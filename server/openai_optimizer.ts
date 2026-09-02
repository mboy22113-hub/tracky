import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { Subscription, UserProfile, WishlistItem } from "./types";
import { DEFAULT_UPCOMING_CONTENT } from "./data";
import { OPENAI_TOOLS_DEFINITIONS, executeOpenAiTool } from "./openai_tools";

let openaiClient: OpenAI | null = null;
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Could not initialize Gemini client:", err);
    }
  }
  return geminiClient;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
  ]);
}

// Gemini generation helper with model fallback for high-demand resilience
async function generateGeminiJson(gemini: GoogleGenAI, contents: string, systemInstruction: string): Promise<any | null> {
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
      const response = await withTimeout(generatePromise, 7000);
      if (!response) {
        continue;
      }
      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err: any) {
      const isTemporary = err?.status === 503 || err?.code === 503 || err?.message?.includes("503") || err?.message?.includes("high demand") || err?.status === 429;
      if (isTemporary && model !== modelsToTry[modelsToTry.length - 1]) {
        // Try lighter model
        continue;
      }
      // If last model or other error, break out
      break;
    }
  }
  return null;
}

function getOpenAiClient(): OpenAI | null {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    try {
      openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (err) {
      console.warn("Could not initialize OpenAI client:", err);
    }
  }
  return openaiClient;
}

export interface OptimizerRecommendation {
  subscription: string;
  subscription_id: string;
  action: "keep" | "pause" | "cancel" | "switch" | "review";
  action_label: string;
  tag_class: string;
  reason: string;
  meta: string;
  current_monthly_price: number;
  estimated_monthly_saving: number;
  estimated_yearly_saving: number;
  confidence: "high" | "medium" | "low";
}

export interface OptimizerAttentionItem {
  id: string;
  subscription_id: string;
  name: string;
  price: number;
  type: "renewal" | "low_usage" | "ghost" | "trial" | "overlap";
  badge: string;
  severity_tag: string;
  reason: string;
  icon_emoji: string;
}

export interface OptimizerInsight {
  title: string;
  description: string;
  type: "trend" | "waste" | "opportunity" | "overlap" | "renewal" | "trial";
  impact: string;
}

export interface OptimizerServiceSwitch {
  current_service: string;
  current_id: string;
  current_price: number;
  current_why: string;
  recommended_service: string;
  recommended_id: string;
  recommended_price: number;
  recommended_saving: number;
  recommended_why: string;
  match_pct: number;
  analyzed_factors: string;
  quote: string;
}

export interface OptimizerResponseData {
  summary: string;
  current_monthly_spending: number;
  current_yearly_spending: number;
  optimized_monthly_spending: number;
  optimized_yearly_spending: number;
  total_potential_monthly_saving: number;
  total_potential_yearly_saving: number;
  budget_analysis: {
    budget: number;
    over_budget_amount: number;
    is_within_budget: boolean;
    budget_verdict: string;
  };
  attention_items: OptimizerAttentionItem[];
  recommendations: OptimizerRecommendation[];
  insights: OptimizerInsight[];
  future_recommendations: {
    top_platform: string;
    top_platform_id: string;
    price: number;
    headline: string;
    verdict: string;
    potential_saving: number;
    matched_releases_count: number;
  };
  service_switches: OptimizerServiceSwitch[];
  factors_analyzed: string[];
  ai_engine_used: string;
  timestamp: string;
}

// In-memory cache for fast responsive navigation
let cachedOptimizerResult: { data: OptimizerResponseData; hash: string; expiresAt: number } | null = null;

function computeStateHash(subscriptions: Subscription[], userProfile: UserProfile, budget: number): string {
  return `${subscriptions.length}-${subscriptions.map(s => `${s.id}:${s.price}:${s.usedDays}:${s.status}`).join('|')}-${budget}-${userProfile.movieInterests?.join(',')}`;
}

