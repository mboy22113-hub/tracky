export function renderProfileScreen(state) {
  const { user = {} } = state;

  const movieOptions = ["Superhero", "Action", "Sci-Fi", "Comedy", "Anime", "Drama", "Thriller", "Horror", "Documentary"];
  const musicOptions = ["Podcasts", "Commute", "Workouts", "Focus / Work", "Hi-Res Audio", "EDM / Pop"];
  const gamingOptions = ["PC (Steam)", "PlayStation", "Xbox Game Pass", "Mobile", "Nintendo Switch"];
  const productivityOptions = ["Cloud Storage", "Design / Video", "AI Tools (ChatGPT)", "Note-Taking", "Password Manager"];

  const devices = [
    { id: "mobile", label: "📱 Mobile (iOS/Android)" },
    { id: "laptop", label: "💻 Laptop / Mac" },
    { id: "tv", label: "📺 Smart TV / FireStick" },
    { id: "console", label: "🎮 Gaming Console" },
    { id: "tablet", label: "📟 iPad / Tablet" }
  ];

  const goals = [
    { id: "best_value", emoji: "💎", title: "Best Value for Money", desc: "Keep services with high usage & lowest cost per hour" },
    { id: "lowest_cost", emoji: "📉", title: "Lowest Total Spend", desc: "Aggressively cut underutilized services to stay under budget" },
    { id: "variety", emoji: "🍿", title: "Maximum Entertainment", desc: "Prioritize diverse catalogs with new monthly releases" }
  ];

  const notifications = user.notificationSettings || {
    renewals: true, trials: true, lowUsage: true, ghostSubscriptions: true
  };

  const userDevices = user.connectedDevices || ["mobile", "laptop", "tv"];
  const userInterests = user.movieInterests || ["Action", "Sci-Fi", "Superhero"];
  const userMusic = user.musicUse || ["Commute", "Workouts", "Focus / Work"];
  const userGaming = user.gamingInterests || ["PC (Steam)", "Mobile"];
  const userProductivity = user.productivityInterests || ["Design / Video", "AI Tools (ChatGPT)"];

  return `
    <div class="scroll">
      <!-- Profile Screen Header -->
      <div class="profile-hero">
        <h1>Personalization & Profile</h1>
        <p>Customize your taste profile, connected devices & optimization goals</p>
      </div>

      <!-- 1️⃣ Profile Information & Account Status Badge -->
      <div class="pcard glass" style="margin-top:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <div class="account-status-badge">
            <span class="status-indicator-dot"></span>
            <span>Active Session • Pro Tier</span>
          </div>
          <button class="profile-switch-acc-btn" id="profile-open-login-btn" title="Switch or Manage Account">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/><polyline points="19 8 22 11 19 14"/></svg>
            <span>Switch / Login</span>
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <div class="profile-avatar">${user.name ? user.name[0].toUpperCase() : 'A'}</div>
          <div class="profile-id">
            <div class="profile-name" id="profile-display-name">${user.name || 'Alex'}</div>
            <div class="profile-email" id="profile-display-email">${user.email || 'alex@email.com'}</div>
          </div>
          <button class="profile-edit-btn" id="profile-edit-btn">Edit</button>
        </div>

        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--line);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <label class="field-label" style="font-weight:700; color:var(--navy); font-size:12px;" for="profile-monthly-budget">Monthly Budget Target</label>
            <span style="font-size:12px; font-weight:800; color:var(--primary);">₹${user.monthlyBudget || 1000}/mo</span>
          </div>
          <div style="display:flex; gap:8px;">
            <input type="number" class="field-input" id="profile-monthly-budget" value="${user.monthlyBudget || 1000}" style="padding:9px 12px; font-size:13px;" placeholder="1000">
            <button class="field-save-btn" id="profile-save-budget-btn" style="flex:0 0 auto; width:80px; padding:9px 12px;">Save</button>
          </div>
        </div>
      </div>

      <!-- 2️⃣ Interests & Taste -->
      <div class="pcard glass" style="margin-top:14px;">
        <h3>Interests & Taste</h3>
        <div class="pcard-sub">Select your entertainment and workflow habits for AI recommendations</div>

        <div class="chip-q">🎬 Movies & TV Shows</div>
        <div class="chip-grid">
          ${movieOptions.map(opt => `
            <div class="chip ${userInterests.includes(opt) ? 'active' : ''}" data-movie-chip="${opt}">
              ${opt}
            </div>
          `).join('')}
        </div>

        <div class="chip-q">🎵 Music & Audio</div>
        <div class="chip-grid">
          ${musicOptions.map(opt => `
            <div class="chip ${userMusic.includes(opt) ? 'active' : ''}" data-music-chip="${opt}">
              ${opt}
            </div>
          `).join('')}
        </div>

        <div class="chip-q">🎮 Gaming</div>
        <div class="chip-grid">
          ${gamingOptions.map(opt => `
            <div class="chip ${userGaming.includes(opt) ? 'active' : ''}" data-gaming-chip="${opt}">
              ${opt}
            </div>
          `).join('')}
        </div>

        <div class="chip-q">⚡ Productivity & Cloud</div>
        <div class="chip-grid">
          ${productivityOptions.map(opt => `
            <div class="chip ${userProductivity.includes(opt) ? 'active' : ''}" data-prod-chip="${opt}">
              ${opt}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3️⃣ Connected Devices -->
      <div class="pcard glass" style="margin-top:14px;">
        <h3>Connected Devices</h3>
        <div class="pcard-sub">Used to recommend the best streaming quality tier & ecosystem match</div>
        <div class="chip-grid" style="margin-top:10px;">
          ${devices.map(d => `
            <div class="chip ${userDevices.includes(d.id) ? 'active' : ''}" data-device-chip="${d.id}">
              ${d.label}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 4️⃣ Subscription Goals -->
      <div class="pcard glass" style="margin-top:14px;">
        <h3>Subscription Goals</h3>
        <div class="pcard-sub">How Trackey's optimizer algorithm should prioritize your portfolio</div>
        <div class="goal-grid">
          ${goals.map(g => `
            <div class="goal-card ${user.optimizationGoal === g.id ? 'active' : ''}" data-goal-id="${g.id}">
              <div class="goal-emoji">${g.emoji}</div>
              <div class="goal-body">
                <div class="goal-title">${g.title}</div>
                <div class="goal-desc">${g.desc}</div>
              </div>
              <div class="goal-check"></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Notification Alert Toggles -->
      <div class="pcard glass" style="margin-top:14px;">
        <h3>Alert Preferences</h3>
        <div class="pcard-sub">Automated alerts for renewals and trial expiry</div>

        <div class="toggle-row">
          <div>
            <div class="toggle-row-label">Upcoming Renewal Alerts</div>
            <div class="toggle-row-sub">Remind me 3 days before any renewal</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-renewals" ${notifications.renewals ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div>
            <div class="toggle-row-label">Free Trial Expiry Warnings</div>
            <div class="toggle-row-sub">Alert 48 hours before paid conversion</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-trials" ${notifications.trials ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div>
            <div class="toggle-row-label">Ghost Subscription Alerts</div>
            <div class="toggle-row-sub">Notify when paying for uninstalled apps</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-ghosts" ${notifications.ghostSubscriptions ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- 5️⃣ Account Security & Session Management -->
      <div class="pcard glass" style="margin-top:14px;">
        <h3>Account & Security</h3>
        <div class="pcard-sub">Manage active session, connected credentials & switch profile</div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:var(--bg-deep); border-radius:10px;">
            <div>
              <div style="font-size:12px; font-weight:700; color:var(--navy);">Logged in as <span style="color:var(--primary);">${user.name || 'Alex'}</span></div>
              <div style="font-size:11px; color:var(--muted);">${user.email || 'alex@email.com'}</div>
            </div>
            <span class="auth-badge-pill">Verified</span>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="opt-nav-btn secondary" id="profile-switch-account-bottom-btn" style="flex:1; font-size:12px; padding:10px 14px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/><polyline points="19 8 22 11 19 14"/></svg>
              <span>Login with another Account</span>
            </button>
            <button class="opt-nav-btn secondary" id="profile-sign-out-btn" style="flex:0 0 auto; min-width:85px; font-size:12px; padding:10px 14px; color:#EF4444; border-color:rgba(239,68,68,0.25);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy Assurance -->
      <div class="why-card" style="margin-top:14px; margin-bottom:24px;">
        <strong>🔒 Privacy-First Preferences</strong>
        Your profile preferences remain stored strictly locally and on your secure Trackey instance. No bank credentials or sensitive tokens required.
      </div>
    </div>
  `;
}

