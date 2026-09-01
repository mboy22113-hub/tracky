import sys
import json
import sqlite3
import os
import uuid
import datetime

# Database Path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "trackey.db")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.services.optimizer_service import compute_optimization
from backend.services.recommendation_service import get_future_recommendations
from backend.services.comparison_service import compare_ott_services, compare_universal_services
from backend.services.movie_service import get_upcoming_movies
from backend.services.ai_service import generate_advisor_response

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def dict_from_row(row):
    return dict(row) if row else None

def get_user_and_profile(conn):
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE id = 'u_default'")
    u = c.fetchone()
    c.execute("SELECT * FROM user_preferences WHERE user_id = 'u_default'")
    p = c.fetchone()

    def split_csv(val):
        return [x.strip() for x in val.split(",") if x.strip()] if val else []

    def safe_json(val, default):
        if not val: return default
        try: return json.loads(val)
        except: return default

    return {
        "id": u["id"] if u else "u_default",
        "name": u["name"] if u else "Alex",
        "email": u["email"] if u else "alex@email.com",
        "ageRange": u["age_range"] if (u and u["age_range"]) else "",
        "subscriptionCategories": split_csv(p["subscription_categories"]) if p else ["movies", "music"],
        "movieInterests": split_csv(p["movie_interests"]) if p else ["Superhero", "Action", "Sci-Fi"],
        "contentPriorities": split_csv(p["content_priorities"]) if p else ["New releases"],
        "musicInterests": split_csv(p["music_interests"]) if p else [],
        "musicUse": split_csv(p["music_use"]) if p else [],
        "gamingInterests": split_csv(p["gaming_interests"]) if p else [],
        "gamingFrequency": p["gaming_frequency"] if (p and p["gaming_frequency"]) else "",
        "otherInterests": split_csv(p["other_interests"]) if p else [],
        "monthlyBudget": float(p["monthly_budget"]) if p else 1000.0,
        "optimizationGoal": p["optimization_goal"] if (p and p["optimization_goal"]) else "best_value",
        "recommendationPriorities": split_csv(p["recommendation_priorities"]) if p else [],
        "recommendationSettings": safe_json(p["recommendation_settings"], {"movies":True,"music":True,"games":True,"others":True}) if p else {"movies":True,"music":True,"games":True,"others":True},
        "notificationSettings": safe_json(p["notification_preferences"], {"renewals":True,"trials":True,"lowUsage":True,"ghostSubscriptions":True,"budget":True,"optimization":True}) if p else {"renewals":True,"trials":True,"lowUsage":True,"ghostSubscriptions":True,"budget":True,"optimization":True},
        "trackerPreferences": safe_json(p["tracker_preferences"], {"usageTracking":True,"reminders":True,"personalizedRecs":True}) if p else {"usageTracking":True,"reminders":True,"personalizedRecs":True},
        "transactionConnected": bool(p["transaction_connected"]) if p else False
    }

def get_all_subscriptions(conn, category=None):
    c = conn.cursor()
    if category and category != 'all':
        c.execute("SELECT * FROM subscriptions WHERE user_id = 'u_default' AND category = ?", (category,))
    else:
        c.execute("SELECT * FROM subscriptions WHERE user_id = 'u_default'")
    rows = c.fetchall()

    results = []
    for r in rows:
        sub_id = r["id"]
        c.execute("SELECT COUNT(*) as cnt FROM usage_records WHERE subscription_id = ?", (sub_id,))
        cnt_row = c.fetchone()
        used_days = cnt_row["cnt"] if cnt_row and cnt_row["cnt"] > 0 else (2 if r["status"] == 'low' else 14 if r["free"] else 18)
        last_used = "18 days ago" if r["status"] == "low" else "today" if r["status"] == "high" else "yesterday"

        results.append({
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "categoryLabel": r["category_label"],
            "icon": r["icon"],
            "color": r["color"],
            "price": float(r["price"]),
            "free": bool(r["free"]),
            "billingCycle": r["billing_cycle"] or "monthly",
            "nextRenewal": r["next_renewal"],
            "renewsIn": r["renews_in"],
            "autopay": r["autopay"] or "Enabled",
            "freeTrial": bool(r["free_trial"]),
            "trialDaysLeft": r["trial_days_left"],
            "appInstalled": bool(r["app_installed"]),
            "valueScore": r["value_score"] or "7.0/10",
            "redundancy": r["redundancy"] or "Low",
            "pauseSupported": bool(r["pause_supported"]),
            "status": r["status"] or "active",
            "statusLabel": r["status_label"] or "Active",
            "recommendation": r["recommendation"] or "",
            "usedDays": used_days,
            "lastUsed": last_used
        })
    return results

