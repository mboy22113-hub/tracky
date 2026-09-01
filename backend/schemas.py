from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# User & Profile schemas
class UserProfileBase(BaseModel):
    name: str = "Alex"
    email: str = "alex@email.com"
    ageRange: Optional[str] = ""
    subscriptionCategories: List[str] = ["movies", "music"]
    movieInterests: List[str] = ["Superhero", "Action", "Sci-Fi"]
    contentPriorities: List[str] = ["New releases"]
    musicInterests: List[str] = []
    musicUse: List[str] = []
    gamingInterests: List[str] = []
    gamingFrequency: Optional[str] = ""
    otherInterests: List[str] = []
    monthlyBudget: float = 1000.0
    optimizationGoal: str = "best_value"
    recommendationPriorities: List[str] = []
    recommendationSettings: Dict[str, bool] = {"movies": True, "music": True, "games": True, "others": True}
    notificationSettings: Dict[str, bool] = {
        "renewals": True,
        "trials": True,
        "lowUsage": True,
        "ghostSubscriptions": True,
        "budget": True,
        "optimization": True
    }
    trackerPreferences: Dict[str, bool] = {
        "usageTracking": True,
        "reminders": True,
        "personalizedRecs": True
    }
    transactionConnected: bool = False

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: str = "u_default"

# Subscription schemas
class SubscriptionBase(BaseModel):
    name: str
    category: str # movies, music, games, others
    categoryLabel: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = "#2F6FED"
    price: float = 0.0
    free: bool = False
    billingCycle: str = "monthly"
    nextRenewal: Optional[str] = None
    renewsIn: Optional[str] = None
    autopay: str = "Unknown" # Enabled, Disabled, Unknown, Not applicable
    freeTrial: bool = False
    trialDaysLeft: Optional[int] = None
    appInstalled: bool = True
    valueScore: Optional[str] = "7.0/10"
    redundancy: Optional[str] = "Low"
    pauseSupported: bool = False
    status: Optional[str] = "active" # high, active, moderate, low
    statusLabel: Optional[str] = "Active"
    recommendation: Optional[str] = ""
    usedDays: Optional[int] = 0
    lastUsed: Optional[str] = "recently"

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    categoryLabel: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    price: Optional[float] = None
    free: Optional[bool] = None
    billingCycle: Optional[str] = None
    nextRenewal: Optional[str] = None
    renewsIn: Optional[str] = None
    autopay: Optional[str] = None
    freeTrial: Optional[bool] = None
    trialDaysLeft: Optional[int] = None
    appInstalled: Optional[bool] = None
    valueScore: Optional[str] = None
    redundancy: Optional[str] = None
    pauseSupported: Optional[bool] = None
    status: Optional[str] = None
    statusLabel: Optional[str] = None
    recommendation: Optional[str] = None
    usedDays: Optional[int] = None
    lastUsed: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: str

# Usage schema
class UsageRecordCreate(BaseModel):
    subscription_id: str
    date: str
    used: bool = True
    duration_minutes: int = 0

# Insights schema
class CategoryTotal(BaseModel):
    category: str
    label: str
    amount: float
    percentage: float
    color: str

class MonthTrend(BaseModel):
    month: str
    value: float

class InsightsResponse(BaseModel):
    monthlySpend: float
    yearlyProjection: float
    potentialLeakage: float
    activeSubscriptionsCount: int
    categoryTotals: Dict[str, float]
    categories: List[CategoryTotal]
    spendingTrend: List[MonthTrend]
    trendDescription: str
    trendDirection: str # up, down, flat
    trendPercentage: int
    lowUsageCount: int
    topUsedSubscription: Optional[str]
    largestCategory: str
    aiNotices: List[str]

# Optimizer schema
class OptimizerRequest(BaseModel):
    budget: Optional[float] = None

class OptimizedPlanResponse(BaseModel):
    currentMonthlySpend: float
    budget: float
    optimizedMonthlySpend: float
    potentialReduction: float
    withinBudget: bool
    currentSubscriptionsCount: int
    optimizedSubscriptionsCount: int
    keep: List[Dict[str, Any]]
    review: List[Dict[str, Any]]
    attention: List[Dict[str, Any]]
    ghosts: List[Dict[str, Any]]
    trials: List[Dict[str, Any]]
    overlap: Optional[Dict[str, Any]]
    reasons: List[str]
    valueNote: str
    caption: str

# Recommendations schema
class ContentRecommendation(BaseModel):
    id: str
    title: str
    genre: str
    platform: str
    platformName: str
    availability: str
    tags: List[str]
    emoji: str
    posterUrl: Optional[str] = None
    trailerUrl: Optional[str] = None
    inWishlist: bool = False

class FutureCategoryRecommendation(BaseModel):
    category: str
    title: str
    badge: str
    badgeClass: str
    reason: str
    note: Optional[str] = None
    items: List[Dict[str, Any]] = []
    cta: Optional[Dict[str, str]] = None

class FutureRecommendationsResponse(BaseModel):
    movies: FutureCategoryRecommendation
    music: FutureCategoryRecommendation
    games: FutureCategoryRecommendation
    others: FutureCategoryRecommendation

# Movie schema
class UpcomingMovie(BaseModel):
    id: str
    title: str
    type: str = "Movie"
    poster_url: Optional[str] = None
    release_date: str
    platform: str
    platform_name: str
    genre: str
    trailer_url: str = ""
    emoji: str = "🎬"
    tags: List[str] = []
    inWishlist: bool = False
    aiRecommendation: Optional[str] = None

# Wishlist schema
class WishlistCreate(BaseModel):
    content_id: str
    title: str
    poster_url: Optional[str] = None
    platform: Optional[str] = None

class WishlistResponse(BaseModel):
    id: str
    user_id: str
    content_id: str
    title: str
    poster_url: Optional[str] = None
    platform: Optional[str] = None
    created_at: Any

# Comparison schemas
class OTTComparisonRequest(BaseModel):
    platforms: Optional[List[str]] = None # e.g. ["netflix", "primevideo", "jiohotstar", "appletv", "disney"]

class OTTComparisonItem(BaseModel):
    id: str
    name: str
    monthlyPrice: float
    watchHoursMonth: float
    costPerHour: float
    upcomingReleasesCount: int
    valueScore: float
    currentSubscriber: bool

class OTTComparisonResponse(BaseModel):
    comparison: List[OTTComparisonItem]
    winner: str
    score: float
    recommendation: str
    aiVerdict: str

class UniversalComparisonRequest(BaseModel):
    serviceA: str
    serviceB: str
    category: Optional[str] = None

class UniversalComparisonResponse(BaseModel):
    category: str
    serviceA: Dict[str, Any]
    serviceB: Dict[str, Any]
    comparisonFields: List[Dict[str, Any]]
    winner: str
    personalizedAiVerdict: str

# AI Assistant schema
class AssistantChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class AssistantAction(BaseModel):
    label: str
    type: str # "navigate_subs", "navigate_optimize", "open_detail", "review_sub", "set_budget"
    payload: Optional[Dict[str, Any]] = None

class AssistantChatResponse(BaseModel):
    answer: str
    reason: str
    action: Optional[AssistantAction] = None
