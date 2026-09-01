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
    const totalCurrentSpend = currentSubs.reduce((sum, s) => sum + (s.price || 0), 0);
    const lowUsageSubs = currentSubs.filter(s => s.status === 'low' || s.usedDays <= 4);
    const activeSubs = currentSubs.filter(s => s.status !== 'paused');

    // Keep items with high usage
    const keptSubs = currentSubs.filter(s => s.usedDays > 4);
    const reviewSubs = lowUsageSubs;

    const recommendedSpend = keptSubs.reduce((sum, s) => sum + (s.price || 0), 0);
    const potentialSavings = Math.max(0, totalCurrentSpend - recommendedSpend);

    // Items needing attention: low usage, expiring trials, uninstalled apps
    const attentionItems = [];
    currentSubs.forEach(s => {
      if (s.id === 'canva') {
        attentionItems.push({
          id: s.id,
          name: s.name,
          category: s.category,
          price: s.price,
          reason: 'Low usage — used only 3 days this month (trial ending)',
          action: 'Review →',
          badge: 'Low usage'
        });
      } else if (s.id === 'netflix') {
        attentionItems.push({
          id: s.id,
          name: s.name,
          category: s.category,
          price: s.price,
          reason: 'Renewal in 3 days + low usage (used 2 days)',
          action: 'Review →',
          badge: 'Renewal alert'
        });
      } else if (s.id === 'jiohotstar') {
        attentionItems.push({
          id: s.id,
          name: s.name,
          category: s.category,
          price: s.price,
          reason: 'Moderate usage with upcoming renewal in 9 days',
          action: 'Review →',
          badge: 'Moderate'
        });
      } else if (s.status === 'low' && s.price > 0) {
        attentionItems.push({
          id: s.id,
          name: s.name,
          category: s.category,
          price: s.price,
          reason: `Low usage — used only ${s.usedDays} days this month`,
          action: 'Review →',
          badge: 'Low usage'
        });
      }
    });

    const recommendations = [
      {
        subId: 'spotify',
        subName: 'Spotify',
        action: 'keep',
        label: 'Keep',
        score: '9.1/10',
        reason: 'Keep Spotify and Prime Video because your usage is high (24 days active).'
      },
      {
        subId: 'primevideo',
        subName: 'Prime Video',
        action: 'keep',
        label: 'Keep',
        score: '7.4/10',
        reason: 'Keep Prime Video for steady viewing (12 days) plus bundled shopping benefits.'
      },
      {
        subId: 'netflix',
        subName: 'Netflix',
        action: 'review',
        label: 'Review',
        score: '5.8/10',
        reason: 'Review Netflix because usage is low (2 days) and renewal is approaching in 3 days.'
      },
      {
        subId: 'canva',
        subName: 'Canva',
        action: 'pause',
        label: 'Pause',
        score: '3.2/10',
        reason: 'Pause Canva subscription to save ₹500/mo since it is rarely used (3 days).'
      },
      {
        subId: 'jiohotstar',
        subName: 'JioHotstar',
        action: 'conditional',
        label: 'Evaluate',
        score: '6.1/10',
        reason: 'Consider JioHotstar only when your preferred live sports or Marvel content is available.'
      }
    ];

    return {
      currentSpending: totalCurrentSpend,
      recommendedSpending: recommendedSpend,
      potentialSavings: potentialSavings || 699,
      activeCount: activeSubs.length,
      lowUsageCount: lowUsageSubs.length,
      budget: budget || 1000,
      attentionItems,
      recommendations
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

