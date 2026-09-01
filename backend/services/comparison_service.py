from typing import List, Dict, Any, Optional

OTT_PLATFORM_CATALOG = {
    "netflix": {
        "id": "netflix",
        "name": "Netflix",
        "monthlyPrice": 199.0,
        "defaultWatchHours": 14.0,
        "upcomingReleasesCount": 24,
        "contentTypes": ["Global movies", "Series", "Documentaries", "Anime"],
        "quality": "4K Ultra HD (on premium)",
        "baseScore": 7.5
    },
    "primevideo": {
        "id": "primevideo",
        "name": "Prime Video",
        "monthlyPrice": 299.0,
        "defaultWatchHours": 28.0,
        "upcomingReleasesCount": 19,
        "contentTypes": ["Action", "Superhero", "Regional movies", "Amazon Originals"],
        "quality": "4K Ultra HD + HDR",
        "baseScore": 8.4
    },
    "jiohotstar": {
        "id": "jiohotstar",
        "name": "JioHotstar",
        "monthlyPrice": 149.0,
        "defaultWatchHours": 18.0,
        "upcomingReleasesCount": 16,
        "contentTypes": ["Live Sports", "Cricket", "Disney+", "Indian TV serials"],
        "quality": "Full HD / 4K",
        "baseScore": 7.8
    },
    "appletv": {
        "id": "appletv",
        "name": "Apple TV+",
        "monthlyPrice": 99.0,
        "defaultWatchHours": 8.0,
        "upcomingReleasesCount": 10,
        "contentTypes": ["Prestige Drama", "Sci-Fi", "Award-winning Originals"],
        "quality": "4K Dolby Vision + Atmos",
        "baseScore": 7.9
    },
    "disney": {
        "id": "disney",
        "name": "Disney+",
        "monthlyPrice": 299.0,
        "defaultWatchHours": 15.0,
        "upcomingReleasesCount": 14,
        "contentTypes": ["Marvel", "Star Wars", "Pixar", "Animation"],
        "quality": "4K Ultra HD",
        "baseScore": 8.0
    }
}

UNIVERSAL_SERVICES_CATALOG = {
    "spotify": {
        "name": "Spotify",
        "category": "music",
        "monthlyPrice": 119,
        "freePlan": "Yes (Ad-supported)",
        "audioQuality": "320 kbps High Quality",
        "podcasts": "Extensive catalog & Video Podcasts",
        "offlineListening": "Yes (up to 10k songs)",
        "musicDiscovery": "Industry-leading Discover Weekly & AI DJ",
        "familyPlan": "₹179/month (up to 6 accounts)",
        "studentDiscount": "₹59/month",
        "supportedPlatforms": "iOS, Android, Web, Mac, Windows, TVs, Game consoles",
        "bestFor": "Daily streaming, podcasts, algorithmic music discovery",
        "rating": "4.7 / 5"
    },
    "applemusic": {
        "name": "Apple Music",
        "category": "music",
        "monthlyPrice": 99,
        "freePlan": "No free tier (1-month trial)",
        "audioQuality": "Lossless (24-bit/192kHz) & Spatial Audio Dolby Atmos",
        "podcasts": "Separate Apple Podcasts app",
        "offlineListening": "Yes (up to 100k songs in library)",
        "musicDiscovery": "Curated editorial radio & playlists",
        "familyPlan": "₹149/month (up to 6 accounts)",
        "studentDiscount": "₹59/month",
        "supportedPlatforms": "iOS, Android, Mac, Windows, Apple Watch, HomePod",
        "bestFor": "Audiophiles, Apple ecosystem users, high-fidelity lossless",
        "rating": "4.6 / 5"
    },
    "chatgpt": {
        "name": "ChatGPT Plus",
        "category": "ai",
        "monthlyPrice": 1650,
        "freePlan": "Yes (GPT-4o mini & limited GPT-4o)",
        "aiModels": "GPT-4o, OpenAI o1, Canvas, DALL-E 3",
        "features": "Advanced Voice, Custom GPTs, Web browsing, Code Interpreter",
        "cloudSync": "Real-time sync across web & mobile apps",
        "bestFor": "General reasoning, coding, writing, conversational voice AI",
        "rating": "4.8 / 5"
    },
    "gemini": {
        "name": "Gemini Advanced",
        "category": "ai",
        "monthlyPrice": 1950,
        "freePlan": "Yes (Gemini Flash)",
        "aiModels": "Gemini 1.5 Pro, 2.0 Flash, 2M context window",
        "features": "Google Workspace integration (Docs, Gmail), Python code execution, Deep Research",
        "cloudSync": "2TB Google One Cloud storage included in plan",
        "bestFor": "Large document analysis (2M tokens), Google Workspace workflows, bundled cloud storage",
        "rating": "4.7 / 5"
    },
    "canva": {
        "name": "Canva Pro",
        "category": "design",
        "monthlyPrice": 500,
        "freePlan": "Yes (Generous free design templates)",
        "features": "100M+ stock photos, Magic Studio AI, Brand Kit, 1-click resize",
        "cloudSync": "1TB cloud storage",
        "bestFor": "Social media graphics, presentations, non-designers, fast templates",
        "rating": "4.8 / 5"
    },
    "adobeexpress": {
        "name": "Adobe Express Premium",
        "category": "design",
        "monthlyPrice": 800,
        "freePlan": "Yes (Basic assets)",
        "features": "Adobe Firefly Generative AI, Photoshop & Illustrator interoperability, Adobe Fonts",
        "cloudSync": "100GB cloud storage",
        "bestFor": "Designers needing Creative Cloud workflows and high-end Firefly generative tools",
        "rating": "4.5 / 5"
    },
    "googledrive": {
        "name": "Google One (Drive)",
        "category": "cloud",
        "monthlyPrice": 130,
        "freePlan": "15 GB free with Google Account",
        "storageAmount": "100 GB (expandable to 2TB+)",
        "cloudSync": "Seamless Android backups, Google Photos, Gmail, Docs",
        "sharing": "Link sharing with granular view/edit/comment permissions",
        "platforms": "Android, iOS, Web, Windows, Mac",
        "bestFor": "Android users, Google Workspace collaboration, photo backups",
        "rating": "4.8 / 5"
    },
    "onedrive": {
        "name": "Microsoft OneDrive (365)",
        "category": "cloud",
        "monthlyPrice": 140,
        "freePlan": "5 GB free with Microsoft Account",
        "storageAmount": "100 GB (or 1TB with Microsoft 365 Personal at ₹489/mo)",
        "cloudSync": "Native Windows explorer sync, Office document co-authoring",
        "sharing": "Password protected & expiring links (on paid tiers)",
        "platforms": "Windows, Mac, iOS, Android, Web",
        "bestFor": "Windows users, Word/Excel/PowerPoint heavy workflows",
        "rating": "4.5 / 5"
    }
}

