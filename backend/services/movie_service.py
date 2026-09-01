from typing import List, Dict, Any, Optional
from .recommendation_service import DEFAULT_UPCOMING_CONTENT

def get_upcoming_movies(
    user_interests: List[str] = None,
    wishlist_ids: List[str] = None
) -> List[Dict[str, Any]]:
    if user_interests is None:
        user_interests = ["Superhero", "Action", "Sci-Fi"]
    if wishlist_ids is None:
        wishlist_ids = []

    results = []
    for item in DEFAULT_UPCOMING_CONTENT:
        is_match = any(t in user_interests or (t == "Superhero" and "Marvel / Superhero" in user_interests) for t in item["tags"])
        ai_rec = f"Matches your interest in {item['genre']}" if is_match else "Available on " + item["platform_name"]

        results.append({
            "id": item["id"],
            "title": item["title"],
            "type": item["type"],
            "poster_url": item["poster_url"],
            "release_date": item["release_date"],
            "platform": item["platform"],
            "platform_name": item["platform_name"],
            "genre": item["genre"],
            "trailer_url": item["trailer_url"],
            "emoji": item["emoji"],
            "tags": item["tags"],
            "inWishlist": item["id"] in wishlist_ids,
            "aiRecommendation": ai_rec
        })

    return results
