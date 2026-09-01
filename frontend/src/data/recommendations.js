// Recommendations & future content data definitions

export const UPCOMING_RELEASES = [
  {
    id: "m_dune2",
    title: "Dune: Part Two",
    genre: "Sci-Fi / Adventure",
    releaseDate: "18 Sep 2026",
    ottPlatform: "Prime Video",
    ottPlatformId: "primevideo",
    ottColor: "#00A8E1",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    forYou: true,
    matchingGenres: ["Sci-Fi", "Action"],
    matchScore: 96,
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
  },
  {
    id: "m_gladiator2",
    title: "Gladiator II",
    genre: "Action / Epic Drama",
    releaseDate: "24 Sep 2026",
    ottPlatform: "Prime Video",
    ottPlatformId: "primevideo",
    ottColor: "#00A8E1",
    posterUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo",
    forYou: true,
    matchingGenres: ["Action", "Drama"],
    matchScore: 92,
    synopsis: "Years after witnessing the death of Maximus, Lucius enters the Colosseum to return glory to Rome."
  },
  {
    id: "m_deadpool",
    title: "Deadpool & Wolverine",
    genre: "Superhero / Action / Comedy",
    releaseDate: "12 Sep 2026",
    ottPlatform: "Disney+ / JioHotstar",
    ottPlatformId: "jiohotstar",
    ottColor: "#0C1B33",
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
    forYou: true,
    matchingGenres: ["Superhero", "Action"],
    matchScore: 94,
    synopsis: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool."
  },
  {
    id: "m_ringsofpower2",
    title: "The Rings of Power S2",
    genre: "Epic Fantasy / Adventure",
    releaseDate: "05 Sep 2026",
    ottPlatform: "Prime Video",
    ottPlatformId: "primevideo",
    ottColor: "#00A8E1",
    posterUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=TCwZDDn6190",
    forYou: true,
    matchingGenres: ["Fantasy", "Action"],
    matchScore: 91,
    synopsis: "Sauron has returned. Cast out by Galadriel, without army or ally, the rising Dark Lord must now rely on his own cunning."
  },
  {
    id: "m_squidgame2",
    title: "Squid Game: Season 2",
    genre: "Thriller / Mystery / Survival",
    releaseDate: "29 Sep 2026",
    ottPlatform: "Netflix",
    ottPlatformId: "netflix",
    ottColor: "#141414",
    posterUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=lB_v2c943L4",
    forYou: false,
    matchingGenres: ["Thriller"],
    matchScore: 84,
    synopsis: "Three years after winning Squid Game, Player 456 gave up going to the states and is back with a new resolution in his mind."
  },
  {
    id: "m_theboys4",
    title: "The Boys: Season 4",
    genre: "Action / Dark Comedy",
    releaseDate: "15 Sep 2026",
    ottPlatform: "Prime Video",
    ottPlatformId: "primevideo",
    ottColor: "#00A8E1",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=EzFXDvC-n_E",
    forYou: true,
    matchingGenres: ["Action", "Comedy"],
    matchScore: 90,
    synopsis: "Victoria Neuman is closer than ever to the Oval Office and under the muscly thumb of Homelander, who is consolidating his power."
  }
];

export const FUTURE_STRATEGIC_ACTIONS = [
  {
    id: "strat_prime_ott",
    title: "Switch Focus to Prime Video for September Blockbusters",
    badge: "Strategic Recommendation",
    badgeType: "recommend",
    reason: "Major sci-fi and action releases (Dune: Part Two & Gladiator II) are arriving on Prime Video next month, while your Netflix usage has dropped to 2 days.",
    note: "You have several movies matching your interests coming to Prime Video next month. Consider pausing Netflix. Estimated saving: ₹199.",
    ctaLabel: "Review Netflix Plan",
    targetService: "netflix",
    potentialSaving: 199
  },
  {
    id: "strat_music_overlap",
    title: "Resolve Music Streaming Overlap",
    badge: "Cost Reduction",
    badgeType: "warn",
    reason: "You are paying for both Spotify (₹119/mo) and Apple Music (₹99/mo). Spotify has 24 days active usage while Apple Music is redundant.",
    note: "Consolidate into Spotify to save ₹99/month without losing access to your favorite playlists.",
    ctaLabel: "Review Apple Music",
    targetService: "applemusic",
    potentialSaving: 99
  },
  {
    id: "strat_canva_pause",
    title: "Pause Canva Subscription",
    badge: "Leakage Alert",
    badgeType: "warn",
    reason: "Canva costs ₹500/mo but was used only 3 days this month with an expiring trial.",
    note: "Pause your Canva subscription to immediately save ₹500/mo.",
    ctaLabel: "Pause Canva",
    targetService: "canva",
    potentialSaving: 500
  }
];
