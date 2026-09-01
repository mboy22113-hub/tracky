// Insights & analytics master definitions

export const INSIGHTS_PERIOD_DATA = {
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
      {
        id: 'spotify',
        name: 'Spotify',
        icon: '🎧',
        color: '#1DB954',
        cost: 119,
        usageHours: 35,
        costPerHour: 3,
        status: 'good',
        statusLabel: 'Great Value',
        badge: '✅ ₹3/hr'
      },
      {
        id: 'primevideo',
        name: 'Prime Video',
        icon: '🎬',
        color: '#00A8E1',
        cost: 299,
        usageHours: 20,
        costPerHour: 15,
        status: 'good',
        statusLabel: 'Good Value',
        badge: '✅ ₹15/hr'
      },
      {
        id: 'netflix',
        name: 'Netflix',
        icon: '🍿',
        color: '#E50914',
        cost: 199,
        usageHours: 3,
        costPerHour: 66,
        status: 'warning',
        statusLabel: 'Low Value',
        badge: '⚠️ ₹66/hr'
      },
      {
        id: 'canva',
        name: 'Canva',
        icon: '🎨',
        color: '#00C4CC',
        cost: 499,
        usageHours: 2,
        costPerHour: 249,
        status: 'danger',
        statusLabel: 'Overpaying',
        badge: '⚠️ ₹249/hr'
      }
    ],
    valueInsight: 'Canva and Netflix have the highest cost per hour because of low usage.',
    weeklyActivity: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      mostActive: { name: 'Spotify', detail: '35 hrs / 7 days active' },
      leastActive: { name: 'Canva', detail: '2 hrs / 1 day active' },
      services: [
        {
          id: 'spotify',
          name: 'Spotify',
          icon: '🎧',
          color: '#1DB954',
          activeDays: 7,
          percentage: 100,
          intensity: [3, 4, 4, 5, 5, 4, 3] // scale 0-5
        },
        {
          id: 'primevideo',
          name: 'Prime Video',
          icon: '🎬',
          color: '#00A8E1',
          activeDays: 5,
          percentage: 71,
          intensity: [0, 2, 0, 3, 4, 5, 4]
        },
        {
          id: 'netflix',
          name: 'Netflix',
          icon: '🍿',
          color: '#E50914',
          activeDays: 2,
          percentage: 28,
          intensity: [0, 0, 0, 0, 1, 2, 0]
        },
        {
          id: 'canva',
          name: 'Canva',
          icon: '🎨',
          color: '#00C4CC',
          activeDays: 1,
          percentage: 14,
          intensity: [0, 0, 2, 0, 0, 0, 0]
        }
      ]
    },
    moneyLeaks: [
      {
        id: 'leak_ghost',
        type: 'ghost',
        icon: '👻',
        title: 'Ghost Subscription',
        description: 'Deleted app but active subscription detected.',
        serviceName: 'Duolingo Super',
        serviceId: 'duolingo',
        riskLevel: 'High Risk',
        riskClass: 'high',
        potentialSavings: 299,
        actionLabel: 'Review →'
      },
      {
        id: 'leak_trial',
        type: 'trial',
        icon: '🎁',
        title: 'Free Trial Ending',
        description: 'Trial ends in 2 days. Auto-renews soon.',
        serviceName: 'Canva Pro',
        serviceId: 'canva',
        riskLevel: 'Medium Risk',
        riskClass: 'medium',
        potentialSavings: 499,
        actionLabel: 'Review →'
      },
      {
        id: 'leak_low_usage',
        type: 'low_usage',
        icon: '⚠️',
        title: 'Low Usage',
        description: 'Netflix has not been used for 18 days.',
        serviceName: 'Netflix Basic',
        serviceId: 'netflix',
        riskLevel: 'Medium Risk',
        riskClass: 'medium',
        potentialSavings: 199,
        actionLabel: 'Review →'
      },
      {
        id: 'leak_overlap',
        type: 'overlap',
        icon: '💸',
        title: 'Duplicate / Overlapping Services',
        description: 'Multiple services provide similar functionality.',
        serviceName: 'Apple Music & Spotify',
        serviceId: 'spotify',
        riskLevel: 'Low Risk',
        riskClass: 'low',
        potentialSavings: 119,
        actionLabel: 'Review →'
      }
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

export const INSIGHTS_DATA = INSIGHTS_PERIOD_DATA.thismonth;

