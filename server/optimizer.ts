import { Subscription } from './types';

export function parseDays(strVal?: string | null): number {
  if (!strVal) return 999999;
  try {
    const parts = strVal.split(' ');
    const num = parseInt(parts[0], 10);
    return isNaN(num) ? 999999 : num;
  } catch {
    return 999999;
  }
}

export function getRecommendation(s: Subscription) {
  if (s.free) {
    return {
      action: "KEEP",
      severity: "keep",
      priority: 6,
      reason: "Free app — no subscription cost, nothing to optimize."
    };
  }

  const renewDays = parseDays(s.renewsIn);
  const trialDays = s.trialDaysLeft;
  const appInstalled = s.appInstalled ?? true;
  const status = s.status || "active";
  const usedDays = s.usedDays || 0;
  const price = s.price || 0;
  const redundancy = (s.redundancy || "").toLowerCase();

  // Priority 1: Free trial ending soon
  if (trialDays !== undefined && trialDays !== null) {
    return {
      action: "REVIEW",
      severity: "info",
      priority: 1,
      reason: `Trial ends in ${trialDays} day${trialDays !== 1 ? 's' : ''} — review before it converts to ₹${price}/month.`
    };
  }

  // Priority 2: Upcoming renewal + low usage
  if (status === "low" && renewDays <= 7) {
    return {
      action: "REVIEW",
      severity: "leakreview",
      priority: 2,
      reason: `Used only ${usedDays} day${usedDays !== 1 ? 's' : ''} this month and renews in ${s.renewsIn}.`
    };
  }

  // Priority 3: Ghost subscription (app not installed)
  if (appInstalled === false) {
    return {
      action: "REVIEW",
      severity: "info",
      priority: 3,
      reason: "App is not installed and the subscription may still be active."
    };
  }

  // Priority 4: High cost relative to usage (low usage generally)
  if (status === "low") {
    return {
      action: "REVIEW",
      severity: "leakreview",
      priority: 4,
      reason: `Low recent usage (${usedDays} days) relative to its ₹${price}/month cost.`
    };
  }

  // Priority 5: Possible category overlap
  if (redundancy.includes("overlap")) {
    let overlapWith = redundancy.includes("—") ? redundancy.split("—")[1].trim() : "Another subscription in this category";
    overlapWith = overlapWith.charAt(0).toUpperCase() + overlapWith.slice(1);
    return {
      action: "REVIEW",
      severity: "review",
      priority: 5,
      reason: `${overlapWith} — worth checking if you need both.`
    };
  }

  // Priority 6: Healthy keep
  return {
    action: "KEEP",
    severity: "keep",
    priority: 6,
    reason: `Used ${usedDays} days this month — good value for ₹${price}/month.`
  };
}

export function valueScoreNum(scoreStr: any): number {
  try {
    if (typeof scoreStr === 'number') return scoreStr;
    const cleaned = String(scoreStr).split("/")[0].trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 5.0 : num;
  } catch {
    return 5.0;
  }
}

export function knapsackPortfolio(items: Array<{ id: string; item: Subscription; price: number; value: number }>, budget: number) {
  const cap = Math.max(0, Math.floor(budget));
  const n = items.length;
  if (n === 0 || cap === 0) return [];

  const dp: number[] = new Array(cap + 1).fill(0);
  const keep: boolean[][] = Array.from({ length: n }, () => new Array(cap + 1).fill(false));

  for (let i = 0; i < n; i++) {
    const price = Math.min(Math.floor(items[i].price), cap);
    const val = items[i].value;
    for (let c = cap; c >= price; c--) {
      if (dp[c - price] + val > dp[c]) {
        dp[c] = dp[c - price] + val;
        keep[i][c] = true;
      }
    }
  }

  let c = cap;
  const selected: Array<{ id: string; item: Subscription; price: number; value: number }> = [];
  for (let i = n - 1; i >= 0; i--) {
    if (keep[i][c]) {
      selected.push(items[i]);
      c -= Math.min(Math.floor(items[i].price), cap);
    }
  }

  selected.reverse();
  return selected;
}

