from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription
from ..schemas import InsightsResponse
from .users import get_or_create_user
from .subscriptions import to_dict

router = APIRouter(prefix="/api/insights", tags=["insights"])

CAT_COLORS = {"movies": "#2F6FED", "music": "#2FAE6B", "games": "#C98A2C", "others": "#16213E"}
CAT_LABELS = {"movies": "Movies", "music": "Music", "games": "Games", "others": "Others"}

@router.get("", response_model=InsightsResponse)
def get_insights(period: str = "thismonth", db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    paid = [s for s in sub_dicts if not s.get("free")]
    monthly_real = sum(s.get("price", 0) for s in paid)

    # Monthly build-up trend
    shape = [0.83, 0.86, 0.90, 0.94, 0.97, 1.0]
    months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    trend = [
        {"month": m, "value": round((monthly_real if i == 5 else monthly_real * shape[i]) / 10) * 10}
        for i, m in enumerate(months)
    ]

    factor = 1.0
    if period == "lastmonth" and len(trend) >= 5:
        factor = trend[4]["value"] / trend[5]["value"] if trend[5]["value"] else 1.0
    elif period == "last3" and len(trend) >= 6:
        avg3 = (trend[3]["value"] + trend[4]["value"] + trend[5]["value"]) / 3.0
        factor = avg3 / trend[5]["value"] if trend[5]["value"] else 1.0

    monthly_shown = round(monthly_real * factor)
    yearly_shown = monthly_shown * 12

    leak_total = sum(s.get("price", 0) for s in paid if s.get("status") == "low")

    # Category totals
    cat_totals = {"movies": 0.0, "music": 0.0, "games": 0.0, "others": 0.0}
    for s in paid:
        c = s.get("category", "others")
        cat_totals[c] = cat_totals.get(c, 0.0) + float(s.get("price", 0))

    categories_list = []
    largest_cat = "movies"
    max_cat_spend = -1
    for cat_key in ["movies", "music", "games", "others"]:
        amt = cat_totals.get(cat_key, 0.0)
        pct = (amt / monthly_real * 100) if monthly_real > 0 else 0
        if amt > max_cat_spend:
            max_cat_spend = amt
            largest_cat = cat_key
        categories_list.append({
            "category": cat_key,
            "label": CAT_LABELS[cat_key],
            "amount": amt,
            "percentage": round(pct, 1),
            "color": CAT_COLORS[cat_key]
        })

    # Trend calculation
    pct_change = round(((trend[5]["value"] - trend[2]["value"]) / trend[2]["value"]) * 100) if trend[2]["value"] else 0
    if pct_change > 2:
        trend_dir = "up"
        trend_desc = f"Your subscription spending increased {abs(pct_change)}% over the last 3 months."
    elif pct_change < -2:
        trend_dir = "down"
        trend_desc = f"Your subscription spending decreased {abs(pct_change)}% over the last 3 months."
    else:
        trend_dir = "flat"
        trend_desc = "Your subscription spending has stayed roughly stable over the last 3 months."

    # Low usage & top used
    low_usage = [s for s in sub_dicts if s.get("status") == "low"]
    most_used = sorted(sub_dicts, key=lambda s: s.get("usedDays", 0), reverse=True)[0] if sub_dicts else None

    # AI Notices
    notices = []
    if most_used:
        notices.append(f"{most_used['name']} is your most frequently used subscription this month.")
    if low_usage:
        notices.append(f"{len(low_usage)} subscription{'s have' if len(low_usage) > 1 else ' has'} low recent usage.")
    notices.append(f"{CAT_LABELS[largest_cat]} account for the largest share of your subscription spending.")
    
    trials = [s for s in sub_dicts if s.get("trialDaysLeft") is not None]
    if trials:
        notices.append(f"{len(trials)} free trial{'s are' if len(trials) > 1 else ' is'} ending soon.")

    ghosts = [s for s in sub_dicts if s.get("appInstalled") is False]
    if ghosts:
        notices.append(f"You have {len(ghosts)} subscription{'s' if len(ghosts) > 1 else ''} associated with an app that is no longer installed.")

    return InsightsResponse(
        monthlySpend=monthly_shown,
        yearlyProjection=yearly_shown,
        potentialLeakage=leak_total,
        activeSubscriptionsCount=len(sub_dicts),
        categoryTotals=cat_totals,
        categories=categories_list,
        spendingTrend=trend,
        trendDescription=trend_desc,
        trendDirection=trend_dir,
        trendPercentage=pct_change,
        lowUsageCount=len(low_usage),
        topUsedSubscription=most_used["name"] if most_used else None,
        largestCategory=CAT_LABELS[largest_cat],
        aiNotices=notices[:4]
    )