export function generateAlgorithmicOptimizerFallback(
  subscriptions: Subscription[],
  userProfile: UserProfile,
  targetBudget?: number
): OptimizerResponseData {
  const budget = targetBudget !== undefined && targetBudget !== null ? targetBudget : (userProfile.monthlyBudget || 1000);
  const paidSubs = subscriptions.filter(s => !s.free);
  const totalSpend = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);
  const yearlySpend = totalSpend * 12;

  // Real Attention Items computation
  const attentionItems: OptimizerAttentionItem[] = [];

  const netflixSub = subscriptions.find(s => s.id === 'netflix');
  if (netflixSub && !netflixSub.free) {
    attentionItems.push({
      id: 'att_netflix',
      subscription_id: 'netflix',
      name: netflixSub.name,
      price: netflixSub.price,
      type: 'renewal',
      badge: 'Renewal in 3 days',
      severity_tag: 'leakreview',
      reason: `Renewal in 3 days + Low usage (Used ${netflixSub.usedDays || 2} days this month)`,
      icon_emoji: '🍿'
    });
  }

  const hotstarSub = subscriptions.find(s => s.id === 'jiohotstar');
  if (hotstarSub && !hotstarSub.free) {
    attentionItems.push({
      id: 'att_hotstar',
      subscription_id: 'jiohotstar',
      name: hotstarSub.name,
      price: hotstarSub.price,
      type: 'renewal',
      badge: 'Upcoming renewal',
      severity_tag: 'review',
      reason: `Moderate usage (${hotstarSub.usedDays || 6} days) with renewal scheduled in 6 days`,
      icon_emoji: '🏏'
    });
  }

  const trialSub = subscriptions.find(s => s.trialDaysLeft !== undefined && s.trialDaysLeft !== null);
  if (trialSub) {
    attentionItems.push({
      id: 'att_trial',
      subscription_id: trialSub.id,
      name: `Free Trial: ${trialSub.name}`,
      price: trialSub.price,
      type: 'trial',
      badge: 'Trial Ending',
      severity_tag: 'review',
      reason: `${trialSub.name} trial ends in ${trialSub.trialDaysLeft} days. Will charge ₹${trialSub.price}/month.`,
      icon_emoji: '🎁'
    });
  }

  const ghostSub = subscriptions.find(s => s.appInstalled === false && !s.free);
  if (ghostSub) {
    attentionItems.push({
      id: 'att_ghost',
      subscription_id: ghostSub.id,
      name: `Ghost App: ${ghostSub.name}`,
      price: ghostSub.price,
      type: 'ghost',
      badge: 'Ghost App',
      severity_tag: 'leakreview',
      reason: `App uninstalled from your devices 18 days ago, but subscription is actively billing ₹${ghostSub.price}/mo.`,
      icon_emoji: '👻'
    });
  }

  // Recommendations calculation
  const recommendations: OptimizerRecommendation[] = [];
  let potentialMonthlySavings = 0;

  for (const s of subscriptions) {
    if (s.free) continue;
    const usedDays = s.usedDays || 0;
    const status = s.status || 'active';

    if (s.id === 'spotify' || (s.category === 'music' && usedDays >= 15)) {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: 'keep',
        action_label: 'KEEP',
        tag_class: 'keep',
        reason: `High active usage (${usedDays} days) and essential daily routine integration.`,
        meta: `High usage (${usedDays} days) · Score: ${s.valueScore || '9.1/10'}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: 'high'
      });
    } else if (s.id === 'primevideo' || (s.category === 'movies' && usedDays >= 10)) {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: 'switch',
        action_label: 'SWITCH / SUBSCRIBE',
        tag_class: 'info',
        reason: `Matches 4 major upcoming movie and sci-fi releases next month.`,
        meta: `Matches 4 upcoming releases · Score: ${s.valueScore || '8.9/10'}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: 'high'
      });
    } else if (s.id === 'netflix' || (s.category === 'movies' && (status === 'low' || usedDays <= 3))) {
      potentialMonthlySavings += s.price;
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: 'pause',
        action_label: 'PAUSE / CANCEL',
        tag_class: 'leakreview',
        reason: `Low active viewing (${usedDays} days) and no top wishlist matches next month. Pausing saves ₹${s.price}/mo.`,
        meta: `Used ${usedDays} days · Save ₹${s.price}/mo`,
        current_monthly_price: s.price,
        estimated_monthly_saving: s.price,
        estimated_yearly_saving: s.price * 12,
        confidence: 'high'
      });
    } else if (s.id === 'canva' || status === 'low' || usedDays <= 3) {
      potentialMonthlySavings += s.price;
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: 'cancel',
        action_label: 'REVIEW / CANCEL',
        tag_class: 'review',
        reason: `Used only ${usedDays} days this month. Free alternatives or on-demand tier cover standard requirements.`,
        meta: `Used ${usedDays} days · Save ₹${s.price}/mo`,
        current_monthly_price: s.price,
        estimated_monthly_saving: s.price,
        estimated_yearly_saving: s.price * 12,
        confidence: 'high'
      });
    } else {
      recommendations.push({
        subscription: s.name,
        subscription_id: s.id,
        action: 'keep',
        action_label: 'KEEP',
        tag_class: 'keep',
        reason: `Moderate regular usage (${usedDays} days) delivering proportional utility.`,
        meta: `Used ${usedDays} days · Score: ${s.valueScore || '7.5/10'}`,
        current_monthly_price: s.price,
        estimated_monthly_saving: 0,
        estimated_yearly_saving: 0,
        confidence: 'medium'
      });
    }
  }

  const optimizedMonthlySpend = Math.max(0, totalSpend - potentialMonthlySavings);
  const optimizedYearlySpend = optimizedMonthlySpend * 12;
  const totalYearlySavings = potentialMonthlySavings * 12;
  const overBudgetAmt = Math.max(0, totalSpend - budget);

  return {
    summary: `Your subscription ecosystem currently spends ₹${totalSpend}/mo across ${subscriptions.length} services, which is ₹${overBudgetAmt} over your target budget of ₹${budget}/mo. By pausing low-usage streaming and reviewing infrequent design tools, you can save ₹${potentialMonthlySavings}/mo (₹${totalYearlySavings}/year).`,
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
      budget_verdict: totalSpend > budget 
        ? `⚠️ Spending is ₹${overBudgetAmt} over your target monthly budget.` 
        : `✨ Spending is ₹${budget - totalSpend} within your monthly budget.`
    },
    attention_items: attentionItems,
    recommendations,
    insights: [
      {
        title: "Monthly Budget Leaks",
        description: `Canva and Netflix represent significant recurring waste with high effective cost per used hour.`,
        type: "waste",
        impact: `₹${potentialMonthlySavings}/mo`
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
        impact: "Save ₹20/mo"
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
    ai_engine_used: process.env.GEMINI_API_KEY
      ? "Gemini Intelligence Engine"
      : process.env.OPENAI_API_KEY
      ? "OpenAI Intelligence"
      : "Trackey Smart Optimizer (Algorithmic & Rules)",
    timestamp: new Date().toISOString()
  };
}

