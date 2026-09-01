from typing import List, Dict, Any
import math

def parse_days(str_val: str) -> int:
    if not str_val:
        return 999999
    try:
        parts = str_val.split()
        return int(parts[0])
    except Exception:
        return 999999

def get_recommendation(s: Dict[str, Any]) -> Dict[str, Any]:
    if s.get("free"):
        return {
            "action": "KEEP",
            "severity": "keep",
            "priority": 6,
            "reason": "Free app — no subscription cost, nothing to optimize."
        }

    renew_days = parse_days(s.get("renewsIn", ""))
    trial_days = s.get("trialDaysLeft")
    app_installed = s.get("appInstalled", True)
    status = s.get("status", "active")
    used_days = s.get("usedDays", 0)
    price = s.get("price", 0)
    redundancy = str(s.get("redundancy", "")).lower()

    # Priority 1: Free trial ending soon
    if trial_days is not None:
        return {
            "action": "REVIEW",
            "severity": "info",
            "priority": 1,
            "reason": f"Trial ends in {trial_days} day{'s' if trial_days != 1 else ''} — review before it converts to ₹{price}/month."
        }

    # Priority 2: Upcoming renewal + low usage
    if status == "low" and renew_days <= 7:
        return {
            "action": "REVIEW",
            "severity": "leakreview",
            "priority": 2,
            "reason": f"Used only {used_days} day{'s' if used_days != 1 else ''} this month and renews in {s.get('renewsIn')}."
        }

    # Priority 3: Ghost subscription (app not installed)
    if app_installed is False:
        return {
            "action": "REVIEW",
            "severity": "info",
            "priority": 3,
            "reason": "App is not installed and the subscription may still be active."
        }

    # Priority 4: High cost relative to usage (low usage generally)
    if status == "low":
        return {
            "action": "REVIEW",
            "severity": "leakreview",
            "priority": 4,
            "reason": f"Low recent usage ({used_days} days) relative to its ₹{price}/month cost."
        }

    # Priority 5: Possible category overlap
    if "overlap" in redundancy:
        overlap_with = redundancy.split("—")[1].strip() if "—" in redundancy else "Another subscription in this category"
        overlap_with = overlap_with.capitalize()
        return {
            "action": "REVIEW",
            "severity": "review",
            "priority": 5,
            "reason": f"{overlap_with} — worth checking if you need both."
        }

    # Priority 6: Healthy keep
    return {
        "action": "KEEP",
        "severity": "keep",
        "priority": 6,
        "reason": f"Used {used_days} days this month — good value for ₹{price}/month."
    }

def value_score_num(score_str: Any) -> float:
    try:
        if isinstance(score_str, (int, float)):
            return float(score_str)
        cleaned = str(score_str).split("/")[0].strip()
        return float(cleaned)
    except Exception:
        return 5.0

def knapsack_portfolio(items: List[Dict[str, Any]], budget: float) -> List[Dict[str, Any]]:
    cap = max(0, int(budget))
    n = len(items)
    if n == 0 or cap == 0:
        return []

    # dp table
    dp = [0.0] * (cap + 1)
    keep = [[False] * (cap + 1) for _ in range(n)]

    for i in range(n):
        price = min(int(items[i]["price"]), cap)
        val = items[i]["value"]
        for c in range(cap, price - 1, -1):
            if dp[c - price] + val > dp[c]:
                dp[c] = dp[c - price] + val
                keep[i][c] = True

    c = cap
    selected = []
    for i in range(n - 1, -1, -1):
        if keep[i][c]:
            selected.append(items[i])
            c -= min(int(items[i]["price"]), cap)

    selected.reverse()
    return selected

