from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription
from ..schemas import OptimizerRequest, OptimizedPlanResponse
from ..services.optimizer_service import compute_optimization
from .users import get_or_create_user
from .subscriptions import to_dict

router = APIRouter(prefix="/api/optimizer", tags=["optimizer"])

@router.post("", response_model=OptimizedPlanResponse)
@router.get("", response_model=OptimizedPlanResponse)
def get_or_run_optimizer(body: OptimizerRequest = None, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    budget = body.budget if (body and body.budget is not None) else user.preferences.monthly_budget

    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    result = compute_optimization(sub_dicts, budget)

    return OptimizedPlanResponse(
        currentMonthlySpend=result["currentMonthlySpend"],
        budget=result["budget"],
        optimizedMonthlySpend=result["optimizedMonthlySpend"],
        potentialReduction=result["potentialReduction"],
        withinBudget=result["withinBudget"],
        currentSubscriptionsCount=result["currentSubscriptionsCount"],
        optimizedSubscriptionsCount=result["optimizedSubscriptionsCount"],
        keep=result["keep"],
        review=result["review"],
        attention=result["attention"],
        ghosts=result["ghosts"],
        trials=result["trials"],
        overlap=result["overlap"],
        reasons=result["reasons"],
        valueNote=result["valueNote"],
        caption=result["caption"]
    )
