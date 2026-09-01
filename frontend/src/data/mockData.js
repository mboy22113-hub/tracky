import { INITIAL_SUBSCRIPTIONS } from './subscriptions.js';
import { KNOWN_SERVICES } from './services.js';
import { POPULAR_COMPARISON_PRESETS, buildComparisonData } from './comparisons.js';
import { UPCOMING_RELEASES, FUTURE_STRATEGIC_ACTIONS } from './recommendations.js';
import { INSIGHTS_DATA, INSIGHTS_PERIOD_DATA } from './insights.js';

export {
  INITIAL_SUBSCRIPTIONS,
  KNOWN_SERVICES,
  POPULAR_COMPARISON_PRESETS,
  buildComparisonData,
  UPCOMING_RELEASES,
  FUTURE_STRATEGIC_ACTIONS,
  INSIGHTS_DATA,
  INSIGHTS_PERIOD_DATA
};

export const INITIAL_USER = {
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
  monthlyBudget: 1000,
  optimizationGoal: "best_value",
  recommendationPriorities: ["High usage", "Budget saving"],
  recommendationSettings: { movies: true, music: true, games: true, others: true },
  notificationSettings: { renewals: true, trials: true, lowUsage: true, ghostSubscriptions: true, budget: true, optimization: true },
  trackerPreferences: { usageTracking: true, reminders: true, personalizedRecs: true },
  transactionConnected: false
};