def compare_ott_services(
    platforms: Optional[List[str]],
    subscriptions: List[Dict[str, Any]],
    user_profile: Dict[str, Any]
) -> Dict[str, Any]:
    if not platforms:
        platforms = ["netflix", "primevideo", "jiohotstar", "appletv", "disney"]

    sub_map = {s["id"]: s for s in subscriptions}
    results = []

    movie_interests = user_profile.get("movieInterests", ["Superhero", "Action", "Sci-Fi"])
    
    for pid in platforms:
        cat_item = OTT_PLATFORM_CATALOG.get(pid)
        if not cat_item:
            continue

        curr = sub_map.get(pid)
        watch_hrs = float(curr.get("usedDays", 0) * 1.5) if curr else cat_item["defaultWatchHours"]
        if watch_hrs <= 0:
            watch_hrs = 2.0

        price = float(curr.get("price") if curr else cat_item["monthlyPrice"])
        cost_per_hr = round(price / watch_hrs, 2)

        # Interest match boost
        interest_match_count = sum(1 for c in cat_item["contentTypes"] if any(i.lower() in c.lower() for i in movie_interests))
        value_score = round(cat_item["baseScore"] + (interest_match_count * 0.4) - min(2.0, (cost_per_hr / 20.0)), 1)
        value_score = max(3.0, min(9.9, value_score))

        results.append({
            "id": pid,
            "name": cat_item["name"],
            "monthlyPrice": price,
            "watchHoursMonth": round(watch_hrs, 1),
            "costPerHour": cost_per_hr,
            "upcomingReleasesCount": cat_item["upcomingReleasesCount"],
            "valueScore": value_score,
            "currentSubscriber": curr is not None
        })

    # Pick winner with highest value score
    results.sort(key=lambda x: x["valueScore"], reverse=True)
    winner = results[0]["name"]
    score = results[0]["valueScore"]

    ai_verdict = f"Based on your profile interests ({', '.join(movie_interests)}) and cost efficiency, {winner} delivers the highest estimated value score ({score}/10) at ₹{results[0]['costPerHour']}/hour watched."

    return {
        "comparison": results,
        "winner": winner,
        "score": score,
        "recommendation": f"Prioritize {winner} for primary entertainment.",
        "aiVerdict": ai_verdict
    }

