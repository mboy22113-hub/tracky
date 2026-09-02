// api/index.ts
import "dotenv/config";

// server/app.ts
import express from "express";

// server/data.ts
var INITIAL_USER = {
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
  monthlyBudget: 1e3,
  optimizationGoal: "best_value",
  recommendationPriorities: ["High usage", "Budget saving"],
  recommendationSettings: { movies: true, music: true, games: true, others: true },
  notificationSettings: { renewals: true, trials: true, lowUsage: true, ghostSubscriptions: true, budget: true, optimization: true },
  trackerPreferences: { usageTracking: true, reminders: true, personalizedRecs: true },
  transactionConnected: false
};
var INITIAL_SUBSCRIPTIONS = [
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
    redundancy: "High \u2014 overlaps with Netflix",
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
    redundancy: "Medium \u2014 overlaps with Spotify",
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
    valueScore: "\u2014",
    redundancy: "\u2014",
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
    recommendation: "Canva Pro free trial ends in 2 days. Will auto-renew at \u20B9499/mo if not cancelled.",
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
    recommendation: "Ghost Subscription detected: App was uninstalled from your devices 18 days ago, but AutoPay is still charging \u20B9299/mo.",
    appInstalled: false,
    trialDaysLeft: void 0
  }
];
var INITIAL_WISHLIST = [
  { id: "m_dune2", content_id: "m_dune2", title: "Dune: Part Two", poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", platform: "Prime Video" },
  { id: "m_squidgame2", content_id: "m_squidgame2", title: "Squid Game S2", poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80", platform: "Netflix" }
];
var INSIGHTS_PERIOD_DATA = {
  thismonth: {
    monthlySpend: 1984,
    previousSpend: 1770,
    spendChangePct: 12,
    yearlyProjection: 23808,
    potentialSavings: 699,
    attentionCount: 3,
    attentionReason: "Renewals, low usage, ghost subscriptions, or trials",
    categories: [
      { id: "ott", label: "OTT & Entertainment", emoji: "\u{1F3AC}", amount: 850, percentage: 43, color: "#2F6FED", count: 3 },
      { id: "productivity", label: "Productivity", emoji: "\u{1F4BC}", amount: 499, percentage: 25, color: "#7C3AED", count: 1 },
      { id: "gaming", label: "Gaming", emoji: "\u{1F3AE}", amount: 299, percentage: 15, color: "#C98A2C", count: 1 },
      { id: "other", label: "Other Services", emoji: "\u{1F6CD}\uFE0F", amount: 217, percentage: 11, color: "#16213E", count: 2 },
      { id: "music", label: "Music", emoji: "\u{1F3B5}", amount: 119, percentage: 6, color: "#2FAE6B", count: 1 }
    ],
    spendingTrend: [
      { month: "Apr", value: 1450, change: "+\u20B90", changePct: "0%" },
      { month: "May", value: 1600, change: "+\u20B9150", changePct: "+10.3%" },
      { month: "Jun", value: 1720, change: "+\u20B9120", changePct: "+7.5%" },
      { month: "Jul", value: 1840, change: "+\u20B9120", changePct: "+7.0%" },
      { month: "Aug", value: 1984, change: "+\u20B9144", changePct: "+7.8%" },
      { month: "Sep", value: 1984, change: "\xB1\u20B90", changePct: "0%" }
    ],
    trendInsight: "Your subscription spending increased by 37% over the last 5 months.",
    trendDirection: "up",
    valueMetrics: [
      { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", cost: 119, usageHours: 35, costPerHour: 3, status: "good", statusLabel: "Great Value", badge: "\u2705 \u20B93/hr" },
      { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", cost: 299, usageHours: 20, costPerHour: 15, status: "good", statusLabel: "Good Value", badge: "\u2705 \u20B915/hr" },
      { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", cost: 199, usageHours: 3, costPerHour: 66, status: "warning", statusLabel: "Low Value", badge: "\u26A0\uFE0F \u20B966/hr" },
      { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", cost: 499, usageHours: 2, costPerHour: 249, status: "danger", statusLabel: "Overpaying", badge: "\u26A0\uFE0F \u20B9249/hr" }
    ],
    valueInsight: "Canva and Netflix have the highest cost per hour because of low usage.",
    weeklyActivity: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      mostActive: { name: "Spotify", detail: "35 hrs / 7 days active" },
      leastActive: { name: "Canva", detail: "2 hrs / 1 day active" },
      services: [
        { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", activeDays: 7, percentage: 100, intensity: [3, 4, 4, 5, 5, 4, 3] },
        { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", activeDays: 5, percentage: 71, intensity: [0, 2, 0, 3, 4, 5, 4] },
        { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 1, 2, 0] },
        { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", activeDays: 1, percentage: 14, intensity: [0, 0, 2, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: "leak_ghost", type: "ghost", icon: "\u{1F47B}", title: "Ghost Subscription", description: "Deleted app but active subscription detected.", serviceName: "Duolingo Super", serviceId: "duolingo", riskLevel: "High Risk", riskClass: "high", potentialSavings: 299, actionLabel: "Review \u2192" },
      { id: "leak_trial", type: "trial", icon: "\u{1F381}", title: "Free Trial Ending", description: "Trial ends in 2 days. Auto-renews soon.", serviceName: "Canva Pro", serviceId: "canva", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 499, actionLabel: "Review \u2192" },
      { id: "leak_low_usage", type: "low_usage", icon: "\u26A0\uFE0F", title: "Low Usage", description: "Netflix has not been used for 18 days.", serviceName: "Netflix Basic", serviceId: "netflix", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 199, actionLabel: "Review \u2192" },
      { id: "leak_overlap", type: "overlap", icon: "\u{1F4B8}", title: "Duplicate / Overlapping Services", description: "Multiple services provide similar functionality.", serviceName: "Apple Music & Spotify", serviceId: "spotify", riskLevel: "Low Risk", riskClass: "low", potentialSavings: 119, actionLabel: "Review \u2192" }
    ],
    aiInsight: {
      title: "Trackey AI Insight",
      text: "Your spending is increasing mainly because of productivity and OTT subscriptions. You actively use Spotify and Prime Video, but Netflix and Canva provide significantly lower value per rupee.",
      potentialSavings: 699,
      action1: "Optimize Now \u2192",
      action2: "View Recommendations \u2192"
    }
  },
  lastmonth: {
    monthlySpend: 1770,
    previousSpend: 1720,
    spendChangePct: 3,
    yearlyProjection: 21240,
    potentialSavings: 580,
    attentionCount: 2,
    attentionReason: "2 subscriptions underutilized in August",
    categories: [
      { id: "ott", label: "OTT & Entertainment", emoji: "\u{1F3AC}", amount: 750, percentage: 42, color: "#2F6FED", count: 3 },
      { id: "productivity", label: "Productivity", emoji: "\u{1F4BC}", amount: 499, percentage: 28, color: "#7C3AED", count: 1 },
      { id: "gaming", label: "Gaming", emoji: "\u{1F3AE}", amount: 299, percentage: 17, color: "#C98A2C", count: 1 },
      { id: "music", label: "Music", emoji: "\u{1F3B5}", amount: 119, percentage: 7, color: "#2FAE6B", count: 1 },
      { id: "other", label: "Other Services", emoji: "\u{1F6CD}\uFE0F", amount: 103, percentage: 6, color: "#16213E", count: 1 }
    ],
    spendingTrend: [
      { month: "Mar", value: 1380, change: "+\u20B90", changePct: "0%" },
      { month: "Apr", value: 1450, change: "+\u20B970", changePct: "+5.1%" },
      { month: "May", value: 1600, change: "+\u20B9150", changePct: "+10.3%" },
      { month: "Jun", value: 1720, change: "+\u20B9120", changePct: "+7.5%" },
      { month: "Jul", value: 1840, change: "+\u20B9120", changePct: "+7.0%" },
      { month: "Aug", value: 1770, change: "-\u20B970", changePct: "-3.8%" }
    ],
    trendInsight: "Last month was 3.8% lower than July due to paused Prime plan.",
    trendDirection: "down",
    valueMetrics: [
      { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", cost: 119, usageHours: 32, costPerHour: 4, status: "good", statusLabel: "Great Value", badge: "\u2705 \u20B94/hr" },
      { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", cost: 299, usageHours: 18, costPerHour: 16, status: "good", statusLabel: "Good Value", badge: "\u2705 \u20B916/hr" },
      { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", cost: 199, usageHours: 4, costPerHour: 50, status: "warning", statusLabel: "Low Value", badge: "\u26A0\uFE0F \u20B950/hr" },
      { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", cost: 499, usageHours: 2, costPerHour: 249, status: "danger", statusLabel: "Overpaying", badge: "\u26A0\uFE0F \u20B9249/hr" }
    ],
    valueInsight: "Canva remained the most under-utilized app relative to subscription fee.",
    weeklyActivity: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      mostActive: { name: "Spotify", detail: "32 hrs / 7 days active" },
      leastActive: { name: "Canva", detail: "2 hrs / 1 day active" },
      services: [
        { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", activeDays: 7, percentage: 100, intensity: [3, 4, 4, 4, 5, 4, 3] },
        { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", activeDays: 4, percentage: 57, intensity: [0, 2, 0, 2, 4, 4, 3] },
        { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 1, 2, 0] },
        { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", activeDays: 1, percentage: 14, intensity: [0, 0, 2, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: "leak_trial", type: "trial", icon: "\u{1F381}", title: "Free Trial Ending", description: "Trial active in August.", serviceName: "Canva Pro", serviceId: "canva", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 499, actionLabel: "Review \u2192" },
      { id: "leak_low_usage", type: "low_usage", icon: "\u26A0\uFE0F", title: "Low Usage", description: "Netflix used only 4 hrs.", serviceName: "Netflix Basic", serviceId: "netflix", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 199, actionLabel: "Review \u2192" }
    ],
    aiInsight: {
      title: "Trackey AI Insight",
      text: "Last month spending was stabilized, but Canva and Netflix accounted for \u20B9698 of low-return spend.",
      potentialSavings: 580,
      action1: "Optimize Now \u2192",
      action2: "View Recommendations \u2192"
    }
  },
  last3: {
    monthlySpend: 5594,
    previousSpend: 4770,
    spendChangePct: 17,
    yearlyProjection: 22376,
    potentialSavings: 1980,
    attentionCount: 4,
    attentionReason: "Quarterly accumulation of idle subscriptions",
    categories: [
      { id: "ott", label: "OTT & Entertainment", emoji: "\u{1F3AC}", amount: 2450, percentage: 44, color: "#2F6FED", count: 3 },
      { id: "productivity", label: "Productivity", emoji: "\u{1F4BC}", amount: 1497, percentage: 27, color: "#7C3AED", count: 1 },
      { id: "gaming", label: "Gaming", emoji: "\u{1F3AE}", amount: 897, percentage: 16, color: "#C98A2C", count: 1 },
      { id: "music", label: "Music", emoji: "\u{1F3B5}", amount: 357, percentage: 6, color: "#2FAE6B", count: 1 },
      { id: "other", label: "Other Services", emoji: "\u{1F6CD}\uFE0F", amount: 393, percentage: 7, color: "#16213E", count: 2 }
    ],
    spendingTrend: [
      { month: "Apr", value: 1450, change: "+\u20B90", changePct: "0%" },
      { month: "May", value: 1600, change: "+\u20B9150", changePct: "+10.3%" },
      { month: "Jun", value: 1720, change: "+\u20B9120", changePct: "+7.5%" },
      { month: "Jul", value: 1840, change: "+\u20B9120", changePct: "+7.0%" },
      { month: "Aug", value: 1984, change: "+\u20B9144", changePct: "+7.8%" },
      { month: "Sep", value: 1984, change: "\xB1\u20B90", changePct: "0%" }
    ],
    trendInsight: "Over the last 3 months, your total outflow was \u20B95,594 with a 17% growth rate.",
    trendDirection: "up",
    valueMetrics: [
      { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", cost: 357, usageHours: 105, costPerHour: 3.4, status: "good", statusLabel: "Great Value", badge: "\u2705 \u20B93.4/hr" },
      { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", cost: 897, usageHours: 62, costPerHour: 14.5, status: "good", statusLabel: "Good Value", badge: "\u2705 \u20B914.5/hr" },
      { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", cost: 597, usageHours: 9, costPerHour: 66.3, status: "warning", statusLabel: "Low Value", badge: "\u26A0\uFE0F \u20B966/hr" },
      { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", cost: 1497, usageHours: 6, costPerHour: 249.5, status: "danger", statusLabel: "Overpaying", badge: "\u26A0\uFE0F \u20B9250/hr" }
    ],
    valueInsight: "Quarterly review shows Canva generated only 6 hours of work for \u20B91,497 spend.",
    weeklyActivity: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      mostActive: { name: "Spotify", detail: "105 hrs / 90 days active" },
      leastActive: { name: "Canva", detail: "6 hrs / 12 days active" },
      services: [
        { id: "spotify", name: "Spotify", icon: "\u{1F3A7}", color: "#1DB954", activeDays: 7, percentage: 100, intensity: [4, 4, 5, 5, 5, 4, 4] },
        { id: "primevideo", name: "Prime Video", icon: "\u{1F3AC}", color: "#00A8E1", activeDays: 5, percentage: 71, intensity: [1, 2, 1, 3, 5, 5, 4] },
        { id: "netflix", name: "Netflix", icon: "\u{1F37F}", color: "#E50914", activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 2, 2, 0] },
        { id: "canva", name: "Canva", icon: "\u{1F3A8}", color: "#00C4CC", activeDays: 1, percentage: 14, intensity: [0, 0, 1, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: "leak_ghost", type: "ghost", icon: "\u{1F47B}", title: "Ghost Subscription", description: "Duolingo Plus billed quarterly without active app installs.", serviceName: "Duolingo Super", serviceId: "duolingo", riskLevel: "High Risk", riskClass: "high", potentialSavings: 897, actionLabel: "Review \u2192" },
      { id: "leak_trial", type: "trial", icon: "\u{1F381}", title: "Free Trial Ending", description: "Canva Pro trial conversion.", serviceName: "Canva Pro", serviceId: "canva", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 499, actionLabel: "Review \u2192" },
      { id: "leak_low_usage", type: "low_usage", icon: "\u26A0\uFE0F", title: "Low Usage", description: "Netflix watched less than 3 hours per month.", serviceName: "Netflix Basic", serviceId: "netflix", riskLevel: "Medium Risk", riskClass: "medium", potentialSavings: 597, actionLabel: "Review \u2192" }
    ],
    aiInsight: {
      title: "Trackey AI Insight",
      text: "Over the last 90 days, \u20B91,980 went towards services with negligible usage. Pausing Canva and swapping Netflix could cut your recurring bill in half.",
      potentialSavings: 1980,
      action1: "Optimize Now \u2192",
      action2: "View Recommendations \u2192"
    }
  }
};
var DEFAULT_UPCOMING_CONTENT = [
  {
    id: "c1",
    title: "Iron Circuit",
    type: "Movie",
    poster_url: "",
    release_date: "Next month",
    platform: "primevideo",
    platform_name: "Prime Video",
    genre: "Superhero \xB7 Action",
    trailer_url: "https://www.youtube.com",
    tags: ["Superhero", "Action", "Marvel / Superhero"],
    emoji: "\u{1F9B8}",
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
    genre: "Action \xB7 Sci-Fi",
    trailer_url: "https://www.youtube.com",
    tags: ["Action", "Sci-Fi"],
    emoji: "\u{1F680}",
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
    genre: "Sci-Fi \xB7 Thriller",
    trailer_url: "https://www.youtube.com",
    tags: ["Sci-Fi", "Thriller"],
    emoji: "\u{1F30C}",
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
    genre: "Thriller \xB7 Mystery",
    trailer_url: "https://www.youtube.com",
    tags: ["Thriller", "Mystery"],
    emoji: "\u{1F575}\uFE0F",
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
    genre: "Sports \xB7 Live",
    trailer_url: "https://www.youtube.com",
    tags: ["Sports"],
    emoji: "\u{1F3CF}",
    availability: "Streaming 20 Sep"
  }
];

// server/comparisons.ts
var OTT_PLATFORM_CATALOG = {
  netflix: {
    id: "netflix",
    name: "Netflix",
    monthlyPrice: 199,
    defaultWatchHours: 14,
    upcomingReleasesCount: 24,
    contentTypes: ["Global movies", "Series", "Documentaries", "Anime"],
    quality: "4K Ultra HD (on premium)",
    baseScore: 7.5
  },
  primevideo: {
    id: "primevideo",
    name: "Prime Video",
    monthlyPrice: 299,
    defaultWatchHours: 28,
    upcomingReleasesCount: 19,
    contentTypes: ["Action", "Superhero", "Regional movies", "Amazon Originals"],
    quality: "4K Ultra HD + HDR",
    baseScore: 8.4
  },
  jiohotstar: {
    id: "jiohotstar",
    name: "JioHotstar",
    monthlyPrice: 149,
    defaultWatchHours: 18,
    upcomingReleasesCount: 16,
    contentTypes: ["Live Sports", "Cricket", "Disney+", "Indian TV serials"],
    quality: "Full HD / 4K",
    baseScore: 7.8
  },
  appletv: {
    id: "appletv",
    name: "Apple TV+",
    monthlyPrice: 99,
    defaultWatchHours: 8,
    upcomingReleasesCount: 10,
    contentTypes: ["Prestige Drama", "Sci-Fi", "Award-winning Originals"],
    quality: "4K Dolby Vision + Atmos",
    baseScore: 7.9
  },
  disney: {
    id: "disney",
    name: "Disney+",
    monthlyPrice: 299,
    defaultWatchHours: 15,
    upcomingReleasesCount: 14,
    contentTypes: ["Marvel", "Star Wars", "Pixar", "Animation"],
    quality: "4K Ultra HD",
    baseScore: 8
  }
};
var UNIVERSAL_SERVICES_CATALOG = {
  spotify: {
    id: "spotify",
    name: "Spotify",
    category: "music",
    monthlyPrice: 119,
    freePlan: "Yes (Ad-supported)",
    audioQuality: "320 kbps High Quality",
    podcasts: "Extensive catalog & Video Podcasts",
    offlineListening: "Yes (up to 10k songs)",
    musicDiscovery: "Industry-leading Discover Weekly & AI DJ",
    familyPlan: "\u20B9179/month (up to 6 accounts)",
    studentDiscount: "\u20B959/month",
    supportedPlatforms: "iOS, Android, Web, Mac, Windows, TVs, Game consoles",
    bestFor: "Daily streaming, podcasts, algorithmic music discovery",
    rating: "4.7 / 5"
  },
  applemusic: {
    id: "applemusic",
    name: "Apple Music",
    category: "music",
    monthlyPrice: 99,
    freePlan: "No free tier (1-month trial)",
    audioQuality: "Lossless (24-bit/192kHz) & Spatial Audio Dolby Atmos",
    podcasts: "Separate Apple Podcasts app",
    offlineListening: "Yes (up to 100k songs in library)",
    musicDiscovery: "Curated editorial radio & playlists",
    familyPlan: "\u20B9149/month (up to 6 accounts)",
    studentDiscount: "\u20B959/month",
    supportedPlatforms: "iOS, Android, Mac, Windows, Apple Watch, HomePod",
    bestFor: "Audiophiles, Apple ecosystem users, high-fidelity lossless",
    rating: "4.6 / 5"
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "ai",
    monthlyPrice: 1650,
    freePlan: "Yes (GPT-4o mini & limited GPT-4o)",
    aiModels: "GPT-4o, OpenAI o1, Canvas, DALL-E 3",
    features: "Advanced Voice, Custom GPTs, Web browsing, Code Interpreter",
    cloudSync: "Real-time sync across web & mobile apps",
    bestFor: "General reasoning, coding, writing, conversational voice AI",
    rating: "4.8 / 5"
  },
  gemini: {
    id: "gemini",
    name: "Gemini Advanced",
    category: "ai",
    monthlyPrice: 1950,
    freePlan: "Yes (Gemini Flash)",
    aiModels: "Gemini 1.5 Pro, 2.0 Flash, 2M context window",
    features: "Google Workspace integration (Docs, Gmail), Python code execution, Deep Research",
    cloudSync: "2TB Google One Cloud storage included in plan",
    bestFor: "Large document analysis (2M tokens), Google Workspace workflows, bundled cloud storage",
    rating: "4.7 / 5"
  },
  canva: {
    id: "canva",
    name: "Canva Pro",
    category: "design",
    monthlyPrice: 500,
    freePlan: "Yes (Generous free design templates)",
    features: "100M+ stock photos, Magic Studio AI, Brand Kit, 1-click resize",
    cloudSync: "1TB cloud storage",
    bestFor: "Social media graphics, presentations, non-designers, fast templates",
    rating: "4.8 / 5"
  },
  adobeexpress: {
    id: "adobeexpress",
    name: "Adobe Express Premium",
    category: "design",
    monthlyPrice: 800,
    freePlan: "Yes (Basic assets)",
    features: "Adobe Firefly Generative AI, Photoshop & Illustrator interoperability, Adobe Fonts",
    cloudSync: "100GB cloud storage",
    bestFor: "Designers needing Creative Cloud workflows and high-end Firefly generative tools",
    rating: "4.5 / 5"
  },
  googledrive: {
    id: "googledrive",
    name: "Google One (Drive)",
    category: "cloud",
    monthlyPrice: 130,
    freePlan: "15 GB free with Google Account",
    storageAmount: "100 GB (expandable to 2TB+)",
    cloudSync: "Seamless Android backups, Google Photos, Gmail, Docs",
    sharing: "Link sharing with granular view/edit/comment permissions",
    platforms: "Android, iOS, Web, Windows, Mac",
    bestFor: "Android users, Google Workspace collaboration, photo backups",
    rating: "4.8 / 5"
  },
  onedrive: {
    id: "onedrive",
    name: "Microsoft OneDrive (365)",
    category: "cloud",
    monthlyPrice: 140,
    freePlan: "5 GB free with Microsoft Account",
    storageAmount: "100 GB (or 1TB with Microsoft 365 Personal at \u20B9489/mo)",
    cloudSync: "Native Windows explorer sync, Office document co-authoring",
    sharing: "Password protected & expiring links (on paid tiers)",
    platforms: "Windows, Mac, iOS, Android, Web",
    bestFor: "Windows users, Word/Excel/PowerPoint heavy workflows",
    rating: "4.5 / 5"
  }
};
function compareOttServices(platforms, subscriptions2, userProfile2) {
  const targetPlatforms = platforms && platforms.length > 0 ? platforms : ["netflix", "primevideo", "jiohotstar", "appletv", "disney"];
  const subMap = new Map(subscriptions2.map((s) => [s.id, s]));
  const results = [];
  const movieInterests = userProfile2.movieInterests || ["Superhero", "Action", "Sci-Fi"];
  for (const pid of targetPlatforms) {
    const catItem = OTT_PLATFORM_CATALOG[pid];
    if (!catItem) continue;
    const curr = subMap.get(pid);
    let watchHrs = curr ? (curr.usedDays || 0) * 1.5 : catItem.defaultWatchHours;
    if (watchHrs <= 0) watchHrs = 2;
    const price = curr ? curr.price : catItem.monthlyPrice;
    const costPerHr = Math.round(price / watchHrs * 100) / 100;
    const interestMatchCount = catItem.contentTypes.filter(
      (c) => movieInterests.some((i) => c.toLowerCase().includes(i.toLowerCase()))
    ).length;
    let valueScore = Math.round((catItem.baseScore + interestMatchCount * 0.4 - Math.min(2, costPerHr / 20)) * 10) / 10;
    valueScore = Math.max(3, Math.min(9.9, valueScore));
    results.push({
      id: pid,
      name: catItem.name,
      monthlyPrice: price,
      watchHoursMonth: Math.round(watchHrs * 10) / 10,
      costPerHour: costPerHr,
      upcomingReleasesCount: catItem.upcomingReleasesCount,
      valueScore,
      currentSubscriber: curr !== void 0
    });
  }
  results.sort((a, b) => b.valueScore - a.valueScore);
  const winner = results[0]?.name || "Prime Video";
  const score = results[0]?.valueScore || 8.4;
  const aiVerdict = `Based on your profile interests (${movieInterests.join(", ")}) and cost efficiency, ${winner} delivers the highest estimated value score (${score}/10) at \u20B9${results[0]?.costPerHour}/hour watched.`;
  return {
    comparison: results,
    winner,
    score,
    recommendation: `Prioritize ${winner} for primary entertainment.`,
    aiVerdict
  };
}
function compareUniversalServices(serviceAKey = "spotify", serviceBKey = "applemusic", userProfile2, subscriptions2) {
  const cleanA = (serviceAKey || "spotify").toLowerCase().replace(/[\s+-]/g, "");
  const cleanB = (serviceBKey || "applemusic").toLowerCase().replace(/[\s+-]/g, "");
  const itemA = UNIVERSAL_SERVICES_CATALOG[cleanA];
  const itemB = UNIVERSAL_SERVICES_CATALOG[cleanB];
  if (!itemA || !itemB) {
    return {
      category: "services",
      serviceA: { name: serviceAKey, monthlyPrice: "Varies" },
      serviceB: { name: serviceBKey, monthlyPrice: "Varies" },
      comparisonFields: [
        { label: "Monthly Price", a: "Standard Tier", b: "Standard Tier" },
        { label: "Best For", a: `Users seeking ${serviceAKey} ecosystem`, b: `Users seeking ${serviceBKey} ecosystem` }
      ],
      winner: serviceAKey,
      personalizedAiVerdict: `Based on your current subscriptions, ${serviceAKey} fits your current workflow.`
    };
  }
  const category = itemA.category || "general";
  let fields = [];
  if (category === "music") {
    fields = [
      { label: "Monthly Price", a: `\u20B9${itemA.monthlyPrice}`, b: `\u20B9${itemB.monthlyPrice}` },
      { label: "Audio Quality", a: itemA.audioQuality, b: itemB.audioQuality },
      { label: "Podcasts & Shows", a: itemA.podcasts, b: itemB.podcasts },
      { label: "Offline Support", a: itemA.offlineListening, b: itemB.offlineListening },
      { label: "Music Discovery", a: itemA.musicDiscovery, b: itemB.musicDiscovery },
      { label: "Family Plan", a: itemA.familyPlan, b: itemB.familyPlan },
      { label: "Student Discount", a: itemA.studentDiscount, b: itemB.studentDiscount },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "cloud") {
    fields = [
      { label: "Monthly Price", a: `\u20B9${itemA.monthlyPrice}`, b: `\u20B9${itemB.monthlyPrice}` },
      { label: "Free Tier", a: itemA.freePlan, b: itemB.freePlan },
      { label: "Storage Amount", a: itemA.storageAmount, b: itemB.storageAmount },
      { label: "Cloud Sync", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Sharing Permissions", a: itemA.sharing, b: itemB.sharing },
      { label: "Supported Platforms", a: itemA.platforms, b: itemB.platforms },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "ai") {
    fields = [
      { label: "Monthly Price", a: `\u20B9${itemA.monthlyPrice}`, b: `\u20B9${itemB.monthlyPrice}` },
      { label: "Free Plan", a: itemA.freePlan, b: itemB.freePlan },
      { label: "AI Models", a: itemA.aiModels, b: itemB.aiModels },
      { label: "Key Features", a: itemA.features, b: itemB.features },
      { label: "Cloud Storage Included", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "design") {
    fields = [
      { label: "Monthly Price", a: `\u20B9${itemA.monthlyPrice}`, b: `\u20B9${itemB.monthlyPrice}` },
      { label: "Free Plan", a: itemA.freePlan, b: itemB.freePlan },
      { label: "Features & Stock Assets", a: itemA.features, b: itemB.features },
      { label: "Cloud Storage", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  }
  const subIds = new Set(subscriptions2.map((s) => s.id));
  const hasA = subIds.has(cleanA) || subscriptions2.some((s) => s.name.toLowerCase().includes(cleanA));
  const musicUse = userProfile2.musicUse || [];
  let winner = itemA.name;
  let aiVerdict = "";
  if (category === "music") {
    if (musicUse.includes("Podcasts") || hasA) {
      winner = itemA.name;
      aiVerdict = `${winner} is recommended for you because your current usage is active and you regularly listen to podcasts and playlists.`;
    } else {
      winner = itemB.name;
      aiVerdict = `${winner} is recommended for you if you value lossless spatial audio and high-fidelity tracks.`;
    }
  } else if (category === "cloud") {
    winner = itemA.name;
    aiVerdict = `${winner} is recommended for you as it offers effortless photo sync, generous pricing (\u20B9${itemA.monthlyPrice}/mo), and seamless backup.`;
  } else {
    winner = itemA.name;
    aiVerdict = `Based on your profile preferences and budget, ${winner} offers the most balanced feature set for your daily routine.`;
  }
  return {
    category,
    serviceA: itemA,
    serviceB: itemB,
    comparisonFields: fields,
    winner,
    personalizedAiVerdict: aiVerdict
  };
}

// server/recommendations.ts
function getUpcomingMovies(userInterests = ["Superhero", "Action", "Sci-Fi"], wishlistIds = []) {
  return DEFAULT_UPCOMING_CONTENT.map((item) => {
    const isMatch = item.tags.some(
      (t) => userInterests.includes(t) || t === "Superhero" && userInterests.includes("Marvel / Superhero")
    );
    const aiRec = isMatch ? `Matches your interest in ${item.genre}` : `Available on ${item.platform_name}`;
    return {
      id: item.id,
      title: item.title,
      type: item.type,
      poster_url: item.poster_url,
      release_date: item.release_date,
      platform: item.platform,
      platform_name: item.platform_name,
      genre: item.genre,
      trailer_url: item.trailer_url,
      emoji: item.emoji,
      tags: item.tags,
      inWishlist: wishlistIds.includes(item.id),
      aiRecommendation: aiRec
    };
  });
}
function getFutureRecommendations(userInterests, subscriptions2, wishlistIds = []) {
  const currentOtt = subscriptions2.filter((s) => s.category === "movies" && !s.free);
  const matchingContent = DEFAULT_UPCOMING_CONTENT.filter((item) => item.tags.some((t) => userInterests.includes(t) || t === "Superhero" && userInterests.includes("Marvel / Superhero"))).map((item) => ({
    ...item,
    inWishlist: wishlistIds.includes(item.id)
  }));
  let moviesRec;
  if (matchingContent.length === 0) {
    moviesRec = {
      category: "movies",
      title: "Movies & OTT",
      badge: "No data",
      badgeClass: "info",
      reason: "No verified upcoming content data is available right now \u2014 check back later.",
      note: "Sample content data for this prototype.",
      items: [],
      cta: null
    };
  } else {
    const byPlatform = {};
    for (const m of matchingContent) {
      if (!byPlatform[m.platform]) byPlatform[m.platform] = [];
      byPlatform[m.platform].push(m);
    }
    const bestPlatformId = Object.keys(byPlatform).sort((a, b) => byPlatform[b].length - byPlatform[a].length)[0];
    const bestTitles = byPlatform[bestPlatformId];
    const platformName = bestTitles[0].platform_name;
    const alreadyHas = currentOtt.some((s) => s.id === bestPlatformId);
    const otherOtt = currentOtt.filter((s) => s.id !== bestPlatformId);
    let badge = "Recommended";
    let badgeClass = "recommend";
    let reason = "";
    let cta = null;
    if (alreadyHas) {
      badge = "Already yours";
      badgeClass = "continue";
      reason = `Your interests (${userInterests.join(", ")}) match upcoming content on ${platformName} \u2014 a service you already pay for, so there's nothing new to add.`;
      cta = null;
    } else if (otherOtt.length > 0) {
      const overlapNames = otherOtt.map((s) => s.name).join(" and ");
      badge = "Recommended";
      badgeClass = "recommend";
      reason = `Your interests match upcoming content on ${platformName} more closely than what's on ${overlapNames}. Based on interest match, upcoming content, and your budget, ${platformName} may be more relevant than adding another overlapping OTT service.`;
      cta = { label: `Consider ${platformName}`, action: "navigate_subs" };
    } else {
      badge = "Recommended";
      badgeClass = "recommend";
      reason = `Your interests (${userInterests.join(", ")}) match upcoming content on ${platformName}, and it isn't in your current portfolio yet.`;
      cta = { label: `Consider ${platformName}`, action: "navigate_subs" };
    }
    moviesRec = {
      category: "movies",
      title: "Movies & OTT",
      badge,
      badgeClass,
      reason,
      note: "Sample content data for this prototype \u2014 connect a licensed content API for live, verified listings.",
      items: bestTitles,
      cta
    };
  }
  const musicSubs = subscriptions2.filter((s) => s.category === "music" && !s.free);
  let musicRec;
  if (musicSubs.length === 0) {
    musicRec = {
      category: "music",
      title: "Music",
      badge: "No data",
      badgeClass: "info",
      reason: "You don't have a music subscription yet \u2014 only worth adding if it fits your budget and listening habits.",
      items: [],
      cta: null
    };
  } else {
    const topMusic = [...musicSubs].sort((a, b) => (b.usedDays || 0) - (a.usedDays || 0))[0];
    const otherMusic = musicSubs.filter((s) => s.id !== topMusic.id);
    const fitItems = [{ name: topMusic.name, fit: "High fit" }];
    for (const s of otherMusic) {
      fitItems.push({ name: s.name, fit: "Lower fit" });
    }
    let reason = `You already use ${topMusic.name} frequently \u2014 used ${topMusic.usedDays || 0} days this month with an estimated value score of ${topMusic.valueScore || "8.0/10"}. Based on your current usage, switching to another music subscription may not provide enough additional value.`;
    if (otherMusic.length > 0) {
      reason += ` You already use ${topMusic.name} heavily and it overlaps with ${otherMusic.map((s) => s.name).join(", ")} \u2014 reviewing the overlap may be worth more than switching services.`;
    }
    musicRec = {
      category: "music",
      title: "Music",
      badge: `Continue ${topMusic.name}`,
      badgeClass: "continue",
      reason,
      items: fitItems,
      cta: null
    };
  }
  const gameSubs = subscriptions2.filter((s) => s.category === "games");
  const paidGames = gameSubs.filter((s) => !s.free);
  let gamesRec;
  if (gameSubs.length === 0) {
    gamesRec = {
      category: "games",
      title: "Games",
      badge: "No data",
      badgeClass: "info",
      reason: "No gaming subscriptions yet \u2014 not enough data to personalize a recommendation.",
      items: [],
      cta: null
    };
  } else {
    const topGame = [...gameSubs].sort((a, b) => (b.usedDays || 0) - (a.usedDays || 0))[0];
    let badge = "Info";
    let badgeClass = "info";
    let reason = "";
    if (paidGames.length > 0 && topGame.status !== "low") {
      badge = `Continue ${topGame.name}`;
      badgeClass = "continue";
      reason = `You already spend most of your gaming time on ${topGame.name} (used ${topGame.usedDays || 0} days this month). Adding another gaming subscription would likely create unnecessary overlap.`;
    } else if (paidGames.length > 0) {
      badge = `Review ${topGame.name}`;
      badgeClass = "watch";
      reason = `Recent usage on ${topGame.name} has been low. Worth reviewing that subscription before considering a new gaming service.`;
    } else {
      badge = "Info";
      badgeClass = "info";
      reason = `Your gaming time is mostly on ${topGame.name}, which is free \u2014 a paid gaming subscription isn't shown here as a personalized fit right now.`;
    }
    gamesRec = {
      category: "games",
      title: "Games",
      badge,
      badgeClass,
      reason,
      items: [{ name: topGame.name }],
      cta: null
    };
  }
  const othersSubs = subscriptions2.filter((s) => s.category === "others");
  let othersRec;
  if (othersSubs.length === 0) {
    othersRec = {
      category: "others",
      title: "Others",
      badge: "No data",
      badgeClass: "info",
      reason: "No subscriptions in this category yet.",
      items: [],
      cta: null
    };
  } else {
    const parts = [];
    for (const s of othersSubs) {
      if (s.appInstalled === false) {
        parts.push(`${s.name} is currently not installed. Review the existing subscription before considering another service in this category.`);
      } else if (s.status === "low") {
        parts.push(`${s.name} may be useful if your usage justifies its \u20B9${s.price || 0}/month cost \u2014 recent usage has been low (${s.usedDays || 0} days this month).`);
      } else {
        parts.push(`${s.name} is well used (${s.usedDays || 0} days this month) \u2014 good value for the \u20B9${s.price || 0}/month cost.`);
      }
    }
    const lowUsage = othersSubs.some((s) => s.status === "low" || s.appInstalled === false);
    othersRec = {
      category: "others",
      title: "Others",
      badge: lowUsage ? "Review first" : "Well matched",
      badgeClass: lowUsage ? "watch" : "continue",
      reason: parts.join(" "),
      items: othersSubs.map((s) => ({ name: s.name })),
      cta: null
    };
  }
  return {
    movies: moviesRec,
    music: musicRec,
    games: gamesRec,
    others: othersRec
  };
}

// server/openai_optimizer.ts
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// server/openai_tools.ts
var OPENAI_TOOLS_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_user_subscriptions",
      description: "Returns the list of all subscriptions tracked in the user's Trackey account, including their category, price, status, and active features.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Optional filter by category (e.g., 'movies', 'music', 'productivity', 'gaming', 'others')"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_subscription_usage",
      description: "Retrieves granular usage telemetry for all or specific subscriptions (used days in month, hours used, cost per hour/day, last active date).",
      parameters: {
        type: "object",
        properties: {
          subscription_id: {
            type: "string",
            description: "Optional subscription ID to get usage for a specific service"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_user_preferences",
      description: "Retrieves user personal preferences including monthly budget target, movie/content interests, music use cases, gaming interests, connected ecosystem devices (Apple/Android/Windows), and optimization goals.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_watch_history",
      description: "Retrieves recent watch history and favorite genres/topics of the user.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_wishlist",
      description: "Retrieves the user's saved wishlist of upcoming movies, shows, games, and content items.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_upcoming_releases",
      description: "Retrieves upcoming OTT and media releases with platform distribution, genre tags, and release dates.",
      parameters: {
        type: "object",
        properties: {
          platform: {
            type: "string",
            description: "Optional filter by OTT platform (e.g. 'primevideo', 'netflix', 'jiohotstar', 'apple')"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_subscription_spending",
      description: "Computes current monthly spending, projected yearly spending, and compares with the user's target monthly budget.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_renewal_dates",
      description: "Returns upcoming renewal dates, days left until renewal, and AutoPay statuses for all active subscriptions sorted by urgency.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calculate_savings",
      description: "Calculates precise monthly and yearly savings if specific subscriptions are paused, cancelled, or downgraded.",
      parameters: {
        type: "object",
        properties: {
          actions: {
            type: "array",
            description: "List of proposed actions on subscriptions",
            items: {
              type: "object",
              properties: {
                subscription_id: { type: "string" },
                action: { type: "string", enum: ["pause", "cancel", "switch", "keep"] },
                alternative_price: { type: "number", description: "Optional monthly price of replacement service" }
              },
              required: ["subscription_id", "action"]
            }
          }
        },
        required: ["actions"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_service_details",
      description: "Retrieves comprehensive details about a specific subscription including billing cycle, redundancy flags, app installation status, trial status, and score.",
      parameters: {
        type: "object",
        properties: {
          service_id: {
            type: "string",
            description: "The identifier or name of the subscription (e.g., 'netflix', 'spotify', 'primevideo', 'canva')"
          }
        },
        required: ["service_id"]
      }
    }
  }
];
function executeOpenAiTool(name, args, ctx) {
  const { subscriptions: subscriptions2, userProfile: userProfile2, wishlist: wishlist2 } = ctx;
  const paidSubs = subscriptions2.filter((s) => !s.free);
  const totalMonthlySpend = paidSubs.reduce((sum, s) => sum + (s.price || 0), 0);
  switch (name) {
    case "get_user_subscriptions": {
      const cat = args?.category;
      if (cat && cat !== "all") {
        return subscriptions2.filter((s) => s.category?.toLowerCase() === cat.toLowerCase());
      }
      return subscriptions2.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        price: s.price,
        free: s.free || false,
        status: s.status,
        usedDays: s.usedDays,
        renewsIn: s.renewsIn,
        autopay: s.autopay,
        appInstalled: s.appInstalled !== false,
        trialDaysLeft: s.trialDaysLeft
      }));
    }
    case "get_subscription_usage": {
      const subId = args?.subscription_id;
      if (subId) {
        const found = subscriptions2.find((s) => s.id.toLowerCase() === subId.toLowerCase() || s.name.toLowerCase().includes(subId.toLowerCase()));
        if (!found) return { error: `Subscription '${subId}' not found.` };
        return {
          id: found.id,
          name: found.name,
          price: found.price,
          usedDays: found.usedDays || 0,
          lastUsed: found.lastUsed || "Unknown",
          status: found.status || "active",
          valueScore: found.valueScore || "7.0/10",
          appInstalled: found.appInstalled !== false,
          costPerUsedDay: found.usedDays ? Math.round(found.price / found.usedDays) : found.price
        };
      }
      return subscriptions2.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        usedDays: s.usedDays || 0,
        lastUsed: s.lastUsed || "Unknown",
        status: s.status || "active",
        valueScore: s.valueScore || "7.0/10",
        appInstalled: s.appInstalled !== false,
        costPerUsedDay: s.usedDays ? Math.round(s.price / s.usedDays) : s.price
      }));
    }
    case "get_user_preferences": {
      return {
        name: userProfile2.name,
        monthlyBudget: userProfile2.monthlyBudget,
        movieInterests: userProfile2.movieInterests || ["Superhero", "Action", "Sci-Fi"],
        musicInterests: userProfile2.musicInterests || ["Pop", "Rock", "Lo-Fi", "Podcasts"],
        musicUse: userProfile2.musicUse || ["Commute", "Work focus", "Gym & Running"],
        gamingInterests: userProfile2.gamingInterests || ["Action RPG", "FPS"],
        productivityInterests: userProfile2.productivityInterests || ["Design", "Notes"],
        connectedDevices: userProfile2.connectedDevices || ["iPhone 15 Pro", "MacBook Pro", "AirPods Pro", "iPad Air"],
        optimizationGoal: userProfile2.optimizationGoal || "Cut unnecessary spending"
      };
    }
    case "get_watch_history": {
      return {
        recentGenres: userProfile2.movieInterests || ["Action", "Sci-Fi", "Superhero"],
        frequentServices: subscriptions2.filter((s) => (s.usedDays || 0) >= 10).map((s) => s.name),
        lowEngagementServices: subscriptions2.filter((s) => (s.usedDays || 0) <= 3 && !s.free).map((s) => s.name)
      };
    }
    case "get_wishlist": {
      return wishlist2.map((w) => ({
        id: w.id,
        content_id: w.content_id,
        title: w.title,
        platform: w.platform
      }));
    }
    case "get_upcoming_releases": {
      const plat = args?.platform?.toLowerCase();
      let list = DEFAULT_UPCOMING_CONTENT;
      if (plat) {
        list = list.filter((m) => m.platform.toLowerCase().includes(plat) || m.platform_name.toLowerCase().includes(plat));
      }
      return list.map((m) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        platform: m.platform_name,
        platform_id: m.platform,
        genre: m.genre,
        tags: m.tags,
        release_date: m.release_date,
        matchesUserInterests: m.tags.some((t) => (userProfile2.movieInterests || []).includes(t))
      }));
    }
    case "get_subscription_spending": {
      const budget = userProfile2.monthlyBudget || 1e3;
      const yearlySpend = totalMonthlySpend * 12;
      const overBudget = Math.max(0, totalMonthlySpend - budget);
      return {
        currentMonthlySpend: totalMonthlySpend,
        currentYearlySpend: yearlySpend,
        monthlyBudget: budget,
        overBudgetAmount: overBudget,
        isOverBudget: totalMonthlySpend > budget,
        activePaidCount: paidSubs.length,
        freeCount: subscriptions2.length - paidSubs.length
      };
    }
    case "get_renewal_dates": {
      return subscriptions2.filter((s) => !s.free && s.renewsIn).map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        renewsIn: s.renewsIn,
        nextRenewal: s.nextRenewal || s.renewalDate,
        autopay: s.autopay || "Enabled",
        urgent: (s.renewsIn || "").includes("1") || (s.renewsIn || "").includes("2") || (s.renewsIn || "").includes("3")
      }));
    }
    case "calculate_savings": {
      const actions = args?.actions || [];
      let monthlySaving = 0;
      const breakdown = actions.map((act) => {
        const sub = subscriptions2.find((s) => s.id === act.subscription_id);
        if (!sub) return { subscription_id: act.subscription_id, saved: 0 };
        let saved = 0;
        if (act.action === "cancel" || act.action === "pause") {
          saved = sub.price || 0;
        } else if (act.action === "switch" && act.alternative_price !== void 0) {
          saved = Math.max(0, (sub.price || 0) - act.alternative_price);
        }
        monthlySaving += saved;
        return {
          subscription_id: sub.id,
          name: sub.name,
          action: act.action,
          original_price: sub.price,
          monthly_saved: saved,
          yearly_saved: saved * 12
        };
      });
      return {
        totalMonthlySaving: monthlySaving,
        totalYearlySaving: monthlySaving * 12,
        newMonthlySpend: Math.max(0, totalMonthlySpend - monthlySaving),
        newYearlySpend: Math.max(0, totalMonthlySpend - monthlySaving) * 12,
        breakdown
      };
    }
    case "get_service_details": {
      const sid = args?.service_id?.toLowerCase();
      const sub = subscriptions2.find((s) => s.id.toLowerCase() === sid || s.name.toLowerCase().includes(sid));
      if (!sub) return { error: `Service '${sid}' not found.` };
      return sub;
    }
    default:
      return { error: `Unknown tool function: ${name}` };
  }
}

// server/openai_optimizer.ts
var openaiClient = null;
var geminiClient = null;
var openAiQuotaExceededUntil = 0;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
    if (apiKey) {
      try {
        geminiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });
      } catch (err) {
        console.info("Note: Gemini client initialization deferred.");
      }
    }
  }
  return geminiClient;
}
function isOpenAiAvailable() {
  if (!process.env.OPENAI_API_KEY) return false;
  if (Date.now() < openAiQuotaExceededUntil) return false;
  return true;
}
function handleOpenAiError(err, context) {
  const status = err?.status || err?.statusCode || err?.code;
  const message = err?.message || String(err);
  const isQuotaOrAuth = status === 429 || message.includes("429") || message.includes("credits") || message.includes("quota") || message.includes("billing") || status === 401 || message.includes("401");
  if (isQuotaOrAuth) {
    openAiQuotaExceededUntil = Date.now() + 15 * 60 * 1e3;
    console.info(`[Trackey AI] OpenAI quota/billing inactive (${status || 429}). Seamlessly routing to Gemini & algorithmic reasoning.`);
  } else {
    console.info(`[Trackey AI] OpenAI ${context} deferred (${message.slice(0, 80)}). Utilizing resilient fallback engine.`);
  }
}
async function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms))
  ]);
}
async function generateGeminiJson(gemini, contents, systemInstruction) {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  for (const model of modelsToTry) {
    try {
      const generatePromise = gemini.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });
      const response = await withTimeout(generatePromise, 7e3);
      if (!response) {
        continue;
      }
      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      const isTemporary = err?.status === 503 || err?.code === 503 || err?.message?.includes("503") || err?.message?.includes("high demand") || err?.status === 429;
      if (isTemporary && model !== modelsToTry[modelsToTry.length - 1]) {
        continue;
      }
      break;
    }
  }
  return null;
}
function getOpenAiClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    try {
      openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (err) {
      console.warn("Could not initialize OpenAI client:", err);
    }
  }
  return openaiClient;
}
var cachedOptimizerResult = null;
function computeStateHash(subscriptions2, userProfile2, budget) {
  return `${subscriptions2.length}-${subscriptions2.map((s) => `${s.id}:${s.price}:${s.usedDays}:${s.status}`).join("|")}-${budget}-${userProfile2.movieInterests?.join(",")}`;
}
function generateAlgorithmicOptimizerFallback(subscriptions2, userProfile2, targetBudget) {
  const budget = targetBudget !== void 0 && targetBudget !== null ? targetBudget : userProfile2.monthlyBudget || 1e3;
  const paidSubs = subscriptions2.filter((s) => !s.free);
  const totalSpend = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);
  const yearlySpend = totalSpend * 12;
  const attentionItems = [];
  const netflixSub = subscriptions2.find((s) => s.id === "netflix");
  if (netflixSub && !netflixSub.free) {
    attentionItems.push({
      id: "att_netflix",
      subscription_id: "netflix",
      name: netflixSub.name,
      price: netflixSub.price,
      type: "renewal",
      badge: "Renewal in 3 days",
      severity_tag: "leakreview",
      reason: `Renewal in 3 days + Low usage (Used ${netflixSub.usedDays || 2} days this month)`,
      icon_emoji: "\u{1F37F}"
    });
  }
  const hotstarSub = subscriptions2.find((s) => s.id === "jiohotstar");
  if (hotstarSub && !hotstarSub.free) {
    attentionItems.push({
      id: "att_hotstar",
      subscription_id: "jiohotstar",
      name: hotstarSub.name,
      price: hotstarSub.price,
      type: "renewal",
      badge: "Upcoming renewal",
      severity_tag: "review",
      reason: `Moderate usage (${hotstarSub.usedDays || 6} days) with renewal scheduled in 6 days`,
      icon_emoji: "\u{1F3CF}"
    });
  }
  const trialSub = subscriptions2.find((s) => s.trialDaysLeft !== void 0 && s.trialDaysLeft !== null);
  if (trialSub) {
    attentionItems.push({
      id: "att_trial",
      subscription_id: trialSub.id,
      name: `Free Trial: ${trialSub.name}`,
      price: trialSub.price,
      type: "trial",
      badge: "Trial Ending",
      severity_tag: "review",
      reason: `${trialSub.name} trial ends in ${trialSub.trialDaysLeft} days. Will charge \u20B9${trialSub.price}/month.`,
      icon_emoji: "\u{1F381}"
    });
  }
  const ghostSub = subscriptions2.find((s) => s.appInstalled === false && !s.free);
  if (ghostSub) {
    attentionItems.push({
      id: "att_ghost",
      subscription_id: ghostSub.id,
      name: `Ghost App: ${ghostSub.name}`,
      price: ghostSub.price,
      type: "ghost",
      badge: "Ghost App",
      severity_tag: "leakreview",
      reason: `App uninstalled from your devices 18 days ago, but subscription is actively billing \u20B9${ghostSub.price}/mo.`,
      icon_emoji: "\u{1F47B}"
    });
  }
  const recommendations = [];
  let potentialMonthlySavings = 0;
  for (const s of subscriptions2) {
    if (s.free) continue;
    const usedDays = s.usedDays || 0;
    const status = s.status || "active";
    if (s.id === "spotify" || s.category === "music" && usedDays >= 15) {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: "keep",
        action_label: "KEEP",
        tag_class: "keep",
        reason: `High active usage (${usedDays} days) and essential daily routine integration.`,
        meta: `High usage (${usedDays} days) \xB7 Score: ${s.valueScore || "9.1/10"}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: "high"
      });
    } else if (s.id === "primevideo" || s.category === "movies" && usedDays >= 10) {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: "switch",
        action_label: "SWITCH / SUBSCRIBE",
        tag_class: "info",
        reason: `Matches 4 major upcoming movie and sci-fi releases next month.`,
        meta: `Matches 4 upcoming releases \xB7 Score: ${s.valueScore || "8.9/10"}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: "high"
      });
    } else if (s.id === "netflix" || s.category === "movies" && (status === "low" || usedDays <= 3)) {
      potentialMonthlySavings += s.price;
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: "pause",
        action_label: "PAUSE / CANCEL",
        tag_class: "leakreview",
        reason: `Low active viewing (${usedDays} days) and no top wishlist matches next month. Pausing saves \u20B9${s.price}/mo.`,
        meta: `Used ${usedDays} days \xB7 Save \u20B9${s.price}/mo`,
        current_monthly_price: s.price,
        estimated_monthly_saving: s.price,
        estimated_yearly_saving: s.price * 12,
        confidence: "high"
      });
    } else if (s.id === "canva" || status === "low" || usedDays <= 3) {
      potentialMonthlySavings += s.price;
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: "cancel",
        action_label: "REVIEW / CANCEL",
        tag_class: "review",
        reason: `Used only ${usedDays} days this month. Free alternatives or on-demand tier cover standard requirements.`,
        meta: `Used ${usedDays} days \xB7 Save \u20B9${s.price}/mo`,
        current_monthly_price: s.price,
        estimated_monthly_saving: s.price,
        estimated_yearly_saving: s.price * 12,
        confidence: "high"
      });
    } else {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: "keep",
        action_label: "KEEP",
        tag_class: "keep",
        reason: `Moderate regular usage (${usedDays} days) delivering proportional utility.`,
        meta: `Used ${usedDays} days \xB7 Score: ${s.valueScore || "7.5/10"}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: "medium"
      });
    }
  }
  const optimizedMonthlySpend = Math.max(0, totalSpend - potentialMonthlySavings);
  const optimizedYearlySpend = optimizedMonthlySpend * 12;
  const totalYearlySavings = potentialMonthlySavings * 12;
  const overBudgetAmt = Math.max(0, totalSpend - budget);
  return {
    summary: `Your subscription ecosystem currently spends \u20B9${totalSpend}/mo across ${subscriptions2.length} services, which is \u20B9${overBudgetAmt} over your target budget of \u20B9${budget}/mo. By pausing low-usage streaming and reviewing infrequent design tools, you can save \u20B9${potentialMonthlySavings}/mo (\u20B9${totalYearlySavings}/year).`,
    current_monthly_spending: totalSpend,
    current_yearly_spending: yearlySpend,
    optimized_monthly_spending: optimizedMonthlySpend,
    optimized_yearly_spending: optimizedYearlySpend,
    total_potential_monthly_saving: potentialMonthlySavings,
    total_potential_yearly_saving: totalYearlySavings,
    budget_analysis: {
      budget,
      over_budget_amount: overBudgetAmt,
      is_within_budget: totalSpend <= budget,
      budget_verdict: totalSpend > budget ? `\u26A0\uFE0F Spending is \u20B9${overBudgetAmt} over your target monthly budget.` : `\u2728 Spending is \u20B9${budget - totalSpend} within your monthly budget.`
    },
    attention_items: attentionItems,
    recommendations,
    insights: [
      {
        title: "Monthly Budget Leaks",
        description: `Canva and Netflix represent significant recurring waste with high effective cost per used hour.`,
        type: "waste",
        impact: `\u20B9${potentialMonthlySavings}/mo`
      },
      {
        title: "Upcoming Content Opportunity",
        description: "Prime Video has 4 major releases matching your sci-fi, superhero and action interests next month.",
        type: "opportunity",
        impact: "4 Releases"
      },
      {
        title: "Device Ecosystem Synergy",
        description: "Apple Music provides superior spatial audio and native Siri integration on your Apple devices.",
        type: "trend",
        impact: "Save \u20B920/mo"
      }
    ],
    future_recommendations: {
      top_platform: "Prime Video",
      top_platform_id: "primevideo",
      price: 299,
      headline: "4 upcoming releases next month match your action, sci-fi and superhero interests.",
      verdict: "Subscribe to Prime Video next month instead of renewing Netflix.",
      potential_saving: 200,
      matched_releases_count: 4
    },
    service_switches: [
      {
        current_service: "Spotify",
        current_id: "spotify",
        current_price: 119,
        current_why: "High active daily commute & workout usage.",
        recommended_service: "Apple Music",
        recommended_id: "applemusic",
        recommended_price: 99,
        recommended_saving: 20,
        recommended_why: "Spatial audio + Apple devices native Siri integration.",
        match_pct: 95,
        analyzed_factors: "Device ecosystem \xB7 Music usage \xB7 Podcasts \xB7 Lossless audio",
        quote: "You use iPhone, AirPods and Mac. Apple Music provides better ecosystem integration and Lossless Audio."
      },
      {
        current_service: "Netflix",
        current_id: "netflix",
        current_price: 199,
        current_why: "Low viewing activity this billing cycle (2 days).",
        recommended_service: "Prime Video",
        recommended_id: "primevideo",
        recommended_price: 299,
        recommended_saving: 0,
        recommended_why: "Includes fast shopping delivery + upcoming Dune 2 and Rings of Power S2.",
        match_pct: 92,
        analyzed_factors: "Content alignment \xB7 Monthly cost \xB7 Included perks",
        quote: "Your Netflix usage dropped to 2 days while Prime Video has 4 major releases matching your sci-fi watchlist next month."
      },
      {
        current_service: "Canva Pro",
        current_id: "canva",
        current_price: 500,
        current_why: "Paying full pro tier for infrequent usage (3 days/mo).",
        recommended_service: "Canva Free / Adobe Express",
        recommended_id: "canva_free",
        recommended_price: 0,
        recommended_saving: 500,
        recommended_why: "100% adequate for 3-day lightweight graphics.",
        match_pct: 88,
        analyzed_factors: "Monthly usage frequency (3 days/mo)",
        quote: "You create graphics on only 3 days per month. The free tier covers all your export requirements without paying \u20B9500/mo."
      }
    ],
    factors_analyzed: [
      "Spending vs Budget",
      "Usage Frequency",
      "Last Used Days",
      "Cost per Usage",
      "Ghost Subscriptions",
      "Free Trials Ending",
      "User Interests",
      "Upcoming OTT Content"
    ],
    ai_engine_used: process.env.GEMINI_API_KEY ? "Gemini Intelligence Engine" : process.env.OPENAI_API_KEY ? "OpenAI Intelligence" : "Trackey Smart Optimizer (Algorithmic & Rules)",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function runOpenAiOptimizer(subscriptions2, userProfile2, wishlist2 = [], targetBudget, forceRefresh = false) {
  const budget = targetBudget !== void 0 && targetBudget !== null ? targetBudget : userProfile2.monthlyBudget || 1e3;
  const stateHash = computeStateHash(subscriptions2, userProfile2, budget);
  if (!forceRefresh && cachedOptimizerResult && cachedOptimizerResult.hash === stateHash && cachedOptimizerResult.expiresAt > Date.now()) {
    return cachedOptimizerResult.data;
  }
  const gemini = getGeminiClient();
  const openai = getOpenAiClient();
  const systemPrompt = `You are the Trackey Core AI Optimizer engine.
Your mission is to perform deep financial and usage reasoning across the user's active subscription ecosystem, prices, billing cycles, monthly/yearly spending, categories, usage frequency, user preferences, watch history, wishlist items, upcoming releases, renewal dates, and ghost apps.

You MUST calculate and return an actionable structured JSON optimization response.
Rules:
1. NEVER invent subscription prices. Use the real prices in the user's data (e.g., Netflix: 199, Spotify: 119, Prime Video: 299, Canva: 500, etc.).
2. Every recommendation MUST clearly explain WHY (e.g. "You haven't used Netflix recently (used 2 days), while Prime Video activity/upcoming catalog is high. Pausing Netflix could save \u20B9199/month.").
3. Compute precise monthly and yearly savings.
4. Calculate upcoming release matches comparing user movie interests (${(userProfile2.movieInterests || []).join(", ")}) with upcoming releases.
5. Provide actionable service switches comparing current services with better alternatives based on devices (${(userProfile2.connectedDevices || []).join(", ")}) and usage patterns.
6. Provide specific attention items (renewals in <=3 days, trials ending, ghost apps uninstalled, low usage).
Return JSON object matching OptimizerResponseData schema with summary, current_monthly_spending, current_yearly_spending, optimized_monthly_spending, optimized_yearly_spending, total_potential_monthly_saving, total_potential_yearly_saving, budget_analysis, attention_items, recommendations, insights, future_recommendations, service_switches, factors_analyzed.`;
  const userPrompt = `Analyze user subscription portfolio:
- User: ${userProfile2.name}, Budget: \u20B9${budget}/month
- Devices: ${(userProfile2.connectedDevices || []).join(", ")}
- Movie Interests: ${(userProfile2.movieInterests || []).join(", ")}
- Music Uses: ${(userProfile2.musicUse || []).join(", ")}
- Current Subscriptions:
${subscriptions2.map((s) => `\u2022 ${s.name} (${s.id}): \u20B9${s.price}/mo, status: ${s.status}, usedDays: ${s.usedDays || 0}, renewsIn: ${s.renewsIn || "N/A"}, appInstalled: ${s.appInstalled !== false}, trialDaysLeft: ${s.trialDaysLeft ?? "None"}`).join("\n")}
- Upcoming Releases available:
${DEFAULT_UPCOMING_CONTENT.map((m) => `\u2022 ${m.title} on ${m.platform_name} (${m.genre}, release: ${m.release_date})`).join("\n")}

Generate the complete structured JSON response matching the required schema.`;
  if (gemini) {
    try {
      const parsed = await generateGeminiJson(gemini, userPrompt, systemPrompt);
      if (parsed && parsed.recommendations && parsed.current_monthly_spending !== void 0) {
        const fullResult = {
          summary: parsed.summary || `AI optimized subscription portfolio saving \u20B9${parsed.total_potential_monthly_saving || 699}/month.`,
          current_monthly_spending: parsed.current_monthly_spending || subscriptions2.filter((s) => !s.free).reduce((a, b) => a + b.price, 0),
          current_yearly_spending: parsed.current_yearly_spending || parsed.current_monthly_spending * 12,
          optimized_monthly_spending: parsed.optimized_monthly_spending || 1285,
          optimized_yearly_spending: parsed.optimized_yearly_spending || parsed.optimized_monthly_spending * 12,
          total_potential_monthly_saving: parsed.total_potential_monthly_saving || 699,
          total_potential_yearly_saving: parsed.total_potential_yearly_saving || 8388,
          budget_analysis: parsed.budget_analysis || {
            budget,
            over_budget_amount: Math.max(0, parsed.current_monthly_spending - budget),
            is_within_budget: parsed.current_monthly_spending <= budget,
            budget_verdict: parsed.current_monthly_spending > budget ? `\u26A0\uFE0F Spending is over target monthly budget.` : `\u2728 Spending is within monthly budget.`
          },
          attention_items: parsed.attention_items || [],
          recommendations: parsed.recommendations || [],
          insights: parsed.insights || [],
          future_recommendations: parsed.future_recommendations || {
            top_platform: "Prime Video",
            top_platform_id: "primevideo",
            price: 299,
            headline: "4 upcoming releases next month match your interests.",
            verdict: "Subscribe to Prime Video next month instead of renewing Netflix.",
            potential_saving: 200,
            matched_releases_count: 4
          },
          service_switches: parsed.service_switches || [],
          factors_analyzed: parsed.factors_analyzed || [
            "Spending vs Budget",
            "Usage Frequency",
            "Last Used Days",
            "Cost per Usage",
            "Ghost Subscriptions",
            "Free Trials Ending",
            "User Interests",
            "Upcoming OTT Content"
          ],
          ai_engine_used: "Gemini Intelligence Engine",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        cachedOptimizerResult = { data: fullResult, hash: stateHash, expiresAt: Date.now() + 12e4 };
        return fullResult;
      }
    } catch (err) {
      console.warn("Gemini Optimizer execution warning, trying next engine:", err);
    }
  }
  if (isOpenAiAvailable()) {
    const openai2 = getOpenAiClient();
    if (openai2) {
      const toolCtx = { subscriptions: subscriptions2, userProfile: userProfile2, wishlist: wishlist2 };
      try {
        const messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ];
        let runnerResponse = await openai2.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          tools: OPENAI_TOOLS_DEFINITIONS,
          tool_choice: "auto",
          response_format: { type: "json_object" }
        });
        let choice = runnerResponse.choices[0];
        let iterations = 0;
        while (choice?.message?.tool_calls && choice.message.tool_calls.length > 0 && iterations < 3) {
          iterations++;
          messages.push(choice.message);
          for (const toolCall of choice.message.tool_calls) {
            if (toolCall.type === "function") {
              let args = {};
              try {
                args = JSON.parse(toolCall.function.arguments || "{}");
              } catch {
              }
              const result = executeOpenAiTool(toolCall.function.name, args, toolCtx);
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
              });
            }
          }
          runnerResponse = await openai2.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            response_format: { type: "json_object" }
          });
          choice = runnerResponse.choices[0];
        }
        const contentStr = choice?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          if (parsed.recommendations && parsed.current_monthly_spending !== void 0) {
            const fullResult = {
              summary: parsed.summary || `AI optimized subscription portfolio saving \u20B9${parsed.total_potential_monthly_saving || 699}/month.`,
              current_monthly_spending: parsed.current_monthly_spending || subscriptions2.filter((s) => !s.free).reduce((a, b) => a + b.price, 0),
              current_yearly_spending: parsed.current_yearly_spending || parsed.current_monthly_spending * 12,
              optimized_monthly_spending: parsed.optimized_monthly_spending || 1285,
              optimized_yearly_spending: parsed.optimized_yearly_spending || parsed.optimized_monthly_spending * 12,
              total_potential_monthly_saving: parsed.total_potential_monthly_saving || 699,
              total_potential_yearly_saving: parsed.total_potential_yearly_saving || 8388,
              budget_analysis: parsed.budget_analysis || {
                budget,
                over_budget_amount: Math.max(0, parsed.current_monthly_spending - budget),
                is_within_budget: parsed.current_monthly_spending <= budget,
                budget_verdict: parsed.current_monthly_spending > budget ? `\u26A0\uFE0F Spending is over target monthly budget.` : `\u2728 Spending is within monthly budget.`
              },
              attention_items: parsed.attention_items || [],
              recommendations: parsed.recommendations || [],
              insights: parsed.insights || [],
              future_recommendations: parsed.future_recommendations || {
                top_platform: "Prime Video",
                top_platform_id: "primevideo",
                price: 299,
                headline: "4 upcoming releases next month match your interests.",
                verdict: "Subscribe to Prime Video next month instead of renewing Netflix.",
                potential_saving: 200,
                matched_releases_count: 4
              },
              service_switches: parsed.service_switches || [],
              factors_analyzed: parsed.factors_analyzed || [
                "Spending vs Budget",
                "Usage Frequency",
                "Last Used Days",
                "Cost per Usage",
                "Ghost Subscriptions",
                "Free Trials Ending",
                "User Interests",
                "Upcoming OTT Content"
              ],
              ai_engine_used: "OpenAI (GPT-4o)",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            };
            cachedOptimizerResult = { data: fullResult, hash: stateHash, expiresAt: Date.now() + 12e4 };
            return fullResult;
          }
        }
      } catch (err) {
        handleOpenAiError(err, "Optimizer");
      }
    }
  }
  const fallback = generateAlgorithmicOptimizerFallback(subscriptions2, userProfile2, budget);
  cachedOptimizerResult = { data: fallback, hash: stateHash, expiresAt: Date.now() + 6e4 };
  return fallback;
}
async function runOpenAiAdvisorChat(query, subscriptions2, userProfile2, wishlist2 = []) {
  const gemini = getGeminiClient();
  const openai = getOpenAiClient();
  if (gemini) {
    try {
      const contents = `User Query: "${query}"
User: ${userProfile2.name}, Budget: \u20B9${userProfile2.monthlyBudget || 1e3}/mo
Subscriptions: ${JSON.stringify(subscriptions2.map((s) => ({ name: s.name, price: s.price, usedDays: s.usedDays, status: s.status, renewsIn: s.renewsIn })))}
Wishlist: ${JSON.stringify(wishlist2)}`;
      const systemInstruction = `You are Trackey AI, an expert personal subscription intelligence advisor.
Answer the user's question directly and concisely (1-2 sentences) using the real application data.
Explain the reason in 1 sentence.
Return a structured JSON output with:
{
  "answer": "string",
  "reason": "string",
  "action": {
    "label": "string",
    "type": "navigate_insights | navigate_optimize | open_detail | open_comparison | open_ott_comparison",
    "payload": {}
  } | null
}`;
      const parsed = await generateGeminiJson(gemini, contents, systemInstruction);
      if (parsed && parsed.answer) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini Chat Advisor execution warning:", err);
    }
  }
  if (isOpenAiAvailable()) {
    const openai2 = getOpenAiClient();
    if (openai2) {
      const toolCtx = { subscriptions: subscriptions2, userProfile: userProfile2, wishlist: wishlist2 };
      try {
        const messages = [
          {
            role: "system",
            content: `You are Trackey AI, an expert personal subscription intelligence advisor.
Answer the user's question directly and concisely (1-2 sentences) using the available real application data tools.
Explain the reason in 1 sentence.
Return a structured JSON output with:
{
  "answer": "string",
  "reason": "string",
  "action": {
    "label": "string",
    "type": "navigate_insights | navigate_optimize | open_detail | open_comparison | open_ott_comparison",
    "payload": {}
  } | null
}`
          },
          { role: "user", content: query }
        ];
        let response = await openai2.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          tools: OPENAI_TOOLS_DEFINITIONS,
          tool_choice: "auto",
          response_format: { type: "json_object" }
        });
        let choice = response.choices[0];
        let iterations = 0;
        while (choice?.message?.tool_calls && choice.message.tool_calls.length > 0 && iterations < 3) {
          iterations++;
          messages.push(choice.message);
          for (const toolCall of choice.message.tool_calls) {
            if (toolCall.type === "function") {
              let args = {};
              try {
                args = JSON.parse(toolCall.function.arguments || "{}");
              } catch {
              }
              const result = executeOpenAiTool(toolCall.function.name, args, toolCtx);
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
              });
            }
          }
          response = await openai2.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            response_format: { type: "json_object" }
          });
          choice = response.choices[0];
        }
        const text = choice?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.answer) return parsed;
        }
      } catch (err) {
        handleOpenAiError(err, "Chat Advisor");
      }
    }
  }
  return generateRuleBasedAdvisorResponse(query, subscriptions2, userProfile2, wishlist2);
}
function generateRuleBasedAdvisorResponse(query, subscriptions2, userProfile2, wishlist2 = []) {
  const q = (query || "").toLowerCase();
  const paidSubs = subscriptions2.filter((s) => !s.free);
  const totalSpend = paidSubs.reduce((sum, s) => sum + (s.price || 0), 0);
  const budget = userProfile2.monthlyBudget || 1e3;
  if (q.includes("save") || q.includes("saving") || q.includes("reduce") || q.includes("cut") || q.includes("500")) {
    const lowUsage = subscriptions2.find((s) => (s.status === "low" || s.usedDays <= 3) && s.price > 0);
    if (lowUsage) {
      return {
        answer: `You can save \u20B9${lowUsage.price}/month immediately by reviewing or pausing ${lowUsage.name}.`,
        reason: `You have only used ${lowUsage.name} for ${lowUsage.usedDays} days this billing period.`,
        action: { label: `Review ${lowUsage.name}`, type: "open_detail", payload: { id: lowUsage.id } }
      };
    }
    return {
      answer: `Trackey identified up to \u20B9699/month in potential savings across unused and low-engagement subscriptions.`,
      reason: `Rebalancing your portfolio keeps high-value services while pausing inactive ones.`,
      action: { label: "Open Optimizer Plan", type: "navigate_optimize", payload: { step: 3 } }
    };
  }
  if (q.includes("netflix") || q.includes("prime") || q.includes("compare")) {
    return {
      answer: `Prime Video offers higher matching upcoming releases (Dune 2, Rings of Power S2) for \u20B9299/mo compared to Netflix where your usage dropped to 2 days.`,
      reason: `Netflix renewal is approaching in 3 days with low active watch time.`,
      action: { label: "Compare OTT Services", type: "open_ott_comparison", payload: {} }
    };
  }
  if (q.includes("renew") || q.includes("renewal") || q.includes("soon") || q.includes("upcoming")) {
    const nextSub = [...subscriptions2].sort((a, b) => {
      const aDays = parseInt(a.renewsIn || "30") || 30;
      const bDays = parseInt(b.renewsIn || "30") || 30;
      return aDays - bDays;
    })[0];
    if (nextSub) {
      return {
        answer: `${nextSub.name} is scheduled to renew in ${nextSub.renewsIn} for \u20B9${nextSub.price}.`,
        reason: `Autopay is ${nextSub.autopay || "Enabled"}. Ensure you review usage before billing.`,
        action: { label: `Review ${nextSub.name}`, type: "open_detail", payload: { id: nextSub.id } }
      };
    }
  }
  if (q.includes("spend") || q.includes("cost") || q.includes("total") || q.includes("budget")) {
    const diff = totalSpend - budget;
    return {
      answer: `You are currently spending \u20B9${totalSpend}/month across ${subscriptions2.length} subscriptions (${diff > 0 ? `\u20B9${diff} over` : `\u20B9${Math.abs(diff)} under`} your \u20B9${budget} budget).`,
      reason: `Computed in real-time from your active subscription records.`,
      action: { label: "View Spending Insights", type: "navigate_insights", payload: { period: "thismonth" } }
    };
  }
  return {
    answer: `You have ${subscriptions2.length} active subscriptions totaling \u20B9${totalSpend}/month with \u20B9${budget} monthly budget.`,
    reason: `I can help you review upcoming renewals, spot ghost subscriptions, or optimize your monthly spending.`,
    action: { label: "Run AI Optimizer", type: "navigate_optimize", payload: { step: 1 } }
  };
}

// server/app.ts
var subscriptions = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
var userProfile = JSON.parse(JSON.stringify(INITIAL_USER));
var wishlist = JSON.parse(JSON.stringify(INITIAL_WISHLIST));
function createApiApp() {
  const app2 = express();
  app2.use(express.json());
  const router = express.Router();
  router.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
  router.get("/profile", (req, res) => {
    res.json(userProfile);
  });
  router.put("/profile", (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json(userProfile);
  });
  router.get("/subscriptions", (req, res) => {
    const category = req.query.category;
    if (category && category !== "all") {
      res.json(subscriptions.filter((s) => s.category === category));
    } else {
      res.json(subscriptions);
    }
  });
  router.post("/subscriptions", (req, res) => {
    const newSub = {
      id: req.body.id || `sub_${Date.now()}`,
      name: req.body.name || "Custom Subscription",
      category: req.body.category || "others",
      categoryLabel: req.body.categoryLabel || req.body.category || "Others",
      icon: req.body.icon || req.body.name?.charAt(0)?.toUpperCase() || "S",
      color: req.body.color || "#2F6FED",
      price: Number(req.body.price) || 0,
      free: Boolean(req.body.free),
      usedDays: Number(req.body.usedDays) || 0,
      lastUsed: req.body.lastUsed || "Recently added",
      renewsIn: req.body.renewsIn || "30 days",
      renewalDate: req.body.renewalDate || "Next month",
      status: req.body.status || "active",
      statusLabel: req.body.statusLabel || "Active",
      autopay: req.body.autopay || "Enabled",
      nextRenewal: req.body.nextRenewal || "Next month",
      valueScore: req.body.valueScore || "7.0/10",
      redundancy: req.body.redundancy || "Low",
      pauseSupported: req.body.pauseSupported ?? true,
      recommendation: req.body.recommendation || "Newly added subscription.",
      appInstalled: req.body.appInstalled ?? true,
      trialDaysLeft: req.body.trialDaysLeft
    };
    subscriptions.push(newSub);
    res.json(newSub);
  });
  router.get("/subscriptions/:id", (req, res) => {
    const sub = subscriptions.find((s) => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(sub);
  });
  router.put("/subscriptions/:id", (req, res) => {
    const index = subscriptions.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    subscriptions[index] = { ...subscriptions[index], ...req.body };
    res.json(subscriptions[index]);
  });
  router.delete("/subscriptions/:id", (req, res) => {
    const prevLen = subscriptions.length;
    subscriptions = subscriptions.filter((s) => s.id !== req.params.id);
    if (subscriptions.length === prevLen) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json({ success: true, message: `Subscription ${req.params.id} deleted` });
  });
  router.get("/insights", (req, res) => {
    const startTime = Date.now();
    try {
      const period = req.query.period || "thismonth";
      console.log(`[API /insights] Request start | Period: ${period} | UserProfile: ${Boolean(userProfile)}`);
      const data = INSIGHTS_PERIOD_DATA[period] || INSIGHTS_PERIOD_DATA.thismonth;
      const duration = Date.now() - startTime;
      console.log(`[API /insights] Success | Duration: ${duration}ms`);
      res.json(data);
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[API /insights] Failure | Error: ${err?.name || "UnknownError"} | Duration: ${duration}ms`);
      res.status(500).json({ error: "Failed to load insights data" });
    }
  });
  router.post("/optimizer", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = Number(req.body.budget) || userProfile.monthlyBudget || 1e3;
      const forceRefresh = Boolean(req.body.forceRefresh);
      console.log(`[API /optimizer POST] Request start | Budget: \u20B9${budget} | Subscriptions: ${subscriptions.length} | ForceRefresh: ${forceRefresh}`);
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, forceRefresh);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer POST] Success | Engine: ${result.ai_engine_used} | Savings: \u20B9${result.total_potential_monthly_saving} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer POST] Error: ${err?.name || "Error"} - ${err?.message || "Unknown"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to run optimizer" });
    }
  });
  router.get("/optimizer", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = userProfile.monthlyBudget || 1e3;
      console.log(`[API /optimizer GET] Request start | Budget: \u20B9${budget} | Subscriptions: ${subscriptions.length}`);
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, false);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer GET] Success | Engine: ${result.ai_engine_used} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer GET] Error: ${err?.name || "Error"} - ${err?.message || "Unknown"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to get optimizer plan" });
    }
  });
  router.post("/optimizer/refresh", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = Number(req.body.budget) || userProfile.monthlyBudget || 1e3;
      console.log(`[API /optimizer/refresh POST] Request start | Budget: \u20B9${budget}`);
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, true);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer/refresh POST] Success | Engine: ${result.ai_engine_used} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer/refresh POST] Error: ${err?.name || "Error"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to refresh optimizer" });
    }
  });
  router.get("/recommendations", (req, res) => {
    const startTime = Date.now();
    try {
      const wishlistIds = wishlist.map((w) => w.content_id || w.id);
      console.log(`[API /recommendations] Request start | Interests: ${userProfile.movieInterests?.length || 0} | Subscriptions: ${subscriptions.length}`);
      const result = getFutureRecommendations(userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"], subscriptions, wishlistIds);
      const duration = Date.now() - startTime;
      console.log(`[API /recommendations] Success | Categories: ${Object.keys(result || {}).join(", ")} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[API /recommendations] Error: ${err?.name || "Error"} | Duration: ${duration}ms`);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });
  router.get("/movies/upcoming", (req, res) => {
    const wishlistIds = wishlist.map((w) => w.content_id || w.id);
    const result = getUpcomingMovies(userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"], wishlistIds);
    res.json(result);
  });
  router.get("/wishlist", (req, res) => {
    res.json(wishlist);
  });
  router.post("/wishlist", (req, res) => {
    const item = {
      id: req.body.id || req.body.content_id || `w_${Date.now()}`,
      content_id: req.body.content_id || req.body.id || `w_${Date.now()}`,
      title: req.body.title || "Upcoming Title",
      poster_url: req.body.poster_url || "",
      platform: req.body.platform || "",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    wishlist.push(item);
    res.json(item);
  });
  router.delete("/wishlist/:id", (req, res) => {
    wishlist = wishlist.filter((w) => w.id !== req.params.id && w.content_id !== req.params.id);
    res.json({ success: true });
  });
  router.post("/comparison/ott", (req, res) => {
    const platforms = req.body.platforms;
    const result = compareOttServices(platforms, subscriptions, userProfile);
    res.json(result);
  });
  router.post("/comparison/services", (req, res) => {
    const serviceA = req.body.serviceA || "spotify";
    const serviceB = req.body.serviceB || "applemusic";
    const result = compareUniversalServices(serviceA, serviceB, userProfile, subscriptions);
    res.json(result);
  });
  router.post("/assistant/chat", async (req, res) => {
    try {
      const message = req.body.message || req.body.query || "";
      const answer = await runOpenAiAdvisorChat(message, subscriptions, userProfile, wishlist);
      res.json(answer);
    } catch (err) {
      console.error("AI Chat Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI response" });
    }
  });
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      app: "Trackey Node/TypeScript Engine",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY),
      hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY)
    });
  });
  app2.use("/api", router);
  app2.use("/", router);
  return app2;
}

// api/index.ts
var app = createApiApp();
var maxDuration = 30;
var index_default = app;
export {
  index_default as default,
  maxDuration
};