def run_command(endpoint: str, method: str, body: dict, query_params: dict):
    conn = get_db()
    try:
        # Profile
        if endpoint == "/api/profile":
            if method == "GET":
                return get_user_and_profile(conn)
            elif method == "PUT":
                c = conn.cursor()
                name = body.get("name", "Alex")
                email = body.get("email", "alex@email.com")
                age_range = body.get("ageRange", "")
                c.execute("UPDATE users SET name = ?, email = ?, age_range = ? WHERE id = 'u_default'", (name, email, age_range))

                cats = ",".join(body.get("subscriptionCategories", []))
                movies = ",".join(body.get("movieInterests", []))
                priorities = ",".join(body.get("contentPriorities", []))
                music_i = ",".join(body.get("musicInterests", []))
                music_u = ",".join(body.get("musicUse", []))
                gaming_i = ",".join(body.get("gamingInterests", []))
                gaming_f = body.get("gamingFrequency", "")
                other_i = ",".join(body.get("otherInterests", []))
                budget = float(body.get("monthlyBudget", 1000.0))
                goal = body.get("optimizationGoal", "best_value")
                rec_p = ",".join(body.get("recommendationPriorities", []))
                notif = json.dumps(body.get("notificationSettings", {}))
                rec_s = json.dumps(body.get("recommendationSettings", {}))
                track_p = json.dumps(body.get("trackerPreferences", {}))
                tx_conn = 1 if body.get("transactionConnected") else 0

                c.execute("""
                UPDATE user_preferences SET
                    subscription_categories = ?, movie_interests = ?, content_priorities = ?,
                    music_interests = ?, music_use = ?, gaming_interests = ?, gaming_frequency = ?,
                    other_interests = ?, monthly_budget = ?, optimization_goal = ?, recommendation_priorities = ?,
                    notification_preferences = ?, recommendation_settings = ?, tracker_preferences = ?, transaction_connected = ?
                WHERE user_id = 'u_default'
                """, (cats, movies, priorities, music_i, music_u, gaming_i, gaming_f, other_i, budget, goal, rec_p, notif, rec_s, track_p, tx_conn))
                conn.commit()
                return get_user_and_profile(conn)

        # Subscriptions
        elif endpoint == "/api/subscriptions":
            if method == "GET":
                cat = query_params.get("category")
                return get_all_subscriptions(conn, cat)
            elif method == "POST":
                c = conn.cursor()
                sub_id = body.get("name", "sub").lower().replace(" ", "") + "_" + str(uuid.uuid4())[:6]
                name = body.get("name")
                cat = body.get("category", "others")
                cat_label = body.get("categoryLabel", cat.title())
                icon = body.get("icon") or name[0].upper()
                color = body.get("color", "#2F6FED")
                price = float(body.get("price", 0.0))
                free = 1 if body.get("free") else 0
                used_days = int(body.get("usedDays", 10))
                status = "high" if used_days >= 20 else "low" if used_days <= 3 else "active"
                status_label = "High usage" if status == "high" else "Low usage" if status == "low" else "Active"
                now = datetime.datetime.utcnow().isoformat()

                c.execute("""
                INSERT INTO subscriptions (
                    id, user_id, name, category, category_label, icon, color, price, free, billing_cycle,
                    next_renewal, renews_in, autopay, free_trial, trial_days_left, app_installed, value_score,
                    redundancy, pause_supported, status, status_label, recommendation, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    sub_id, "u_default", name, cat, cat_label, icon, color, price, free, body.get("billingCycle", "monthly"),
                    body.get("nextRenewal", "15 Sep"), body.get("renewsIn", "15 days"), body.get("autopay", "Enabled"),
                    1 if body.get("freeTrial") else 0, body.get("trialDaysLeft"), 1 if body.get("appInstalled", True) else 0,
                    body.get("valueScore", "7.0/10"), body.get("redundancy", "Low"), 1 if body.get("pauseSupported") else 0,
                    status, status_label, body.get("recommendation", f"Added {name} to your subscription tracker."), now
                ))

                for d in range(used_days):
                    c.execute("INSERT INTO usage_records (subscription_id, user_id, date, used, duration_minutes) VALUES (?, ?, ?, ?, ?)",
                              (sub_id, 'u_default', f'2026-08-{d+1:02d}', 1, 45))
                conn.commit()

                subs = get_all_subscriptions(conn)
                return next((s for s in subs if s["id"] == sub_id), None)

        elif endpoint.startswith("/api/subscriptions/"):
            sub_id = endpoint.split("/")[-1]
            c = conn.cursor()
            if method == "GET":
                subs = get_all_subscriptions(conn)
                match = next((s for s in subs if s["id"] == sub_id), None)
                if not match: return {"error": "Not found"}
                return match
            elif method == "PUT":
                if "name" in body: c.execute("UPDATE subscriptions SET name = ? WHERE id = ?", (body["name"], sub_id))
                if "price" in body: c.execute("UPDATE subscriptions SET price = ? WHERE id = ?", (float(body["price"]), sub_id))
                if "autopay" in body: c.execute("UPDATE subscriptions SET autopay = ? WHERE id = ?", (body["autopay"], sub_id))
                if "nextRenewal" in body: c.execute("UPDATE subscriptions SET next_renewal = ? WHERE id = ?", (body["nextRenewal"], sub_id))
                conn.commit()
                subs = get_all_subscriptions(conn)
                return next((s for s in subs if s["id"] == sub_id), None)
            elif method == "DELETE":
                c.execute("DELETE FROM subscriptions WHERE id = ?", (sub_id,))
                c.execute("DELETE FROM usage_records WHERE subscription_id = ?", (sub_id,))
                conn.commit()
                return {"status": "ok", "message": f"Deleted {sub_id}"}

        # Insights
        elif endpoint == "/api/insights":
            period = query_params.get("period", "thismonth")
            subs = get_all_subscriptions(conn)
            paid = [s for s in subs if not s["free"]]
            monthly_real = sum(s["price"] for s in paid)

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
            leak_total = sum(s["price"] for s in paid if s["status"] == "low")

            cat_totals = {"movies": 0.0, "music": 0.0, "games": 0.0, "others": 0.0}
            for s in paid:
                c_key = s.get("category", "others")
                cat_totals[c_key] = cat_totals.get(c_key, 0.0) + float(s.get("price", 0))

            cat_colors = {"movies": "#2F6FED", "music": "#2FAE6B", "games": "#C98A2C", "others": "#16213E"}
            cat_labels = {"movies": "Movies", "music": "Music", "games": "Games", "others": "Others"}

            categories_list = [
                { "id": "ott", "label": "OTT & Entertainment", "emoji": "🎬", "amount": 850 if period != "lastmonth" else 750, "percentage": 43 if period != "lastmonth" else 42, "color": "#2F6FED", "count": 3 },
                { "id": "productivity", "label": "Productivity", "emoji": "💼", "amount": 499, "percentage": 25 if period != "lastmonth" else 28, "color": "#7C3AED", "count": 1 },
                { "id": "gaming", "label": "Gaming", "emoji": "🎮", "amount": 299, "percentage": 15 if period != "lastmonth" else 17, "color": "#C98A2C", "count": 1 },
                { "id": "other", "label": "Other Services", "emoji": "🛍️", "amount": 217 if period != "lastmonth" else 103, "percentage": 11 if period != "lastmonth" else 6, "color": "#16213E", "count": 2 },
                { "id": "music", "label": "Music", "emoji": "🎵", "amount": 119, "percentage": 6 if period != "lastmonth" else 7, "color": "#2FAE6B", "count": 1 }
            ]

            spending_trend = [
                { "month": "Apr", "value": 1450, "change": "+₹0", "changePct": "0%" },
                { "month": "May", "value": 1600, "change": "+₹150", "changePct": "+10.3%" },
                { "month": "Jun", "value": 1720, "change": "+₹120", "changePct": "+7.5%" },
                { "month": "Jul", "value": 1840, "change": "+₹120", "changePct": "+7.0%" },
                { "month": "Aug", "value": 1984 if period != "lastmonth" else 1770, "change": "+₹144" if period != "lastmonth" else "-₹70", "changePct": "+7.8%" if period != "lastmonth" else "-3.8%" },
                { "month": "Sep", "value": 1984 if period != "lastmonth" else 1770, "change": "±₹0", "changePct": "0%" }
            ]

            value_metrics = [
                { "id": "spotify", "name": "Spotify", "icon": "🎧", "color": "#1DB954", "cost": 119, "usageHours": 35, "costPerHour": 3, "status": "good", "statusLabel": "Great Value", "badge": "✅ ₹3/hr" },
                { "id": "primevideo", "name": "Prime Video", "icon": "🎬", "color": "#00A8E1", "cost": 299, "usageHours": 20, "costPerHour": 15, "status": "good", "statusLabel": "Good Value", "badge": "✅ ₹15/hr" },
                { "id": "netflix", "name": "Netflix", "icon": "🍿", "color": "#E50914", "cost": 199, "usageHours": 3, "costPerHour": 66, "status": "warning", "statusLabel": "Low Value", "badge": "⚠️ ₹66/hr" },
                { "id": "canva", "name": "Canva", "icon": "🎨", "color": "#00C4CC", "cost": 499, "usageHours": 2, "costPerHour": 249, "status": "danger", "statusLabel": "Overpaying", "badge": "⚠️ ₹249/hr" }
            ]

            weekly_activity = {
                "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "mostActive": { "name": "Spotify", "detail": "35 hrs / 7 days active" },
                "leastActive": { "name": "Canva", "detail": "2 hrs / 1 day active" },
                "services": [
                    { "id": "spotify", "name": "Spotify", "icon": "🎧", "color": "#1DB954", "activeDays": 7, "percentage": 100, "intensity": [3, 4, 4, 5, 5, 4, 3] },
                    { "id": "primevideo", "name": "Prime Video", "icon": "🎬", "color": "#00A8E1", "activeDays": 5, "percentage": 71, "intensity": [0, 2, 0, 3, 4, 5, 4] },
                    { "id": "netflix", "name": "Netflix", "icon": "🍿", "color": "#E50914", "activeDays": 2, "percentage": 28, "intensity": [0, 0, 0, 0, 1, 2, 0] },
                    { "id": "canva", "name": "Canva", "icon": "🎨", "color": "#00C4CC", "activeDays": 1, "percentage": 14, "intensity": [0, 0, 2, 0, 0, 0, 0] }
                ]
            }

            money_leaks = [
                { "id": "leak_ghost", "type": "ghost", "icon": "👻", "title": "Ghost Subscription", "description": "Deleted app but active subscription detected.", "serviceName": "Duolingo Super", "serviceId": "duolingo", "riskLevel": "High Risk", "riskClass": "high", "potentialSavings": 299, "actionLabel": "Review →" },
                { "id": "leak_trial", "type": "trial", "icon": "🎁", "title": "Free Trial Ending", "description": "Trial ends in 2 days. Auto-renews soon.", "serviceName": "Canva Pro", "serviceId": "canva", "riskLevel": "Medium Risk", "riskClass": "medium", "potentialSavings": 499, "actionLabel": "Review →" },
                { "id": "leak_low_usage", "type": "low_usage", "icon": "⚠️", "title": "Low Usage", "description": "Netflix has not been used for 18 days.", "serviceName": "Netflix Basic", "serviceId": "netflix", "riskLevel": "Medium Risk", "riskClass": "medium", "potentialSavings": 199, "actionLabel": "Review →" },
                { "id": "leak_overlap", "type": "overlap", "icon": "💸", "title": "Duplicate / Overlapping Services", "description": "Multiple services provide similar functionality.", "serviceName": "Apple Music & Spotify", "serviceId": "spotify", "riskLevel": "Low Risk", "riskClass": "low", "potentialSavings": 119, "actionLabel": "Review →" }
            ]

            return {
                "monthlySpend": 1984 if period == "thismonth" else 1770 if period == "lastmonth" else 5594,
                "previousSpend": 1770 if period == "thismonth" else 1720 if period == "lastmonth" else 4770,
                "spendChangePct": 12 if period == "thismonth" else 3 if period == "lastmonth" else 17,
                "yearlyProjection": 23808,
                "potentialSavings": 699 if period == "thismonth" else 580 if period == "lastmonth" else 1980,
                "attentionCount": 3 if period == "thismonth" else 2 if period == "lastmonth" else 4,
                "attentionReason": "Renewals, low usage, ghost subscriptions, or trials",
                "categories": categories_list,
                "spendingTrend": spending_trend,
                "trendInsight": "Your subscription spending increased by 37% over the last 5 months.",
                "trendDirection": "up" if period != "lastmonth" else "down",
                "valueMetrics": value_metrics,
                "valueInsight": "Canva and Netflix have the highest cost per hour because of low usage.",
                "weeklyActivity": weekly_activity,
                "moneyLeaks": money_leaks,
                "aiInsight": {
                    "title": "Trackey AI Insight",
                    "text": "Your spending is increasing mainly because of productivity and OTT subscriptions. You actively use Spotify and Prime Video, but Netflix and Canva provide significantly lower value per rupee.",
                    "potentialSavings": 699,
                    "action1": "Optimize Now →",
                    "action2": "View Recommendations →"
                }
            }

        # Optimizer
        elif endpoint == "/api/optimizer":
            prof = get_user_and_profile(conn)
            budget = body.get("budget") if (body and body.get("budget")) else prof["monthlyBudget"]
            subs = get_all_subscriptions(conn)
            return compute_optimization(subs, budget)

        # Recommendations
        elif endpoint == "/api/recommendations":
            prof = get_user_and_profile(conn)
            subs = get_all_subscriptions(conn)
            c = conn.cursor()
            c.execute("SELECT content_id FROM wishlist WHERE user_id = 'u_default'")
            wishlist_ids = [r["content_id"] for r in c.fetchall()]
            return get_future_recommendations(prof["movieInterests"], subs, wishlist_ids)

        # Movies upcoming
        elif endpoint == "/api/movies/upcoming":
            prof = get_user_and_profile(conn)
            c = conn.cursor()
            c.execute("SELECT content_id FROM wishlist WHERE user_id = 'u_default'")
            wishlist_ids = [r["content_id"] for r in c.fetchall()]
            return get_upcoming_movies(prof["movieInterests"], wishlist_ids)

        # Wishlist
        elif endpoint == "/api/wishlist":
            c = conn.cursor()
            if method == "GET":
                c.execute("SELECT * FROM wishlist WHERE user_id = 'u_default'")
                return [dict(r) for r in c.fetchall()]
            elif method == "POST":
                w_id = "w_" + str(uuid.uuid4())[:8]
                c.execute("INSERT INTO wishlist (id, user_id, content_id, title, poster_url, platform, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                          (w_id, "u_default", body.get("content_id"), body.get("title"), body.get("poster_url"), body.get("platform"), datetime.datetime.utcnow().isoformat()))
                conn.commit()
                return {"id": w_id, "content_id": body.get("content_id"), "title": body.get("title"), "poster_url": body.get("poster_url"), "platform": body.get("platform")}

        elif endpoint.startswith("/api/wishlist/"):
            item_id = endpoint.split("/")[-1]
            c = conn.cursor()
            c.execute("DELETE FROM wishlist WHERE user_id = 'u_default' AND (id = ? OR content_id = ?)", (item_id, item_id))
            conn.commit()
            return {"status": "ok", "message": f"Removed {item_id}"}

        # Comparisons
        elif endpoint == "/api/comparison/ott":
            prof = get_user_and_profile(conn)
            subs = get_all_subscriptions(conn)
            platforms = body.get("platforms") if body else None
            return compare_ott_services(platforms, subs, prof)

        elif endpoint == "/api/comparison/services":
            prof = get_user_and_profile(conn)
            subs = get_all_subscriptions(conn)
            return compare_universal_services(body.get("serviceA"), body.get("serviceB"), prof, subs)

        # Assistant Chat
        elif endpoint == "/api/assistant/chat":
            prof = get_user_and_profile(conn)
            subs = get_all_subscriptions(conn)
            c = conn.cursor()
            c.execute("SELECT * FROM wishlist WHERE user_id = 'u_default'")
            wishlists = [dict(r) for r in c.fetchall()]
            return generate_advisor_response(body.get("message", ""), subs, prof, wishlists)

        elif endpoint == "/api/health":
            return {"status": "ok", "app": "Trackey API"}

        return {"error": f"Unknown endpoint {endpoint}"}
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        payload = json.loads(sys.argv[1])
        res = run_command(payload.get("endpoint"), payload.get("method", "GET"), payload.get("body", {}), payload.get("query", {}))
        print(json.dumps(res))
    else:
        print(json.dumps({"status": "ready"}))
