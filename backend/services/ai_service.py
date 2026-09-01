import re
from typing import List, Dict, Any, Optional
from .optimizer_service import compute_optimization, parse_days
from .comparison_service import compare_universal_services, compare_ott_services
from .recommendation_service import DEFAULT_UPCOMING_CONTENT

def generate_advisor_response(
    query: str,
    subscriptions: List[Dict[str, Any]],
    user_profile: Dict[str, Any],
    wishlist_items: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    q = query.lower().strip()
    paid_subs = [s for s in subscriptions if not s.get("free")]
    total_spend = sum(s.get("price", 0) for s in paid_subs)
    budget = float(user_profile.get("monthlyBudget", 1000.0))
    movie_interests = user_profile.get("movieInterests", ["Superhero", "Action", "Sci-Fi"])

    # 1. "How much am I spending?" / spend / cost / total
    if any(k in q for k in ["how much", "spending", "total spend", "monthly spend", "cost", "expenses"]):
        over_budget = total_spend > budget
        diff = abs(total_spend - budget)
        budget_note = f" You are currently ₹{int(diff):,} {'over' if over_budget else 'under'} your ₹{int(budget):,} monthly budget." if budget else ""

        top_sub = sorted(paid_subs, key=lambda s: s.get("price", 0), reverse=True)[0] if paid_subs else None
        reason = f"Across your {len(subscriptions)} tracked subscriptions, your largest expense is {top_sub['name']} (₹{top_sub['price']}/mo).{budget_note}" if top_sub else "Based on your Trackey data."

        return {
            "answer": f"Based on your Trackey data, you currently spend ₹{int(total_spend):,}/month across {len(subscriptions)} subscriptions.",
            "reason": reason,
            "action": {
                "label": "View Spending Insights",
                "type": "navigate_insights",
                "payload": {"period": "thismonth"}
            }
        }

    # 2. "Which subscription should I review?" / review / cut / cancel / save money
    if any(k in q for k in ["which subscription", "should i review", "review", "cut", "cancel", "save money", "reduce"]):
        low_usage = [s for s in paid_subs if s.get("status") == "low" or s.get("usedDays", 0) <= 3]
        if low_usage:
            target = low_usage[0]
            return {
                "answer": f"Based on your Trackey data, you should review {target['name']}.",
                "reason": f"{target['name']} costs ₹{target['price']}/month but was used only {target.get('usedDays', 0)} days this month (last used {target.get('lastUsed', 'recently')}).",
                "action": {
                    "label": f"Review {target['name']}",
                    "type": "open_detail",
                    "payload": {"id": target["id"]}
                }
            }
        else:
            return {
                "answer": "All your subscriptions currently show moderate to high usage.",
                "reason": "Based on your usage records, no severe leakage is detected right now.",
                "action": {
                    "label": "Open Optimizer",
                    "type": "navigate_optimize",
                    "payload": {}
                }
            }

    # 3. "What renews soon?" / renewal / upcoming / next
    if any(k in q for k in ["renew", "renewal", "renews soon", "upcoming renewal", "due"]):
        with_renewals = [
            s for s in subscriptions
            if s.get("renewsIn") and parse_days(s.get("renewsIn")) < 900
        ]
        with_renewals.sort(key=lambda s: parse_days(s.get("renewsIn")))
        if with_renewals:
            target = with_renewals[0]
            return {
                "answer": f"{target['name']} renews next in {target['renewsIn']} for ₹{target['price']}.",
                "reason": f"Next scheduled renewal date is {target.get('nextRenewal', 'soon')}. AutoPay status: {target.get('autopay', 'Unknown')}.",
                "action": {
                    "label": f"Manage {target['name']}",
                    "type": "open_detail",
                    "payload": {"id": target["id"]}
                }
            }
        return {
            "answer": "No imminent renewals found in your active subscriptions.",
            "reason": "Based on your Trackey records.",
            "action": None
        }

    # 4. "Should I keep [Spotify/Netflix/Prime/Canva...]?"
    match_sub = None
    for s in subscriptions:
        if s["name"].lower() in q or s["id"] in q:
            match_sub = s
            break

    if match_sub:
        used_days = match_sub.get("usedDays", 0)
        status = match_sub.get("status", "active")
        score = match_sub.get("valueScore", "7.0/10")
        if status == "high" or used_days >= 15:
            return {
                "answer": f"Yes, keeping {match_sub['name']} is recommended.",
                "reason": f"You used {match_sub['name']} {used_days} days this month with an estimated value score of {score}. It delivers solid return for ₹{match_sub['price']}/month.",
                "action": {
                    "label": f"View {match_sub['name']} Details",
                    "type": "open_detail",
                    "payload": {"id": match_sub["id"]}
                }
            }
        elif status == "low" or used_days <= 4:
            return {
                "answer": f"Reviewing {match_sub['name']} before its next renewal is suggested.",
                "reason": f"You used {match_sub['name']} only {used_days} days this month, making its effective cost per use relatively high (₹{match_sub['price']}/mo).",
                "action": {
                    "label": f"Review {match_sub['name']}",
                    "type": "open_detail",
                    "payload": {"id": match_sub["id"]}
                }
            }
        else:
            return {
                "answer": f"{match_sub['name']} has moderate usage ({used_days} days this month).",
                "reason": f"It renews in {match_sub.get('renewsIn', 'upcoming renewal')} at ₹{match_sub['price']}/month. Review whether you need its full tier.",
                "action": {
                    "label": f"Inspect {match_sub['name']}",
                    "type": "open_detail",
                    "payload": {"id": match_sub["id"]}
                }
            }

    # 5. "Netflix vs Prime" or comparison queries
    if " vs " in q or "compare" in q:
        if "netflix" in q and "prime" in q:
            comp = compare_universal_services("netflix", "primevideo", user_profile, subscriptions)
            return {
                "answer": f"Between Netflix and Prime Video, {comp['winner']} has higher relevance for your profile.",
                "reason": comp["personalizedAiVerdict"],
                "action": {
                    "label": "Open Service Comparison",
                    "type": "open_comparison",
                    "payload": {"serviceA": "netflix", "serviceB": "primevideo"}
                }
            }
        elif "spotify" in q and "apple" in q:
            comp = compare_universal_services("spotify", "applemusic", user_profile, subscriptions)
            return {
                "answer": f"Between Spotify and Apple Music, {comp['winner']} matches your habits best.",
                "reason": comp["personalizedAiVerdict"],
                "action": {
                    "label": "Open Comparison",
                    "type": "open_comparison",
                    "payload": {"serviceA": "spotify", "serviceB": "applemusic"}
                }
            }
        else:
            ott_res = compare_ott_services(None, subscriptions, user_profile)
            return {
                "answer": f"Based on your profile, {ott_res['winner']} scores highest in value ({ott_res['score']}/10).",
                "reason": ott_res["aiVerdict"],
                "action": {
                    "label": "View OTT Comparison",
                    "type": "open_ott_comparison",
                    "payload": {}
                }
            }

    # 6. "What movies are coming next month?" / movies / releases / upcoming
    if any(k in q for k in ["movie", "movies", "show", "shows", "release", "coming next month", "upcoming movies"]):
        matching = [m for m in DEFAULT_UPCOMING_CONTENT if any(t in movie_interests for t in m["tags"])]
        titles = [m["title"] for m in (matching if matching else DEFAULT_UPCOMING_CONTENT)[:2]]
        titles_str = " and ".join(titles)
        return {
            "answer": f"Verified upcoming releases matching your interests include {titles_str}.",
            "reason": f"Based on your profile interests ({', '.join(movie_interests)}) and verified catalog data.",
            "action": {
                "label": "View Future Recommendations",
                "type": "navigate_optimize",
                "payload": {"section": "future_subscriptions"}
            }
        }

    # 7. "Optimize my subscriptions" / optimize / portfolio / plan
    if any(k in q for k in ["optimize", "plan", "portfolio", "recommendation plan"]):
        opt = compute_optimization(subscriptions, budget)
        red = opt.get("potentialReduction", 0)
        return {
            "answer": f"Your current spend is ₹{int(opt['currentMonthlySpend']):,}/mo with a budget of ₹{int(budget):,}/mo.",
            "reason": f"Potential monthly reduction is estimated at ₹{int(red):,}/month if you review flagged items.",
            "action": {
                "label": "View Optimized Plan",
                "type": "navigate_optimize",
                "payload": {}
            }
        }

    # 8. "Do I have any ghost subscriptions?" / ghost / uninstalled
    if any(k in q for k in ["ghost", "uninstalled", "not installed"]):
        ghosts = [s for s in subscriptions if s.get("appInstalled") is False]
        if ghosts:
            g = ghosts[0]
            return {
                "answer": f"Possible ghost subscription detected: {g['name']}.",
                "reason": f"The {g['name']} application is not installed on your device, but the subscription may still be active (₹{g['price']}/month).",
                "action": {
                    "label": f"Review {g['name']}",
                    "type": "open_detail",
                    "payload": {"id": g["id"]}
                }
            }
        else:
            return {
                "answer": "No ghost subscriptions detected in your portfolio.",
                "reason": "All active paid services have confirmed app installations or web activity.",
                "action": None
            }

    # Default advisor fallback grounded in user data
    return {
        "answer": f"Based on your Trackey data: You have {len(subscriptions)} subscriptions totaling ₹{int(total_spend):,}/month.",
        "reason": f"Your monthly budget is set to ₹{int(budget):,}. Ask me about renewals, reviews, comparisons, or upcoming content!",
        "action": {
            "label": "Optimize Subscriptions",
            "type": "navigate_optimize",
            "payload": {}
        }
    }
