from typing import List, Dict, Any

DEFAULT_UPCOMING_CONTENT = [
    {
        "id": "c1",
        "title": "Iron Circuit",
        "type": "Movie",
        "poster_url": "",
        "release_date": "Next month",
        "platform": "primevideo",
        "platform_name": "Prime Video",
        "genre": "Superhero · Action",
        "trailer_url": "https://www.youtube.com",
        "tags": ["Superhero", "Action", "Marvel / Superhero"],
        "emoji": "🦸",
        "availability": "Coming next month"
    },
    {
        "id": "c2",
        "title": "Rogue Vanguard",
        "type": "Series",
        "poster_url": "",
        "release_date": "Next month",
        "platform": "primevideo",
        "platform_name": "Prime Video",
        "genre": "Action · Sci-Fi",
        "trailer_url": "https://www.youtube.com",
        "tags": ["Action", "Sci-Fi"],
        "emoji": "🚀",
        "availability": "Coming next month"
    },
    {
        "id": "c3",
        "title": "Midnight Circuit",
        "type": "Movie",
        "poster_url": "",
        "release_date": "Available now",
        "platform": "primevideo",
        "platform_name": "Prime Video",
        "genre": "Sci-Fi · Thriller",
        "trailer_url": "https://www.youtube.com",
        "tags": ["Sci-Fi", "Thriller"],
        "emoji": "🌌",
        "availability": "Available now"
    },
    {
        "id": "c4",
        "title": "Shadow Protocol",
        "type": "Series",
        "poster_url": "",
        "release_date": "15 Sep",
        "platform": "netflix",
        "platform_name": "Netflix",
        "genre": "Thriller · Mystery",
        "trailer_url": "https://www.youtube.com",
        "tags": ["Thriller", "Mystery"],
        "emoji": "🕵️",
        "availability": "Coming 15 Sep"
    },
    {
        "id": "c5",
        "title": "Champions Arena",
        "type": "Sports",
        "poster_url": "",
        "release_date": "20 Sep",
        "platform": "jiohotstar",
        "platform_name": "JioHotstar",
        "genre": "Sports · Live",
        "trailer_url": "https://www.youtube.com",
        "tags": ["Sports"],
        "emoji": "🏏",
        "availability": "Streaming 20 Sep"
    }
]

