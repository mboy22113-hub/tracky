import { Subscription, UserProfile } from './types';

export const OTT_PLATFORM_CATALOG: Record<string, any> = {
  netflix: {
    id: "netflix",
    name: "Netflix",
    monthlyPrice: 199.0,
    defaultWatchHours: 14.0,
    upcomingReleasesCount: 24,
    contentTypes: ["Global movies", "Series", "Documentaries", "Anime"],
    quality: "4K Ultra HD (on premium)",
    baseScore: 7.5
  },
  primevideo: {
    id: "primevideo",
    name: "Prime Video",
    monthlyPrice: 299.0,
    defaultWatchHours: 28.0,
    upcomingReleasesCount: 19,
    contentTypes: ["Action", "Superhero", "Regional movies", "Amazon Originals"],
    quality: "4K Ultra HD + HDR",
    baseScore: 8.4
  },
  jiohotstar: {
    id: "jiohotstar",
    name: "JioHotstar",
    monthlyPrice: 149.0,
    defaultWatchHours: 18.0,
    upcomingReleasesCount: 16,
    contentTypes: ["Live Sports", "Cricket", "Disney+", "Indian TV serials"],
    quality: "Full HD / 4K",
    baseScore: 7.8
  },
  appletv: {
    id: "appletv",
    name: "Apple TV+",
    monthlyPrice: 99.0,
    defaultWatchHours: 8.0,
    upcomingReleasesCount: 10,
    contentTypes: ["Prestige Drama", "Sci-Fi", "Award-winning Originals"],
    quality: "4K Dolby Vision + Atmos",
    baseScore: 7.9
  },
  disney: {
    id: "disney",
    name: "Disney+",
    monthlyPrice: 299.0,
    defaultWatchHours: 15.0,
    upcomingReleasesCount: 14,
    contentTypes: ["Marvel", "Star Wars", "Pixar", "Animation"],
    quality: "4K Ultra HD",
    baseScore: 8.0
  }
};

export const UNIVERSAL_SERVICES_CATALOG: Record<string, any> = {
  spotify: {
    id: "spotify",
    name: "Spotify",
    category: "music",
    monthlyPrice: 119,
    freePlan: "Yes (Ad-supported)",
    audioQuality: "320 kbps High Quality",
    podcasts: "Extensive catalog & Video Podcasts",
    offlineListening: "Yes (up to 10k songs)",
    musicDiscovery: "Industry-leading Discover Weekly & AI DJ",
    familyPlan: "₹179/month (up to 6 accounts)",
    studentDiscount: "₹59/month",
    supportedPlatforms: "iOS, Android, Web, Mac, Windows, TVs, Game consoles",
    bestFor: "Daily streaming, podcasts, algorithmic music discovery",
    rating: "4.7 / 5"
  },
  applemusic: {
    id: "applemusic",
    name: "Apple Music",
    category: "music",
    monthlyPrice: 99,
    freePlan: "No free tier (1-month trial)",
    audioQuality: "Lossless (24-bit/192kHz) & Spatial Audio Dolby Atmos",
    podcasts: "Separate Apple Podcasts app",
    offlineListening: "Yes (up to 100k songs in library)",
    musicDiscovery: "Curated editorial radio & playlists",
    familyPlan: "₹149/month (up to 6 accounts)",
    studentDiscount: "₹59/month",
    supportedPlatforms: "iOS, Android, Mac, Windows, Apple Watch, HomePod",
    bestFor: "Audiophiles, Apple ecosystem users, high-fidelity lossless",
    rating: "4.6 / 5"
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "ai",
    monthlyPrice: 1650,
    freePlan: "Yes (GPT-4o mini & limited GPT-4o)",
    aiModels: "GPT-4o, OpenAI o1, Canvas, DALL-E 3",
    features: "Advanced Voice, Custom GPTs, Web browsing, Code Interpreter",
    cloudSync: "Real-time sync across web & mobile apps",
    bestFor: "General reasoning, coding, writing, conversational voice AI",
    rating: "4.8 / 5"
  },
  gemini: {
    id: "gemini",
    name: "Gemini Advanced",
    category: "ai",
    monthlyPrice: 1950,
    freePlan: "Yes (Gemini Flash)",
    aiModels: "Gemini 1.5 Pro, 2.0 Flash, 2M context window",
    features: "Google Workspace integration (Docs, Gmail), Python code execution, Deep Research",
    cloudSync: "2TB Google One Cloud storage included in plan",
    bestFor: "Large document analysis (2M tokens), Google Workspace workflows, bundled cloud storage",
    rating: "4.7 / 5"
  },
  canva: {
    id: "canva",
    name: "Canva Pro",
    category: "design",
    monthlyPrice: 500,
    freePlan: "Yes (Generous free design templates)",
    features: "100M+ stock photos, Magic Studio AI, Brand Kit, 1-click resize",
    cloudSync: "1TB cloud storage",
    bestFor: "Social media graphics, presentations, non-designers, fast templates",
    rating: "4.8 / 5"
  },
  adobeexpress: {
    id: "adobeexpress",
    name: "Adobe Express Premium",
    category: "design",
    monthlyPrice: 800,
    freePlan: "Yes (Basic assets)",
    features: "Adobe Firefly Generative AI, Photoshop & Illustrator interoperability, Adobe Fonts",
    cloudSync: "100GB cloud storage",
    bestFor: "Designers needing Creative Cloud workflows and high-end Firefly generative tools",
    rating: "4.5 / 5"
  },
  googledrive: {
    id: "googledrive",
    name: "Google One (Drive)",
    category: "cloud",
    monthlyPrice: 130,
    freePlan: "15 GB free with Google Account",
    storageAmount: "100 GB (expandable to 2TB+)",
    cloudSync: "Seamless Android backups, Google Photos, Gmail, Docs",
    sharing: "Link sharing with granular view/edit/comment permissions",
    platforms: "Android, iOS, Web, Windows, Mac",
    bestFor: "Android users, Google Workspace collaboration, photo backups",
    rating: "4.8 / 5"
  },
  onedrive: {
    id: "onedrive",
    name: "Microsoft OneDrive (365)",
    category: "cloud",
    monthlyPrice: 140,
    freePlan: "5 GB free with Microsoft Account",
    storageAmount: "100 GB (or 1TB with Microsoft 365 Personal at ₹489/mo)",
    cloudSync: "Native Windows explorer sync, Office document co-authoring",
    sharing: "Password protected & expiring links (on paid tiers)",
    platforms: "Windows, Mac, iOS, Android, Web",
    bestFor: "Windows users, Word/Excel/PowerPoint heavy workflows",
    rating: "4.5 / 5"
  }
};

