from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Wishlist
from ..schemas import UpcomingMovie
from ..services.movie_service import get_upcoming_movies
from .users import get_or_create_user

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/upcoming", response_model=List[UpcomingMovie])
def list_upcoming_movies(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    raw_interests = user.preferences.movie_interests or "Superhero,Action,Sci-Fi"
    interests = [x.strip() for x in raw_interests.split(",") if x.strip()]

    wishlists = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    wishlist_ids = [w.content_id for w in wishlists]

    items = get_upcoming_movies(interests, wishlist_ids)
    return [UpcomingMovie(**item) for item in items]
