import { renderSubCard } from '../components/subscriptionCard.js';

export function renderSubscriptionsScreen(state) {
  const { subscriptions = [], selectedCategory = 'all' } = state;

  const paidSubs = subscriptions.filter(s => !s.free);
  const totalMonthly = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);

  const ghostSubs = subscriptions.filter(s => s.appInstalled === false);
  const trialSubs = subscriptions.filter(s => s.trialDaysLeft !== undefined && s.trialDaysLeft !== null);

  let filteredSubs = subscriptions;
  if (selectedCategory === 'all') {
    filteredSubs = subscriptions;
  } else if (selectedCategory === 'ghost') {
    filteredSubs = ghostSubs;
  } else if (selectedCategory === 'trials') {
    filteredSubs = trialSubs;
  } else {
    filteredSubs = subscriptions.filter(s => (s.category || '').toLowerCase() === selectedCategory.toLowerCase());
  }

  const categories = [
    { id: 'all', label: 'All', count: subscriptions.length },
    { id: 'movies', label: 'Movies', count: subscriptions.filter(s => s.category === 'movies').length },
    { id: 'music', label: 'Music', count: subscriptions.filter(s => s.category === 'music').length },
    { id: 'games', label: 'Games', count: subscriptions.filter(s => s.category === 'games').length },
    { id: 'others', label: 'Others', count: subscriptions.filter(s => s.category === 'others').length },
    { id: 'trials', label: '🎁 Trials', count: trialSubs.length },
    { id: 'ghost', label: '👻 Ghost Apps', count: ghostSubs.length }
  ];

  return `
    <div class="scroll">
      <!-- 1. Service Library Header -->
      <div class="hero" style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
        <div>
          <h1>Service Library</h1>
          <p>Active portfolio · ${subscriptions.length} services · ₹${Math.round(totalMonthly)}/mo</p>
        </div>
        <button class="analysis-btn" id="subs-header-add-btn" style="background:var(--primary); border:none; padding:8px 13px; font-size:12px;">
          <span>+ Add</span>
        </button>
      </div>

      <!-- 2. Search & Category Filters Bar with Ghost Apps & Free Trials Tabs -->
      <div class="pills" id="subs-category-pills" style="margin-top:14px; overflow-x:auto; flex-wrap:nowrap; padding-bottom:4px;">
        ${categories.map(cat => `
          <div class="pill ${selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="white-space:nowrap; flex-shrink:0;">
            ${cat.label} ${cat.count !== undefined ? `<span style="font-size:10px; opacity:0.85; margin-left:3px; font-weight:700;">(${cat.count})</span>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- 3. Subscriptions Library Cards List -->
      <div class="sub-list" id="subs-cards-list" style="margin-top:14px; margin-bottom:24px;">
        ${filteredSubs.length > 0 ? (
          filteredSubs.map(s => renderSubCard(s)).join('')
        ) : `
          <div style="padding:32px 20px; text-align:center; background:var(--white); border:1px solid var(--line); border-radius:var(--r-md); color:var(--muted); font-size:13px;">
            <div style="font-size:24px; margin-bottom:6px;">📦</div>
            <strong>No subscriptions found in this category</strong>
            <p style="font-size:11.5px; margin-top:4px; color:var(--muted-soft);">Tap "+ Add Subscription" below to track a new service.</p>
          </div>
        `}
      </div>
    </div>

    <!-- Floating Add Button -->
    <button class="fab-add" id="fab-add-sub" title="Add Subscription">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  `;
}