export function compareOttServices(
  platforms: string[] | undefined,
  subscriptions: Subscription[],
  userProfile: UserProfile
) {
  const targetPlatforms = platforms && platforms.length > 0
    ? platforms
    : ["netflix", "primevideo", "jiohotstar", "appletv", "disney"];

  const subMap = new Map(subscriptions.map(s => [s.id, s]));
  const results: any[] = [];
  const movieInterests = userProfile.movieInterests || ["Superhero", "Action", "Sci-Fi"];

  for (const pid of targetPlatforms) {
    const catItem = OTT_PLATFORM_CATALOG[pid];
    if (!catItem) continue;

    const curr = subMap.get(pid);
    let watchHrs = curr ? (curr.usedDays || 0) * 1.5 : catItem.defaultWatchHours;
    if (watchHrs <= 0) watchHrs = 2.0;

    const price = curr ? curr.price : catItem.monthlyPrice;
    const costPerHr = Math.round((price / watchHrs) * 100) / 100;

    const interestMatchCount = (catItem.contentTypes as string[]).filter(c =>
      movieInterests.some(i => c.toLowerCase().includes(i.toLowerCase()))
    ).length;

    let valueScore = Math.round((catItem.baseScore + (interestMatchCount * 0.4) - Math.min(2.0, costPerHr / 20.0)) * 10) / 10;
    valueScore = Math.max(3.0, Math.min(9.9, valueScore));

    results.push({
      id: pid,
      name: catItem.name,
      monthlyPrice: price,
      watchHoursMonth: Math.round(watchHrs * 10) / 10,
      costPerHour: costPerHr,
      upcomingReleasesCount: catItem.upcomingReleasesCount,
      valueScore,
      currentSubscriber: curr !== undefined
    });
  }

  results.sort((a, b) => b.valueScore - a.valueScore);
  const winner = results[0]?.name || "Prime Video";
  const score = results[0]?.valueScore || 8.4;

  const aiVerdict = `Based on your profile interests (${movieInterests.join(', ')}) and cost efficiency, ${winner} delivers the highest estimated value score (${score}/10) at ₹${results[0]?.costPerHour}/hour watched.`;

  return {
    comparison: results,
    winner,
    score,
    recommendation: `Prioritize ${winner} for primary entertainment.`,
    aiVerdict
  };
}

