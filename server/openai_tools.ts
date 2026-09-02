import { Subscription, UserProfile, WishlistItem } from './types.js';
import { DEFAULT_UPCOMING_CONTENT } from './data.js';

export interface ToolExecutionContext {
  subscriptions: Subscription[];
  userProfile: UserProfile;
  wishlist: WishlistItem[];
}

export const OPENAI_TOOLS_DEFINITIONS = [
  {
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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

export function executeOpenAiTool(
  name: string,
  args: Record<string, any>,
  ctx: ToolExecutionContext
): any {
  const { subscriptions, userProfile, wishlist } = ctx;
  const paidSubs = subscriptions.filter(s => !s.free);
  const totalMonthlySpend = paidSubs.reduce((sum, s) => sum + (s.price || 0), 0);

  switch (name) {
    case "get_user_subscriptions": {
      const cat = args?.category;
      if (cat && cat !== "all") {
        return subscriptions.filter(s => s.category?.toLowerCase() === cat.toLowerCase());
      }
      return subscriptions.map(s => ({
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
        const found = subscriptions.find(s => s.id.toLowerCase() === subId.toLowerCase() || s.name.toLowerCase().includes(subId.toLowerCase()));
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
      return subscriptions.map(s => ({
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
        name: userProfile.name,
        monthlyBudget: userProfile.monthlyBudget,
        movieInterests: userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"],
        musicInterests: userProfile.musicInterests || ["Pop", "Rock", "Lo-Fi", "Podcasts"],
        musicUse: userProfile.musicUse || ["Commute", "Work focus", "Gym & Running"],
        gamingInterests: userProfile.gamingInterests || ["Action RPG", "FPS"],
        productivityInterests: userProfile.productivityInterests || ["Design", "Notes"],
        connectedDevices: userProfile.connectedDevices || ["iPhone 15 Pro", "MacBook Pro", "AirPods Pro", "iPad Air"],
        optimizationGoal: userProfile.optimizationGoal || "Cut unnecessary spending"
      };
    }

    case "get_watch_history": {
      return {
        recentGenres: userProfile.movieInterests || ["Action", "Sci-Fi", "Superhero"],
        frequentServices: subscriptions.filter(s => (s.usedDays || 0) >= 10).map(s => s.name),
        lowEngagementServices: subscriptions.filter(s => (s.usedDays || 0) <= 3 && !s.free).map(s => s.name)
      };
    }

    case "get_wishlist": {
      return wishlist.map(w => ({
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
        list = list.filter(m => m.platform.toLowerCase().includes(plat) || m.platform_name.toLowerCase().includes(plat));
      }
      return list.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        platform: m.platform_name,
        platform_id: m.platform,
        genre: m.genre,
        tags: m.tags,
        release_date: m.release_date,
        matchesUserInterests: m.tags.some(t => (userProfile.movieInterests || []).includes(t))
      }));
    }

    case "get_subscription_spending": {
      const budget = userProfile.monthlyBudget || 1000;
      const yearlySpend = totalMonthlySpend * 12;
      const overBudget = Math.max(0, totalMonthlySpend - budget);
      return {
        currentMonthlySpend: totalMonthlySpend,
        currentYearlySpend: yearlySpend,
        monthlyBudget: budget,
        overBudgetAmount: overBudget,
        isOverBudget: totalMonthlySpend > budget,
        activePaidCount: paidSubs.length,
        freeCount: subscriptions.length - paidSubs.length
      };
    }

    case "get_renewal_dates": {
      return subscriptions
        .filter(s => !s.free && s.renewsIn)
        .map(s => ({
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
      const actions: Array<{ subscription_id: string; action: string; alternative_price?: number }> = args?.actions || [];
      let monthlySaving = 0;
      const breakdown = actions.map(act => {
        const sub = subscriptions.find(s => s.id === act.subscription_id);
        if (!sub) return { subscription_id: act.subscription_id, saved: 0 };
        let saved = 0;
        if (act.action === "cancel" || act.action === "pause") {
          saved = sub.price || 0;
        } else if (act.action === "switch" && act.alternative_price !== undefined) {
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
      const sub = subscriptions.find(s => s.id.toLowerCase() === sid || s.name.toLowerCase().includes(sid));
      if (!sub) return { error: `Service '${sid}' not found.` };
      return sub;
    }

    default:
      return { error: `Unknown tool function: ${name}` };
  }
}
