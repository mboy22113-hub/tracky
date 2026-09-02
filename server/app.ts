import express from "express";
import { Subscription, UserProfile, WishlistItem } from "./types";
import { INITIAL_SUBSCRIPTIONS, INITIAL_USER, INITIAL_WISHLIST, INSIGHTS_PERIOD_DATA } from "./data";
import { compareOttServices, compareUniversalServices } from "./comparisons";
import { getUpcomingMovies, getFutureRecommendations } from "./recommendations";
import { runOpenAiOptimizer, runOpenAiAdvisorChat } from "./openai_optimizer";

// In-Memory State Store
let subscriptions: Subscription[] = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
let userProfile: UserProfile = JSON.parse(JSON.stringify(INITIAL_USER));
let wishlist: WishlistItem[] = JSON.parse(JSON.stringify(INITIAL_WISHLIST));

export function createApiApp() {
  const app = express();
  app.use(express.json());

  const router = express.Router();

  // Middleware: Prevent caching of personalized optimizer data across CDNs/browsers
  router.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });

  // Profile API
  router.get("/profile", (req, res) => {
    res.json(userProfile);
  });

  router.put("/profile", (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json(userProfile);
  });

  // Subscriptions CRUD API
  router.get("/subscriptions", (req, res) => {
    const category = req.query.category as string;
    if (category && category !== "all") {
      res.json(subscriptions.filter(s => s.category === category));
    } else {
      res.json(subscriptions);
    }
  });

  router.post("/subscriptions", (req, res) => {
    const newSub: Subscription = {
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
    const sub = subscriptions.find(s => s.id === req.params.id);
    if (!sub) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(sub);
  });

  router.put("/subscriptions/:id", (req, res) => {
    const index = subscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    subscriptions[index] = { ...subscriptions[index], ...req.body };
    res.json(subscriptions[index]);
  });

  router.delete("/subscriptions/:id", (req, res) => {
    const prevLen = subscriptions.length;
    subscriptions = subscriptions.filter(s => s.id !== req.params.id);
    if (subscriptions.length === prevLen) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json({ success: true, message: `Subscription ${req.params.id} deleted` });
  });

  // Insights API
  router.get("/insights", (req, res) => {
    const startTime = Date.now();
    try {
      const period = (req.query.period as string) || "thismonth";
      console.log(`[API /insights] Request start | Period: ${period} | UserProfile: ${Boolean(userProfile)}`);
      const data = INSIGHTS_PERIOD_DATA[period] || INSIGHTS_PERIOD_DATA.thismonth;
      const duration = Date.now() - startTime;
      console.log(`[API /insights] Success | Duration: ${duration}ms`);
      res.json(data);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[API /insights] Failure | Error: ${err?.name || "UnknownError"} | Duration: ${duration}ms`);
      res.status(500).json({ error: "Failed to load insights data" });
    }
  });

  // AI Optimizer API powered by Gemini / OpenAI / Resilient Engine
  router.post("/optimizer", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = Number(req.body.budget) || userProfile.monthlyBudget || 1000;
      const forceRefresh = Boolean(req.body.forceRefresh);
      console.log(`[API /optimizer POST] Request start | Budget: ₹${budget} | Subscriptions: ${subscriptions.length} | ForceRefresh: ${forceRefresh}`);
      
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, forceRefresh);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer POST] Success | Engine: ${result.ai_engine_used} | Savings: ₹${result.total_potential_monthly_saving} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer POST] Error: ${err?.name || "Error"} - ${err?.message || "Unknown"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to run optimizer" });
    }
  });

  router.get("/optimizer", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = userProfile.monthlyBudget || 1000;
      console.log(`[API /optimizer GET] Request start | Budget: ₹${budget} | Subscriptions: ${subscriptions.length}`);
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, false);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer GET] Success | Engine: ${result.ai_engine_used} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer GET] Error: ${err?.name || "Error"} - ${err?.message || "Unknown"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to get optimizer plan" });
    }
  });

  router.post("/optimizer/refresh", async (req, res) => {
    const startTime = Date.now();
    try {
      const budget = Number(req.body.budget) || userProfile.monthlyBudget || 1000;
      console.log(`[API /optimizer/refresh POST] Request start | Budget: ₹${budget}`);
      const result = await runOpenAiOptimizer(subscriptions, userProfile, wishlist, budget, true);
      const duration = Date.now() - startTime;
      console.log(`[API /optimizer/refresh POST] Success | Engine: ${result.ai_engine_used} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[API /optimizer/refresh POST] Error: ${err?.name || "Error"} | Duration: ${duration}ms`);
      res.status(500).json({ error: err.message || "Failed to refresh optimizer" });
    }
  });

  // Recommendations & Movies API
  router.get("/recommendations", (req, res) => {
    const startTime = Date.now();
    try {
      const wishlistIds = wishlist.map(w => w.content_id || w.id);
      console.log(`[API /recommendations] Request start | Interests: ${userProfile.movieInterests?.length || 0} | Subscriptions: ${subscriptions.length}`);
      const result = getFutureRecommendations(userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"], subscriptions, wishlistIds);
      const duration = Date.now() - startTime;
      console.log(`[API /recommendations] Success | Categories: ${Object.keys(result || {}).join(", ")} | Duration: ${duration}ms`);
      res.json(result);
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[API /recommendations] Error: ${err?.name || "Error"} | Duration: ${duration}ms`);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  router.get("/movies/upcoming", (req, res) => {
    const wishlistIds = wishlist.map(w => w.content_id || w.id);
    const result = getUpcomingMovies(userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"], wishlistIds);
    res.json(result);
  });

  // Wishlist API
  router.get("/wishlist", (req, res) => {
    res.json(wishlist);
  });

  router.post("/wishlist", (req, res) => {
    const item: WishlistItem = {
      id: req.body.id || req.body.content_id || `w_${Date.now()}`,
      content_id: req.body.content_id || req.body.id || `w_${Date.now()}`,
      title: req.body.title || "Upcoming Title",
      poster_url: req.body.poster_url || "",
      platform: req.body.platform || "",
      created_at: new Date().toISOString()
    };
    wishlist.push(item);
    res.json(item);
  });

  router.delete("/wishlist/:id", (req, res) => {
    wishlist = wishlist.filter(w => w.id !== req.params.id && w.content_id !== req.params.id);
    res.json({ success: true });
  });

  // Comparisons API
  router.post("/comparison/ott", (req, res) => {
    const platforms = req.body.platforms as string[] | undefined;
    const result = compareOttServices(platforms, subscriptions, userProfile);
    res.json(result);
  });

  router.post("/comparison/services", (req, res) => {
    const serviceA = req.body.serviceA || "spotify";
    const serviceB = req.body.serviceB || "applemusic";
    const result = compareUniversalServices(serviceA, serviceB, userProfile, subscriptions);
    res.json(result);
  });

  // Natural Language Assistant Chat API (AI Advisor Powered)
  router.post("/assistant/chat", async (req, res) => {
    try {
      const message = req.body.message || req.body.query || "";
      const answer = await runOpenAiAdvisorChat(message, subscriptions, userProfile, wishlist);
      res.json(answer);
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI response" });
    }
  });

  // Health API
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      app: "Trackey Node/TypeScript Engine",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY)
    });
  });

  // Mount router under BOTH /api and root / to support direct routing and Vercel serverless rewrites seamlessly
  app.use("/api", router);
  app.use("/", router);

  return app;
}
