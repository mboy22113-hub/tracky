import { Subscription, UserProfile, WishlistItem } from './types.js';

export const INITIAL_USER: UserProfile = {
  id: "u_default",
  name: "Alex",
  email: "alex@email.com",
  ageRange: "20-29",
  subscriptionCategories: ["movies", "music"],
  movieInterests: ["Superhero", "Action", "Sci-Fi"],
  contentPriorities: ["New releases"],
  musicInterests: ["Pop", "Electronic", "Rock"],
  musicUse: ["Daily commute", "Work focus"],
  gamingInterests: ["Action", "Open World"],
  gamingFrequency: "Regular",
  otherInterests: ["Cloud Storage", "Graphic Design"],
  productivityInterests: ["Cloud Storage", "Design tools"],
  connectedDevices: ["iPhone 15 Pro", "MacBook Pro", "iPad Air", "Smart TV"],
  monthlyBudget: 1000,
  optimizationGoal: "best_value",
  recommendationPriorities: ["High usage", "Budget saving"],
  recommendationSettings: { movies: true, music: true, games: true, others: true },
  notificationSettings: { renewals: true, trials: true, lowUsage: true, ghostSubscriptions: true, budget: true, optimization: true },
  trackerPreferences: { usageTracking: true, reminders: true, personalizedRecs: true },
  transactionConnected: false
};

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "netflix",
    name: "Netflix",
    category: "movies",
    categoryLabel: "Movies",
    icon: "N",
    color: "#141414",
    price: 199,
    free: false,
    usedDays: 2,
    lastUsed: "18 days ago",
    renewsIn: "3 days",
    renewalDate: "5 Sep 2026",
    status: "low",
    statusLabel: "Low usage",
    autopay: "Enabled",
    nextRenewal: "5 Sep",
    valueScore: "5.8/10",
    redundancy: "Medium",
    pauseSupported: false,
    recommendation: "Your recent usage is low (2 days). Review before renewal in 3 days."
  },
  {
    id: "primevideo",
    name: "Prime Video",
    category: "movies",
    categoryLabel: "Movies",
    icon: "P",
    color: "#00A8E1",
    price: 299,
    free: false,
    usedDays: 12,
    lastUsed: "2 days ago",
    renewsIn: "18 days",
    renewalDate: "20 Sep 2026",
    status: "active",
    statusLabel: "Active",
    autopay: "Enabled",
    nextRenewal: "20 Sep",
    valueScore: "7.4/10",
    redundancy: "Low",
    pauseSupported: false,
    recommendation: "Usage is steady and consistent (12 days). Delivering good value."
  },
  {
    id: "jiohotstar",
    name: "JioHotstar",
    category: "movies",
    categoryLabel: "Movies",
    icon: "J",
    color: "#0C1B33",
    price: 149,
    free: false,
    usedDays: 6,
    lastUsed: "5 days ago",
    renewsIn: "9 days",
    renewalDate: "11 Sep 2026",
    status: "moderate",
    statusLabel: "Moderate usage",
    autopay: "Enabled",
    nextRenewal: "11 Sep",
    valueScore: "6.1/10",
    redundancy: "High — overlaps with Netflix",
    pauseSupported: true,
    recommendation: "Overlaps with Netflix content. Check if keeping both is necessary."
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    categoryLabel: "Music",
    icon: "S",
    color: "#1DB954",
    price: 119,
    free: false,
    usedDays: 24,
    lastUsed: "today",
    renewsIn: "11 days",
    renewalDate: "13 Sep 2026",
    status: "high",
    statusLabel: "High usage",
    autopay: "Enabled",
    nextRenewal: "13 Sep",
    valueScore: "9.1/10",
    redundancy: "Low",
    pauseSupported: false,
    recommendation: "Most frequently used subscription (24 days). High return on spend."
  },
  {
    id: "applemusic",
    name: "Apple Music",
    category: "music",
    categoryLabel: "Music",
    icon: "A",
    color: "#FA243C",
    price: 99,
    free: false,
    usedDays: 18,
    lastUsed: "yesterday",
    renewsIn: "7 days",
    renewalDate: "9 Sep 2026",
    status: "active",
    statusLabel: "Active",
    autopay: "Enabled",
    nextRenewal: "9 Sep",
    valueScore: "7.0/10",
    redundancy: "Medium — overlaps with Spotify",
    pauseSupported: true,
    recommendation: "Regular usage, but overlaps with Spotify audio library."
  },
  {
    id: "xboxgamepass",
    name: "Xbox Game Pass",
    category: "games",
    categoryLabel: "Games",
    icon: "X",
    color: "#107C10",
    price: 489,
    free: false,
    usedDays: 18,
    lastUsed: "yesterday",
    renewsIn: "24 days",
    renewalDate: "26 Sep 2026",
    status: "active",
    statusLabel: "Active",
    autopay: "Enabled",
    nextRenewal: "26 Sep",
    valueScore: "7.8/10",
    redundancy: "Low",
    pauseSupported: true,
    recommendation: "Consistent gaming hours this month. Good catalog usage."
  },
  {
    id: "bgmi",
    name: "BGMI",
    category: "games",
    categoryLabel: "Games",
    icon: "B",
    color: "#E08A2C",
    price: 0,
    free: true,
    usedDays: 14,
    lastUsed: "today",
    renewsIn: null,
    renewalDate: null,
    status: "active",
    statusLabel: "Active",
    autopay: "Not applicable",
    nextRenewal: "Not applicable",
    valueScore: "—",
    redundancy: "—",
    pauseSupported: false,
    recommendation: "Free mobile game with no recurring cost."
  },
  {
    id: "googleone",
    name: "Google One",
    category: "others",
    categoryLabel: "Others",
    icon: "G",
    color: "#4285F4",
    price: 130,
    free: false,
    usedDays: 25,
    lastUsed: "today",
    renewsIn: "14 days",
    renewalDate: "16 Sep 2026",
    status: "high",
    statusLabel: "High usage",
    autopay: "Enabled",
    nextRenewal: "16 Sep",
    valueScore: "8.6/10",
    redundancy: "Low",
    pauseSupported: false,
    recommendation: "Used almost daily for cloud backups and storage."
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "others",
    categoryLabel: "Productivity",
    icon: "C",
    color: "#00C4CC",
    price: 499,
    free: false,
    usedDays: 3,
    lastUsed: "2 days ago",
    renewsIn: "2 days",
    renewalDate: "4 Sep 2026",
    status: "moderate",
    statusLabel: "Trial ending",
    autopay: "Enabled",
    nextRenewal: "4 Sep",
    valueScore: "6.2/10",
    redundancy: "Low",
    pauseSupported: true,
    recommendation: "Canva Pro free trial ends in 2 days. Will auto-renew at ₹499/mo if not cancelled.",
    appInstalled: true,
    trialDaysLeft: 2
  },
  {
    id: "duolingo",
    name: "Duolingo Super",
    category: "others",
    categoryLabel: "Education",
    icon: "D",
    color: "#58CC02",
    price: 299,
    free: false,
    usedDays: 0,
    lastUsed: "22 days ago",
    renewsIn: "5 days",
    renewalDate: "7 Sep 2026",
    status: "low",
    statusLabel: "Ghost App",
    autopay: "Enabled",
    nextRenewal: "7 Sep",
    valueScore: "1.2/10",
    redundancy: "Low",
    pauseSupported: true,
    recommendation: "Ghost Subscription detected: App was uninstalled from your devices 18 days ago, but AutoPay is still charging ₹299/mo.",
    appInstalled: false,
    trialDaysLeft: undefined
  }
];

