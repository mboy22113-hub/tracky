export interface Subscription {
  id: string;
  name: string;
  category: string;
  categoryLabel?: string;
  icon?: string;
  color?: string;
  price: number;
  free?: boolean;
  billingCycle?: string;
  nextRenewal?: string;
  renewsIn?: string | null;
  renewalDate?: string | null;
  autopay?: string;
  freeTrial?: boolean;
  trialDaysLeft?: number;
  appInstalled?: boolean;
  valueScore?: string;
  redundancy?: string;
  pauseSupported?: boolean;
  status?: string;
  statusLabel?: string;
  recommendation?: string;
  usedDays?: number;
  lastUsed?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  ageRange?: string;
  subscriptionCategories: string[];
  movieInterests: string[];
  contentPriorities: string[];
  musicInterests: string[];
  musicUse: string[];
  gamingInterests: string[];
  gamingFrequency?: string;
  otherInterests: string[];
  productivityInterests?: string[];
  connectedDevices?: string[];
  monthlyBudget: number;
  optimizationGoal: string;
  recommendationPriorities: string[];
  recommendationSettings: Record<string, boolean>;
  notificationSettings: Record<string, boolean>;
  trackerPreferences: Record<string, boolean>;
  transactionConnected: boolean;
}

export interface WishlistItem {
  id: string;
  content_id: string;
  title: string;
  poster_url?: string;
  platform?: string;
  created_at?: string;
}