def compute_optimization(subscriptions: List[Dict[str, Any]], budget: float) -> Dict[str, Any]:
    paid = [s for s in subscriptions if not s.get("free", False)]
    total_spend = sum(s.get("price", 0) for s in paid)

    annotated = []
    for s in subscriptions:
        rec = get_recommendation(s)
        annotated.append({**s, "recommendationData": rec})

    attention = [
        item for item in annotated
        if not item.get("free", False) and item["recommendationData"]["priority"] <= 5
    ]
    attention.sort(key=lambda x: x["recommendationData"]["priority"])

    keep_items = [item for item in annotated if item["recommendationData"]["action"] == "KEEP"]
    review_items = [item for item in annotated if item["recommendationData"]["action"] == "REVIEW"]

    ghosts = [item for item in annotated if item.get("appInstalled") is False]
    trials = [item for item in annotated if item.get("trialDaysLeft") is not None]

    # Category overlap calculation
    categories = {}
    for s in paid:
        cat = s.get("category", "others")
        categories.setdefault(cat, []).append(s)

    overlap_info = None
    max_cat_count = 1
    for cat, items in categories.items():
        if len(items) > max_cat_count:
            max_cat_count = len(items)
            sorted_by_usage = sorted(items, key=lambda x: x.get("usedDays", 0), reverse=True)
            overlap_info = {
                "category": cat,
                "items": items,
                "top": sorted_by_usage[0]
            }

    if total_spend <= budget:
        return {
            "currentMonthlySpend": total_spend,
            "budget": budget,
            "optimizedMonthlySpend": total_spend,
            "potentialReduction": 0.0,
            "withinBudget": True,
            "currentSubscriptionsCount": len(paid),
            "optimizedSubscriptionsCount": len(paid),
            "keep": keep_items,
            "review": review_items,
            "attention": attention,
            "ghosts": ghosts,
            "trials": trials,
            "overlap": overlap_info,
            "reasons": ["Your current portfolio already fits your budget — no changes needed."],
            "valueNote": "Estimated value: comparable to your current portfolio.",
            "caption": "Your current portfolio already fits your budget — no changes needed."
        }

    # Prepare knapsack items
    knap_items = [
        {
            "id": s["id"],
            "item": s,
            "price": s.get("price", 0),
            "value": value_score_num(s.get("valueScore", 7.0)) * 10
        }
        for s in paid
    ]
    selected_knap = knapsack_portfolio(knap_items, budget)
    selected_ids = {x["id"] for x in selected_knap}

    recommended_paid = [s for s in paid if s["id"] in selected_ids]
    rec_spend = sum(s.get("price", 0) for s in recommended_paid)
    potential_reduction = max(0.0, total_spend - rec_spend)

    # Average value comparisons
    curr_avg_val = sum(value_score_num(s.get("valueScore", 7.0)) for s in paid) / len(paid) if paid else 0
    rec_avg_val = sum(value_score_num(s.get("valueScore", 7.0)) for s in recommended_paid) / len(recommended_paid) if recommended_paid else 0

    if rec_avg_val > curr_avg_val + 0.1:
        val_note = "Estimated value: higher than your current portfolio."
    elif rec_avg_val < curr_avg_val - 0.1:
        val_note = "Estimated value: about the same as your current portfolio."
    else:
        val_note = "Estimated value: comparable to your current portfolio."

    reasons = [
        f"You are ₹{int(total_spend - budget):,} over your monthly budget.",
        f"By reviewing lower usage subscriptions, you can potentially reduce spending by ₹{int(potential_reduction):,}/month."
    ]

    return {
        "currentMonthlySpend": total_spend,
        "budget": budget,
        "optimizedMonthlySpend": rec_spend,
        "potentialReduction": potential_reduction,
        "withinBudget": False,
        "currentSubscriptionsCount": len(paid),
        "optimizedSubscriptionsCount": len(recommended_paid),
        "keep": keep_items,
        "review": review_items,
        "attention": attention,
        "ghosts": ghosts,
        "trials": trials,
        "overlap": overlap_info,
        "reasons": reasons,
        "valueNote": val_note,
        "caption": "This is a deterministic, budget-constrained estimate based on your usage and value scores — not a guarantee. You decide what to change."
    }