export const INITIAL_WISHLIST: WishlistItem[] = [
  { id: 'm_dune2', content_id: 'm_dune2', title: 'Dune: Part Two', poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', platform: 'Prime Video' },
  { id: 'm_squidgame2', content_id: 'm_squidgame2', title: 'Squid Game S2', poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80', platform: 'Netflix' }
];

export const INSIGHTS_PERIOD_DATA: Record<string, any> = {
  thismonth: {
    monthlySpend: 1984,
    previousSpend: 1770,
    spendChangePct: 12,
    yearlyProjection: 23808,
    potentialSavings: 699,
    attentionCount: 3,
    attentionReason: 'Renewals, low usage, ghost subscriptions, or trials',
    categories: [
      { id: 'ott', label: 'OTT & Entertainment', emoji: '🎬', amount: 850, percentage: 43, color: '#2F6FED', count: 3 },
      { id: 'productivity', label: 'Productivity', emoji: '💼', amount: 499, percentage: 25, color: '#7C3AED', count: 1 },
      { id: 'gaming', label: 'Gaming', emoji: '🎮', amount: 299, percentage: 15, color: '#C98A2C', count: 1 },
      { id: 'other', label: 'Other Services', emoji: '🛍️', amount: 217, percentage: 11, color: '#16213E', count: 2 },
      { id: 'music', label: 'Music', emoji: '🎵', amount: 119, percentage: 6, color: '#2FAE6B', count: 1 }
    ],
    spendingTrend: [
      { month: 'Apr', value: 1450, change: '+₹0', changePct: '0%' },
      { month: 'May', value: 1600, change: '+₹150', changePct: '+10.3%' },
      { month: 'Jun', value: 1720, change: '+₹120', changePct: '+7.5%' },
      { month: 'Jul', value: 1840, change: '+₹120', changePct: '+7.0%' },
      { month: 'Aug', value: 1984, change: '+₹144', changePct: '+7.8%' },
      { month: 'Sep', value: 1984, change: '±₹0', changePct: '0%' }
    ],
    trendInsight: 'Your subscription spending increased by 37% over the last 5 months.',
    trendDirection: 'up',
    valueMetrics: [
      { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', cost: 119, usageHours: 35, costPerHour: 3, status: 'good', statusLabel: 'Great Value', badge: '✅ ₹3/hr' },
      { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', cost: 299, usageHours: 20, costPerHour: 15, status: 'good', statusLabel: 'Good Value', badge: '✅ ₹15/hr' },
      { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', cost: 199, usageHours: 3, costPerHour: 66, status: 'warning', statusLabel: 'Low Value', badge: '⚠️ ₹66/hr' },
      { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', cost: 499, usageHours: 2, costPerHour: 249, status: 'danger', statusLabel: 'Overpaying', badge: '⚠️ ₹249/hr' }
    ],
    valueInsight: 'Canva and Netflix have the highest cost per hour because of low usage.',
    weeklyActivity: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      mostActive: { name: 'Spotify', detail: '35 hrs / 7 days active' },
      leastActive: { name: 'Canva', detail: '2 hrs / 1 day active' },
      services: [
        { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', activeDays: 7, percentage: 100, intensity: [3, 4, 4, 5, 5, 4, 3] },
        { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', activeDays: 5, percentage: 71, intensity: [0, 2, 0, 3, 4, 5, 4] },
        { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 1, 2, 0] },
        { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', activeDays: 1, percentage: 14, intensity: [0, 0, 2, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: 'leak_ghost', type: 'ghost', icon: '👻', title: 'Ghost Subscription', description: 'Deleted app but active subscription detected.', serviceName: 'Duolingo Super', serviceId: 'duolingo', riskLevel: 'High Risk', riskClass: 'high', potentialSavings: 299, actionLabel: 'Review →' },
      { id: 'leak_trial', type: 'trial', icon: '🎁', title: 'Free Trial Ending', description: 'Trial ends in 2 days. Auto-renews soon.', serviceName: 'Canva Pro', serviceId: 'canva', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 499, actionLabel: 'Review →' },
      { id: 'leak_low_usage', type: 'low_usage', icon: '⚠️', title: 'Low Usage', description: 'Netflix has not been used for 18 days.', serviceName: 'Netflix Basic', serviceId: 'netflix', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 199, actionLabel: 'Review →' },
      { id: 'leak_overlap', type: 'overlap', icon: '💸', title: 'Duplicate / Overlapping Services', description: 'Multiple services provide similar functionality.', serviceName: 'Apple Music & Spotify', serviceId: 'spotify', riskLevel: 'Low Risk', riskClass: 'low', potentialSavings: 119, actionLabel: 'Review →' }
    ],
    aiInsight: {
      title: 'Trackey AI Insight',
      text: 'Your spending is increasing mainly because of productivity and OTT subscriptions. You actively use Spotify and Prime Video, but Netflix and Canva provide significantly lower value per rupee.',
      potentialSavings: 699,
      action1: 'Optimize Now →',
      action2: 'View Recommendations →'
    }
  },
  lastmonth: {
    monthlySpend: 1770,
    previousSpend: 1720,
    spendChangePct: 3,
    yearlyProjection: 21240,
    potentialSavings: 580,
    attentionCount: 2,
    attentionReason: '2 subscriptions underutilized in August',
    categories: [
      { id: 'ott', label: 'OTT & Entertainment', emoji: '🎬', amount: 750, percentage: 42, color: '#2F6FED', count: 3 },
      { id: 'productivity', label: 'Productivity', emoji: '💼', amount: 499, percentage: 28, color: '#7C3AED', count: 1 },
      { id: 'gaming', label: 'Gaming', emoji: '🎮', amount: 299, percentage: 17, color: '#C98A2C', count: 1 },
      { id: 'music', label: 'Music', emoji: '🎵', amount: 119, percentage: 7, color: '#2FAE6B', count: 1 },
      { id: 'other', label: 'Other Services', emoji: '🛍️', amount: 103, percentage: 6, color: '#16213E', count: 1 }
    ],
    spendingTrend: [
      { month: 'Mar', value: 1380, change: '+₹0', changePct: '0%' },
      { month: 'Apr', value: 1450, change: '+₹70', changePct: '+5.1%' },
      { month: 'May', value: 1600, change: '+₹150', changePct: '+10.3%' },
      { month: 'Jun', value: 1720, change: '+₹120', changePct: '+7.5%' },
      { month: 'Jul', value: 1840, change: '+₹120', changePct: '+7.0%' },
      { month: 'Aug', value: 1770, change: '-₹70', changePct: '-3.8%' }
    ],
    trendInsight: 'Last month was 3.8% lower than July due to paused Prime plan.',
    trendDirection: 'down',
    valueMetrics: [
      { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', cost: 119, usageHours: 32, costPerHour: 4, status: 'good', statusLabel: 'Great Value', badge: '✅ ₹4/hr' },
      { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', cost: 299, usageHours: 18, costPerHour: 16, status: 'good', statusLabel: 'Good Value', badge: '✅ ₹16/hr' },
      { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', cost: 199, usageHours: 4, costPerHour: 50, status: 'warning', statusLabel: 'Low Value', badge: '⚠️ ₹50/hr' },
      { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', cost: 499, usageHours: 2, costPerHour: 249, status: 'danger', statusLabel: 'Overpaying', badge: '⚠️ ₹249/hr' }
    ],
    valueInsight: 'Canva remained the most under-utilized app relative to subscription fee.',
    weeklyActivity: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      mostActive: { name: 'Spotify', detail: '32 hrs / 7 days active' },
      leastActive: { name: 'Canva', detail: '2 hrs / 1 day active' },
      services: [
        { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', activeDays: 7, percentage: 100, intensity: [3, 4, 4, 4, 5, 4, 3] },
        { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', activeDays: 4, percentage: 57, intensity: [0, 2, 0, 2, 4, 4, 3] },
        { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 1, 2, 0] },
        { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', activeDays: 1, percentage: 14, intensity: [0, 0, 2, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: 'leak_trial', type: 'trial', icon: '🎁', title: 'Free Trial Ending', description: 'Trial active in August.', serviceName: 'Canva Pro', serviceId: 'canva', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 499, actionLabel: 'Review →' },
      { id: 'leak_low_usage', type: 'low_usage', icon: '⚠️', title: 'Low Usage', description: 'Netflix used only 4 hrs.', serviceName: 'Netflix Basic', serviceId: 'netflix', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 199, actionLabel: 'Review →' }
    ],
    aiInsight: {
      title: 'Trackey AI Insight',
      text: 'Last month spending was stabilized, but Canva and Netflix accounted for ₹698 of low-return spend.',
      potentialSavings: 580,
      action1: 'Optimize Now →',
      action2: 'View Recommendations →'
    }
  },
  last3: {
    monthlySpend: 5594,
    previousSpend: 4770,
    spendChangePct: 17,
    yearlyProjection: 22376,
    potentialSavings: 1980,
    attentionCount: 4,
    attentionReason: 'Quarterly accumulation of idle subscriptions',
    categories: [
      { id: 'ott', label: 'OTT & Entertainment', emoji: '🎬', amount: 2450, percentage: 44, color: '#2F6FED', count: 3 },
      { id: 'productivity', label: 'Productivity', emoji: '💼', amount: 1497, percentage: 27, color: '#7C3AED', count: 1 },
      { id: 'gaming', label: 'Gaming', emoji: '🎮', amount: 897, percentage: 16, color: '#C98A2C', count: 1 },
      { id: 'music', label: 'Music', emoji: '🎵', amount: 357, percentage: 6, color: '#2FAE6B', count: 1 },
      { id: 'other', label: 'Other Services', emoji: '🛍️', amount: 393, percentage: 7, color: '#16213E', count: 2 }
    ],
    spendingTrend: [
      { month: 'Apr', value: 1450, change: '+₹0', changePct: '0%' },
      { month: 'May', value: 1600, change: '+₹150', changePct: '+10.3%' },
      { month: 'Jun', value: 1720, change: '+₹120', changePct: '+7.5%' },
      { month: 'Jul', value: 1840, change: '+₹120', changePct: '+7.0%' },
      { month: 'Aug', value: 1984, change: '+₹144', changePct: '+7.8%' },
      { month: 'Sep', value: 1984, change: '±₹0', changePct: '0%' }
    ],
    trendInsight: 'Over the last 3 months, your total outflow was ₹5,594 with a 17% growth rate.',
    trendDirection: 'up',
    valueMetrics: [
      { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', cost: 357, usageHours: 105, costPerHour: 3.4, status: 'good', statusLabel: 'Great Value', badge: '✅ ₹3.4/hr' },
      { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', cost: 897, usageHours: 62, costPerHour: 14.5, status: 'good', statusLabel: 'Good Value', badge: '✅ ₹14.5/hr' },
      { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', cost: 597, usageHours: 9, costPerHour: 66.3, status: 'warning', statusLabel: 'Low Value', badge: '⚠️ ₹66/hr' },
      { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', cost: 1497, usageHours: 6, costPerHour: 249.5, status: 'danger', statusLabel: 'Overpaying', badge: '⚠️ ₹250/hr' }
    ],
    valueInsight: 'Quarterly review shows Canva generated only 6 hours of work for ₹1,497 spend.',
    weeklyActivity: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      mostActive: { name: 'Spotify', detail: '105 hrs / 90 days active' },
      leastActive: { name: 'Canva', detail: '6 hrs / 12 days active' },
      services: [
        { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', activeDays: 7, percentage: 100, intensity: [4, 4, 5, 5, 5, 4, 4] },
        { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', activeDays: 5, percentage: 71, intensity: [1, 2, 1, 3, 5, 5, 4] },
        { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 2, 2, 0] },
        { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', activeDays: 1, percentage: 14, intensity: [0, 0, 1, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: 'leak_ghost', type: 'ghost', icon: '👻', title: 'Ghost Subscription', description: 'Duolingo Plus billed quarterly without active app installs.', serviceName: 'Duolingo Super', serviceId: 'duolingo', riskLevel: 'High Risk', riskClass: 'high', potentialSavings: 897, actionLabel: 'Review →' },
      { id: 'leak_trial', type: 'trial', icon: '🎁', title: 'Free Trial Ending', description: 'Canva Pro trial conversion.', serviceName: 'Canva Pro', serviceId: 'canva', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 499, actionLabel: 'Review →' },
      { id: 'leak_low_usage', type: 'low_usage', icon: '⚠️', title: 'Low Usage', description: 'Netflix watched less than 3 hours per month.', serviceName: 'Netflix Basic', serviceId: 'netflix', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 597, actionLabel: 'Review →' }
    ],
    aiInsight: {
      title: 'Trackey AI Insight',
      text: 'Over the last 90 days, ₹1,980 went towards services with negligible usage. Pausing Canva and swapping Netflix could cut your recurring bill in half.',
      potentialSavings: 1980,
      action1: 'Optimize Now →',
      action2: 'View Recommendations →'
    }
  }
};

export const DEFAULT_UPCOMING_CONTENT = [
  {
    id: "c1",
    title: "Iron Circuit",
    type: "Movie",
    poster_url: "",
    release_date: "Next month",
    platform: "primevideo",
    platform_name: "Prime Video",
    genre: "Superhero · Action",
    trailer_url: "https://www.youtube.com",
    tags: ["Superhero", "Action", "Marvel / Superhero"],
    emoji: "🦸",
    availability: "Coming next month"
  },
  {
    id: "c2",
    title: "Rogue Vanguard",
    type: "Series",
    poster_url: "",
    release_date: "Next month",
    platform: "primevideo",
    platform_name: "Prime Video",
    genre: "Action · Sci-Fi",
    trailer_url: "https://www.youtube.com",
    tags: ["Action", "Sci-Fi"],
    emoji: "🚀",
    availability: "Coming next month"
  },
  {
    id: "c3",
    title: "Midnight Circuit",
    type: "Movie",
    poster_url: "",
    release_date: "Available now",
    platform: "primevideo",
    platform_name: "Prime Video",
    genre: "Sci-Fi · Thriller",
    trailer_url: "https://www.youtube.com",
    tags: ["Sci-Fi", "Thriller"],
    emoji: "🌌",
    availability: "Available now"
  },
  {
    id: "c4",
    title: "Shadow Protocol",
    type: "Series",
    poster_url: "",
    release_date: "15 Sep",
    platform: "netflix",
    platform_name: "Netflix",
    genre: "Thriller · Mystery",
    trailer_url: "https://www.youtube.com",
    tags: ["Thriller", "Mystery"],
    emoji: "🕵️",
    availability: "Coming 15 Sep"
  },
  {
    id: "c5",
    title: "Champions Arena",
    type: "Sports",
    poster_url: "",
    release_date: "20 Sep",
    platform: "jiohotstar",
    platform_name: "JioHotstar",
    genre: "Sports · Live",
    trailer_url: "https://www.youtube.com",
    tags: ["Sports"],
    emoji: "🏏",
    availability: "Streaming 20 Sep"
  }
];