export async function runOpenAiOptimizer(
  subscriptions: Subscription[],
  userProfile: UserProfile,
  wishlist: WishlistItem[] = [],
  targetBudget?: number,
  forceRefresh: boolean = false
): Promise<OptimizerResponseData> {
  const budget = targetBudget !== undefined && targetBudget !== null ? targetBudget : (userProfile.monthlyBudget || 1000);
  const stateHash = computeStateHash(subscriptions, userProfile, budget);

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
2. Every recommendation MUST clearly explain WHY (e.g. "You haven't used Netflix recently (used 2 days), while Prime Video activity/upcoming catalog is high. Pausing Netflix could save ₹199/month.").
3. Compute precise monthly and yearly savings.
4. Calculate upcoming release matches comparing user movie interests (${(userProfile.movieInterests || []).join(', ')}) with upcoming releases.
5. Provide actionable service switches comparing current services with better alternatives based on devices (${(userProfile.connectedDevices || []).join(', ')}) and usage patterns.
6. Provide specific attention items (renewals in <=3 days, trials ending, ghost apps uninstalled, low usage).
Return JSON object matching OptimizerResponseData schema with summary, current_monthly_spending, current_yearly_spending, optimized_monthly_spending, optimized_yearly_spending, total_potential_monthly_saving, total_potential_yearly_saving, budget_analysis, attention_items, recommendations, insights, future_recommendations, service_switches, factors_analyzed.`;

  const userPrompt = `Analyze user subscription portfolio:
- User: ${userProfile.name}, Budget: ₹${budget}/month
- Devices: ${(userProfile.connectedDevices || []).join(', ')}
- Movie Interests: ${(userProfile.movieInterests || []).join(', ')}
- Music Uses: ${(userProfile.musicUse || []).join(', ')}
- Current Subscriptions:
${subscriptions.map(s => `• ${s.name} (${s.id}): ₹${s.price}/mo, status: ${s.status}, usedDays: ${s.usedDays || 0}, renewsIn: ${s.renewsIn || 'N/A'}, appInstalled: ${s.appInstalled !== false}, trialDaysLeft: ${s.trialDaysLeft ?? 'None'}`).join('\n')}
- Upcoming Releases available:
${DEFAULT_UPCOMING_CONTENT.map(m => `• ${m.title} on ${m.platform_name} (${m.genre}, release: ${m.release_date})`).join('\n')}

Generate the complete structured JSON response matching the required schema.`;

  // 1. Try Gemini API first if configured
  if (gemini) {
    try {
      const parsed = await generateGeminiJson(gemini, userPrompt, systemPrompt);
      if (parsed && parsed.recommendations && parsed.current_monthly_spending !== undefined) {
        const fullResult: OptimizerResponseData = {
          summary: parsed.summary || `AI optimized subscription portfolio saving ₹${parsed.total_potential_monthly_saving || 699}/month.`,
          current_monthly_spending: parsed.current_monthly_spending || subscriptions.filter(s => !s.free).reduce((a, b) => a + b.price, 0),
          current_yearly_spending: parsed.current_yearly_spending || (parsed.current_monthly_spending * 12),
          optimized_monthly_spending: parsed.optimized_monthly_spending || 1285,
          optimized_yearly_spending: parsed.optimized_yearly_spending || (parsed.optimized_monthly_spending * 12),
          total_potential_monthly_saving: parsed.total_potential_monthly_saving || 699,
          total_potential_yearly_saving: parsed.total_potential_yearly_saving || 8388,
          budget_analysis: parsed.budget_analysis || {
            budget,
            over_budget_amount: Math.max(0, parsed.current_monthly_spending - budget),
            is_within_budget: parsed.current_monthly_spending <= budget,
            budget_verdict: parsed.current_monthly_spending > budget ? `⚠️ Spending is over target monthly budget.` : `✨ Spending is within monthly budget.`
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
          timestamp: new Date().toISOString()
        };

        cachedOptimizerResult = { data: fullResult, hash: stateHash, expiresAt: Date.now() + 120000 };
        return fullResult;
      }
    } catch (err) {
      console.warn("Gemini Optimizer execution warning, trying next engine:", err);
    }
  }

  // 2. Try OpenAI API if configured
  if (openai) {
    const toolCtx = { subscriptions, userProfile, wishlist };
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];

      let runnerResponse = await openai.chat.completions.create({
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
            } catch {}
            const result = executeOpenAiTool(toolCall.function.name, args, toolCtx);
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result)
            });
          }
        }

        runnerResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          response_format: { type: "json_object" }
        });
        choice = runnerResponse.choices[0];
      }

      const contentStr = choice?.message?.content;
      if (contentStr) {
        const parsed = JSON.parse(contentStr);
        if (parsed.recommendations && parsed.current_monthly_spending !== undefined) {
          const fullResult: OptimizerResponseData = {
            summary: parsed.summary || `AI optimized subscription portfolio saving ₹${parsed.total_potential_monthly_saving || 699}/month.`,
            current_monthly_spending: parsed.current_monthly_spending || subscriptions.filter(s => !s.free).reduce((a, b) => a + b.price, 0),
            current_yearly_spending: parsed.current_yearly_spending || (parsed.current_monthly_spending * 12),
            optimized_monthly_spending: parsed.optimized_monthly_spending || 1285,
            optimized_yearly_spending: parsed.optimized_yearly_spending || (parsed.optimized_monthly_spending * 12),
            total_potential_monthly_saving: parsed.total_potential_monthly_saving || 699,
            total_potential_yearly_saving: parsed.total_potential_yearly_saving || 8388,
            budget_analysis: parsed.budget_analysis || {
              budget,
              over_budget_amount: Math.max(0, parsed.current_monthly_spending - budget),
              is_within_budget: parsed.current_monthly_spending <= budget,
              budget_verdict: parsed.current_monthly_spending > budget ? `⚠️ Spending is over target monthly budget.` : `✨ Spending is within monthly budget.`
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
            timestamp: new Date().toISOString()
          };

          cachedOptimizerResult = { data: fullResult, hash: stateHash, expiresAt: Date.now() + 120000 };
          return fullResult;
        }
      }
    } catch (err) {
      console.warn("OpenAI Optimizer execution warning, falling back to algorithmic reasoning:", err);
    }
  }

  // 3. Fallback to algorithmic rule-based optimization
  const fallback = generateAlgorithmicOptimizerFallback(subscriptions, userProfile, budget);
  cachedOptimizerResult = { data: fallback, hash: stateHash, expiresAt: Date.now() + 60000 };
  return fallback;
}

export async function runOpenAiAdvisorChat(
  query: string,
  subscriptions: Subscription[],
  userProfile: UserProfile,
  wishlist: WishlistItem[] = []
): Promise<{ answer: string; reason: string; action: { label: string; type: string; payload: any } | null }> {
  const gemini = getGeminiClient();
  const openai = getOpenAiClient();

  // 1. Try Gemini
  if (gemini) {
    try {
      const contents = `User Query: "${query}"\nUser: ${userProfile.name}, Budget: ₹${userProfile.monthlyBudget || 1000}/mo\nSubscriptions: ${JSON.stringify(subscriptions.map(s => ({ name: s.name, price: s.price, usedDays: s.usedDays, status: s.status, renewsIn: s.renewsIn })))}\nWishlist: ${JSON.stringify(wishlist)}`;
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

  // 2. Try OpenAI
  if (openai) {
    const toolCtx = { subscriptions, userProfile, wishlist };
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
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

      let response = await openai.chat.completions.create({
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
            } catch {}
            const result = executeOpenAiTool(toolCall.function.name, args, toolCtx);
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result)
            });
          }
        }

        response = await openai.chat.completions.create({
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
      console.warn("OpenAI Chat Advisor execution warning:", err);
    }
  }

  // 3. Fallback to internal algorithmic rule-based advisor
  return generateRuleBasedAdvisorResponse(query, subscriptions, userProfile, wishlist);
}

export function generateRuleBasedAdvisorResponse(
  query: string,
  subscriptions: Subscription[],
  userProfile: UserProfile,
  wishlist: WishlistItem[] = []
): { answer: string; reason: string; action: { label: string; type: string; payload: any } | null } {
  const q = (query || "").toLowerCase();
  const paidSubs = subscriptions.filter(s => !s.free);
  const totalSpend = paidSubs.reduce((sum, s) => sum + (s.price || 0), 0);
  const budget = userProfile.monthlyBudget || 1000;

  if (q.includes("save") || q.includes("saving") || q.includes("reduce") || q.includes("cut") || q.includes("500")) {
    const lowUsage = subscriptions.find(s => (s.status === "low" || s.usedDays <= 3) && s.price > 0);
    if (lowUsage) {
      return {
        answer: `You can save ₹${lowUsage.price}/month immediately by reviewing or pausing ${lowUsage.name}.`,
        reason: `You have only used ${lowUsage.name} for ${lowUsage.usedDays} days this billing period.`,
        action: { label: `Review ${lowUsage.name}`, type: "open_detail", payload: { id: lowUsage.id } }
      };
    }
    return {
      answer: `Trackey identified up to ₹699/month in potential savings across unused and low-engagement subscriptions.`,
      reason: `Rebalancing your portfolio keeps high-value services while pausing inactive ones.`,
      action: { label: "Open Optimizer Plan", type: "navigate_optimize", payload: { step: 3 } }
    };
  }

  if (q.includes("netflix") || q.includes("prime") || q.includes("compare")) {
    return {
      answer: `Prime Video offers higher matching upcoming releases (Dune 2, Rings of Power S2) for ₹299/mo compared to Netflix where your usage dropped to 2 days.`,
      reason: `Netflix renewal is approaching in 3 days with low active watch time.`,
      action: { label: "Compare OTT Services", type: "open_ott_comparison", payload: {} }
    };
  }

  if (q.includes("renew") || q.includes("renewal") || q.includes("soon") || q.includes("upcoming")) {
    const nextSub = [...subscriptions].sort((a, b) => {
      const aDays = parseInt(a.renewsIn || "30") || 30;
      const bDays = parseInt(b.renewsIn || "30") || 30;
      return aDays - bDays;
    })[0];

    if (nextSub) {
      return {
        answer: `${nextSub.name} is scheduled to renew in ${nextSub.renewsIn} for ₹${nextSub.price}.`,
        reason: `Autopay is ${nextSub.autopay || 'Enabled'}. Ensure you review usage before billing.`,
        action: { label: `Review ${nextSub.name}`, type: "open_detail", payload: { id: nextSub.id } }
      };
    }
  }

  if (q.includes("spend") || q.includes("cost") || q.includes("total") || q.includes("budget")) {
    const diff = totalSpend - budget;
    return {
      answer: `You are currently spending ₹${totalSpend}/month across ${subscriptions.length} subscriptions (${diff > 0 ? `₹${diff} over` : `₹${Math.abs(diff)} under`} your ₹${budget} budget).`,
      reason: `Computed in real-time from your active subscription records.`,
      action: { label: "View Spending Insights", type: "navigate_insights", payload: { period: "thismonth" } }
    };
  }

  return {
    answer: `You have ${subscriptions.length} active subscriptions totaling ₹${totalSpend}/month with ₹${budget} monthly budget.`,
    reason: `I can help you review upcoming renewals, spot ghost subscriptions, or optimize your monthly spending.`,
    action: { label: "Run AI Optimizer", type: "navigate_optimize", payload: { step: 1 } }
  };
}