export function computeOptimization(subscriptions: Subscription[], budget: number) {
  const paid = subscriptions.filter(s => !s.free);
  const totalSpend = paid.reduce((sum, s) => sum + (s.price || 0), 0);

  const annotated = subscriptions.map(s => ({
    ...s,
    recommendationData: getRecommendation(s)
  }));

  const attention = annotated
    .filter(item => !item.free && item.recommendationData.priority <= 5)
    .sort((a, b) => a.recommendationData.priority - b.recommendationData.priority);

  const keepItems = annotated.filter(item => item.recommendationData.action === "KEEP");
  const reviewItems = annotated.filter(item => item.recommendationData.action === "REVIEW");

  const ghosts = annotated.filter(item => item.appInstalled === false);
  const trials = annotated.filter(item => item.trialDaysLeft !== undefined && item.trialDaysLeft !== null);

  // Category overlap calculation
  const categories: Record<string, Subscription[]> = {};
  for (const s of paid) {
    const cat = s.category || "others";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  }

  let overlapInfo: any = null;
  let maxCatCount = 1;
  for (const cat of Object.keys(categories)) {
    const items = categories[cat];
    if (items.length > maxCatCount) {
      maxCatCount = items.length;
      const sortedByUsage = [...items].sort((a, b) => (b.usedDays || 0) - (a.usedDays || 0));
      overlapInfo = {
        category: cat,
        items,
        top: sortedByUsage[0]
      };
    }
  }

  if (totalSpend <= budget) {
    return {
      currentMonthlySpend: totalSpend,
      budget,
      optimizedMonthlySpend: totalSpend,
      potentialReduction: 0.0,
      withinBudget: true,
      currentSubscriptionsCount: paid.length,
      optimizedSubscriptionsCount: paid.length,
      keep: keepItems,
      review: reviewItems,
      attention,
      ghosts,
      trials,
      overlap: overlapInfo,
      reasons: ["Your current portfolio already fits your budget — no changes needed."],
      valueNote: "Estimated value: comparable to your current portfolio.",
      caption: "Your current portfolio already fits your budget — no changes needed."
    };
  }

  // Prepare knapsack items
  const knapItems = paid.map(s => ({
    id: s.id,
    item: s,
    price: s.price || 0,
    value: valueScoreNum(s.valueScore || 7.0) * 10
  }));

  const selectedKnap = knapsackPortfolio(knapItems, budget);
  const selectedIds = new Set(selectedKnap.map(x => x.id));

  const recommendedPaid = paid.filter(s => selectedIds.has(s.id));
  const recSpend = recommendedPaid.reduce((sum, s) => sum + (s.price || 0), 0);
  const potentialReduction = Math.max(0.0, totalSpend - recSpend);

  const currAvgVal = paid.length > 0 ? paid.reduce((sum, s) => sum + valueScoreNum(s.valueScore || 7.0), 0) / paid.length : 0;
  const recAvgVal = recommendedPaid.length > 0 ? recommendedPaid.reduce((sum, s) => sum + valueScoreNum(s.valueScore || 7.0), 0) / recommendedPaid.length : 0;

  let valNote = "Estimated value: comparable to your current portfolio.";
  if (recAvgVal > currAvgVal + 0.1) {
    valNote = "Estimated value: higher than your current portfolio.";
  } else if (recAvgVal < currAvgVal - 0.1) {
    valNote = "Estimated value: about the same as your current portfolio.";
  }

  const reasons = [
    `You are ₹${Math.round(totalSpend - budget).toLocaleString('en-IN')} over your monthly budget.`,
    `By reviewing lower usage subscriptions, you can potentially reduce spending by ₹${Math.round(potentialReduction).toLocaleString('en-IN')}/month.`
  ];

  return {
    currentMonthlySpend: totalSpend,
    budget,
    optimizedMonthlySpend: recSpend,
    potentialReduction,
    withinBudget: false,
    currentSubscriptionsCount: paid.length,
    optimizedSubscriptionsCount: recommendedPaid.length,
    keep: keepItems,
    review: reviewItems,
    attention,
    ghosts,
    trials,
    overlap: overlapInfo,
    reasons,
    valueNote: valNote,
    caption: "This is a deterministic, budget-constrained estimate based on your usage and value scores — not a guarantee. You decide what to change."
  };
}
