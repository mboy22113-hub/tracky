import { renderMovieCard } from '../components/movieCard.js';
import { getServiceLogo } from '../components/brandLogos.js';
import { UPCOMING_RELEASES } from '../data/recommendations.js';

export function renderOptimizeScreen(state) {
  const currentStep = state.optimizerStep || 1;
  const { user = {}, wishlist = [], movies = [], subscriptions = [] } = state;

  const paidSubs = subscriptions.filter(s => !s.free);
  const totalCurrentSpend = paidSubs.reduce((acc, s) => acc + (s.price || 0), 0);
  const lowUsageSubs = subscriptions.filter(s => s.status === 'low' || (s.usedDays !== undefined && s.usedDays <= 4 && s.price > 0));

  // Current values
  const currentSpend = totalCurrentSpend || 1984;
  const budgetVal = user.monthlyBudget || 1000;
  const savingsVal = 699;
  const optimizedSpend = 1285;
  const overBudgetAmt = Math.max(0, currentSpend - budgetVal);

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
      <!-- Optimizer Hero -->
      <div class="opt-hero">
        <h1>Subscription Optimizer</h1>
        <p>AI-guided step-by-step portfolio restructuring</p>
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
        optimizedSpend,
        overBudgetAmt,
        subscriptions,
        lowUsageSubs,
        wishlistSet,
        movies,
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
function renderSection1Overview({ currentSpend, budgetVal, savingsVal, overBudgetAmt, subscriptions, lowUsageSubs }) {
  const activeCount = subscriptions.length || 9;
  const lowCount = lowUsageSubs.length || 2;

  return `
    <div class="opt-section-wrapper" id="opt-section-1">
      <div class="opt-card glass">
        <h3>Current Portfolio</h3>
        <p style="font-size:12px;color:var(--muted);margin-top:2px;">Real-time active subscription metrics and budget constraints</p>

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
            <div class="insight-summary-label">Low-Usage Flags</div>
            <div class="insight-summary-value warn" style="font-size:18px;font-weight:800;margin-top:4px;">${lowCount}</div>
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

          <!-- Simple Budget Status Message -->
          <div class="budget-status ${currentSpend > budgetVal ? 'over' : 'under'}" style="margin-top:12px;padding:10px 12px;border-radius:10px;background:${currentSpend > budgetVal ? 'var(--danger-soft)' : 'var(--success-soft)'};">
            ${currentSpend > budgetVal 
              ? `⚠️ Current spending is ₹${overBudgetAmt} over your target budget.` 
              : `✨ Current spending is ₹${budgetVal - currentSpend} within your monthly budget.`}
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
function renderSection2Attention({ subscriptions }) {
  const netflixSub = subscriptions.find(s => s.id === 'netflix') || { id: 'netflix', name: 'Netflix', price: 199, usedDays: 2 };
  const hotstarSub = subscriptions.find(s => s.id === 'jiohotstar') || { id: 'jiohotstar', name: 'JioHotstar', price: 149, usedDays: 6 };
  const canvaSub = subscriptions.find(s => s.id === 'canva') || { id: 'canva', name: 'Canva', price: 500, usedDays: 3 };

  const logoNetflix = getServiceLogo('Netflix', '#E50914');
  const logoHotstar = getServiceLogo('JioHotstar', '#0C1B33');
  const logoCanva = getServiceLogo('Canva', '#00C4CC');

  return `
    <div class="opt-section-wrapper" id="opt-section-2">
      <div class="opt-card glass">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <h3>Items Needing Attention</h3>
          <span class="severity-tag leak"><div class="dot"></div>5 Alerts</span>
        </div>
        <p style="font-size:12px;color:var(--muted);">Priority review for upcoming renewals, low usage, ghost apps & trials</p>

        <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px;">
          <!-- Item 1: Netflix -->
          <div class="attention-item" id="attention-card-netflix">
            <div class="sub-logo-wrap" style="width:38px;height:38px;">
              ${logoNetflix}
            </div>
            <div class="attention-body">
              <div class="attention-title">
                ${netflixSub.name}
                <span class="action-tag leakreview" style="font-size:9.5px;">Renewal in 3 days</span>
              </div>
              <div class="attention-reason">Renewal in 3 days + Low usage (Used 2 days this month)</div>
            </div>
            <button class="attention-btn" data-sub-id="netflix">Review →</button>
          </div>

          <!-- Item 2: JioHotstar -->
          <div class="attention-item" id="attention-card-jiohotstar">
            <div class="sub-logo-wrap" style="width:38px;height:38px;">
              ${logoHotstar}
            </div>
            <div class="attention-body">
              <div class="attention-title">
                ${hotstarSub.name}
                <span class="action-tag review" style="font-size:9.5px;">Upcoming renewal</span>
              </div>
              <div class="attention-reason">Moderate usage with renewal in 6 days</div>
            </div>
            <button class="attention-btn" data-sub-id="jiohotstar">Review →</button>
          </div>

          <!-- Item 3: Canva -->
          <div class="attention-item" id="attention-card-canva">
            <div class="sub-logo-wrap" style="width:38px;height:38px;">
              ${logoCanva}
            </div>
            <div class="attention-body">
              <div class="attention-title">
                ${canvaSub.name}
                <span class="action-tag leakreview" style="font-size:9.5px;">Low usage</span>
              </div>
              <div class="attention-reason">Low usage — used only 3 days this month (₹500/mo)</div>
            </div>
            <button class="attention-btn" data-sub-id="canva">Review →</button>
          </div>

          <!-- Item 4: Ghost Subscription Alert -->
          <div class="attention-item" style="border:1.5px dashed rgba(224,93,93,0.5);background:rgba(254,242,242,0.6);" id="attention-card-ghost">
            <div style="width:38px;height:38px;border-radius:12px;background:var(--danger-soft);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
              👻
            </div>
            <div class="attention-body">
              <div class="attention-title" style="color:var(--danger);">
                Ghost Subscription
                <span class="action-tag leakreview">Action Needed</span>
              </div>
              <div class="attention-reason">App deleted from your devices, but subscription is still actively billing ₹299/mo.</div>
            </div>
            <button class="attention-btn" style="color:var(--danger);" data-sub-id="primevideo">Review →</button>
          </div>

          <!-- Item 5: Free Trial Alert -->
          <div class="attention-item" style="border:1.5px dashed rgba(224,138,44,0.5);background:rgba(254,248,235,0.6);" id="attention-card-trial">
            <div style="width:38px;height:38px;border-radius:12px;background:var(--amber-soft);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
              🎁
            </div>
            <div class="attention-body">
              <div class="attention-title" style="color:var(--amber);">
                Free Trial Alert
                <span class="action-tag review">Trial Ending</span>
              </div>
              <div class="attention-reason">Canva Pro trial ends in 2 days. Will automatically charge ₹500/month.</div>
            </div>
            <button class="attention-btn" style="color:var(--amber);" data-sub-id="canva">Review →</button>
          </div>
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
function renderSection3AiPlan({ currentSpend, savingsVal, optimizedSpend, subscriptions, state }) {
  const isPlanApplied = state.planApplied || false;

  const spotifySub = subscriptions.find(s => s.id === 'spotify') || { name: 'Spotify', price: 119 };
  const primeSub = subscriptions.find(s => s.id === 'primevideo') || { name: 'Prime Video', price: 299 };
  const netflixSub = subscriptions.find(s => s.id === 'netflix') || { name: 'Netflix', price: 199 };
  const canvaSub = subscriptions.find(s => s.id === 'canva') || { name: 'Canva', price: 500 };

  const logoSpotify = getServiceLogo('Spotify', '#1DB954');
  const logoPrime = getServiceLogo('Prime Video', '#00A8E1');
  const logoNetflix = getServiceLogo('Netflix', '#E50914');
  const logoCanva = getServiceLogo('Canva', '#00C4CC');

  return `
    <div class="opt-section-wrapper" id="opt-section-3">
      <div class="opt-card glass">
        <h3>Your Optimized Plan</h3>
        <p style="font-size:12px;color:var(--muted);">AI-rebalanced portfolio maximizing usage return and saving ₹${savingsVal}/mo</p>

        <!-- AI Analyzed Factors Chips -->
        <div class="opt-ai-factors-box">
          <div class="opt-ai-factors-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            AI Analyzed Parameters
          </div>
          <div class="opt-ai-factors-list">
            <span class="opt-factor-chip">Spending vs Budget</span>
            <span class="opt-factor-chip">Usage Frequency</span>
            <span class="opt-factor-chip">Last Used Days</span>
            <span class="opt-factor-chip">Cost per Usage</span>
            <span class="opt-factor-chip">Ghost Subscriptions</span>
            <span class="opt-factor-chip">Free Trials Ending</span>
            <span class="opt-factor-chip">User Interests</span>
            <span class="opt-factor-chip">Upcoming OTT Content</span>
          </div>
        </div>

        <!-- Current vs Optimized Cost Banner -->
        <div class="portfolio-compare" style="margin-top:14px;">
          <div class="portfolio-col">
            <div class="portfolio-col-label">Current Monthly Cost</div>
            <div class="portfolio-col-amt">₹${currentSpend}<span style="font-size:10px;font-weight:500;color:var(--muted);">/mo</span></div>
            <div class="portfolio-col-count">9 active subscriptions</div>
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

        <!-- Action Items List -->
        <div style="margin-top:18px;">
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:10px;">Recommended Action Plan:</div>

          <!-- Action 1: KEEP Spotify -->
          <div class="opt-row" id="plan-item-spotify">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoSpotify}
            </div>
            <div class="opt-row-body">
              <div class="opt-row-name">
                ${spotifySub.name}
                <span class="action-tag keep">KEEP</span>
              </div>
              <div class="opt-row-meta">High usage (24 days) · Score: 9.1/10</div>
              <div class="opt-row-reason">High usage and matches your podcast/music preferences.</div>
            </div>
            <div class="opt-row-right">
              <div class="opt-row-price">₹${Math.round(spotifySub.price)}</div>
            </div>
          </div>

          <!-- Action 2: SWITCH / SUBSCRIBE Prime Video -->
          <div class="opt-row" id="plan-item-prime">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoPrime}
            </div>
            <div class="opt-row-body">
              <div class="opt-row-name">
                ${primeSub.name}
                <span class="action-tag info">SWITCH / SUBSCRIBE</span>
              </div>
              <div class="opt-row-meta">Matches 4 upcoming releases · Score: 8.9/10</div>
              <div class="opt-row-reason">Upcoming movies next month match your interests.</div>
            </div>
            <div class="opt-row-right">
              <div class="opt-row-price">₹${Math.round(primeSub.price)}</div>
            </div>
          </div>

          <!-- Action 3: PAUSE / CANCEL Netflix -->
          <div class="opt-row" id="plan-item-netflix">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoNetflix}
            </div>
            <div class="opt-row-body">
              <div class="opt-row-name">
                ${netflixSub.name}
                <span class="action-tag leakreview">PAUSE / CANCEL</span>
              </div>
              <div class="opt-row-meta">Used 2 days · Save ₹199/mo</div>
              <div class="opt-row-reason">Low usage and no highly relevant upcoming content.</div>
            </div>
            <div class="opt-row-right">
              <div class="opt-row-price">₹${Math.round(netflixSub.price)}</div>
              <button class="opt-action-btn" data-sub-id="netflix">Review</button>
            </div>
          </div>

          <!-- Action 4: REVIEW Canva -->
          <div class="opt-row" id="plan-item-canva">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoCanva}
            </div>
            <div class="opt-row-body">
              <div class="opt-row-name">
                ${canvaSub.name}
                <span class="action-tag review">REVIEW</span>
              </div>
              <div class="opt-row-meta">Used 3 days · Save ₹500/mo</div>
              <div class="opt-row-reason">Used only 3 days this month.</div>
            </div>
            <div class="opt-row-right">
              <div class="opt-row-price">₹${Math.round(canvaSub.price)}</div>
              <button class="opt-action-btn" data-sub-id="canva">Review</button>
            </div>
          </div>
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
function renderSection4Future({ wishlistSet, movies }) {
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

  const logoPrime = getServiceLogo('Prime Video', '#00A8E1');

  return `
    <div class="opt-section-wrapper" id="opt-section-4">
      <div class="opt-card glass">
        <h3>Future Recommendations</h3>
        <p style="font-size:12px;color:var(--primary);font-weight:700;margin-top:2px;">What should you subscribe to next month?</p>

        <!-- OTT Recommendation Card (Personalized) -->
        <div class="future-card glass" style="margin-top:14px;background:var(--white);border:1.5px solid rgba(47,111,237,0.3);">
          <div class="future-card-head" style="align-items:center;">
            <div class="sub-logo-wrap" style="width:36px;height:36px;">
              ${logoPrime}
            </div>
            <div>
              <h3 style="font-size:15px;">Prime Video</h3>
              <div style="font-size:11px;color:var(--muted);font-weight:600;">Estimated: ₹299 / month</div>
            </div>
            <span class="future-badge recommend" style="margin-left:auto;">TOP RECOMMENDATION</span>
          </div>

          <!-- Interest Alignment Reason -->
          <div style="margin-top:12px;font-size:12.5px;color:var(--navy);font-weight:700;line-height:1.45;">
            "4 upcoming releases next month match your action, sci-fi and superhero interests."
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
              Subscribe to Prime Video next month instead of renewing Netflix.
            </div>
            <div style="font-size:11.5px;color:var(--success);font-weight:800;margin-top:4px;">
              Potential saving: ₹200 / month
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
function renderSection5ServiceSwitch() {
  return `
    <div class="opt-section-wrapper" id="opt-section-5">
      <div class="opt-card glass">
        <h3>Better Service for You</h3>
        <p style="font-size:12px;color:var(--muted);">Personalized comparisons and ecosystem alignment based on actual usage</p>

        <!-- Switch Card 1: Spotify vs Apple Music -->
        <div class="service-switch-card">
          <div class="switch-header">
            <div class="switch-pair-badge">
              <span>Spotify</span>
              <span style="color:var(--primary);">→</span>
              <span>Apple Music</span>
            </div>
            <span class="switch-match-pill">95% Match</span>
          </div>

          <div class="switch-factors-bar">
            <span>Analyzed:</span> Device ecosystem · Music usage · Podcasts · Lossless audio
          </div>

          <div class="switch-quote-box">
            "You use iPhone, AirPods and Mac. Apple Music provides better ecosystem integration and Lossless Audio."
            <div style="font-size:10.5px;color:var(--muted);margin-top:4px;">Alternative: If podcast discovery is primary, Spotify remains top choice.</div>
          </div>

          <div class="switch-details-grid">
            <div class="switch-detail-box">
              <div class="switch-detail-label">Current Service</div>
              <div class="switch-detail-name">Spotify</div>
              <div class="switch-detail-price">₹119 / month</div>
              <div class="switch-why">High active daily commute & workout usage.</div>
            </div>

            <div class="switch-detail-box recommended">
              <div class="switch-detail-label" style="color:var(--primary);">Recommended</div>
              <div class="switch-detail-name">Apple Music</div>
              <div class="switch-detail-price" style="color:var(--success);">₹99 / month (Save ₹20)</div>
              <div class="switch-why">Spatial audio + Apple devices native Siri integration.</div>
            </div>
          </div>
        </div>

        <!-- Switch Card 2: Netflix vs Prime Video -->
        <div class="service-switch-card">
          <div class="switch-header">
            <div class="switch-pair-badge">
              <span>Netflix</span>
              <span style="color:var(--primary);">→</span>
              <span>Prime Video</span>
            </div>
            <span class="switch-match-pill">92% Match</span>
          </div>

          <div class="switch-factors-bar">
            <span>Analyzed:</span> Content alignment · Monthly cost · Included perks
          </div>

          <div class="switch-quote-box">
            "Your Netflix usage dropped to 2 days while Prime Video has 4 major releases matching your sci-fi watchlist next month."
          </div>

          <div class="switch-details-grid">
            <div class="switch-detail-box">
              <div class="switch-detail-label">Current Service</div>
              <div class="switch-detail-name">Netflix</div>
              <div class="switch-detail-price">₹199 / month</div>
              <div class="switch-why">Low viewing activity this billing cycle.</div>
            </div>

            <div class="switch-detail-box recommended">
              <div class="switch-detail-label" style="color:var(--primary);">Recommended</div>
              <div class="switch-detail-name">Prime Video</div>
              <div class="switch-detail-price">₹299 / month</div>
              <div class="switch-why">Includes fast shopping delivery + upcoming Dune 2.</div>
            </div>
          </div>
        </div>

        <!-- Switch Card 3: Canva Pro vs Canva Free -->
        <div class="service-switch-card">
          <div class="switch-header">
            <div class="switch-pair-badge">
              <span>Canva Pro</span>
              <span style="color:var(--primary);">→</span>
              <span>Canva Free / Adobe Express</span>
            </div>
            <span class="switch-match-pill" style="color:var(--success);background:var(--success-soft);">88% Match</span>
          </div>

          <div class="switch-factors-bar">
            <span>Analyzed:</span> Monthly usage frequency (3 days/mo)
          </div>

          <div class="switch-quote-box">
            "You create graphics on only 3 days per month. The free tier covers all your export requirements without paying ₹500/mo."
          </div>

          <div class="switch-details-grid">
            <div class="switch-detail-box">
              <div class="switch-detail-label">Current Service</div>
              <div class="switch-detail-name">Canva Pro</div>
              <div class="switch-detail-price">₹500 / month</div>
              <div class="switch-why">Paying full pro tier for infrequent usage.</div>
            </div>

            <div class="switch-detail-box recommended">
              <div class="switch-detail-label" style="color:var(--success);">Recommended</div>
              <div class="switch-detail-name">Free Tier</div>
              <div class="switch-detail-price" style="color:var(--success);">₹0 / month (Save ₹500)</div>
              <div class="switch-why">100% adequate for 3-day lightweight graphics.</div>
            </div>
          </div>
        </div>
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