def get_future_recommendations(
    user_interests: List[str],
    subscriptions: List[Dict[str, Any]],
    wishlist_ids: List[str] = None
) -> Dict[str, Any]:
    if wishlist_ids is None:
        wishlist_ids = []

    # 1. Movies & OTT
    current_ott = [s for s in subscriptions if s.get("category") == "movies" and not s.get("free")]
    
    # Check matching content from catalog
    matching_content = []
    for item in DEFAULT_UPCOMING_CONTENT:
        is_match = any(t in user_interests or t == "Superhero" and "Marvel / Superhero" in user_interests for t in item["tags"])
        if is_match:
            matching_content.append({
                **item,
                "inWishlist": item["id"] in wishlist_ids
            })

    if not matching_content:
        movies_rec = {
            "category": "movies",
            "title": "Movies & OTT",
            "badge": "No data",
            "badgeClass": "info",
            "reason": "No verified upcoming content data is available right now — check back later.",
            "note": "Sample content data for this prototype.",
            "items": [],
            "cta": None
        }
    else:
        # Group by platform
        by_platform: Dict[str, List[Dict[str, Any]]] = {}
        for m in matching_content:
            by_platform.setdefault(m["platform"], []).append(m)

        best_platform_id = sorted(by_platform.keys(), key=lambda p: len(by_platform[p]), reverse=True)[0]
        best_titles = by_platform[best_platform_id]
        platform_name = best_titles[0]["platform_name"]
        already_has = any(s["id"] == best_platform_id for s in current_ott)
        other_ott = [s for s in current_ott if s["id"] != best_platform_id]

        if already_has:
            badge = "Already yours"
            badge_class = "continue"
            reason = f"Your interests ({', '.join(user_interests)}) match upcoming content on {platform_name} — a service you already pay for, so there's nothing new to add."
            cta = None
        elif other_ott:
            overlap_names = " and ".join(s["name"] for s in other_ott)
            badge = "Recommended"
            badge_class = "recommend"
            reason = f"Your interests match upcoming content on {platform_name} more closely than what's on {overlap_names}. Based on interest match, upcoming content, and your budget, {platform_name} may be more relevant than adding another overlapping OTT service."
            cta = {"label": f"Consider {platform_name}", "action": "navigate_subs"}
        else:
            badge = "Recommended"
            badge_class = "recommend"
            reason = f"Your interests ({', '.join(user_interests)}) match upcoming content on {platform_name}, and it isn't in your current portfolio yet."
            cta = {"label": f"Consider {platform_name}", "action": "navigate_subs"}

        movies_rec = {
            "category": "movies",
            "title": "Movies & OTT",
            "badge": badge,
            "badgeClass": badge_class,
            "reason": reason,
            "note": "Sample content data for this prototype — connect a licensed content API for live, verified listings.",
            "items": best_titles,
            "cta": cta
        }

    # 2. Music
    music_subs = [s for s in subscriptions if s.get("category") == "music" and not s.get("free")]
    if not music_subs:
        music_rec = {
            "category": "music",
            "title": "Music",
            "badge": "No data",
            "badgeClass": "info",
            "reason": "You don't have a music subscription yet — only worth adding if it fits your budget and listening habits.",
            "items": [],
            "cta": None
        }
    else:
        top_music = sorted(music_subs, key=lambda s: s.get("usedDays", 0), reverse=True)[0]
        other_music = [s for s in music_subs if s["id"] != top_music["id"]]
        fit_items = [{"name": top_music["name"], "fit": "High fit"}]
        for s in other_music:
            fit_items.append({"name": s["name"], "fit": "Lower fit"})

        reason = f"You already use {top_music['name']} frequently — used {top_music.get('usedDays', 0)} days this month with an estimated value score of {top_music.get('valueScore', '8.0/10')}. Based on your current usage, switching to another music subscription may not provide enough additional value."
        if other_music:
            reason += f" You already use {top_music['name']} heavily and it overlaps with {', '.join(s['name'] for s in other_music)} — reviewing the overlap may be worth more than switching services."

        music_rec = {
            "category": "music",
            "title": "Music",
            "badge": f"Continue {top_music['name']}",
            "badgeClass": "continue",
            "reason": reason,
            "items": fit_items,
            "cta": None
        }

    # 3. Games
    game_subs = [s for s in subscriptions if s.get("category") == "games"]
    paid_games = [s for s in game_subs if not s.get("free")]
    if not game_subs:
        games_rec = {
            "category": "games",
            "title": "Games",
            "badge": "No data",
            "badgeClass": "info",
            "reason": "No gaming subscriptions yet — not enough data to personalize a recommendation.",
            "items": [],
            "cta": None
        }
    else:
        top_game = sorted(game_subs, key=lambda s: s.get("usedDays", 0), reverse=True)[0]
        if paid_games and top_game.get("status") != "low":
            badge = f"Continue {top_game['name']}"
            badge_class = "continue"
            reason = f"You already spend most of your gaming time on {top_game['name']} (used {top_game.get('usedDays', 0)} days this month). Adding another gaming subscription would likely create unnecessary overlap."
        elif paid_games:
            badge = f"Review {top_game['name']}"
            badge_class = "watch"
            reason = f"Recent usage on {top_game['name']} has been low. Worth reviewing that subscription before considering a new gaming service."
        else:
            badge = "Info"
            badge_class = "info"
            reason = f"Your gaming time is mostly on {top_game['name']}, which is free — a paid gaming subscription isn't shown here as a personalized fit right now."

        games_rec = {
            "category": "games",
            "title": "Games",
            "badge": badge,
            "badgeClass": badge_class,
            "reason": reason,
            "items": [{"name": top_game["name"]}],
            "cta": None
        }

    # 4. Others
    others_subs = [s for s in subscriptions if s.get("category") == "others"]
    if not others_subs:
        others_rec = {
            "category": "others",
            "title": "Others",
            "badge": "No data",
            "badgeClass": "info",
            "reason": "No subscriptions in this category yet.",
            "items": [],
            "cta": None
        }
    else:
        parts = []
        for s in others_subs:
            if s.get("appInstalled") is False:
                parts.append(f"{s['name']} is currently not installed. Review the existing subscription before considering another service in this category.")
            elif s.get("status") == "low":
                parts.append(f"{s['name']} may be useful if your usage justifies its ₹{s.get('price', 0)}/month cost — recent usage has been low ({s.get('usedDays', 0)} days this month).")
            else:
                parts.append(f"{s['name']} is well used ({s.get('usedDays', 0)} days this month) — good value for the ₹{s.get('price', 0)}/month cost.")

        low_usage = any(s.get("status") == "low" or s.get("appInstalled") is False for s in others_subs)
        others_rec = {
            "category": "others",
            "title": "Others",
            "badge": "Review first" if low_usage else "Well matched",
            "badgeClass": "watch" if low_usage else "continue",
            "reason": " ".join(parts),
            "items": [{"name": s["name"]} for s in others_subs],
            "cta": None
        }

    return {
        "movies": movies_rec,
        "music": music_rec,
        "games": games_rec,
        "others": others_rec
    }
