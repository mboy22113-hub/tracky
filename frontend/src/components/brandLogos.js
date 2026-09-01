// Brand Vector Logos for Streaming, Music, Gaming & Utility Services

export function getServiceLogo(nameOrId = '', fallbackColor = '#2F6FED') {
  const key = (nameOrId || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Netflix
  if (key.includes('netflix')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#141414"/>
        <path d="M9 7h3.8v18H9V7z" fill="#E50914"/>
        <path d="M19.2 7H23v18h-3.8V7z" fill="#E50914"/>
        <path d="M9 7h4l6.2 18h-4L9 7z" fill="#B20710"/>
      </svg>
    `;
  }

  // Prime Video
  if (key.includes('prime') || key.includes('amazon')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#00A8E1"/>
        <path d="M8 12.5h2.5c1.4 0 2.2.7 2.2 1.8 0 1.2-.9 1.9-2.2 1.9H9.4v3.3H8v-7zm1.4 2.6h1c.6 0 1-.3 1-.8 0-.6-.4-.8-1-.8h-1v1.6z" fill="#FFFFFF"/>
        <path d="M13.2 14.5h1.3v1c.3-.7 1-1.1 1.8-1.1v1.4c-.2 0-.4-.05-.6-.05-1 0-1.2.8-1.2 1.8v3.9h-1.3v-7z" fill="#FFFFFF"/>
        <path d="M17.3 12.2c0-.5.4-.9.9-.9s.9.4.9.9c0 .5-.4.9-.9.9s-.9-.4-.9-.9zm.2 2.3h1.3v7h-1.3v-7z" fill="#FFFFFF"/>
        <path d="M8.5 22.5c4.5 2.2 11 2.2 15 0-.4-.4-1.2-1.2-1.2-1.2-3.3 1.6-8.7 1.6-12.4 0l-1.4 1.2z" fill="#FF9900"/>
        <path d="M23.5 22.5l1.5.3-.2-1.5-1.3 1.2z" fill="#FF9900"/>
      </svg>
    `;
  }

  // JioHotstar / Hotstar / Disney+
  if (key.includes('hotstar') || key.includes('jio') || key.includes('disney')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#0C1B33"/>
        <path d="M16 6l2.8 6.5 7.1.6-5.4 4.7 1.6 6.9-6.1-3.6-6.1 3.6 1.6-6.9-5.4-4.7 7.1-.6L16 6z" fill="#1467E3"/>
        <path d="M16 9.5l1.8 4.2 4.6.4-3.5 3 1 4.5-3.9-2.3-3.9 2.3 1-4.5-3.5-3 4.6-.4L16 9.5z" fill="#00D2FF"/>
        <circle cx="16" cy="16" r="3" fill="#FFE800"/>
      </svg>
    `;
  }

  // Spotify
  if (key.includes('spotify')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#121212"/>
        <circle cx="16" cy="16" r="11" fill="#1DB954"/>
        <path d="M10 12.8c3.8-.9 8.2-.6 11.8 1.4" stroke="#121212" stroke-width="2" stroke-linecap="round"/>
        <path d="M10.8 16c3.2-.8 6.8-.5 9.8 1.2" stroke="#121212" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M11.6 19.2c2.6-.6 5.5-.3 7.9.9" stroke="#121212" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Apple Music
  if (key.includes('apple') || (key.includes('music') && !key.includes('youtube') && !key.includes('spotify'))) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#FA243C"/>
        <path d="M21.5 9v10.5c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c.6 0 1.2.2 1.8.5V12.8l-7 1.8v6.9c0 1.9-1.6 3.5-3.5 3.5S5.8 23.9 5.8 22s1.6-3.5 3.5-3.5c.6 0 1.2.2 1.8.5V11.2c0-.9.6-1.6 1.5-1.8l7.5-1.9c.8-.2 1.4.4 1.4 1.5z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Xbox / Game Pass
  if (key.includes('xbox') || key.includes('gamepass')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#107C10"/>
        <circle cx="16" cy="16" r="10" fill="#107C10"/>
        <path d="M16 8.5c-4.1 0-7.5 3.4-7.5 7.5 0 2.2 1 4.2 2.5 5.5-1.2-1.8-1.5-4.1-.3-6 1.4-2.2 3.4-3.5 5.3-4.8 1.9 1.3 3.9 2.6 5.3 4.8 1.2 1.9.9 4.2-.3 6 1.5-1.3 2.5-3.3 2.5-5.5 0-4.1-3.4-7.5-7.5-7.5z" fill="#FFFFFF"/>
        <path d="M16 13.8c-1.8 1.5-3.8 2.8-5 4.8-.8 1.4-.8 3-.1 4.4 1.5 1.2 3.3 2 5.1 2s3.6-.8 5.1-2c.7-1.4.7-3-.1-4.4-1.2-2-3.2-3.3-5-4.8z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // BGMI / Battlegrounds
  if (key.includes('bgmi') || key.includes('battlegrounds') || key.includes('pubg')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#E08A2C"/>
        <path d="M16 7l8 4.5v9L16 25l-8-4.5v-9L16 7z" stroke="#FFFFFF" stroke-width="2" fill="none"/>
        <path d="M16 11l4 2.2v4.6l-4 2.2-4-2.2v-4.6l4-2.2z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Google One / Drive / Cloud
  if (key.includes('google') || key.includes('cloud') || key.includes('one')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#FFFFFF"/>
        <path d="M18.8 8.5H13.2c-.8 0-1.5.7-1.5 1.5v12c0 .8.7 1.5 1.5 1.5h5.6c.8 0 1.5-.7 1.5-1.5V10c0-.8-.7-1.5-1.5-1.5z" fill="#EA4335"/>
        <path d="M13.2 8.5h-1.5c-1.8 0-3.2 1.4-3.2 3.2v8.6c0 1.8 1.4 3.2 3.2 3.2h1.5V8.5z" fill="#4285F4"/>
        <path d="M20.3 8.5h-1.5v15h1.5c1.8 0 3.2-1.4 3.2-3.2v-8.6c0-1.8-1.4-3.2-3.2-3.2z" fill="#34A853"/>
        <path d="M13.2 20.5h5.6v3h-5.6v-3z" fill="#FBBC05"/>
      </svg>
    `;
  }

  // Canva
  if (key.includes('canva')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#00C4CC"/>
        <path d="M16 23.5c-4.4 0-7.8-3.4-7.8-7.5 0-4.3 3.6-7.5 7.8-7.5 2.2 0 4.1.8 5.4 2.1l-1.9 2c-.9-.9-2.1-1.5-3.5-1.5-2.7 0-4.9 2.1-4.9 4.9 0 2.7 2.2 4.9 4.9 4.9 1.4 0 2.6-.6 3.5-1.5l1.9 2c-1.3 1.3-3.2 2.1-5.4 2.1z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // YouTube / YouTube Premium
  if (key.includes('youtube')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF0000"/>
        <path d="M23.5 11.2c-.3-1-.9-1.7-1.8-2C20.1 8.8 16 8.8 16 8.8s-4.1 0-5.7.4c-.9.3-1.5 1-1.8 2C8 12.8 8 16 8 16s0 3.2.4 4.8c.3 1 .9 1.7 1.8 2 1.6.4 5.7.4 5.7.4s4.1 0 5.7-.4c.9-.3 1.5-1 1.8-2 .4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8z" fill="#FFFFFF"/>
        <path d="M14.4 19.2l5.2-3.2-5.2-3.2v6.4z" fill="#FF0000"/>
      </svg>
    `;
  }

  // Sony LIV
  if (key.includes('sony') || key.includes('liv')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#002B49"/>
        <circle cx="16" cy="16" r="8" fill="#FF4D00"/>
        <path d="M14 12l6 4-6 4v-8z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Zee5
  if (key.includes('zee')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#8230C6"/>
        <path d="M10 10h12l-8 9h8v3H10l8-9h-8v-3z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // ChatGPT / OpenAI
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#10A37F"/>
        <path d="M22.5 13.8c-.2-1.8-1.5-3.2-3.3-3.6-.5-.8-1.3-1.4-2.2-1.7-1.3-.4-2.8-.1-3.8.8-1-.5-2.2-.6-3.2-.2-1.3.5-2.2 1.7-2.4 3-.9.6-1.5 1.6-1.6 2.7-.1 1.3.5 2.5 1.6 3.2.2 1.8 1.5 3.2 3.3 3.6.5.8 1.3 1.4 2.2 1.7 1.3.4 2.8.1 3.8-.8 1 .5 2.2.6 3.2.2 1.3-.5 2.2-1.7 2.4-3 .9-.6 1.5-1.6 1.6-2.7.1-1.3-.5-2.5-1.6-3.2zm-6.5 7.8c-.8 0-1.6-.3-2.2-.8l1.4-1.4c.4.3.9.5 1.4.5 1.2 0 2.2-.9 2.4-2.1h2c-.2 2.1-1.9 3.8-4 3.8zm-4.3-2.5c-.4-.6-.6-1.4-.6-2.2 0-.6.1-1.2.4-1.8l1.7 1c-.1.3-.2.6-.2.8 0 1.2.9 2.2 2.1 2.4v2c-1.5-.2-2.7-1-3.4-2.2zm-1.1-5.7c.3-.6.7-1.2 1.3-1.6.5-.4 1.1-.6 1.8-.6v2c-.3 0-.6.1-.8.2-.8.5-1.3 1.3-1.3 2.3h-2c0-.8.3-1.6 1-2.3zm6-2c.8 0 1.6.3 2.2.8l-1.4 1.4c-.4-.3-.9-.5-1.4-.5-1.2 0-2.2.9-2.4 2.1h-2c.2-2.1 1.9-3.8 4-3.8zm4.3 2.5c.4.6.6 1.4.6 2.2 0 .6-.1 1.2-.4 1.8l-1.7-1c.1-.3.2-.6.2-.8 0-1.2-.9-2.2-2.1-2.4v-2c1.5.2 2.7 1 3.4 2.2zm1.1 5.7c-.3.6-.7 1.2-1.3 1.6-.5.4-1.1.6-1.8.6v-2c.3 0 .6-.1.8-.2.8-.5 1.3-1.3 1.3-2.3h2c0 .8-.3 1.6-1 2.3z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Gemini / Google Gemini
  if (key.includes('gemini')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#1B1F3B"/>
        <path d="M16 6c0 5.5-4.5 10-10 10 5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10z" fill="url(#gemini_grad)"/>
        <defs>
          <linearGradient id="gemini_grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4E82EE"/>
            <stop offset="0.5" stop-color="#A56CF5"/>
            <stop offset="1" stop-color="#EA5F89"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  // Adobe / Adobe Express / Creative Cloud
  if (key.includes('adobe')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#FA0F00"/>
        <path d="M8 8h5.2l5.8 16H14.5l-2.2-6H9.2L8 8zm10.8 0H24v16h-4.2l-1-2.8V8zm-6.2 3.6l-1.8 5.2h3.6l-1.8-5.2z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // OneDrive / Microsoft
  if (key.includes('onedrive') || key.includes('microsoft')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#0078D4"/>
        <path d="M14.5 12a4.5 4.5 0 0 1 4.2 3 4 4 0 0 1 3.8 4 4 4 0 0 1-4 4H10a4 4 0 0 1-4-4 4 4 0 0 1 3-3.9 4.5 4.5 0 0 1 5.5-3.1z" fill="#FFFFFF"/>
      </svg>
    `;
  }

  // Notion
  if (key.includes('notion')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#000000"/>
        <path d="M9 8.5h10.2l4.8 5.5v9.5H10.5L9 8.5z" fill="#FFFFFF"/>
        <path d="M12 12h2.2l4 5.2V12H20v8h-2.2l-4-5.2V20H12v-8z" fill="#000000"/>
      </svg>
    `;
  }

  // Duolingo
  if (key.includes('duolingo')) {
    return `
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
        <rect width="32" height="32" rx="8" fill="#58CC02"/>
        <circle cx="12" cy="15" r="4" fill="#FFFFFF"/>
        <circle cx="20" cy="15" r="4" fill="#FFFFFF"/>
        <circle cx="12" cy="15" r="2" fill="#4B4B4B"/>
        <circle cx="20" cy="15" r="2" fill="#4B4B4B"/>
        <path d="M14 18h4l-2 3-2-3z" fill="#FFC800"/>
      </svg>
    `;
  }

  // Fallback monogram logo
  const initial = (nameOrId || 'S').trim().charAt(0).toUpperCase();
  return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
      <rect width="32" height="32" rx="8" fill="${fallbackColor}"/>
      <text x="16" y="21" font-size="14" font-weight="800" font-family="'Manrope', sans-serif" fill="#FFFFFF" text-anchor="middle">${initial}</text>
    </svg>
  `;
}
