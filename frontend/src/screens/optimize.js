import { renderMovieCard } from '../components/movieCard.js';
import { getServiceLogo } from '../components/brandLogos.js';
import { UPCOMING_RELEASES } from '../data/recommendations.js';

export function renderOptimizeScreen(state) {
  const currentStep = state.optimizerStep || 1;
  const { user = {}, wishlist = [], movies = [], subscriptions = [], optimizer = null } = state;

  const paidSubs = subscriptions.filter(s => !s.free);
  const totalCurrentSpend = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);
  const lowUsageSubs = subscriptions.filter(s => s.status === 'low' || (s.usedDays !== undefined && s.usedDays <= 4 && s.price > 0));

  // Dynamic values derived from OpenAI optimizer or state
  const currentSpend = optimizer?.current_monthly_spending ?? (totalCurrentSpend || 1984);
  const budgetVal = user.monthlyBudget || 1000;
  const savingsVal = optimizer?.total_potential_monthly_saving ?? 699;
  const yearlySavingsVal = optimizer?.total_potential_yearly_saving ?? (savingsVal * 12);
  const optimizedSpend = optimizer?.optimized_monthly_spending ?? Math.max(0, currentSpend - savingsVal);
  const overBudgetAmt = Math.max(0, currentSpend - budgetVal);
  const aiEngineName = optimizer?.ai_engine_used || 'OpenAI Intelligence';

  const wishlistSet = new Set((wishlist || []).map(w => w.content_id || w.id));

  // Step definitions
  const steps = [
    { id: 1, label: 'Overview', title: 'Current Portfolio' },
    { id: 2, label: 'Attention', title: 'Items Needing Attention' },
    { id: 3, label: 'AI Plan', title: 'Your Optimized Plan' },
    { id: 4, label: 'Future', title: 'Future Recommendations' },
    { id: 5, label: 'Switch', title: 'Better Service for You' }
  ];

  return `
    <div class="scroll">
      <!-- Optimizer Hero with AI Intelligence Badge -->
      <div class="opt-hero" style="display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <h1>Subscription Optimizer</h1>
          <button id="opt-reanalyze-ai-btn" class="ghost-cta" style="font-size:11px;padding:4px 9px;border-radius:8px;background:var(--primary-soft);color:var(--primary);border:1px solid rgba(47,111,237,0.25);font-weight:700;display:flex;align-items:center;gap:4px;cursor:pointer;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Re-Analyze AI
          </button>
        </div>
        <p style="display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted);">
          <span>AI-guided step-by-step portfolio restructuring</span>
          <span style="display:inline-block;width:3px;height:3px;border-radius:50%;background:var(--muted);"></span>
          <span style="color:var(--primary);font-weight:700;">⚡ ${aiEngineName}</span>
        </p>
      </div>

      <!-- Top Horizontal Step Navigation -->
      <div class="opt-step-bar" id="opt-step-bar">
        ${steps.map(s => `
          <button class="opt-step-pill ${currentStep === s.id ? 'active' : (currentStep > s.id ? 'completed' : '')}" 
                  data-opt-step="${s.id}" id="opt-step-pill-${s.id}">
            <span class="step-num">${s.id}</span>
            <span>${s.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Step Progress Indicator -->
      <div class="opt-step-progress">
        <div class="opt-step-progress-header">
          <span>Step ${currentStep} of 5 · ${steps[currentStep - 1].title}</span>
          <span>${Math.round((currentStep / 5) * 100)}%</span>
        </div>
        <div class="opt-step-progress-track">
          <div class="opt-step-progress-fill" style="width: ${(currentStep / 5) * 100}%;"></div>
        </div>
      </div>

      <!-- Active Section View -->
      ${renderActiveSection(currentStep, {
        currentSpend,
        budgetVal,
        savingsVal,
        yearlySavingsVal,
        optimizedSpend,
        overBudgetAmt,
        subscriptions,
        lowUsageSubs,
        wishlistSet,
        movies,
        optimizer,
        state
      })}
    </div>
  `;
}

function renderActiveSection(step, ctx) {
  switch (step) {
    case 1:
      return renderSection1Overview(ctx);
    case 2:
      return renderSection2Attention(ctx);
    case 3:
      return renderSection3AiPlan(ctx);
    case 4:
      return renderSection4Future(ctx);
    case 5:
      return renderSection5ServiceSwitch(ctx);
    default:
      return renderSection1Overview(ctx);
  }
}

/* ==========================================================================
   SECTION 1 — CURRENT PORTFOLIO / OVERVIEW
   ========================================================================== */
function renderSection1Overview({ currentSpend, budgetVal, savingsVal, yearlySavingsVal, overBudgetAmt, subscriptions, lowUsageSubs, optimizer }) {
  const activeCount = subscriptions.length || 9;
  const attentionCount = optimizer?.attention_items?.length || lowUsageSubs.length || 3;
  const summaryText = optimizer?.summary || `Your subscription portfolio spends ₹${currentSpend}/mo across ${activeCount} services. Reviewing low-usage services and overlapping catalogs can recover ₹${savingsVal}/mo (₹${yearlySavingsVal}/year).`;

  return `
    <div class="opt-section-wrapper" id="opt-section-1">
      <div class="opt-card glass">
        <h3>Current Portfolio</h3>
        <p style="font-size:12px;color:var(--muted);margin-top:2px;">Real-time active subscription metrics and budget constraints</p>

        <!-- AI Executive Summary Callout -->
        <div style="margin-top:12px;padding:12px 14px;background:var(--primary-soft);border:1px solid rgba(47,111,237,0.2);border-radius:12px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <span style="font-size:11px;font-weight:800;color:var(--primary);text-transform:uppercase;">AI Optimizer Executive Summary</span>
          </div>
          <p style="font-size:12px;color:var(--navy);line-height:1.45;margin:0;">${summaryText}</p>
        </div>

        <!-- 4 Summary Metric Cards -->
        <div class="insight-summary" style="margin-top:14px;padding:0;background:none;border:none;box-shadow:none;">
          <div class="insight-summary-item" style="background:var(--white);padding:14px 12px;border:1px solid var(--line);border-radius:14px;">
            <div class="insight-summary-label">Monthly Spending</div>
            <div class="insight-summary-value" style="font-size:18px;font-weight:800;color:var(--navy);margin-top:4px;">₹${currentSpend}</div>
          </div>
          <div class="insight-summary-item" style="background:var(--white);padding:14px 12px;border:1px solid var(--line);border-radius:14px;">
            <div class="insight-summary-label">Active Subscriptions</div>
            <div class="insight-summary-value" style="font-size:18px;font-weight:800;color:var(--navy);margin-top:4px;">${activeCount}</div>
          </div>
          <div class="insight-summary-item" style="background:var(--white);padding:14px 12px;border:1px solid var(--line);border-radius:14px;">
            <div class="insight-summary-label">Attention Alerts</div>
            <div class="insight-summary-value warn" style="font-size:18px;font-weight:800;margin-top:4px;">${attentionCount}</div>
          </div>
          <div class="insight-summary-item" style="background:var(--white);padding:14px 12px;border:1px solid var(--line);border-radius:14px;">
            <div class="insight-summary-label">Potential Savings</div>
            <div class="insight-summary-value" style="font-size:18px;font-weight:800;color:var(--success);margin-top:4px;">₹${savingsVal}</div>
          </div>
        </div>

        <!-- Monthly Budget Target -->
        <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--line);">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="field-label" style="font-weight:800;color:var(--navy);font-size:13px;">Monthly Budget Target</div>
            <span style="font-size:12px;font-weight:700;color:var(--primary);">₹${budgetVal} / month</span>
          </div>

          <div class="budget-row" style="margin-top:10px;">
            <input type="number" class="budget-input" id="opt-budget-input" value="${budgetVal}" placeholder="1000">
            <button class="budget-save-btn" id="opt-save-budget-btn">Update</button>
          </div>

          <!-- Dynamic Budget Status Message -->
          <div class="budget-status ${currentSpend > budgetVal ? 'over' : 'under'}" style="margin-top:12px;padding:10px 12px;border-radius:10px;background:${currentSpend > budgetVal ? 'var(--danger-soft)' : 'var(--success-soft)'};">
            ${currentSpend > budgetVal 
              ? `⚠️ Current spending is ₹${overBudgetAmt} over your target budget of ₹${budgetVal}/mo.` 
              : `✨ Current spending is ₹${budgetVal - currentSpend} within your monthly budget of ₹${budgetVal}/mo.`}
          </div>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="opt-nav-footer">
        <button class="opt-nav-btn primary" id="opt-next-to-attention">
          Continue to Analysis →
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SECTION 2 — ITEMS NEEDING ATTENTION
   ========================================================================== */
