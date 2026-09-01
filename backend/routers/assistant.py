from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription, Wishlist
from ..schemas import AssistantChatRequest, AssistantChatResponse
from ..services.ai_service import generate_advisor_response
from .users import get_or_create_user
from .subscriptions import to_dict

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
def assistant_chat(body: AssistantChatRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    raw_interests = user.preferences.movie_interests or "Superhero,Action,Sci-Fi"
    interests = [x.strip() for x in raw_interests.split(",") if x.strip()]

    user_dict = {
        "name": user.name,
        "monthlyBudget": user.preferences.monthly_budget,
        "movieInterests": interests,
        "optimizationGoal": user.preferences.optimization_goal
    }

    wishlists = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    wishlist_dicts = [{"id": w.id, "content_id": w.content_id, "title": w.title} for w in wishlists]

    response = generate_advisor_response(
        query=body.message,
        subscriptions=sub_dicts,
        user_profile=user_dict,
        wishlist_items=wishlist_dicts
    )

    return AssistantChatResponse(**response)
