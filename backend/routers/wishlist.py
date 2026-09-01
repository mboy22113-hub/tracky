import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Wishlist
from ..schemas import WishlistResponse, WishlistCreate
from .users import get_or_create_user

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])

@router.get("", response_model=List[WishlistResponse])
def get_wishlist(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    items = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    return items

@router.post("", response_model=WishlistResponse)
def add_to_wishlist(body: WishlistCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == user.id,
        Wishlist.content_id == body.content_id
    ).first()
    if existing:
        return existing

    item_id = "w_" + str(uuid.uuid4())[:8]
    item = Wishlist(
        id=item_id,
        user_id=user.id,
        content_id=body.content_id,
        title=body.title,
        poster_url=body.poster_url,
        platform=body.platform
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{content_or_id}")
def remove_from_wishlist(content_or_id: str, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    item = db.query(Wishlist).filter(
        Wishlist.user_id == user.id,
        (Wishlist.id == content_or_id) | (Wishlist.content_id == content_or_id)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"status": "ok", "message": f"Removed {content_or_id} from wishlist"}