function renderSection2Attention({ subscriptions, optimizer }) {
  const attentionItems = optimizer?.attention_items && optimizer.attention_items.length > 0
    ? optimizer.attention_items
    : [
        {
          id: 'netflix',
          subscription_id: 'netflix',
          name: 'Netflix',
          price: 199,
          badge: 'Renewal in 3 days',
          severity_tag: 'leakreview',
          reason: 'Renewal in 3 days + Low usage (Used 2 days this month)',
          icon_emoji: '🍿'
        },
        {
          id: 'jiohotstar',
          subscription_id: 'jiohotstar',
          name: 'JioHotstar',
          price: 149,
          badge: 'Upcoming renewal',
          severity_tag: 'review',
          reason: 'Moderate usage with renewal scheduled in 6 days',
          icon_emoji: '🏏'
        },
        {
          id: 'trial_canva',
          subscription_id: 'canva',
          name: 'Free Trial: Canva Pro',
          price: 499,
          badge: 'Trial Ending',
          severity_tag: 'review',
          reason: 'Canva Pro trial ends in 2 days. Will automatically charge ₹499/month.',
          icon_emoji: '🎁'
        },
        {
          id: 'ghost_duolingo',
          subscription_id: 'duolingo',
          name: 'Ghost App: Duolingo Super',
          price: 299,
          badge: 'Ghost App',
          severity_tag: 'leakreview',
          reason: 'App uninstalled 18 days ago, but subscription is actively billing ₹299/mo.',
          icon_emoji: '👻'
        }
      ];

  return `
    <div class="opt-section-wrapper" id="opt-section-2">
      <div class="opt-card glass">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <h3>Items Needing Attention</h3>
          <span class="severity-tag leak"><div class="dot"></div>${attentionItems.length} Alerts</span>
        </div>
        <p style="font-size:12px;color:var(--muted);">Priority AI review for upcoming renewals, low usage, ghost apps & trials</p>

        <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px;">
          ${attentionItems.map(item => {
            const sub = subscriptions.find(s => s.id === item.subscription_id);
            const logo = getServiceLogo(sub?.name || item.name, sub?.color || '#2F6FED');
            const isGhostOrTrial = item.type === 'ghost' || item.type === 'trial' || item.id.includes('ghost') || item.id.includes('trial');
            const isDanger = item.severity_tag === 'leakreview' || item.type === 'ghost';

            return `
              <div class="attention-item" id="attention-card-${item.id}" 
                   style="${isGhostOrTrial ? `border:1.5px dashed ${isDanger ? 'rgba(224,93,93,0.5)' : 'rgba(224,138,44,0.5)'};background:${isDanger ? 'rgba(254,242,242,0.6)' : 'rgba(254,248,235,0.6)'};` : ''}">
                <div class="sub-logo-wrap" style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
                  ${isGhostOrTrial 
                    ? `<span style="font-size:20px;">${item.icon_emoji || (isDanger ? '👻' : '🎁')}</span>` 
                    : logo}
                </div>
                <div class="attention-body">
                  <div class="attention-title" style="${isDanger ? 'color:var(--danger);' : ''}">
                    ${item.name}
                    <span class="action-tag ${item.severity_tag || 'leakreview'}" style="font-size:9.5px;">${item.badge}</span>
                  </div>
                  <div class="attention-reason">${item.reason}</div>
                </div>
                <button class="attention-btn" style="${isDanger ? 'color:var(--danger);' : ''}" data-sub-id="${item.subscription_id || 'netflix'}">Review →</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="opt-nav-footer">
        <button class="opt-nav-btn secondary" id="opt-back-to-overview">
          ← Back
        </button>
        <button class="opt-nav-btn primary" id="opt-next-to-plan">
          Continue to Optimization →
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SECTION 3 — AI OPTIMIZED PLAN
   ========================================================================== */
function renderSection3AiPlan({ currentSpend, savingsVal, yearlySavingsVal, optimizedSpend, subscriptions, optimizer, state }) {
  const isPlanApplied = state.planApplied || false;

  const factors = optimizer?.factors_analyzed || [
    "Spending vs Budget",
    "Usage Frequency",
    "Last Used Days",
    "Cost per Usage",
    "Ghost Subscriptions",
    "Free Trials Ending",
    "User Interests",
    "Upcoming OTT Content"
  ];

  const recommendations = optimizer?.recommendations && optimizer.recommendations.length > 0
    ? optimizer.recommendations
    : [
        {
          subscription: 'Spotify',
          subscription_id: 'spotify',
          action: 'keep',
          action_label: 'KEEP',
          tag_class: 'keep',
          reason: 'High active usage (24 days) and strong alignment with your daily routines.',
          meta: 'High usage (24 days) · Score: 9.1/10',
          current_monthly_price: 119,
          estimated_monthly_saving: 0
        },
        {
          subscription: 'Prime Video',
          subscription_id: 'primevideo',
          action: 'switch',
          action_label: 'SWITCH / SUBSCRIBE',
          tag_class: 'info',
          reason: '4 upcoming releases next month match your sci-fi and action interests.',
          meta: 'Matches 4 upcoming releases · Score: 8.9/10',
          current_monthly_price: 299,
          estimated_monthly_saving: 0
        },
        {
          subscription: 'Netflix',
          subscription_id: 'netflix',
          action: 'pause',
          action_label: 'PAUSE / CANCEL',
          tag_class: 'leakreview',
          reason: 'You haven\'t used Netflix recently (2 days active), while Prime Video releases align better. Pausing saves ₹199/mo.',
          meta: 'Used 2 days · Save ₹199/mo',
          current_monthly_price: 199,
          estimated_monthly_saving: 199
        },
        {
          subscription: 'Canva Pro',
          subscription_id: 'canva',
          action: 'cancel',
          action_label: 'CANCEL TRIAL',
          tag_class: 'review',
          reason: 'Free trial ends in 2 days. Cancel before renewal to avoid ₹499/mo charge, or downgrade to Canva Free.',
          meta: 'Trial ends in 2d · Save ₹499/mo',
          current_monthly_price: 499,
          estimated_monthly_saving: 499
        },
        {
          subscription: 'Duolingo Super',
          subscription_id: 'duolingo',
          action: 'cancel',
          action_label: 'CANCEL GHOST APP',
          tag_class: 'leakreview',
          reason: 'App uninstalled 18 days ago with zero recent usage. Cancelling stops immediate ₹299/mo money leak.',
          meta: 'Uninstalled · Save ₹299/mo',
          current_monthly_price: 299,
          estimated_monthly_saving: 299
        }
      ];

  return `
    <div class="opt-section-wrapper" id="opt-section-3">
      <div class="opt-card glass">
        <h3>Your Optimized Plan</h3>
        <p style="font-size:12px;color:var(--muted);">AI-rebalanced portfolio maximizing usage return and saving ₹${savingsVal}/mo (₹${yearlySavingsVal}/year)</p>

        <!-- AI Analyzed Factors Chips -->
        <div class="opt-ai-factors-box">
          <div class="opt-ai-factors-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            AI Analyzed Parameters (${factors.length})
          </div>
          <div class="opt-ai-factors-list">
            ${factors.map(f => `<span class="opt-factor-chip">${f}</span>`).join('')}
          </div>
        </div>

        <!-- Current vs Optimized Cost Banner -->
        <div class="portfolio-compare" style="margin-top:14px;">
          <div class="portfolio-col">
            <div class="portfolio-col-label">Current Monthly Cost</div>
            <div class="portfolio-col-amt">₹${currentSpend}<span style="font-size:10px;font-weight:500;color:var(--muted);">/mo</span></div>
            <div class="portfolio-col-count">${subscriptions.length} active subscriptions</div>
          </div>
          <div class="portfolio-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div class="portfolio-col recommended">
            <div class="portfolio-col-label" style="color:var(--primary);">Optimized Monthly Cost</div>
            <div class="portfolio-col-amt" style="color:var(--primary);">₹${optimizedSpend}<span style="font-size:10px;font-weight:500;color:var(--primary);">/mo</span></div>
            <div class="portfolio-col-count">Potential Savings: ₹${savingsVal}/mo</div>
          </div>
        </div>

        ${isPlanApplied ? `
          <div class="opt-plan-applied-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <div style="font-size:13px;font-weight:800;">Optimized Plan Applied!</div>
              <div style="font-size:11px;opacity:0.9;">Your monthly subscriptions have been successfully restructured.</div>
            </div>
          </div>
        ` : ''}

        <!-- Dynamic Action Items List -->
        <div style="margin-top:18px;">
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:10px;">Recommended Action Plan (${recommendations.length} Services):</div>

          ${recommendations.map(rec => {
            const sub = subscriptions.find(s => s.id === rec.subscription_id || s.name.toLowerCase() === rec.subscription.toLowerCase());
            const logo = getServiceLogo(rec.subscription, sub?.color || '#2F6FED');
            const hasReviewAction = rec.action === 'pause' || rec.action === 'cancel' || rec.action === 'review';

            return `
              <div class="opt-row" id="plan-item-${rec.subscription_id}">
                <div class="sub-logo-wrap" style="width:36px;height:36px;">
                  ${logo}
                </div>
                <div class="opt-row-body">
                  <div class="opt-row-name">
                    ${rec.subscription}
                    <span class="action-tag ${rec.tag_class || 'keep'}">${rec.action_label || rec.action.toUpperCase()}</span>
                  </div>
                  <div class="opt-row-meta">${rec.meta || `Price: ₹${rec.current_monthly_price}/mo`}</div>
                  <div class="opt-row-reason">${rec.reason}</div>
                </div>
                <div class="opt-row-right">
                  <div class="opt-row-price">₹${Math.round(rec.current_monthly_price || sub?.price || 0)}</div>
                  ${hasReviewAction ? `
                    <button class="opt-action-btn" data-sub-id="${rec.subscription_id}">Review</button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Primary CTA to Apply Plan -->
        <button class="cta" id="opt-apply-plan-btn" style="margin-top:18px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ${isPlanApplied ? 'Plan Applied (Tap to Re-Apply)' : 'Apply My Plan →'}
        </button>
      </div>

      <!-- Navigation Footer -->
      <div class="opt-nav-footer">
        <button class="opt-nav-btn secondary" id="opt-back-to-attention">
          ← Back
        </button>
        <button class="opt-nav-btn primary" id="opt-next-to-future">
          Continue to Future Recs →
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SECTION 4 — FUTURE SUBSCRIPTION RECOMMENDATIONS
   ========================================================================== */
function renderSection4Future({ wishlistSet, optimizer }) {
  const allReleases = (UPCOMING_RELEASES && UPCOMING_RELEASES.length > 0) ? UPCOMING_RELEASES : [
    {
      id: 'm_dune2',
      title: 'Dune: Part Two',
      genre: 'Sci-Fi / Action',
      releaseDate: '18 Sep 2026',
      ottPlatform: 'Prime Video',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      matchScore: 96,
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w'
    },
    {
      id: 'm_gladiator2',
      title: 'Gladiator II',
      genre: 'Action / Epic Drama',
      releaseDate: '24 Sep 2026',
      ottPlatform: 'Prime Video',
      posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
      matchScore: 92,
      trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo'
    },
    {
      id: 'm_deadpool',
      title: 'Deadpool & Wolverine',
      genre: 'Superhero / Action',
      releaseDate: '12 Sep 2026',
      ottPlatform: 'Disney+ / JioHotstar',
      posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
      matchScore: 94,
      trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk'
    },
    {
      id: 'm_ringsofpower2',
      title: 'The Rings of Power S2',
      genre: 'Epic Fantasy / Adventure',
      releaseDate: '05 Sep 2026',
      ottPlatform: 'Prime Video',
      posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
      matchScore: 91,
      trailerUrl: 'https://www.youtube.com/watch?v=TCwZDDn6190'
    },
    {
      id: 'm_squidgame2',
      title: 'Squid Game: Season 2',
      genre: 'Thriller / Mystery',
      releaseDate: '29 Sep 2026',
      ottPlatform: 'Netflix',
      posterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80',
      matchScore: 84,
      trailerUrl: 'https://www.youtube.com/watch?v=lB_v2c943L4'
    },
    {
      id: 'm_theboys4',
      title: 'The Boys: Season 4',
      genre: 'Action / Dark Comedy',
      releaseDate: '15 Sep 2026',
      ottPlatform: 'Prime Video',
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
      matchScore: 90,
      trailerUrl: 'https://www.youtube.com/watch?v=EzFXDvC-n_E'
    }
  ];

  const topPlatform = optimizer?.future_recommendations?.top_platform || 'Prime Video';
  const topPrice = optimizer?.future_recommendations?.price || 299;
  const headline = optimizer?.future_recommendations?.headline || '4 upcoming releases next month match your action, sci-fi and superhero interests.';
  const verdict = optimizer?.future_recommendations?.verdict || 'Subscribe to Prime Video next month instead of renewing Netflix.';
  const potentialSaving = optimizer?.future_recommendations?.potential_saving || 200;

  const logoTop = getServiceLogo(topPlatform, '#00A8E1');

  return `
    <div class="opt-section-wrapper" id="opt-section-4">
      <div class="opt-card glass">
        <h3>Future Recommendations</h3>
        <p style="font-size:12px;color:var(--primary);font-weight:700;margin-top:2px;">What should you subscribe to next month?</p>

        <!-- OTT Recommendation Card (Personalized) -->
        <div class="future-card glass" style="margin-top:14px;background:var(--white);border:1.5px solid rgba(47,111,237,0.3);">
          <div class="future-card-head" style="align-items:center;">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoTop}
            </div>
            <div>
              <h3 style="font-size:15px;">${topPlatform}</h3>
              <div style="font-size:11px;color:var(--muted);font-weight:600;">Estimated: ₹${topPrice} / month</div>
            </div>
            <span class="future-badge recommend" style="margin-left:auto;">TOP RECOMMENDATION</span>
          </div>

          <!-- Interest Alignment Reason -->
          <div style="margin-top:12px;font-size:12.5px;color:var(--navy);font-weight:700;line-height:1.45;">
            "${headline}"
          </div>

          <!-- Upcoming Release Posters Carousel with Real Visual Artworks -->
          <div style="margin-top:14px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.3px;">
                Upcoming Releases & Posters (${allReleases.length})
              </div>
              <span style="font-size:10.5px;color:var(--primary);font-weight:700;">Swipe to explore →</span>
            </div>
            <div class="movie-carousel" id="opt-future-carousel" style="padding-bottom:8px;">
              ${allReleases.map(m => renderMovieCard(m, wishlistSet.has(m.id))).join('')}
            </div>
          </div>

          <!-- AI Strategic Verdict Banner -->
          <div class="ai-verdict-card" style="margin-top:12px;padding:12px 14px;background:var(--primary-soft);border:none;border-radius:12px;">
            <div style="font-size:11px;font-weight:800;color:var(--primary);text-transform:uppercase;">AI Recommendation</div>
            <div style="font-size:12.5px;font-weight:700;color:var(--navy);margin-top:3px;">
              ${verdict}
            </div>
            <div style="font-size:11.5px;color:var(--success);font-weight:800;margin-top:4px;">
              Potential saving: ₹${potentialSaving} / month
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex;gap:8px;margin-top:14px;">
            <button class="opt-nav-btn secondary" style="flex:1;font-size:12px;" id="opt-view-releases-btn">
              View Releases
            </button>
            <button class="opt-nav-btn primary" style="flex:1;font-size:12px;" id="opt-add-wishlist-all">
              Add All to Wishlist ★
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="opt-nav-footer">
        <button class="opt-nav-btn secondary" id="opt-back-to-plan">
          ← Back
        </button>
        <button class="opt-nav-btn primary" id="opt-next-to-switch">
          Continue to Service Switch →
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SECTION 5 — SERVICE SWITCH RECOMMENDATIONS
   ========================================================================== */
function renderSection5ServiceSwitch({ optimizer }) {
  const switches = optimizer?.service_switches && optimizer.service_switches.length > 0
    ? optimizer.service_switches
    : [
        {
          current_service: "Spotify",
          current_id: "spotify",
          current_price: 119,
          current_why: "High active daily commute & workout usage.",
          recommended_service: "Apple Music",
          recommended_id: "applemusic",
          recommended_price: 99,
          recommended_saving: 20,
          recommended_why: "Spatial audio + Apple devices native Siri integration.",
          match_pct: 95,
          analyzed_factors: "Device ecosystem · Music usage · Podcasts · Lossless audio",
          quote: "You use iPhone, AirPods and Mac. Apple Music provides better ecosystem integration and Lossless Audio."
        },
        {
          current_service: "Netflix",
          current_id: "netflix",
          current_price: 199,
          current_why: "Low viewing activity this billing cycle (2 days).",
          recommended_service: "Prime Video",
          recommended_id: "primevideo",
          recommended_price: 299,
          recommended_saving: 0,
          recommended_why: "Includes fast shopping delivery + upcoming Dune 2 and Rings of Power S2.",
          match_pct: 92,
          analyzed_factors: "Content alignment · Monthly cost · Included perks",
          quote: "Your Netflix usage dropped to 2 days while Prime Video has 4 major releases matching your sci-fi watchlist next month."
        },
        {
          current_service: "Canva Pro",
          current_id: "canva",
          current_price: 500,
          current_why: "Paying full pro tier for infrequent usage (3 days/mo).",
          recommended_service: "Canva Free / Adobe Express",
          recommended_id: "canva_free",
          recommended_price: 0,
          recommended_saving: 500,
          recommended_why: "100% adequate for 3-day lightweight graphics.",
          match_pct: 88,
          analyzed_factors: "Monthly usage frequency (3 days/mo)",
          quote: "You create graphics on only 3 days per month. The free tier covers all your export requirements without paying ₹500/mo."
        }
      ];

  return `
    <div class="opt-section-wrapper" id="opt-section-5">
      <div class="opt-card glass">
        <h3>Better Service for You</h3>
        <p style="font-size:12px;color:var(--muted);">Personalized comparisons and ecosystem alignment based on actual usage</p>

        ${switches.map(sw => `
          <div class="service-switch-card">
            <div class="switch-header">
              <div class="switch-pair-badge">
                <span>${sw.current_service}</span>
                <span style="color:var(--primary);">→</span>
                <span>${sw.recommended_service}</span>
              </div>
              <span class="switch-match-pill" style="${sw.match_pct < 90 ? 'color:var(--success);background:var(--success-soft);' : ''}">${sw.match_pct}% Match</span>
            </div>

            <div class="switch-factors-bar">
              <span>Analyzed:</span> ${sw.analyzed_factors}
            </div>

            <div class="switch-quote-box">
              "${sw.quote}"
            </div>

            <div class="switch-details-grid">
              <div class="switch-detail-box">
                <div class="switch-detail-label">Current Service</div>
                <div class="switch-detail-name">${sw.current_service}</div>
                <div class="switch-detail-price">₹${sw.current_price} / month</div>
                <div class="switch-why">${sw.current_why}</div>
              </div>

              <div class="switch-detail-box recommended">
                <div class="switch-detail-label" style="color:var(--primary);">Recommended</div>
                <div class="switch-detail-name">${sw.recommended_service}</div>
                <div class="switch-detail-price" style="color:var(--success);">
                  ₹${sw.recommended_price} / month ${sw.recommended_saving > 0 ? `(Save ₹${sw.recommended_saving})` : ''}
                </div>
                <div class="switch-why">${sw.recommended_why}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Navigation Footer -->
      <div class="opt-nav-footer">
        <button class="opt-nav-btn secondary" id="opt-back-to-future">
          ← Back
        </button>
        <button class="opt-nav-btn primary" id="opt-complete-journey">
          Return to Overview ✨
        </button>
      </div>
    </div>
  `;
}
