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
  getSubscriptions: subscriptionService.getSubscriptions,
  getSubscriptionById: subscriptionService.getSubscriptionById,
  addSubscription: subscriptionService.addSubscription,
  updateSubscription: subscriptionService.updateSubscription,
  pauseSubscription: subscriptionService.pauseSubscription,
  cancelSubscription: subscriptionService.cancelSubscription,
  deleteSubscription: subscriptionService.cancelSubscription,

  getAvailableServices: comparisonService.getAvailableServices,
  getComparisonPresets: comparisonService.getComparisonPresets,
  compareServices: comparisonService.compareServices,

  getUpcomingReleases: recommendationService.getUpcomingReleases,
  getUpcomingMovies: recommendationService.getUpcomingReleases,
  getStrategicActions: recommendationService.getStrategicActions,
  getOptimizerPlan: recommendationService.getOptimizerPlan,
  getOptimizer: recommendationService.getOptimizerPlan,
  getRecommendations: async () => recommendationService.getStrategicActions(),

  getWishlist: async () => [...wishlistState],
  addToWishlist: async (item) => {
    const entry = { id: item.id || item.content_id || `w_${Date.now()}`, ...item };
    wishlistState.push(entry);
    return entry;
  },
  removeFromWishlist: async (contentId) => {
    wishlistState = wishlistState.filter(w => w.content_id !== contentId && w.id !== contentId);
    return { success: true };
  },

  getInsights: insightsService.getInsights,
  getUser: async () => ({ ...userState }),
  getProfile: async () => ({ ...userState }),
  updateUser: async (patch) => {
    userState = { ...userState, ...patch };
    return { ...userState };
  },
  updateProfile: async (patch) => {
    userState = { ...userState, ...patch };
    return { ...userState };
  }
};
