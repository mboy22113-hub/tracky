import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription, UsageRecord
from ..schemas import SubscriptionResponse, SubscriptionCreate, SubscriptionUpdate
from .users import get_or_create_user

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])

CATEGORY_LABELS = {
    "movies": "Movies · OTT streaming",
    "music": "Music · Streaming",
    "games": "Games · Subscription",
    "others": "Others · Utility"
}

def to_dict(s: Subscription, db: Session) -> dict:
    # Compute usage from usage_records if available
    records = db.query(UsageRecord).filter(UsageRecord.subscription_id == s.id).all()
    used_days = len(records) if records else (2 if s.status == 'low' else 14 if s.free else 18)
    last_used = "18 days ago" if s.status == "low" else "today" if s.status == "high" else "yesterday"

    return {
        "id": s.id,
        "name": s.name,
        "category": s.category,
        "categoryLabel": s.category_label or CATEGORY_LABELS.get(s.category, "Subscription"),
        "icon": s.icon or s.name[0].upper(),
        "color": s.color or "#2F6FED",
        "price": s.price,
        "free": s.free,
        "billingCycle": s.billing_cycle or "monthly",
        "nextRenewal": s.next_renewal,
        "renewsIn": s.renews_in,
        "autopay": s.autopay or "Unknown",
        "freeTrial": s.free_trial,
        "trialDaysLeft": s.trial_days_left,
        "appInstalled": s.app_installed,
        "valueScore": s.value_score or "7.0/10",
        "redundancy": s.redundancy or "Low",
        "pauseSupported": s.pause_supported,
        "status": s.status or "active",
        "statusLabel": s.status_label or "Active",
        "recommendation": s.recommendation or "",
        "usedDays": used_days,
        "lastUsed": last_used
    }

@router.get("", response_model=List[SubscriptionResponse])
def list_subscriptions(category: str = None, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    query = db.query(Subscription).filter(Subscription.user_id == user.id)
    if category and category != "all":
        query = query.filter(Subscription.category == category)
    items = query.all()
    return [to_dict(s, db) for s in items]

@router.post("", response_model=SubscriptionResponse)
def create_subscription(body: SubscriptionCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    sub_id = body.name.lower().replace(" ", "") + "_" + str(uuid.uuid4())[:6]

    icon = body.icon or body.name[0].upper()
    cat_label = body.categoryLabel or CATEGORY_LABELS.get(body.category, "Subscription")

    status = body.status or ("high" if body.usedDays and body.usedDays >= 20 else "low" if body.usedDays and body.usedDays <= 3 else "active")
    status_label = body.statusLabel or ("High usage" if status == "high" else "Low usage" if status == "low" else "Active")

    sub = Subscription(
        id=sub_id,
        user_id=user.id,
        name=body.name,
        category=body.category,
        category_label=cat_label,
        icon=icon,
        color=body.color or "#2F6FED",
        price=body.price,
        free=body.free,
        billing_cycle=body.billingCycle,
        next_renewal=body.nextRenewal,
        renews_in=body.renewsIn,
        autopay=body.autopay or "Unknown",
        free_trial=body.freeTrial,
        trial_days_left=body.trialDaysLeft,
        app_installed=body.appInstalled,
        value_score=body.valueScore or "7.0/10",
        redundancy=body.redundancy or "Low",
        pause_supported=body.pauseSupported,
        status=status,
        status_label=status_label,
        recommendation=body.recommendation or f"Added {body.name} to your subscription tracker."
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    # Seed basic usage records
    if body.usedDays and body.usedDays > 0:
        for i in range(body.usedDays):
            rec = UsageRecord(
                subscription_id=sub.id,
                user_id=user.id,
                date=f"2026-08-{i+1:02d}",
                used=True,
                duration_minutes=45
            )
            db.add(rec)
        db.commit()

    return to_dict(sub, db)

@router.get("/{id}", response_model=SubscriptionResponse)
def get_subscription(id: str, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return to_dict(sub, db)

@router.put("/{id}", response_model=SubscriptionResponse)
def update_subscription(id: str, body: SubscriptionUpdate, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    if body.name is not None: sub.name = body.name
    if body.category is not None: sub.category = body.category
    if body.categoryLabel is not None: sub.category_label = body.categoryLabel
    if body.icon is not None: sub.icon = body.icon
    if body.color is not None: sub.color = body.color
    if body.price is not None: sub.price = body.price
    if body.free is not None: sub.free = body.free
    if body.billingCycle is not None: sub.billing_cycle = body.billingCycle
    if body.nextRenewal is not None: sub.next_renewal = body.nextRenewal
    if body.renewsIn is not None: sub.renews_in = body.renewsIn
    if body.autopay is not None: sub.autopay = body.autopay
    if body.freeTrial is not None: sub.free_trial = body.freeTrial
    if body.trialDaysLeft is not None: sub.trial_days_left = body.trialDaysLeft
    if body.appInstalled is not None: sub.app_installed = body.appInstalled
    if body.valueScore is not None: sub.value_score = body.valueScore
    if body.redundancy is not None: sub.redundancy = body.redundancy
    if body.pauseSupported is not None: sub.pause_supported = body.pauseSupported
    if body.status is not None: sub.status = body.status
    if body.statusLabel is not None: sub.status_label = body.statusLabel
    if body.recommendation is not None: sub.recommendation = body.recommendation

    db.commit()
    db.refresh(sub)
    return to_dict(sub, db)

@router.delete("/{id}")
def delete_subscription(id: str, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(sub)
    db.commit()
    return {"status": "ok", "message": f"Deleted subscription {id}"}
