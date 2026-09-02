import {
  INITIAL_SUBSCRIPTIONS,
  KNOWN_SERVICES,
  POPULAR_COMPARISON_PRESETS,
  buildComparisonData,
  UPCOMING_RELEASES,
  FUTURE_STRATEGIC_ACTIONS,
  INSIGHTS_DATA,
  INSIGHTS_PERIOD_DATA,
  INITIAL_USER
} from '../data/mockData.js';

// Safe in-memory store
let subscriptionsState = [...INITIAL_SUBSCRIPTIONS];
let userState = { ...INITIAL_USER };
let wishlistState = [
  { id: 'm_dune2', content_id: 'm_dune2', title: 'Dune: Part Two', poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', platform: 'Prime Video' },
  { id: 'm_squidgame2', content_id: 'm_squidgame2', title: 'Squid Game S2', poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80', platform: 'Netflix' }
];

export const subscriptionService = {
  async getSubscriptions() {
    return [...subscriptionsState];
  },
  async getSubscriptionById(id) {
    return subscriptionsState.find(s => s.id === id) || null;
  },
  async addSubscription(subData) {
    const newSub = {
      id: subData.id || `sub_${Date.now()}`,
      name: subData.name || 'New Subscription',
      category: subData.category || 'others',
      categoryLabel: subData.categoryLabel || 'Others',
      price: Number(subData.price) || 0,
      free: Number(subData.price) === 0,
      usedDays: Number(subData.usedDays) || 0,
      lastUsed: 'recently',
      renewsIn: subData.renewsIn || '30 days',
      renewalDate: subData.renewalDate || 'Next month',
      status: subData.status || 'active',
      statusLabel: subData.statusLabel || 'Active',
      autopay: 'Enabled',
      nextRenewal: 'Next month',
      valueScore: '7.0/10',
      redundancy: 'Low',
      pauseSupported: true,
      recommendation: 'Track usage over the next 30 days.'
    };
    subscriptionsState.push(newSub);
    return newSub;
  },
  async updateSubscription(id, patch) {
    const idx = subscriptionsState.findIndex(s => s.id === id);
    if (idx !== -1) {
      subscriptionsState[idx] = { ...subscriptionsState[idx], ...patch };
      return subscriptionsState[idx];
    }
    return null;
  },
  async pauseSubscription(id) {
    const idx = subscriptionsState.findIndex(s => s.id === id);
    if (idx !== -1) {
      subscriptionsState[idx].status = 'paused';
      subscriptionsState[idx].statusLabel = 'Paused';
      return subscriptionsState[idx];
    }
    return null;
  },
  async cancelSubscription(id) {
    subscriptionsState = subscriptionsState.filter(s => s.id !== id);
    return { success: true };
  }
};

export const comparisonService = {
  async getAvailableServices() {
    return [...KNOWN_SERVICES];
  },
  async getComparisonPresets() {
    return [...POPULAR_COMPARISON_PRESETS];
  },
  async compareServices(serviceA = 'spotify', serviceB = 'applemusic') {
    return buildComparisonData(serviceA, serviceB, userState);
  }
};

export const recommendationService = {
  async getUpcomingReleases() {
    return [...UPCOMING_RELEASES];
  },
  async getStrategicActions() {
    return [...FUTURE_STRATEGIC_ACTIONS];
  },
  async getOptimizerPlan(budget = userState.monthlyBudget) {
    const currentSubs = [...subscriptionsState];
    const totalCurrentSpend = currentSubs.filter(s => !s.free).reduce((sum, s) => sum + (s.price || 0), 0) || 1984;
    const targetBudget = budget || userState.monthlyBudget || 1000;
    const overBudgetAmt = Math.max(0, totalCurrentSpend - targetBudget);

    // Attention items
    const attention_items = [
      {
        id: 'att_netflix',
        subscription_id: 'netflix',
        name: 'Netflix',
        price: 199,
        type: 'renewal',
        badge: 'Renewal in 3 days',
        severity_tag: 'leakreview',
        reason: 'Renewal in 3 days + Low usage (Used 2 days this month)',
        icon_emoji: '🍿'
      },
      {
        id: 'att_hotstar',
        subscription_id: 'jiohotstar',
        name: 'JioHotstar',
        price: 149,
        type: 'renewal',
        badge: 'Upcoming renewal',
        severity_tag: 'review',
        reason: 'Moderate usage (6 days) with renewal scheduled in 6 days',
        icon_emoji: '🏏'
      },
      {
        id: 'att_canva',
        subscription_id: 'canva',
        name: 'Free Trial: Canva Pro',
        price: 499,
        type: 'trial',
        badge: 'Trial Ending',
        severity_tag: 'review',
        reason: 'Canva Pro trial ends in 2 days. Will automatically charge ₹499/month.',
        icon_emoji: '🎁'
      },
      {
        id: 'att_duolingo',
        subscription_id: 'duolingo',
        name: 'Ghost App: Duolingo Super',
        price: 299,
        type: 'ghost',
        badge: 'Ghost App',
        severity_tag: 'leakreview',
        reason: 'App uninstalled 18 days ago, but subscription is actively billing ₹299/mo.',
        icon_emoji: '👻'
      }
    ];

    const recommendations = [
      {
        subscription: 'Spotify',
        subscription_id: 'spotify',
        action: 'keep',
        action_label: 'KEEP',
        tag_class: 'keep',
        reason: 'High active usage (24 days) and strong alignment with your daily routines.',
        meta: 'High usage (24 days) · Score: 9.1/10',
        current_monthly_price: 119,
        estimated_monthly_saving: 0
      },
      {
        subscription: 'Prime Video',
        subscription_id: 'primevideo',
        action: 'switch',
        action_label: 'SWITCH / SUBSCRIBE',
        tag_class: 'info',
        reason: '4 upcoming releases next month match your sci-fi and action interests.',
        meta: 'Matches 4 upcoming releases · Score: 8.9/10',
        current_monthly_price: 299,
        estimated_monthly_saving: 0
      },
      {
        subscription: 'Netflix',
        subscription_id: 'netflix',
        action: 'pause',
        action_label: 'PAUSE / CANCEL',
        tag_class: 'leakreview',
        reason: 'You haven\'t used Netflix recently (2 days active), while Prime Video releases align better. Pausing saves ₹199/mo.',
        meta: 'Used 2 days · Save ₹199/mo',
        current_monthly_price: 199,
        estimated_monthly_saving: 199
      },
      {
        subscription: 'Canva Pro',
        subscription_id: 'canva',
        action: 'cancel',
        action_label: 'CANCEL TRIAL',
        tag_class: 'review',
        reason: 'Free trial ends in 2 days. Cancel before renewal to avoid ₹499/mo charge, or downgrade to Canva Free.',
        meta: 'Trial ends in 2d · Save ₹499/mo',
        current_monthly_price: 499,
        estimated_monthly_saving: 499
      },
      {
        subscription: 'Duolingo Super',
        subscription_id: 'duolingo',
        action: 'cancel',
        action_label: 'CANCEL GHOST APP',
        tag_class: 'leakreview',
        reason: 'App uninstalled 18 days ago with zero recent usage. Cancelling stops immediate ₹299/mo money leak.',
        meta: 'Uninstalled · Save ₹299/mo',
        current_monthly_price: 299,
        estimated_monthly_saving: 299
      }
    ];

    const potentialSavings = 699;
    const optimizedSpend = Math.max(0, totalCurrentSpend - potentialSavings);

    return {
      summary: `Your subscription ecosystem currently spends ₹${totalCurrentSpend}/mo across ${currentSubs.length} services. Reviewing low-usage services and overlapping catalogs can recover ₹${potentialSavings}/mo (₹${potentialSavings * 12}/year).`,
      current_monthly_spending: totalCurrentSpend,
      current_yearly_spending: totalCurrentSpend * 12,
      optimized_monthly_spending: optimizedSpend,
      optimized_yearly_spending: optimizedSpend * 12,
      total_potential_monthly_saving: potentialSavings,
      total_potential_yearly_saving: potentialSavings * 12,
      currentSpending: totalCurrentSpend,
      recommendedSpending: optimizedSpend,
      potentialSavings: potentialSavings,
      budget_analysis: {
        budget: targetBudget,
        over_budget_amount: overBudgetAmt,
        is_within_budget: totalCurrentSpend <= targetBudget,
        budget_verdict: totalCurrentSpend > targetBudget 
          ? `⚠️ Current spending is ₹${overBudgetAmt} over your target budget of ₹${targetBudget}/mo.` 
          : `✨ Current spending is within your monthly budget of ₹${targetBudget}/mo.`
      },
      attention_items,
      recommendations,
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
      future_recommendations: {
        top_platform: 'Prime Video',
        top_platform_id: 'primevideo',
        price: 299,
        headline: '4 upcoming releases next month match your action, sci-fi and superhero interests.',
        verdict: 'Subscribe to Prime Video next month instead of renewing Netflix.',
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
          analyzed_factors: "Device ecosystem · Music usage · Podcasts · Lossless audio",
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
          analyzed_factors: "Content alignment · Monthly cost · Included perks",
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
          quote: "You create graphics on only 3 days per month. The free tier covers all your export requirements without paying ₹500/mo."
        }
      ],
      ai_engine_used: "Trackey Smart Optimizer (AI Mode)",
      timestamp: new Date().toISOString()
    };
  }
};

export const insightsService = {
  async getInsights(period = 'thismonth') {
    const data = (INSIGHTS_PERIOD_DATA && INSIGHTS_PERIOD_DATA[period]) ? INSIGHTS_PERIOD_DATA[period] : INSIGHTS_DATA;
    return { ...data };
  }
};

// Unified api interface
export const api = {
  getSubscriptions: async (category) => {
    try {
      const url = category && category !== 'all' ? `/api/subscriptions?category=${category}` : '/api/subscriptions';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        subscriptionsState = data;
        return data;
      }
    } catch {}
    return subscriptionService.getSubscriptions();
  },
  getSubscriptionById: async (id) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return subscriptionService.getSubscriptionById(id);
  },
  addSubscription: async (subData) => {
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData)
      });
      if (res.ok) {
        const newSub = await res.json();
        subscriptionsState.push(newSub);
        return newSub;
      }
    } catch {}
    return subscriptionService.addSubscription(subData);
  },
  createSubscription: async (subData) => {
    return api.addSubscription(subData);
  },
  updateSubscription: async (id, patch) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = subscriptionsState.findIndex(s => s.id === id);
        if (idx !== -1) subscriptionsState[idx] = updated;
        return updated;
      }
    } catch {}
    return subscriptionService.updateSubscription(id, patch);
  },
  pauseSubscription: async (id) => {
    return api.updateSubscription(id, { status: 'paused', statusLabel: 'Paused' });
  },
  cancelSubscription: async (id) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        subscriptionsState = subscriptionsState.filter(s => s.id !== id);
        return { success: true };
      }
    } catch {}
    return subscriptionService.cancelSubscription(id);
  },
  deleteSubscription: async (id) => {
    return api.cancelSubscription(id);
  },

  getAvailableServices: comparisonService.getAvailableServices,
  getComparisonPresets: comparisonService.getComparisonPresets,
  compareServices: async (serviceA = 'spotify', serviceB = 'applemusic') => {
    try {
      const res = await fetch('/api/comparison/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceA, serviceB })
      });
      if (res.ok) return await res.json();
    } catch {}
    return comparisonService.compareServices(serviceA, serviceB);
  },

  getUpcomingReleases: async () => {
    try {
      const res = await fetch('/api/movies/upcoming');
      if (res.ok) return await res.json();
    } catch {}
    return recommendationService.getUpcomingReleases();
  },
  getUpcomingMovies: async () => {
    try {
      const res = await fetch('/api/movies/upcoming');
      if (res.ok) return await res.json();
    } catch {}
    return recommendationService.getUpcomingReleases();
  },
  getStrategicActions: async () => {
    try {
      const res = await fetch('/api/recommendations');
      if (res.ok) return await res.json();
    } catch {}
    return recommendationService.getStrategicActions();
  },
  getOptimizerPlan: async (budget = userState.monthlyBudget, forceRefresh = false) => {
    try {
      const res = await fetch('/api/optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, forceRefresh })
      });
      if (res.ok) return await res.json();
    } catch {}
    return recommendationService.getOptimizerPlan(budget);
  },
  refreshOptimizer: async (budget = userState.monthlyBudget) => {
    try {
      const res = await fetch('/api/optimizer/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget })
      });
      if (res.ok) return await res.json();
    } catch {}
    return api.getOptimizerPlan(budget, true);
  },
  getOptimizer: async (budget, forceRefresh = false) => {
    return api.getOptimizerPlan(budget, forceRefresh);
  },
  getRecommendations: async () => {
    return api.getStrategicActions();
  },

  getWishlist: async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        wishlistState = data;
        return data;
      }
    } catch {}
    return [...wishlistState];
  },
  addToWishlist: async (item) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const added = await res.json();
        wishlistState.push(added);
        return added;
      }
    } catch {}
    const entry = { id: item.id || item.content_id || `w_${Date.now()}`, ...item };
    wishlistState.push(entry);
    return entry;
  },
  removeFromWishlist: async (contentId) => {
    try {
      const res = await fetch(`/api/wishlist/${contentId}`, { method: 'DELETE' });
      if (res.ok) {
        wishlistState = wishlistState.filter(w => w.content_id !== contentId && w.id !== contentId);
        return { success: true };
      }
    } catch {}
    wishlistState = wishlistState.filter(w => w.content_id !== contentId && w.id !== contentId);
    return { success: true };
  },

  getInsights: async (period = 'thismonth') => {
    try {
      const res = await fetch(`/api/insights?period=${period}`);
      if (res.ok) return await res.json();
    } catch {}
    return insightsService.getInsights(period);
  },
  getUser: async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        userState = data;
        return data;
      }
    } catch {}
    return { ...userState };
  },
  getProfile: async () => {
    return api.getUser();
  },
  updateUser: async (patch) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      if (res.ok) {
        const updated = await res.json();
        userState = updated;
        return updated;
      }
    } catch {}
    userState = { ...userState, ...patch };
    return { ...userState };
  },
  updateProfile: async (patch) => {
    return api.updateUser(patch);
  },

  chatAdvisor: async (query) => {
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Smart local fallback
    const q = (query || '').toLowerCase();
    const subs = subscriptionsState || [];
    const totalSpend = subs.reduce((sum, s) => sum + (s.price || 0), 0);

    if (q.includes('spend') || q.includes('cost') || q.includes('how much')) {
      return {
        answer: `Based on your Trackey records, you currently spend ₹${totalSpend}/month across ${subs.length} subscriptions.`,
        reason: `Your monthly budget is ₹${userState.monthlyBudget || 1000}.`,
        action: { label: 'View Spending Insights', type: 'navigate_insights', payload: { period: 'thismonth' } }
      };
    }
    if (q.includes('review') || q.includes('cut') || q.includes('cancel')) {
      const low = subs.find(s => s.status === 'low' || s.usedDays <= 3);
      if (low) {
        return {
          answer: `Reviewing ${low.name} is recommended.`,
          reason: `Used only ${low.usedDays || 0} days this month for ₹${low.price}/month.`,
          action: { label: `Review ${low.name}`, type: 'open_detail', payload: { id: low.id } }
        };
      }
    }
    return {
      answer: `You currently have ${subs.length} subscriptions totaling ₹${totalSpend}/month.`,
      reason: `Ask about your renewals, money leaks, service comparisons, or upcoming releases!`,
      action: { label: 'Explore Optimizer', type: 'navigate_optimize', payload: {} }
    };
  }
};