export function compareUniversalServices(
  serviceAKey: string = "spotify",
  serviceBKey: string = "applemusic",
  userProfile: UserProfile,
  subscriptions: Subscription[]
) {
  const cleanA = (serviceAKey || "spotify").toLowerCase().replace(/[\s+-]/g, '');
  const cleanB = (serviceBKey || "applemusic").toLowerCase().replace(/[\s+-]/g, '');

  const itemA = UNIVERSAL_SERVICES_CATALOG[cleanA];
  const itemB = UNIVERSAL_SERVICES_CATALOG[cleanB];

  if (!itemA || !itemB) {
    return {
      category: "services",
      serviceA: { name: serviceAKey, monthlyPrice: "Varies" },
      serviceB: { name: serviceBKey, monthlyPrice: "Varies" },
      comparisonFields: [
        { label: "Monthly Price", a: "Standard Tier", b: "Standard Tier" },
        { label: "Best For", a: `Users seeking ${serviceAKey} ecosystem`, b: `Users seeking ${serviceBKey} ecosystem` }
      ],
      winner: serviceAKey,
      personalizedAiVerdict: `Based on your current subscriptions, ${serviceAKey} fits your current workflow.`
    };
  }

  const category = itemA.category || "general";
  let fields: any[] = [];

  if (category === "music") {
    fields = [
      { label: "Monthly Price", a: `₹${itemA.monthlyPrice}`, b: `₹${itemB.monthlyPrice}` },
      { label: "Audio Quality", a: itemA.audioQuality, b: itemB.audioQuality },
      { label: "Podcasts & Shows", a: itemA.podcasts, b: itemB.podcasts },
      { label: "Offline Support", a: itemA.offlineListening, b: itemB.offlineListening },
      { label: "Music Discovery", a: itemA.musicDiscovery, b: itemB.musicDiscovery },
      { label: "Family Plan", a: itemA.familyPlan, b: itemB.familyPlan },
      { label: "Student Discount", a: itemA.studentDiscount, b: itemB.studentDiscount },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "cloud") {
    fields = [
      { label: "Monthly Price", a: `₹${itemA.monthlyPrice}`, b: `₹${itemB.monthlyPrice}` },
      { label: "Free Tier", a: itemA.freePlan, b: itemB.freePlan },
      { label: "Storage Amount", a: itemA.storageAmount, b: itemB.storageAmount },
      { label: "Cloud Sync", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Sharing Permissions", a: itemA.sharing, b: itemB.sharing },
      { label: "Supported Platforms", a: itemA.platforms, b: itemB.platforms },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "ai") {
    fields = [
      { label: "Monthly Price", a: `₹${itemA.monthlyPrice}`, b: `₹${itemB.monthlyPrice}` },
      { label: "Free Plan", a: itemA.freePlan, b: itemB.freePlan },
      { label: "AI Models", a: itemA.aiModels, b: itemB.aiModels },
      { label: "Key Features", a: itemA.features, b: itemB.features },
      { label: "Cloud Storage Included", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  } else if (category === "design") {
    fields = [
      { label: "Monthly Price", a: `₹${itemA.monthlyPrice}`, b: `₹${itemB.monthlyPrice}` },
      { label: "Free Plan", a: itemA.freePlan, b: itemB.freePlan },
      { label: "Features & Stock Assets", a: itemA.features, b: itemB.features },
      { label: "Cloud Storage", a: itemA.cloudSync, b: itemB.cloudSync },
      { label: "Best For", a: itemA.bestFor, b: itemB.bestFor },
      { label: "User Rating", a: itemA.rating, b: itemB.rating }
    ];
  }

  const subIds = new Set(subscriptions.map(s => s.id));
  const hasA = subIds.has(cleanA) || subscriptions.some(s => s.name.toLowerCase().includes(cleanA));
  const musicUse = userProfile.musicUse || [];

  let winner = itemA.name;
  let aiVerdict = "";

  if (category === "music") {
    if (musicUse.includes("Podcasts") || hasA) {
      winner = itemA.name;
      aiVerdict = `${winner} is recommended for you because your current usage is active and you regularly listen to podcasts and playlists.`;
    } else {
      winner = itemB.name;
      aiVerdict = `${winner} is recommended for you if you value lossless spatial audio and high-fidelity tracks.`;
    }
  } else if (category === "cloud") {
    winner = itemA.name;
    aiVerdict = `${winner} is recommended for you as it offers effortless photo sync, generous pricing (₹${itemA.monthlyPrice}/mo), and seamless backup.`;
  } else {
    winner = itemA.name;
    aiVerdict = `Based on your profile preferences and budget, ${winner} offers the most balanced feature set for your daily routine.`;
  }

  return {
    category,
    serviceA: itemA,
    serviceB: itemB,
    comparisonFields: fields,
    winner,
    personalizedAiVerdict: aiVerdict
  };
}
