export function renderLoginScreen(state) {
  const { user = {}, loginMode = 'signin' } = state;
  const isSignUp = loginMode === 'signup';

  const demoAccounts = [
    { name: 'Alex Kumar', email: 'alex@email.com', budget: 1000, tag: 'Power Streamer', goal: 'best_value' },
    { name: 'Priya Sharma', email: 'priya.s@gmail.com', budget: 800, tag: 'Budget Optimizer', goal: 'lowest_cost' },
    { name: 'David Miller', email: 'david.m@outlook.com', budget: 1500, tag: 'Entertainment Fan', goal: 'variety' }
  ];

  return `
    <div class="scroll" id="login-screen-view">
      <!-- Top Navigation & Brand -->
      <div class="login-header">
        <button class="login-back-btn" id="login-back-btn" title="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div class="login-header-badge">
          <span class="badge-dot"></span>
          <span>Bank-Grade Encryption</span>
        </div>
      </div>

      <!-- Auth Hero Banner -->
      <div class="login-hero">
        <div class="login-brand-icon">
          <svg viewBox="0 0 32 32" fill="none" width="34" height="34">
            <path d="M16 3L4 9v7c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V9L16 3z" fill="#2F6FED"/>
            <path d="M11 16l3.5 3.5L21 12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="login-title">${isSignUp ? 'Create your Trackey Account' : 'Welcome back to Trackey'}</h1>
        <p class="login-subtitle">${isSignUp ? 'Start optimizing your subscriptions and saving money effortlessly.' : 'Sign in to access your subscriptions, AI insights, and savings plan.'}</p>
      </div>

      <!-- Auth Mode Switcher Tabs -->
      <div class="auth-tabs">
        <button class="auth-tab-btn ${!isSignUp ? 'active' : ''}" id="auth-tab-signin" data-auth-mode="signin">Sign In</button>
        <button class="auth-tab-btn ${isSignUp ? 'active' : ''}" id="auth-tab-signup" data-auth-mode="signup">Create Account</button>
      </div>

      <!-- Main Auth Card -->
      <div class="auth-card glass">
        <form id="auth-form" onsubmit="return false;">
          ${isSignUp ? `
            <div class="auth-input-group">
              <label class="auth-label" for="auth-name-input">Full Name</label>
              <div class="auth-input-wrap">
                <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="auth-name-input" class="auth-input" placeholder="e.g. Alex Kumar" required value="${user.name || ''}" autocomplete="name">
              </div>
            </div>
          ` : ''}

          <div class="auth-input-group">
            <label class="auth-label" for="auth-email-input">Email Address</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input type="email" id="auth-email-input" class="auth-input" placeholder="alex@email.com" required value="${user.email || 'alex@email.com'}" autocomplete="email">
            </div>
          </div>

          <div class="auth-input-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <label class="auth-label" for="auth-password-input" style="margin-bottom:0;">Password</label>
              ${!isSignUp ? `<a href="javascript:void(0)" class="auth-forgot-link" id="auth-forgot-btn">Forgot password?</a>` : ''}
            </div>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="auth-password-input" class="auth-input" placeholder="••••••••••••" required value="trackey1234" autocomplete="current-password">
              <button type="button" class="auth-password-toggle" id="auth-password-toggle" title="Toggle password visibility">
                <svg id="pwd-eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-options-row">
            <label class="auth-checkbox-label">
              <input type="checkbox" id="auth-remember-check" checked>
              <span>Keep me signed in</span>
            </label>
            <span class="auth-badge-status">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              SSL Secured
            </span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="auth-submit-btn" id="auth-submit-btn">
            <span id="auth-btn-label">${isSignUp ? 'Create Trackey Account →' : 'Sign In to Trackey →'}</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <!-- Social / Quick Sign In -->
        <div class="social-auth-grid">
          <button class="social-auth-btn" id="social-google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>Google</span>
          </button>
          <button class="social-auth-btn" id="social-passkey-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7l-10-4-10 4v5Z"/><circle cx="12" cy="11" r="2"/></svg>
            <span>Passkey</span>
          </button>
        </div>
      </div>

      <!-- 1-Click Quick Demo Switcher -->
      <div class="demo-accounts-card glass">
        <div class="demo-card-header">
          <div class="demo-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Quick Demo Profiles (1-Click Login)</span>
          </div>
          <span class="demo-badge">Instant Switch</span>
        </div>
        <p class="demo-card-desc">Select any test profile to instantly populate customized subscription data:</p>

        <div class="demo-profile-list">
          ${demoAccounts.map(acc => `
            <button class="demo-profile-item ${user.email === acc.email ? 'active' : ''}" data-demo-email="${acc.email}" data-demo-name="${acc.name}" data-demo-budget="${acc.budget}" data-demo-goal="${acc.goal}">
              <div class="demo-avatar">${acc.name[0]}</div>
              <div class="demo-info">
                <div class="demo-name">${acc.name} <span class="demo-tag">${acc.tag}</span></div>
                <div class="demo-sub">Budget: ₹${acc.budget}/mo • ${acc.email}</div>
              </div>
              <div class="demo-arrow">→</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Security Guarantee Note -->
      <div class="auth-security-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Trackey protects your privacy. We never store banking passwords or charge cards directly.</span>
      </div>
    </div>
  `;
}
