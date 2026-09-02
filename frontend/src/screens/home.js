import { getServiceLogo } from '../components/brandLogos.js';

export function renderHomeScreen(state) {
  const { user = {}, subscriptions = [] } = state;

  const paidSubs = subscriptions.filter(s => !s.free);
  const totalSpend = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);
  const lowUsageSubs = paidSubs.filter(s => s.status === 'low' || (s.usedDays !== undefined && s.usedDays <= 4 && s.price > 0));
  const potentialSavings = 699; // Total actionable savings across low-usage, ghost & ending trials

  // Urgent attention items (renewals, trials, ghost detection)
  const attentionItems = [
    {
      id: 'netflix',
      icon: '⚠️',
      title: 'Netflix renews in 3 days',
      subtitle: 'AutoPay ₹199 · Only 2 days used this month',
      badge: 'Renewal',
      badgeClass: 'amber',
      actionLabel: 'Review',
      target: 'optimize',
      step: 2
    },
    {
      id: 'canva',
      icon: '🎁',
      title: 'Canva Pro trial ends in 2 days',
      subtitle: 'Auto-renews at ₹499/mo if not cancelled',
      badge: 'Trial Expiry',
      badgeClass: 'danger',
      actionLabel: 'Decide',
      target: 'optimize',
      step: 2
    },
    {
      id: 'duolingo',
      icon: '👻',
      title: 'Ghost Subscription Detected',
      subtitle: 'Duolingo Super (₹299/mo) — App uninstalled 18d ago',
      badge: 'Ghost App',
      badgeClass: 'danger',
      actionLabel: 'Cancel',
      target: 'optimize',
      step: 2
    }
  ];

  // Upcoming renewals (compact list of 3 imminent services)
  const upcomingRenewals = [
    {
      id: 'netflix',
      name: 'Netflix',
      price: 199,
      date: '15 Sep',
      daysLeft: 'In 3 days',
      autopay: 'Active',
      color: '#141414'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      price: 119,
      date: '18 Sep',
      daysLeft: 'In 6 days',
      autopay: 'Active',
      color: '#1DB954'
    },
    {
      id: 'primevideo',
      name: 'Prime Video',
      price: 299,
      date: '28 Sep',
      daysLeft: 'In 16 days',
      autopay: 'Active',
      color: '#00A8E1'
    }
  ];

  return `
    <div class="scroll">
      <!-- 1. Header Command Center Welcome -->
      <div class="hero">
        <h1>Command Center</h1>
        <p>Good morning, <span id="home-username">${user.name || 'Alex'}</span> · 3 items need your attention today</p>
      </div>

      <!-- 2. Command Top Spending & Savings Summary -->
      <div class="stat-row">
        <div class="stat-card" id="home-spend-stat" style="cursor:pointer;">
          <div class="stat-label">Monthly Spending</div>
          <div class="stat-value">₹${Math.round(totalSpend || 1984)}</div>
          <div class="stat-note">${subscriptions.length} active service${subscriptions.length === 1 ? '' : 's'}</div>
        </div>
        <div class="stat-card" id="home-savings-stat" style="cursor:pointer;">
          <div class="stat-label">Potential Savings</div>
          <div class="stat-value pos">₹${potentialSavings}</div>
          <div class="stat-note">3 recoverable leaks</div>
        </div>
      </div>

      <!-- 3. ATTENTION NEEDED (Urgent Items) -->
      <div class="section-head" style="margin-top:22px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:13.5px; line-height:1;">🚨</span>
          <h3>Attention Needed</h3>
        </div>
        <span class="see-all" id="home-see-all-attention">Solve All →</span>
      </div>

      <div class="attention-list">
        ${attentionItems.map(item => `
          <div class="attention-item" data-sub-id="${item.id}" data-action-target="${item.target}" data-action-step="${item.step}">
            <div class="attention-icon" style="background:${item.badgeClass === 'danger' ? 'var(--danger-soft)' : 'var(--amber-soft)'};">
              ${item.icon}
            </div>
            <div class="attention-body">
              <div class="attention-title">
                <span>${item.title}</span>
                <span class="renewal-badge" style="${item.badgeClass === 'danger' ? 'background:var(--danger-soft); color:var(--danger);' : 'background:var(--amber-soft); color:var(--amber);'}">${item.badge}</span>
              </div>
              <div class="attention-reason">${item.subtitle}</div>
            </div>
            <button class="attention-btn" data-sub-id="${item.id}" data-action-target="${item.target}" data-action-step="${item.step}">
              ${item.actionLabel}
            </button>
          </div>
        `).join('')}
      </div>

      <!-- 4. QUICK ACTIONS COMMAND GRID -->
      <div class="section-head" style="margin-top:24px;">
        <h3>Quick Actions</h3>
      </div>

      <div class="quick-actions-grid">
        <div class="quick-action-card" id="quick-action-add">
          <div style="width:36px; height:36px; border-radius:11px; background:var(--primary-soft); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:var(--navy); font-family:'Manrope',sans-serif;">Add Service</div>
            <div style="font-size:10.5px; color:var(--muted); font-weight:500;">Track new sub</div>
          </div>
        </div>

        <div class="quick-action-card" id="quick-action-optimize">
          <div style="width:36px; height:36px; border-radius:11px; background:var(--success-soft); color:var(--success); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:var(--navy); font-family:'Manrope',sans-serif;">Optimize</div>
            <div style="font-size:10.5px; color:var(--muted); font-weight:500;">Cut ₹699/mo</div>
          </div>
        </div>

        <div class="quick-action-card" id="quick-action-compare">
          <div style="width:36px; height:36px; border-radius:11px; background:var(--amber-soft); color:var(--amber); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
          </div>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:var(--navy); font-family:'Manrope',sans-serif;">Compare</div>
            <div style="font-size:10.5px; color:var(--muted); font-weight:500;">VS Battle view</div>
          </div>
        </div>

        <div class="quick-action-card" id="quick-action-insights">
          <div style="width:36px; height:36px; border-radius:11px; background:rgba(124,58,237,0.1); color:#7C3AED; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:var(--navy); font-family:'Manrope',sans-serif;">Analytics</div>
            <div style="font-size:10.5px; color:var(--muted); font-weight:500;">Data story</div>
          </div>
        </div>
      </div>

      <!-- 5. UPCOMING RENEWALS (Compact, actionable) -->
      <div class="section-head" style="margin-top:24px;">
        <h3>Upcoming Renewals</h3>
        <span class="see-all" id="home-see-all-renewals">Library (${subscriptions.length}) →</span>
      </div>

      <div class="renewal-list">
        ${upcomingRenewals.map(r => `
          <div class="renewal-card" data-sub-id="${r.id}">
            <div class="sub-logo-wrap" style="width:38px; height:38px; border-radius:11px;">
              ${getServiceLogo(r.name, r.color)}
            </div>
            <div class="renewal-info">
              <div class="renewal-title">${r.name} · ₹${r.price}/mo</div>
              <div class="renewal-sub">${r.date} · AutoPay ${r.autopay}</div>
            </div>
            <div class="renewal-badge">${r.daysLeft}</div>
          </div>
        `).join('')}
      </div>

      <!-- 6. Bottom AI Assistant Prompt -->
      <div class="ai-card" id="home-ai-recommendation-card" style="margin-top:22px; margin-bottom:14px; cursor:pointer;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--primary);"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <div style="flex:1; min-width:0;">
          <strong style="color:var(--navy);display:block;margin-bottom:2px;font-size:12.5px;font-weight:800;">Trackey AI Advisor</strong>
          <span style="font-size:11.5px;color:#1E3A73;line-height:1.4;">You can reduce your monthly bill from ₹1,984 to ₹1,285. Ask me how to optimize.</span>
        </div>
        <span style="font-size:11px;font-weight:700;color:var(--primary);background:rgba(47,111,237,0.1);padding:4px 9px;border-radius:8px;flex-shrink:0;">Chat →</span>
      </div>
    </div>
  `;
}

