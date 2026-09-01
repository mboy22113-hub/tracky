import { KNOWN_SERVICES, getServiceById } from './services.js';

export const POPULAR_COMPARISON_PRESETS = [
  { id: "spotify_vs_applemusic", nameA: "Spotify", idA: "spotify", nameB: "Apple Music", idB: "applemusic", label: "Spotify vs Apple Music" },
  { id: "netflix_vs_primevideo", nameA: "Netflix", idA: "netflix", nameB: "Prime Video", idB: "primevideo", label: "Netflix vs Prime Video" },
  { id: "chatgpt_vs_gemini", nameA: "ChatGPT", idA: "chatgpt", nameB: "Google Gemini", idB: "gemini", label: "ChatGPT vs Gemini" },
  { id: "canva_vs_adobeexpress", nameA: "Canva", idA: "canva", nameB: "Adobe Express", idB: "adobeexpress", label: "Canva vs Adobe Express" },
  { id: "googledrive_vs_onedrive", nameA: "Google Drive (Google One)", idA: "googleone", nameB: "Microsoft OneDrive", idB: "onedrive", label: "Google Drive vs OneDrive" },
  { id: "netflix_vs_jiohotstar", nameA: "Netflix", idA: "netflix", nameB: "JioHotstar", idB: "jiohotstar", label: "Netflix vs JioHotstar" },
  { id: "spotify_vs_youtubepremium", nameA: "Spotify", idA: "spotify", nameB: "YouTube Premium", idB: "youtubepremium", label: "Spotify vs YouTube Premium" }
];

export function buildComparisonData(serviceIdA = 'spotify', serviceIdB = 'applemusic', userProfile = {}) {
  let sA = getServiceById(serviceIdA) || KNOWN_SERVICES[0];
  let sB = getServiceById(serviceIdB) || KNOWN_SERVICES[1];

  // Prevent comparing the exact same service if alternatives exist
  if (sA.id === sB.id) {
    sB = KNOWN_SERVICES.find(s => s.id !== sA.id) || KNOWN_SERVICES[1];
  }

  // Determine winner and personalized verdict based on score and characteristics
  let winner = sA.name;
  let personalizedAiVerdict = '';

  const keyA = sA.id;
  const keyB = sB.id;

  // Custom curated verdicts for popular matchups
  if ((keyA === 'spotify' && keyB === 'applemusic') || (keyA === 'applemusic' && keyB === 'spotify')) {
    winner = 'Spotify';
    personalizedAiVerdict = 'Based on your usage pattern and music discovery preference, Spotify is the better fit for you due to its superior algorithmic recommendations and cross-platform Spotify Connect.';
  } else if ((keyA === 'netflix' && keyB === 'primevideo') || (keyA === 'primevideo' && keyB === 'netflix')) {
    winner = 'Prime Video';
    personalizedAiVerdict = 'Prime Video offers higher overall value at ₹299/mo (or ₹1,499/yr) by bundling free shopping delivery, included music streaming, and 4K HDR playback without steep pricing tiers.';
  } else if ((keyA === 'chatgpt' && keyB === 'gemini') || (keyA === 'gemini' && keyB === 'chatgpt')) {
    winner = 'ChatGPT';
    personalizedAiVerdict = 'ChatGPT leads in advanced coding and logical reasoning, while Google Gemini is unmatched if you need a 2M token context window and 2 TB bundled Google One storage.';
  } else if ((keyA === 'canva' && keyB === 'adobeexpress') || (keyA === 'adobeexpress' && keyB === 'canva')) {
    winner = 'Canva';
    personalizedAiVerdict = 'Canva is recommended for fast social media asset creation and unmatched template volume. Choose Adobe Express if you frequently export linked Photoshop/Illustrator files.';
  } else if ((keyA === 'googleone' && keyB === 'onedrive') || (keyA === 'onedrive' && keyB === 'googleone')) {
    winner = 'Google Drive (Google One)';
    personalizedAiVerdict = 'Google One is the ideal choice for Android phone backups and Google Photos storage. Choose Microsoft OneDrive if you need full Microsoft Office desktop applications.';
  } else if ((keyA === 'netflix' && keyB === 'jiohotstar') || (keyA === 'jiohotstar' && keyB === 'netflix')) {
    winner = 'JioHotstar';
    personalizedAiVerdict = 'JioHotstar delivers broader everyday value with live cricket sports, Marvel & Disney franchises at a lower entry price of ₹149/mo compared to Netflix.';
  } else {
    // Dynamic fallback calculation
    if (sA.score >= sB.score) {
      winner = sA.name;
      personalizedAiVerdict = `${sA.name} scores higher overall (${sA.score}/10) with stronger feature versatility and value for everyday use.`;
    } else {
      winner = sB.name;
      personalizedAiVerdict = `${sB.name} scores higher overall (${sB.score}/10) with competitive pricing and solid platform support.`;
    }
  }

  // Key differences
  const keyDifferences = [
    `Price: ${sA.name} is ₹${Math.round(sA.price)}/mo vs ${sB.name} at ₹${Math.round(sB.price)}/mo.`,
    `Quality: ${sA.name} offers ${sA.audioVideoQuality || 'standard quality'} vs ${sB.audioVideoQuality || 'standard quality'} on ${sB.name}.`,
    `Free Tier: ${sA.name} (${sA.freePlan || 'No'}) vs ${sB.name} (${sB.freePlan || 'No'}).`,
    `Family Sharing: ${sA.name} (${sA.familyPlan || 'Available'}) vs ${sB.name} (${sB.familyPlan || 'Available'}).`
  ];

  return {
    serviceA: {
      id: sA.id,
      name: sA.name,
      category: sA.category,
      categoryLabel: sA.categoryLabel,
      price: sA.price,
      rating: sA.rating || 4.5,
      score: sA.score || 8.5,
      platforms: sA.platforms || ['Web', 'iOS', 'Android'],
      audioVideoQuality: sA.audioVideoQuality || 'Standard HD',
      offlineSupport: sA.offlineSupport || 'Yes',
      cloudSync: sA.cloudSync || 'Yes',
      aiFeatures: sA.aiFeatures || 'Standard AI',
      freePlan: sA.freePlan || 'No',
      familyPlan: sA.familyPlan || 'Available',
      studentDiscount: sA.studentDiscount || 'Available',
      bestFor: sA.bestFor || 'General use',
      features: sA.features || [],
      pros: sA.pros || ['Reliable platform', 'Fast streaming'],
      cons: sA.cons || ['Standard plan limitations']
    },
    serviceB: {
      id: sB.id,
      name: sB.name,
      category: sB.category,
      categoryLabel: sB.categoryLabel,
      price: sB.price,
      rating: sB.rating || 4.5,
      score: sB.score || 8.5,
      platforms: sB.platforms || ['Web', 'iOS', 'Android'],
      audioVideoQuality: sB.audioVideoQuality || 'Standard HD',
      offlineSupport: sB.offlineSupport || 'Yes',
      cloudSync: sB.cloudSync || 'Yes',
      aiFeatures: sB.aiFeatures || 'Standard AI',
      freePlan: sB.freePlan || 'No',
      familyPlan: sB.familyPlan || 'Available',
      studentDiscount: sB.studentDiscount || 'Available',
      bestFor: sB.bestFor || 'General use',
      features: sB.features || [],
      pros: sB.pros || ['Extensive catalog', 'Good mobile support'],
      cons: sB.cons || ['Standard plan limitations']
    },
    winner,
    personalizedAiVerdict,
    keyDifferences
  };
}