def compare_universal_services(
    service_a_key: str,
    service_b_key: str,
    user_profile: Dict[str, Any],
    subscriptions: List[Dict[str, Any]]
) -> Dict[str, Any]:
    key_a = service_a_key.lower().replace(" ", "").replace("+", "").replace("-", "")
    key_b = service_b_key.lower().replace(" ", "").replace("+", "").replace("-", "")

    item_a = UNIVERSAL_SERVICES_CATALOG.get(key_a)
    item_b = UNIVERSAL_SERVICES_CATALOG.get(key_b)

    if not item_a or not item_b:
        # Fallback dynamic comparison
        return {
            "category": "services",
            "serviceA": {"name": service_a_key, "monthlyPrice": "Varies"},
            "serviceB": {"name": service_b_key, "monthlyPrice": "Varies"},
            "comparisonFields": [
                {"label": "Monthly Price", "a": "Standard Tier", "b": "Standard Tier"},
                {"label": "Best For", "a": f"Users seeking {service_a_key} ecosystem", "b": f"Users seeking {service_b_key} ecosystem"}
            ],
            "winner": service_a_key,
            "personalizedAiVerdict": f"Based on your current subscriptions, {service_a_key} fits your current workflow."
        }

    category = item_a.get("category", "general")
    fields = []

    # Category-specific fields (never showing irrelevant fields)
    if category == "music":
        fields = [
            {"label": "Monthly Price", "a": f"₹{item_a['monthlyPrice']}", "b": f"₹{item_b['monthlyPrice']}"},
            {"label": "Audio Quality", "a": item_a.get("audioQuality"), "b": item_b.get("audioQuality")},
            {"label": "Podcasts & Shows", "a": item_a.get("podcasts"), "b": item_b.get("podcasts")},
            {"label": "Offline Support", "a": item_a.get("offlineListening"), "b": item_b.get("offlineListening")},
            {"label": "Music Discovery", "a": item_a.get("musicDiscovery"), "b": item_b.get("musicDiscovery")},
            {"label": "Family Plan", "a": item_a.get("familyPlan"), "b": item_b.get("familyPlan")},
            {"label": "Student Discount", "a": item_a.get("studentDiscount"), "b": item_b.get("studentDiscount")},
            {"label": "Best For", "a": item_a.get("bestFor"), "b": item_b.get("bestFor")},
            {"label": "User Rating", "a": item_a.get("rating"), "b": item_b.get("rating")}
        ]
    elif category == "cloud":
        fields = [
            {"label": "Monthly Price", "a": f"₹{item_a['monthlyPrice']}", "b": f"₹{item_b['monthlyPrice']}"},
            {"label": "Free Tier", "a": item_a.get("freePlan"), "b": item_b.get("freePlan")},
            {"label": "Storage Amount", "a": item_a.get("storageAmount"), "b": item_b.get("storageAmount")},
            {"label": "Cloud Sync", "a": item_a.get("cloudSync"), "b": item_b.get("cloudSync")},
            {"label": "Sharing Permissions", "a": item_a.get("sharing"), "b": item_b.get("sharing")},
            {"label": "Supported Platforms", "a": item_a.get("platforms"), "b": item_b.get("platforms")},
            {"label": "Best For", "a": item_a.get("bestFor"), "b": item_b.get("bestFor")},
            {"label": "User Rating", "a": item_a.get("rating"), "b": item_b.get("rating")}
        ]
    elif category == "ai":
        fields = [
            {"label": "Monthly Price", "a": f"₹{item_a['monthlyPrice']}", "b": f"₹{item_b['monthlyPrice']}"},
            {"label": "Free Plan", "a": item_a.get("freePlan"), "b": item_b.get("freePlan")},
            {"label": "AI Models", "a": item_a.get("aiModels"), "b": item_b.get("aiModels")},
            {"label": "Key Features", "a": item_a.get("features"), "b": item_b.get("features")},
            {"label": "Cloud Storage Included", "a": item_a.get("cloudSync"), "b": item_b.get("cloudSync")},
            {"label": "Best For", "a": item_a.get("bestFor"), "b": item_b.get("bestFor")},
            {"label": "User Rating", "a": item_a.get("rating"), "b": item_b.get("rating")}
        ]
    elif category == "design":
        fields = [
            {"label": "Monthly Price", "a": f"₹{item_a['monthlyPrice']}", "b": f"₹{item_b['monthlyPrice']}"},
            {"label": "Free Plan", "a": item_a.get("freePlan"), "b": item_b.get("freePlan")},
            {"label": "Features & Stock Assets", "a": item_a.get("features"), "b": item_b.get("features")},
            {"label": "Cloud Storage", "a": item_a.get("cloudSync"), "b": item_b.get("cloudSync")},
            {"label": "Best For", "a": item_a.get("bestFor"), "b": item_b.get("bestFor")},
            {"label": "User Rating", "a": item_a.get("rating"), "b": item_b.get("rating")}
        ]

    # Personalized AI verdict tailored to User Profile
    sub_ids = {s["id"] for s in subscriptions}
    has_a = key_a in sub_ids or any(key_a in s["name"].lower() for s in subscriptions)
    has_b = key_b in sub_ids or any(key_b in s["name"].lower() for s in subscriptions)

    music_use = user_profile.get("musicUse", [])

    if category == "music":
        if "Podcasts" in music_use or has_a:
            winner = item_a["name"]
            ai_verdict = f"{winner} is recommended for you because your current usage is active and you regularly listen to podcasts and playlists."
        else:
            winner = item_b["name"]
            ai_verdict = f"{winner} is recommended for you if you value lossless spatial audio and high-fidelity tracks."
    elif category == "cloud":
        winner = item_a["name"]
        ai_verdict = f"{winner} is recommended for you as it offers effortless photo sync, generous pricing (₹{item_a['monthlyPrice']}/mo), and seamless backup."
    else:
        winner = item_a["name"]
        ai_verdict = f"Based on your profile preferences and budget, {winner} offers the most balanced feature set for your daily routine."

    return {
        "category": category,
        "serviceA": item_a,
        "serviceB": item_b,
        "comparisonFields": fields,
        "winner": winner,
        "personalizedAiVerdict": ai_verdict
    }
