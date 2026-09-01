import { Subscription, UserProfile, WishlistItem } from './types.js';
import { DEFAULT_UPCOMING_CONTENT } from './data.js';

export function getUpcomingMovies(
  userInterests: string[] = ["Superhero", "Action", "Sci-Fi"],
  wishlistIds: string[] = []
) {
  return DEFAULT_UPCOMING_CONTENT.map(item => {
    const isMatch = item.tags.some(t =>
      userInterests.includes(t) || (t === "Superhero" && userInterests.includes("Marvel / Superhero"))
    );
    const aiRec = isMatch
      ? `Matches your interest in ${item.genre}`
      : `Available on ${item.platform_name}`;

    return {
      id: item.id,
      title: item.title,
      type: item.type,
      poster_url: item.poster_url,
      release_date: item.release_date,
      platform: item.platform,
      platform_name: item.platform_name,
      genre: item.genre,
      trailer_url: item.trailer_url,
      emoji: item.emoji,
      tags: item.tags,
      inWishlist: wishlistIds.includes(item.id),
      aiRecommendation: aiRec
    };
  });
}

export function getFutureRecommendations(
  userInterests: string[],
  subscriptions: Subscription[],
  wishlistIds: string[] = []
) {
  // 1. Movies & OTT
  const currentOtt = subscriptions.filter(s => s.category === "movies" && !s.free);

  const matchingContent = DEFAULT_UPCOMING_CONTENT
    .filter(item => item.tags.some(t => userInterests.includes(t) || (t === "Superhero" && userInterests.includes("Marvel / Superhero"))))
    .map(item => ({
      ...item,
      inWishlist: wishlistIds.includes(item.id)
    }));

  let moviesRec: any;
  if (matchingContent.length === 0) {
    moviesRec = {
      category: "movies",
      title: "Movies & OTT",
      badge: "No data",
      badgeClass: "info",
      reason: "No verified upcoming content data is available right now — check back later.",
      note: "Sample content data for this prototype.",
      items: [],
      cta: null
    };
  } else {
    const byPlatform: Record<string, any[]> = {};
    for (const m of matchingContent) {
      if (!byPlatform[m.platform]) byPlatform[m.platform] = [];
      byPlatform[m.platform].push(m);
    }

    const bestPlatformId = Object.keys(byPlatform).sort((a, b) => byPlatform[b].length - byPlatform[a].length)[0];
    const bestTitles = byPlatform[bestPlatformId];
    const platformName = bestTitles[0].platform_name;
    const alreadyHas = currentOtt.some(s => s.id === bestPlatformId);
    const otherOtt = currentOtt.filter(s => s.id !== bestPlatformId);

    let badge = "Recommended";
    let badgeClass = "recommend";
    let reason = "";
    let cta: any = null;

    if (alreadyHas) {
      badge = "Already yours";
      badgeClass = "continue";
      reason = `Your interests (${userInterests.join(', ')}) match upcoming content on ${platformName} — a service you already pay for, so there's nothing new to add.`;
      cta = null;
    } else if (otherOtt.length > 0) {
      const overlapNames = otherOtt.map(s => s.name).join(" and ");
      badge = "Recommended";
      badgeClass = "recommend";
      reason = `Your interests match upcoming content on ${platformName} more closely than what's on ${overlapNames}. Based on interest match, upcoming content, and your budget, ${platformName} may be more relevant than adding another overlapping OTT service.`;
      cta = { label: `Consider ${platformName}`, action: "navigate_subs" };
    } else {
      badge = "Recommended";
      badgeClass = "recommend";
      reason = `Your interests (${userInterests.join(', ')}) match upcoming content on ${platformName}, and it isn't in your current portfolio yet.`;
      cta = { label: `Consider ${platformName}`, action: "navigate_subs" };
    }

    moviesRec = {
      category: "movies",
      title: "Movies & OTT",
      badge,
      badgeClass,
      reason,
      note: "Sample content data for this prototype — connect a licensed content API for live, verified listings.",
      items: bestTitles,
      cta
    };
  }

  // 2. Music
  const musicSubs = subscriptions.filter(s => s.category === "music" && !s.free);
  let musicRec: any;
  if (musicSubs.length === 0) {
    musicRec = {
      category: "music",
      title: "Music",
      badge: "No data",
      badgeClass: "info",
      reason: "You don't have a music subscription yet — only worth adding if it fits your budget and listening habits.",
      items: [],
      cta: null
    };
  } else {
    const topMusic = [...musicSubs].sort((a, b) => (b.usedDays || 0) - (a.usedDays || 0))[0];
    const otherMusic = musicSubs.filter(s => s.id !== topMusic.id);
    const fitItems = [{ name: topMusic.name, fit: "High fit" }];
    for (const s of otherMusic) {
      fitItems.push({ name: s.name, fit: "Lower fit" });
    }

    let reason = `You already use ${topMusic.name} frequently — used ${topMusic.usedDays || 0} days this month with an estimated value score of ${topMusic.valueScore || '8.0/10'}. Based on your current usage, switching to another music subscription may not provide enough additional value.`;
    if (otherMusic.length > 0) {
      reason += ` You already use ${topMusic.name} heavily and it overlaps with ${otherMusic.map(s => s.name).join(', ')} — reviewing the overlap may be worth more than switching services.`;
    }

    musicRec = {
      category: "music",
      title: "Music",
      badge: `Continue ${topMusic.name}`,
      badgeClass: "continue",
      reason,
      items: fitItems,
      cta: null
    };
  }

  // 3. Games
  const gameSubs = subscriptions.filter(s => s.category === "games");
  const paidGames = gameSubs.filter(s => !s.free);
  let gamesRec: any;
  if (gameSubs.length === 0) {
    gamesRec = {
      category: "games",
      title: "Games",
      badge: "No data",
      badgeClass: "info",
      reason: "No gaming subscriptions yet — not enough data to personalize a recommendation.",
      items: [],
      cta: null
    };
  } else {
    const topGame = [...gameSubs].sort((a, b) => (b.usedDays || 0) - (a.usedDays || 0))[0];
    let badge = "Info";
    let badgeClass = "info";
    let reason = "";

    if (paidGames.length > 0 && topGame.status !== "low") {
      badge = `Continue ${topGame.name}`;
      badgeClass = "continue";
      reason = `You already spend most of your gaming time on ${topGame.name} (used ${topGame.usedDays || 0} days this month). Adding another gaming subscription would likely create unnecessary overlap.`;
    } else if (paidGames.length > 0) {
      badge = `Review ${topGame.name}`;
      badgeClass = "watch";
      reason = `Recent usage on ${topGame.name} has been low. Worth reviewing that subscription before considering a new gaming service.`;
    } else {
      badge = "Info";
      badgeClass = "info";
      reason = `Your gaming time is mostly on ${topGame.name}, which is free — a paid gaming subscription isn't shown here as a personalized fit right now.`;
    }

    gamesRec = {
      category: "games",
      title: "Games",
      badge,
      badgeClass,
      reason,
      items: [{ name: topGame.name }],
      cta: null
    };
  }

  // 4. Others
  const othersSubs = subscriptions.filter(s => s.category === "others");
  let othersRec: any;
  if (othersSubs.length === 0) {
    othersRec = {
      category: "others",
      title: "Others",
      badge: "No data",
      badgeClass: "info",
      reason: "No subscriptions in this category yet.",
      items: [],
      cta: null
    };
  } else {
    const parts: string[] = [];
    for (const s of othersSubs) {
      if (s.appInstalled === false) {
        parts.push(`${s.name} is currently not installed. Review the existing subscription before considering another service in this category.`);
      } else if (s.status === "low") {
        parts.push(`${s.name} may be useful if your usage justifies its ₹${s.price || 0}/month cost — recent usage has been low (${s.usedDays || 0} days this month).`);
      } else {
        parts.push(`${s.name} is well used (${s.usedDays || 0} days this month) — good value for the ₹${s.price || 0}/month cost.`);
      }
    }

    const lowUsage = othersSubs.some(s => s.status === "low" || s.appInstalled === false);
    othersRec = {
      category: "others",
      title: "Others",
      badge: lowUsage ? "Review first" : "Well matched",
      badgeClass: lowUsage ? "watch" : "continue",
      reason: parts.join(" "),
      items: othersSubs.map(s => ({ name: s.name })),
      cta: null
    };
  }

  return {
    movies: moviesRec,
    music: musicRec,
    games: gamesRec,
    others: othersRec
  };
}
