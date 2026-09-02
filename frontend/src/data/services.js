// Master catalog of known services and their rich specifications for subscription tracking & detailed comparisons

export const KNOWN_SERVICES = [
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    categoryLabel: "Music",
    price: 119,
    rating: 4.8,
    score: 9.3,
    plans: [
      { name: "Individual", price: 119, quality: "320kbps", screens: 1 },
      { name: "Duo", price: 149, quality: "320kbps", screens: 2 },
      { name: "Family", price: 179, quality: "320kbps", screens: 6 },
      { name: "Student", price: 59, quality: "320kbps", screens: 1 }
    ],
    features: [
      "Algorithmic playlist discovery (Discover Weekly, Daily Mix)",
      "Cross-device seamless handoff (Spotify Connect)",
      "Podcasts & video shows ecosystem",
      "Collaborative playlist blends with friends",
      "Social friend activity feed"
    ],
    pros: [
      "Industry-leading algorithmic music discovery",
      "Broadest smart speaker and device ecosystem",
      "Excellent social and collaborative playlist features"
    ],
    cons: [
      "No lossless or Hi-Res audio tier",
      "Ad interruptions on free plan"
    ],
    platforms: ["iOS", "Android", "Web", "Windows", "macOS", "Apple Watch", "Wear OS", "PlayStation", "Xbox", "Smart TVs"],
    audioVideoQuality: "320 kbps AAC / Ogg Vorbis",
    offlineSupport: "Yes, up to 10,000 songs on 5 devices",
    cloudSync: "Yes, real-time library sync across all devices",
    aiFeatures: "AI DJ with personalized voice narration & Daylist",
    freePlan: "Yes (Ad-supported, shuffle-only on mobile)",
    familyPlan: "₹179/mo (up to 6 accounts)",
    studentDiscount: "₹59/mo (50% discount)",
    bestFor: "Music discovery, social sharing, podcasts, and curated playlists"
  },
  {
    id: "applemusic",
    name: "Apple Music",
    category: "music",
    categoryLabel: "Music",
    price: 99,
    rating: 4.6,
    score: 8.9,
    plans: [
      { name: "Individual", price: 99, quality: "Lossless / Hi-Res", screens: 1 },
      { name: "Family", price: 149, quality: "Lossless / Hi-Res", screens: 6 },
      { name: "Student", price: 59, quality: "Lossless / Hi-Res", screens: 1 }
    ],
    features: [
      "Lossless Audio up to 24-bit/192 kHz included at no extra cost",
      "Dolby Atmos Spatial Audio with head tracking",
      "Apple Music Classical dedicated app included",
      "Time-synced lyrics with Apple Music Sing (vocal reducer)",
      "Live global radio stations curated by artists"
    ],
    pros: [
      "Pristine lossless & Spatial Audio quality without surcharge",
      "Deep integration with Siri, HomePod, and iOS",
      "Cheaper individual tier in India (₹99 vs ₹119)"
    ],
    cons: [
      "Discovery algorithm is more traditional/editorial",
      "Android and Windows web apps are less snappy"
    ],
    platforms: ["iOS", "Android", "Web", "macOS", "Windows", "Apple Watch", "Apple TV", "Sonos", "PS5"],
    audioVideoQuality: "24-bit/192 kHz ALAC Lossless & Dolby Atmos",
    offlineSupport: "Yes, up to 100,000 songs in personal library",
    cloudSync: "Yes, iCloud Music Library syncing up to 100k tracks",
    aiFeatures: "Personalized Discovery Station & smart autoplay",
    freePlan: "No (1 month free trial only)",
    familyPlan: "₹149/mo (up to 6 accounts via Family Sharing)",
    studentDiscount: "₹59/mo (includes Apple TV+ for student period)",
    bestFor: "Audiophiles, Apple ecosystem users, and Dolby Atmos spatial audio enthusiasts"
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "movies",
    categoryLabel: "Movies",
    price: 199,
    rating: 4.7,
    score: 9.1,
    plans: [
      { name: "Mobile", price: 149, quality: "480p", screens: 1 },
      { name: "Basic", price: 199, quality: "720p", screens: 1 },
      { name: "Standard", price: 499, quality: "1080p", screens: 2 },
      { name: "Premium", price: 649, quality: "4K+HDR", screens: 4 }
    ],
    features: [
      "Unmatched global original movies and series",
      "Netflix Games mobile bundle included with membership",
      "Multiple user profiles with tailored kid-safety controls",
      "Spatial audio & Dolby Vision on 4K tiers",
      "Smart downloads for offline travel viewing"
    ],
    pros: [
      "World-class original scripted programming",
      "Rock-solid video streaming infrastructure and UI",
      "Zero commercial ads on all standard plans"
    ],
    cons: [
      "Higher monthly price than Indian competitors",
      "Account sharing strictly limited by household rules"
    ],
    platforms: ["iOS", "Android", "Web", "Smart TVs", "Apple TV", "Fire TV", "Roku", "PlayStation", "Xbox"],
    audioVideoQuality: "Up to 4K Ultra HD, Dolby Vision & Spatial Audio",
    offlineSupport: "Yes, up to 100 downloads per device",
    cloudSync: "Yes, profile viewing history & bookmarks",
    aiFeatures: "Deep neural personalized recommendation rankings",
    freePlan: "No",
    familyPlan: "₹649/mo (4 simultaneous screens + spatial audio)",
    studentDiscount: "No dedicated student tier",
    bestFor: "Global blockbuster series, prestige drama, and international cinema"
  },
  {
    id: "primevideo",
    name: "Prime Video",
    category: "movies",
    categoryLabel: "Movies",
    price: 299,
    rating: 4.6,
    score: 8.8,
    plans: [
      { name: "Monthly Prime", price: 299, quality: "4K+HDR", screens: 3 },
      { name: "Annual Prime", price: 1499, quality: "4K+HDR", screens: 3 }
    ],
    features: [
      "Complete Amazon Prime membership bundle (Free delivery, Amazon Music)",
      "4K Ultra HD & HDR10+ streaming included by default",
      "X-Ray powered by IMDb for real-time actor & trivia lookup",
      "Prime Video Channels add-ons (Lionsgate, Discovery+, etc.)"
    ],
    pros: [
      "High value: includes shopping shipping + music streaming",
      "4K HDR streaming available on base subscription",
      "Broad regional Indian cinema and dubbed library"
    ],
    cons: [
      "Interface mixes free Prime titles with pay-per-view rentals",
      "Inconsistent subtitle styling across titles"
    ],
    platforms: ["iOS", "Android", "Web", "Smart TVs", "Fire TV", "Apple TV", "PlayStation", "Xbox"],
    audioVideoQuality: "Up to 4K UHD, HDR10+, Dolby Vision & Atmos",
    offlineSupport: "Yes, up to 25 titles depending on licensing",
    cloudSync: "Yes, Amazon account sync",
    aiFeatures: "X-Ray scene detection and smart dialogue boost",
    freePlan: "30-day free trial on Amazon Prime",
    familyPlan: "Amazon Household profile sharing",
    studentDiscount: "Prime Student offers up to 50% cashback",
    bestFor: "All-in-one entertainment, free shopping delivery, and movie buffs"
  },
  {
    id: "jiohotstar",
    name: "JioHotstar",
    category: "movies",
    categoryLabel: "Movies",
    price: 149,
    rating: 4.4,
    score: 8.2,
    plans: [
      { name: "Super (Ad-Supported)", price: 149, quality: "1080p", screens: 2 },
      { name: "Premium (Ad-Free)", price: 299, quality: "4K+HDR", screens: 4 },
      { name: "Annual Premium", price: 1499, quality: "4K+HDR", screens: 4 }
    ],
    features: [
      "Live Cricket (IPL, ICC tournaments, bilateral tours) & Premier League",
      "Disney, Marvel, Star Wars, Pixar, and HBO titles",
      "Indian regional languages (Hindi, Tamil, Telugu, Malayalam, etc.)",
      "Daily soaps and Indian broadcast network catch-up"
    ],
    pros: [
      "Unrivaled live sports broadcasting in India",
      "Huge Disney & Marvel blockbuster collection",
      "Affordable entry plans"
    ],
    cons: [
      "Commercial advertisements on lower subscription tiers",
      "High streaming server load during peak live finals"
    ],
    platforms: ["iOS", "Android", "Web", "Smart TVs", "Fire TV", "Apple TV"],
    audioVideoQuality: "Up to 4K HDR, Dolby Atmos on Premium",
    offlineSupport: "Yes, select titles available for offline download",
    cloudSync: "Yes, profile and watch history sync",
    aiFeatures: "MaxView live sports multiview and automated highlights",
    freePlan: "Ad-supported free sports streams on mobile",
    familyPlan: "₹1499/year Premium (4 screens simultaneous)",
    studentDiscount: "No direct student discount",
    bestFor: "Live sports enthusiasts and Disney/Marvel franchise fans"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "others",
    categoryLabel: "AI & Productivity",
    price: 1650,
    rating: 4.8,
    score: 9.4,
    plans: [
      { name: "Free", price: 0, quality: "GPT-4o Mini", screens: 1 },
      { name: "Plus", price: 1650, quality: "GPT-4o / o1 reasoning", screens: 1 },
      { name: "Team", price: 2100, quality: "GPT-4o + Admin", screens: 5 }
    ],
    features: [
      "Access to OpenAI o1 reasoning model and GPT-4o",
      "Advanced Voice Mode with real-time conversational pauses",
      "Custom GPTs store and creation capabilities",
      "DALL-E 3 image generation & code interpreter analysis",
      "Browsing & file uploads with python sandbox execution"
    ],
    pros: [
      "Industry benchmark for complex reasoning and coding",
      "Advanced fluid voice interactions",
      "Massive ecosystem of custom third-party GPTs"
    ],
    cons: [
      "High monthly price ($20 / ~₹1,650/mo)",
      "Usage caps apply during peak hours"
    ],
    platforms: ["iOS", "Android", "Web", "macOS app", "Windows app"],
    audioVideoQuality: "Real-time speech synthesis & HD vision analysis",
    offlineSupport: "No (requires internet connection)",
    cloudSync: "Yes, cross-device chat history & custom memories",
    aiFeatures: "State-of-the-art LLM reasoning, code execution, canvas editor",
    freePlan: "Yes (GPT-4o Mini with limited GPT-4o access)",
    familyPlan: "No direct family plan (Individual & Team)",
    studentDiscount: "Occasional university promotional trials",
    bestFor: "Software developers, writers, and advanced reasoning workflows"
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "others",
    categoryLabel: "AI & Productivity",
    price: 1950,
    rating: 4.7,
    score: 9.2,
    plans: [
      { name: "Gemini Free", price: 0, quality: "Gemini 1.5 Flash", screens: 1 },
      { name: "Gemini Advanced (Google One)", price: 1950, quality: "Gemini 1.5 Pro 2M context + 2 TB", screens: 5 }
    ],
    features: [
      "Gemini 1.5 Pro model with 2,000,000 token context window",
      "Bundled with 2 TB Google One cloud storage (Photos, Drive, Gmail)",
      "Direct integration into Gmail, Google Docs, Slides, and Sheets",
      "Real-time multimodal image, audio, video, and code analysis",
      "Deep Google Search live grounding and verification"
    ],
    pros: [
      "Massive 2M token context window (analyze entire textbooks/codebases)",
      "Includes 2 TB Google One cloud storage shareable with 5 family members",
      "Native Google Workspace integration (draft emails, summarize docs)"
    ],
    cons: [
      "Slightly higher single price if cloud storage isn't needed",
      "Voice mode is expanding across regions"
    ],
    platforms: ["iOS", "Android", "Web", "Google Workspace"],
    audioVideoQuality: "Native multimodal input parsing (video/audio/text)",
    offlineSupport: "No (cloud inference)",
    cloudSync: "Yes, Google Account synchronization",
    aiFeatures: "2M context window, Gemini Gems, Workspace AI extensions",
    freePlan: "Yes (Gemini Free with web browsing)",
    familyPlan: "Included 2 TB storage shareable with up to 5 family members",
    studentDiscount: "Google for Education discounted access",
    bestFor: "Document research, large file analysis, and Google Workspace users"
  },
  {
    id: "canva",
    name: "Canva",
    category: "others",
    categoryLabel: "Design & Productivity",
    price: 500,
    rating: 4.8,
    score: 9.1,
    plans: [
      { name: "Free", price: 0, quality: "Standard Assets", screens: 1 },
      { name: "Canva Pro", price: 500, quality: "100M+ Assets", screens: 1 },
      { name: "Canva for Teams", price: 1000, quality: "Team Hub", screens: 5 }
    ],
    features: [
      "100M+ premium stock photos, graphics, videos, and fonts",
      "Magic Studio AI (Background remover, Magic Expand, Magic Switch)",
      "Brand Kit with unlimited color palettes and custom uploaded fonts",
      "1 TB cloud asset storage with version history",
      "One-click social media auto-resizing and scheduling"
    ],
    pros: [
      "Extremely beginner-friendly drag-and-drop interface",
      "Massive high quality template library for social media & print",
      "Fast one-click AI background removal and asset editing"
    ],
    cons: [
      "Less precision for intricate vector design than Illustrator",
      "Requires constant internet connection"
    ],
    platforms: ["iOS", "Android", "Web", "macOS", "Windows"],
    audioVideoQuality: "Up to 4K video exports & SVG vector downloads",
    offlineSupport: "Partial (cached drafts on mobile)",
    cloudSync: "Yes, real-time multi-user collaboration",
    aiFeatures: "Magic Studio generative fill, AI write, Magic Design",
    freePlan: "Yes (Generous free tier with basic templates)",
    familyPlan: "Canva for Teams (₹1000/mo for 5 members)",
    studentDiscount: "Canva for Education (100% free for verified schools/teachers)",
    bestFor: "Content creators, marketing professionals, educators, and social media managers"
  },
  {
    id: "adobeexpress",
    name: "Adobe Express",
    category: "others",
    categoryLabel: "Design & Productivity",
    price: 699,
    rating: 4.5,
    score: 8.5,
    plans: [
      { name: "Free", price: 0, quality: "Standard Assets", screens: 1 },
      { name: "Premium", price: 699, quality: "Adobe Stock + Firefly", screens: 1 }
    ],
    features: [
      "Adobe Firefly generative AI for commercially safe text-to-image",
      "Direct integration with Photoshop & Illustrator linked assets",
      "Adobe Stock collection with 200M+ royalty-free photos and vectors",
      "250 GB cloud storage and PDF quick actions (convert, edit)",
      "Generative match and brand template locking for teams"
    ],
    pros: [
      "Commercially safe Adobe Firefly generative AI",
      "Deep interoperability with Photoshop and Illustrator",
      "High-precision PDF editing and conversion tools"
    ],
    cons: [
      "Template library is smaller than Canva for social formats",
      "Mobile app interface can have a slight learning curve"
    ],
    platforms: ["iOS", "Android", "Web"],
    audioVideoQuality: "Print-ready PDF, CMYK support, 4K video exports",
    offlineSupport: "No",
    cloudSync: "Yes, Adobe Creative Cloud Libraries",
    aiFeatures: "Adobe Firefly Generative Fill & text effects",
    freePlan: "Yes (25 monthly generative credits)",
    familyPlan: "Creative Cloud All Apps team tiers",
    studentDiscount: "Up to 60% off via Adobe Creative Cloud Student",
    bestFor: "Designers working alongside Photoshop/Illustrator and commercial creators"
  },
  {
    id: "googleone",
    name: "Google Drive (Google One)",
    category: "others",
    categoryLabel: "Cloud & Storage",
    price: 130,
    rating: 4.9,
    score: 9.5,
    plans: [
      { name: "Basic (100 GB)", price: 130, quality: "100 GB", screens: 5 },
      { name: "Standard (200 GB)", price: 210, quality: "200 GB", screens: 5 },
      { name: "Premium (2 TB)", price: 650, quality: "2 TB + Google AI", screens: 5 }
    ],
    features: [
      "Unified cloud storage across Google Drive, Gmail, and Photos",
      "Seamless family sharing with up to 5 family members",
      "Google Photos advanced AI editing (Magic Eraser, Portrait Blur)",
      "Automated phone backup for Android (photos, messages, contacts)",
      "Dark web monitoring and Google Store cash back"
    ],
    pros: [
      "Everyday necessity for Android, Gmail, and Google Photos",
      "Easiest family storage sharing structure",
      "Seamless browser-based Google Docs/Sheets collaboration"
    ],
    cons: [
      "Strict account usage limits once free 15 GB is filled",
      "No desktop block-level sync like Dropbox"
    ],
    platforms: ["Android", "iOS", "Web", "Windows", "macOS"],
    audioVideoQuality: "Original quality photo and 4K video backup",
    offlineSupport: "Yes, offline file pinning on mobile and desktop",
    cloudSync: "Yes, instant Google Cloud synchronization",
    aiFeatures: "Magic Eraser in Photos & smart search by visual objects",
    freePlan: "Yes (15 GB free with any Google Account)",
    familyPlan: "Included at no extra fee with any paid plan (share with 5)",
    studentDiscount: "Google Workspace for Education free storage quotas",
    bestFor: "Phone backups, Google Photos storage, and universal document sharing"
  },
  {
    id: "onedrive",
    name: "Microsoft OneDrive",
    category: "others",
    categoryLabel: "Cloud & Storage",
    price: 140,
    rating: 4.6,
    score: 8.8,
    plans: [
      { name: "Basic (100 GB)", price: 140, quality: "100 GB", screens: 1 },
      { name: "Personal (1 TB + Office)", price: 489, quality: "1 TB + Word/Excel", screens: 1 },
      { name: "Family (6 TB + Office)", price: 619, quality: "6 TB + Word/Excel", screens: 6 }
    ],
    features: [
      "Includes full Microsoft 365 desktop apps (Word, Excel, PowerPoint, Outlook)",
      "1 TB per person (up to 6 TB in Family plan)",
      "Personal Vault with biometric/2FA encryption",
      "Files On-Demand to save local PC hard drive space",
      "Ransomware detection and 30-day file rollback"
    ],
    pros: [
      "Incredible value with full Microsoft Office desktop licenses",
      "Personal Vault provides military-grade security for sensitive documents",
      "Deep native integration into Windows 10/11 File Explorer"
    ],
    cons: [
      "Photo backup interface on mobile is less intuitive than Google Photos",
      "Free tier only includes 5 GB"
    ],
    platforms: ["Windows", "macOS", "iOS", "Android", "Web", "Xbox"],
    audioVideoQuality: "High-resolution RAW & 4K media backup",
    offlineSupport: "Yes, Files On-Demand & local folder caching",
    cloudSync: "Yes, block-level delta sync for ultra-fast Office edits",
    aiFeatures: "Microsoft Copilot in Office apps & photo OCR indexing",
    freePlan: "Yes (5 GB free)",
    familyPlan: "₹619/mo for 6 users (1 TB storage + Office apps for each)",
    studentDiscount: "Free Microsoft 365 for eligible school domains",
    bestFor: "Windows PC users, Excel/Word power users, and family storage bundles"
  },
  {
    id: "xboxgamepass",
    name: "Xbox Game Pass",
    category: "games",
    categoryLabel: "Games",
    price: 489,
    rating: 4.8,
    score: 9.4,
    plans: [
      { name: "PC Pass", price: 349, quality: "PC 1080p/4K", screens: 1 },
      { name: "Console Pass", price: 489, quality: "Console 4K", screens: 1 },
      { name: "Ultimate", price: 549, quality: "Cloud + Console + PC", screens: 1 }
    ],
    features: [
      "400+ high quality games across PC, Xbox Console, and Mobile Cloud",
      "Day-one access to new Xbox Game Studios blockbusters (Halo, Forza, Bethesda)",
      "EA Play membership included at no additional charge",
      "Exclusive member discounts and in-game cosmetics perks"
    ],
    pros: [
      "Tremendous cost savings compared to buying standalone $70 games",
      "Includes EA Play catalog",
      "Cloud Gaming allows playing AAA titles on phones and laptops"
    ],
    cons: [
      "Games rotate out of the service periodically",
      "Requires high-speed internet for cloud streaming"
    ],
    platforms: ["PC", "Xbox Series X/S", "Xbox One", "iOS (Cloud)", "Android (Cloud)", "Samsung Smart TVs"],
    audioVideoQuality: "Up to 4K 120fps native / 1080p 60fps cloud stream",
    offlineSupport: "Yes, full game downloads for PC and Console",
    cloudSync: "Yes, Xbox Cloud cross-save and achievements",
    aiFeatures: "Smart cloud streaming frame rendering",
    freePlan: "No (Frequent ₹50 intro offers)",
    familyPlan: "Xbox Game Pass Friends & Family in select test markets",
    studentDiscount: "No direct student tier",
    bestFor: "Gamers wanting vast variety without buying individual console/PC titles"
  },
  {
    id: "youtubepremium",
    name: "YouTube Premium",
    category: "movies",
    categoryLabel: "Video & Music",
    price: 129,
    rating: 4.8,
    score: 9.3,
    plans: [
      { name: "Individual", price: 129, quality: "4K 60fps", screens: 1 },
      { name: "Family", price: 189, quality: "4K 60fps", screens: 5 },
      { name: "Student", price: 79, quality: "4K 60fps", screens: 1 }
    ],
    features: [
      "Zero video ads across all YouTube devices worldwide",
      "Background play & Picture-in-Picture on mobile",
      "Full YouTube Music Premium app included",
      "Smart offline video downloads & 1080p Enhanced Bitrate",
      "Queueing videos on mobile and smart TVs"
    ],
    pros: [
      "Eliminates all intrusive ads across the world's largest video library",
      "Includes a full music streaming service (YouTube Music)",
      "Incredible family tier value (₹189/mo for 5 users)"
    ],
    cons: [
      "Limited exclusive narrative scripted originals"
    ],
    platforms: ["iOS", "Android", "Web", "Smart TVs", "Apple TV", "Consoles"],
    audioVideoQuality: "Up to 4K 60fps / 1080p Premium Bitrate & 256kbps audio",
    offlineSupport: "Yes, offline video downloads in HD",
    cloudSync: "Yes, YouTube account sync across all devices",
    aiFeatures: "AI conversational search & smart video jump-ahead",
    freePlan: "Yes (Standard ad-supported YouTube)",
    familyPlan: "₹189/mo (share with up to 5 family members)",
    studentDiscount: "₹79/mo (includes YouTube Music)",
    bestFor: "Heavy YouTube watchers, learners, creators, and audio listeners"
  },
  {
    id: "duolingo",
    name: "Duolingo Super",
    category: "others",
    categoryLabel: "Education & Languages",
    price: 299,
    rating: 4.7,
    score: 8.9,
    plans: [
      { name: "Free", price: 0, quality: "Ad-Supported with Hearts", screens: 1 },
      { name: "Super (Individual)", price: 299, quality: "Unlimited Hearts, Ad-Free", screens: 1 },
      { name: "Super (Family)", price: 449, quality: "Family Plan (up to 6 members)", screens: 6 }
    ],
    features: [
      "Unlimited Hearts so learning is never paused",
      "Completely ad-free language lessons and pronunciation practice",
      "Personalized Mistake Review and targeted practice hub",
      "Unlimited test attempts and Legend challenges",
      "Progress tracking across 40+ world languages"
    ],
    pros: [
      "Highly addictive bite-sized gamified learning model",
      "Comprehensive pronunciation and listening exercises",
      "Supports 40+ languages from Spanish to Japanese and Hindi"
    ],
    cons: [
      "Grammar deep-dives can feel shallow for advanced fluency",
      "Requires consistent daily engagement to maintain learning streaks"
    ],
    platforms: ["iOS", "Android", "Web"],
    audioVideoQuality: "High-fidelity native speaker voice audio",
    offlineSupport: "Yes, download offline lessons on mobile",
    cloudSync: "Yes, multi-device streak and XP synchronization",
    aiFeatures: "Roleplay conversational AI and explain-my-answer engine",
    freePlan: "Yes (Ad-supported with 5 hearts)",
    familyPlan: "₹449/mo for up to 6 family or friend accounts",
    studentDiscount: "Duolingo for Schools 100% free educator tools",
    bestFor: "Language learners, travelers, and daily habit builders"
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "others",
    categoryLabel: "AI & Productivity",
    price: 1999,
    rating: 4.9,
    score: 9.6,
    plans: [
      { name: "Free", price: 0, quality: "GPT-4o mini, standard rate limits", screens: 1 },
      { name: "Plus", price: 1999, quality: "GPT-4o full access, o1 reasoning, Canvas", screens: 1 },
      { name: "Team", price: 2500, quality: "Team workspace & higher limits", screens: 5 }
    ],
    features: [
      "Access to flagship GPT-4o, GPT-4, and o1 deep reasoning models",
      "Advanced Voice Mode with real-time, emotive conversational audio",
      "DALL-E 3 image generation and visual reasoning editing",
      "Interactive Canvas for coding, document authoring, and project editing",
      "Custom GPTs creation, code interpreter & data analysis sandbox"
    ],
    pros: [
      "Top-tier reasoning, writing, coding, and problem-solving capabilities",
      "Real-time voice conversation mode with natural pauses and tone",
      "Rich custom GPT ecosystem and web search grounding"
    ],
    cons: [
      "High monthly price point (₹1,999/mo)",
      "Periodic usage caps during peak global demand"
    ],
    platforms: ["iOS", "Android", "Web", "macOS", "Windows"],
    audioVideoQuality: "Ultra-low latency real-time voice synthesis",
    offlineSupport: "No, requires active internet connection",
    cloudSync: "Yes, instant chat history synchronization across all devices",
    aiFeatures: "Frontier GPT-4o, o1 reasoning models, Voice Mode & Canvas",
    freePlan: "Yes (GPT-4o mini with limited daily capacity)",
    familyPlan: "Team workspace at ₹2,500/seat/mo",
    studentDiscount: "Campus enterprise licensing via universities",
    bestFor: "Developers, researchers, creators, students, and professionals"
  },
  {
    id: "gemini",
    name: "Gemini Advanced",
    category: "others",
    categoryLabel: "AI & Productivity",
    price: 1950,
    rating: 4.8,
    score: 9.4,
    plans: [
      { name: "Free", price: 0, quality: "Standard Gemini 1.5 Flash", screens: 1 },
      { name: "Google One AI Premium", price: 1950, quality: "Gemini 1.5 Pro (2M context) + 2TB Drive", screens: 5 }
    ],
    features: [
      "Gemini 1.5 Pro with massive 2 Million token context window",
      "Includes 2 TB Google Drive, Gmail, and Google Photos cloud storage",
      "Deeply integrated into Google Docs, Sheets, Slides, and Gmail",
      "Gems: create customized specialized AI expert assistants",
      "Direct Google Workspace and YouTube Extensions integration"
    ],
    pros: [
      "Unmatched 2,000,000 token context window for massive documents and video analysis",
      "Includes 2TB Google One cloud storage for up to 5 family members",
      "Seamless native integration inside Google Docs and Gmail"
    ],
    cons: [
      "Workspace business accounts require separate enterprise licenses"
    ],
    platforms: ["Android", "iOS", "Web"],
    audioVideoQuality: "High-definition Live conversational audio",
    offlineSupport: "No",
    cloudSync: "Yes, unified with Google Account & Drive cloud storage",
    aiFeatures: "Gemini 1.5 Pro, 2M context window, Gems, Imagen 3, Workspace AI",
    freePlan: "Yes (Gemini standard 1.5 Flash)",
    familyPlan: "Share 2TB storage with up to 5 family members",
    studentDiscount: "Google for Education partner access",
    bestFor: "Large document analysis, researchers, and Google Workspace power users"
  },
  {
    id: "amazonprime",
    name: "Amazon Prime",
    category: "others",
    categoryLabel: "Shopping & Entertainment",
    price: 299,
    rating: 4.8,
    score: 9.5,
    plans: [
      { name: "Monthly", price: 299, quality: "Full Prime Benefits", screens: 4 },
      { name: "Quarterly", price: 599, quality: "Full Prime Benefits", screens: 4 },
      { name: "Annual", price: 1499, quality: "Full Prime Benefits (Best Value)", screens: 4 },
      { name: "Prime Shopping Edition", price: 399, quality: "Free Fast Delivery only (1 Year)", screens: 1 }
    ],
    features: [
      "Free 1-Day, Same-Day, and 2-Day delivery with no minimum order value",
      "Prime Video 4K UHD streaming with Dolby Atmos",
      "Amazon Music ad-free streaming included with 100M+ tracks",
      "Prime Gaming with free in-game loot and monthly PC games",
      "Exclusive early access to Great Indian Festival and Lightning Deals"
    ],
    pros: [
      "Outstanding all-in-one value (Fast Delivery + Video + Music + Deals)",
      "Extremely cost-effective annual plan at ₹1,499/year (₹125/mo equivalent)",
      "4 screens 4K streaming included with Prime Video"
    ],
    cons: [
      "Occasional promotional ads for other Prime shows"
    ],
    platforms: ["iOS", "Android", "Web", "Smart TVs", "Fire TV", "Echo", "Consoles"],
    audioVideoQuality: "4K UHD HDR with Dolby Vision & Dolby Atmos",
    offlineSupport: "Yes, video & music downloads on mobile & tablets",
    cloudSync: "Yes, synced across Amazon account ecosystem",
    aiFeatures: "Rufus AI shopping assistant & X-Ray video cast insights",
    freePlan: "30-day free trial available for new users",
    familyPlan: "Amazon Household profile sharing",
    studentDiscount: "Prime Youth Offer (50% cashback for ages 18-24)",
    bestFor: "Online shoppers, movie and TV watchers, and value seekers"
  },
  {
    id: "flipkart",
    name: "Flipkart VIP",
    category: "others",
    categoryLabel: "Shopping & Rewards",
    price: 49,
    rating: 4.6,
    score: 8.8,
    plans: [
      { name: "Plus", price: 0, quality: "Earned via 200 SuperCoins", screens: 1 },
      { name: "VIP Annual", price: 499, quality: "₹499/year (₹41/mo equivalent)", screens: 1 }
    ],
    features: [
      "Free delivery on all Plus & VIP eligible products with no minimum spend",
      "Guaranteed Next-Day delivery in top metro cities",
      "Early access to Big Billion Days and festive blockbuster sales",
      "Earn 5% SuperCoins (up to 100 per order) on every purchase",
      "Priority customer care with instant agent call-back within 30 seconds"
    ],
    pros: [
      "Inexpensive annual pass (₹499/year or earnable for free with SuperCoins)",
      "Priority return pick-ups and instant refunds",
      "Big Billion Days 24-hour headstart on deep discounts"
    ],
    cons: [
      "No standalone video or music streaming platform bundled"
    ],
    platforms: ["iOS", "Android", "Web"],
    audioVideoQuality: "Not applicable (E-commerce shopping)",
    offlineSupport: "No",
    cloudSync: "Yes, synchronized shopping cart, wishlist, and SuperCoins wallet",
    aiFeatures: "Flippi AI shopping search & conversational assistant",
    freePlan: "Flipkart Plus (unlocked via 200 SuperCoins without payment)",
    familyPlan: "Individual account membership",
    studentDiscount: "Flipkart Student Club seasonal promotions",
    bestFor: "Frequent Flipkart shoppers, electronics buyers, and deal hunters"
  }
];

export function getServiceById(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
  return KNOWN_SERVICES.find(s => {
    const sId = s.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sName = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return sId === cleanId || sName === cleanId || cleanId.includes(sId) || sId.includes(cleanId);
  }) || null;
}
