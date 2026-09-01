import { api } from './services/api.js';
import { INITIAL_USER, INITIAL_SUBSCRIPTIONS } from './data/mockData.js';
import { renderBottomNav } from './components/bottomNav.js';
import { setupModal } from './components/modal.js';
import { setupAiAssistant } from './components/aiAssistant.js';
import { renderUniversalComparison, renderOTTComparison } from './components/comparisonCard.js';

import { renderHomeScreen } from './screens/home.js';
import { renderSubscriptionsScreen } from './screens/subscriptions.js';
import { renderSubscriptionDetailScreen } from './screens/subscriptionDetail.js';
import { renderCompareScreen } from './screens/compare.js';
import { renderInsightsScreen } from './screens/insights.js';
import { renderOptimizeScreen } from './screens/optimize.js';
import { renderProfileScreen } from './screens/profile.js';

// Application State (Single Source of Truth)
const state = {
  activeScreen: 'home',
  selectedCategory: 'all',
  selectedSubId: null,
  compareServiceA: 'spotify',
  compareServiceB: 'applemusic',
  optimizerStep: 1,
  planApplied: false,
  insightsPeriod: 'thismonth',
  user: { ...INITIAL_USER },
  subscriptions: [...INITIAL_SUBSCRIPTIONS],
  insights: null,
  optimizer: null,
  recommendations: null,
  movies: [],
  wishlist: []
};

let modal = null;
let aiAssistant = null;

// Screen rendering router
function renderApp() {
  const container = document.getElementById('screen-container');
  const bottomNavContainer = document.getElementById('bottom-nav-container');

  if (!container) return;

  // Render active screen
  let html = '';
  switch (state.activeScreen) {
    case 'home':
      html = renderHomeScreen(state);
      break;
    case 'subscriptions':
      html = renderSubscriptionsScreen(state);
      break;
    case 'detail':
      const currentSub = state.subscriptions.find(s => s.id === state.selectedSubId) || state.subscriptions[0];
      html = renderSubscriptionDetailScreen(currentSub);
      break;
    case 'compare':
      html = renderCompareScreen(state);
      break;
    case 'insights':
      html = renderInsightsScreen(state);
      break;
    case 'optimize':
      html = renderOptimizeScreen(state);
      break;
    case 'profile':
      html = renderProfileScreen(state);
      break;
    default:
      html = renderHomeScreen(state);
  }

  container.innerHTML = html;

  // Render bottom nav (hide on detail screen or keep consistent)
  if (bottomNavContainer) {
    bottomNavContainer.innerHTML = renderBottomNav(
      state.activeScreen === 'detail' ? 'subscriptions' : state.activeScreen
    );
  }

  attachScreenListeners();
}

function navigateTo(screenId, subId = null) {
  state.activeScreen = screenId;
  if (subId) state.selectedSubId = subId;
  renderApp();
}

// Initial Data Fetching from FastAPI REST backend
async function initializeData() {
  try {
    const [userRes, subsRes, moviesRes, wishlistRes] = await Promise.allSettled([
      api.getProfile(),
      api.getSubscriptions(),
      api.getUpcomingMovies(),
      api.getWishlist()
    ]);

    if (userRes.status === 'fulfilled') state.user = userRes.value;
    if (subsRes.status === 'fulfilled' && subsRes.value.length > 0) state.subscriptions = subsRes.value;
    if (moviesRes.status === 'fulfilled') state.movies = moviesRes.value;
    if (wishlistRes.status === 'fulfilled') state.wishlist = wishlistRes.value;

    // Fetch initial insights & optimizer in background
    loadInsights();
    loadOptimizer();
    loadRecommendations();
  } catch (err) {
    console.warn('Backend load error, using initial state:', err);
  } finally {
    renderApp();
  }
}

async function loadInsights(period = 'thismonth') {
  try {
    state.insightsPeriod = period;
    const res = await api.getInsights(period);
    state.insights = res;
    if (state.activeScreen === 'insights') renderApp();
  } catch (err) {
    console.warn('Insights error:', err);
  }
}

async function loadOptimizer(budget = null) {
  try {
    const res = await api.getOptimizer(budget);
    state.optimizer = res;
    if (state.activeScreen === 'optimize') renderApp();
  } catch (err) {
    console.warn('Optimizer error:', err);
  }
}

async function loadRecommendations() {
  try {
    const res = await api.getRecommendations();
    state.recommendations = res;
    if (state.activeScreen === 'optimize') renderApp();
  } catch (err) {
    console.warn('Recommendations error:', err);
  }
}

// Modals: Add / Edit Subscription
function openAddSubscriptionModal() {
  const content = `
    <form id="add-sub-form" style="display:flex;flex-direction:column;gap:12px;">
      <div>
        <div class="field-label">Subscription Name</div>
        <input type="text" id="add-name" class="field-input" placeholder="e.g. Disney+ Hotstar" required>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div>
          <div class="field-label">Category</div>
          <select id="add-category" class="field-input">
            <option value="movies">Movies</option>
            <option value="music">Music</option>
            <option value="games">Games</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <div class="field-label">Price (₹/mo)</div>
          <input type="number" id="add-price" class="field-input" placeholder="199" required>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div>
          <div class="field-label">Days Used this Month</div>
          <input type="number" id="add-days" class="field-input" placeholder="10" value="10">
        </div>
        <div>
          <div class="field-label">Renewal Date</div>
          <input type="text" id="add-renewal" class="field-input" placeholder="e.g. 15 Sep" value="15 Sep">
        </div>
      </div>
      <button type="submit" class="cta" style="margin-top:10px;">Add to Tracker</button>
    </form>
  `;
  modal.open('Add New Subscription', content);

  const form = document.getElementById('add-sub-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('add-name').value.trim();
      const category = document.getElementById('add-category').value;
      const price = parseFloat(document.getElementById('add-price').value) || 0;
      const usedDays = parseInt(document.getElementById('add-days').value) || 0;
      const nextRenewal = document.getElementById('add-renewal').value;

      try {
        const created = await api.createSubscription({
          name, category, price, usedDays, nextRenewal, renewsIn: '15 days'
        });
        state.subscriptions.unshift(created);
        modal.close();
        loadInsights();
        loadOptimizer();
        renderApp();
      } catch (err) {
        alert('Failed to save subscription: ' + err.message);
      }
    };
  }
}

function openEditSubscriptionModal(sub) {
  const content = `
    <form id="edit-sub-form" style="display:flex;flex-direction:column;gap:12px;">
      <div>
        <div class="field-label">Subscription Name</div>
        <input type="text" id="edit-name" class="field-input" value="${sub.name}" required>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div>
          <div class="field-label">Price (₹/mo)</div>
          <input type="number" id="edit-price" class="field-input" value="${sub.price}" required>
        </div>
        <div>
          <div class="field-label">AutoPay</div>
          <select id="edit-autopay" class="field-input">
            <option value="Enabled" ${sub.autopay === 'Enabled' ? 'selected' : ''}>Enabled</option>
            <option value="Disabled" ${sub.autopay === 'Disabled' ? 'selected' : ''}>Disabled</option>
          </select>
        </div>
      </div>
      <div>
        <div class="field-label">Next Renewal</div>
        <input type="text" id="edit-renewal" class="field-input" value="${sub.nextRenewal || ''}">
      </div>
      <button type="submit" class="cta" style="margin-top:10px;">Save Changes</button>
    </form>
  `;
  modal.open(`Edit ${sub.name}`, content);

  const form = document.getElementById('edit-sub-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-name').value.trim();
      const price = parseFloat(document.getElementById('edit-price').value) || 0;
      const autopay = document.getElementById('edit-autopay').value;
      const nextRenewal = document.getElementById('edit-renewal').value;

      try {
        const updated = await api.updateSubscription(sub.id, { name, price, autopay, nextRenewal });
        const idx = state.subscriptions.findIndex(s => s.id === sub.id);
        if (idx !== -1) state.subscriptions[idx] = updated;
        modal.close();
        loadInsights();
        loadOptimizer();
        renderApp();
      } catch (err) {
        alert('Failed to update: ' + err.message);
      }
    };
  }
}

// Comparison Modal
async function openComparisonModal(serviceA = 'spotify', serviceB = 'applemusic') {
  modal.open('Comparing Services', '<p style="padding:16px;text-align:center;">Analyzing services with AI advisor...</p>');
  try {
    const res = await api.compareServices(serviceA, serviceB);
    modal.open(`${res.serviceA.name} vs ${res.serviceB.name}`, renderUniversalComparison(res));
    attachComparisonListeners(serviceA, serviceB);
  } catch (err) {
    modal.open('Comparison', `<p style="padding:16px;color:var(--danger);">${err.message}</p>`);
  }
}

async function openOTTComparisonModal() {
  await openComparisonModal('netflix', 'primevideo');
}

function attachComparisonListeners(currentA, currentB) {
  const selectA = document.getElementById('compare-select-a');
  const selectB = document.getElementById('compare-select-b');

  const reCompare = () => {
    const a = selectA ? selectA.value : currentA;
    const b = selectB ? selectB.value : currentB;
    openComparisonModal(a, b);
  };

  if (selectA) selectA.onchange = reCompare;
  if (selectB) selectB.onchange = reCompare;

  document.querySelectorAll('.compare-preset-btn').forEach(btn => {
    btn.onclick = () => {
      const a = btn.getAttribute('data-preset-a');
      const b = btn.getAttribute('data-preset-b');
      openComparisonModal(a, b);
    };
  });
}

function openTrailerModal(title, url) {
  const content = `
    <div style="padding:10px 0;">
      <div style="font-size:14px;font-weight:800;color:var(--navy);margin-bottom:8px;">${title} Official Preview</div>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;background:#000;">
        <iframe src="${url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
      </div>
      <p style="font-size:11px;color:var(--muted);margin-top:10px;">Available on streaming services next month.</p>
    </div>
  `;
  modal.open(title, content);
}

// Edit Profile Modal
function openEditProfileModal() {
  const content = `
    <form id="edit-profile-form" style="display:flex;flex-direction:column;gap:12px;">
      <div>
        <div class="field-label">Your Name</div>
        <input type="text" id="prof-name" class="field-input" value="${state.user.name || ''}" required>
      </div>
      <div>
        <div class="field-label">Email Address</div>
        <input type="email" id="prof-email" class="field-input" value="${state.user.email || ''}" required>
      </div>
      <div>
        <div class="field-label">Age Range</div>
        <select id="prof-age" class="field-input">
          <option value="">Prefer not to say</option>
          <option value="18-24" ${state.user.ageRange === '18-24' ? 'selected' : ''}>18 - 24</option>
          <option value="25-34" ${state.user.ageRange === '25-34' ? 'selected' : ''}>25 - 34</option>
          <option value="35-44" ${state.user.ageRange === '35-44' ? 'selected' : ''}>35 - 44</option>
          <option value="45+" ${state.user.ageRange === '45+' ? 'selected' : ''}>45+</option>
        </select>
      </div>
      <button type="submit" class="cta" style="margin-top:10px;">Update Profile</button>
    </form>
  `;
  modal.open('Personal Details', content);

  const form = document.getElementById('edit-profile-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-name').value.trim();
      const email = document.getElementById('prof-email').value.trim();
      const ageRange = document.getElementById('prof-age').value;

      try {
        const updated = await api.updateProfile({
          ...state.user,
          name,
          email,
          ageRange
        });
        state.user = updated;
        modal.close();
        renderApp();
      } catch (err) {
        alert('Failed to update profile: ' + err.message);
      }
    };
  }
}

// Event Delegation & Interaction Bindings
function attachScreenListeners() {
  // Bottom Navigation
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.onclick = () => {
      const target = btn.getAttribute('data-nav');
      navigateTo(target);
    };
  });

  // Category Pills
  document.querySelectorAll('.pill[data-cat]').forEach(pill => {
    pill.onclick = () => {
      state.selectedCategory = pill.getAttribute('data-cat');
      renderApp();
    };
  });

  // Subscription Card / Item Click -> Open Detail Screen
  document.querySelectorAll('[data-sub-id]').forEach(el => {
    el.onclick = (e) => {
      // Don't trigger if clicked on a button or action inside
      if (e.target.closest('button') || e.target.closest('.ghost-cta') || e.target.closest('.trial-cta')) return;
      const subId = el.getAttribute('data-sub-id');
      navigateTo('detail', subId);
    };
  });

  // Home Screen Specifics
  const optCta = document.getElementById('home-opt-cta');
  if (optCta) optCta.onclick = () => navigateTo('optimize');

  const seeAllRenewals = document.getElementById('home-see-all-renewals');
  if (seeAllRenewals) seeAllRenewals.onclick = () => navigateTo('subscriptions');

  const seeAllSubs = document.getElementById('home-see-all-subs');
  if (seeAllSubs) seeAllSubs.onclick = () => navigateTo('subscriptions');

  const seeAllMovies = document.getElementById('home-see-all-movies');
  if (seeAllMovies) seeAllMovies.onclick = () => navigateTo('optimize');

  const aiRecCard = document.getElementById('home-ai-recommendation-card');
  if (aiRecCard) {
    aiRecCard.onclick = () => {
      if (aiAssistant && aiAssistant.openDrawer) aiAssistant.openDrawer();
    };
  }

  // Subscriptions Screen Specifics
  const fabAdd = document.getElementById('fab-add-sub');
  if (fabAdd) fabAdd.onclick = openAddSubscriptionModal;

  const runAnalysisBtn = document.getElementById('subs-run-analysis-btn');
  if (runAnalysisBtn) runAnalysisBtn.onclick = () => navigateTo('optimize');

  // Detail Screen Specifics
  const detailBack = document.getElementById('detail-back-btn');
  if (detailBack) detailBack.onclick = () => navigateTo('subscriptions');

  const detailEdit = document.getElementById('detail-edit-btn');
  if (detailEdit) {
    detailEdit.onclick = () => {
      const sub = state.subscriptions.find(s => s.id === state.selectedSubId);
      if (sub) openEditSubscriptionModal(sub);
    };
  }

  const detailDelete = document.getElementById('detail-delete-btn');
  if (detailDelete) {
    detailDelete.onclick = async () => {
      if (confirm('Delete this subscription from Trackey?')) {
        try {
          await api.deleteSubscription(state.selectedSubId);
          state.subscriptions = state.subscriptions.filter(s => s.id !== state.selectedSubId);
          loadInsights();
          loadOptimizer();
          navigateTo('subscriptions');
        } catch (err) {
          alert('Delete failed: ' + err.message);
        }
      }
    };
  }

  const detailPause = document.getElementById('detail-pause-btn');
  if (detailPause) {
    detailPause.onclick = () => {
      alert('Subscription pause instruction recorded in Trackey.');
    };
  }

  const detailCompare = document.getElementById('detail-compare-btn');
  if (detailCompare) {
    detailCompare.onclick = () => {
      const current = state.subscriptions.find(s => s.id === state.selectedSubId);
      if (current && current.category === 'music') {
        openComparisonModal('spotify', 'applemusic');
      } else {
        openOTTComparisonModal();
      }
    };
  }

  // Insights Screen Specifics
  document.querySelectorAll('[data-insights-period]').forEach(p => {
    p.onclick = () => {
      const period = p.getAttribute('data-insights-period');
      loadInsights(period);
    };
  });

  // Interactive Donut Segment Selection & Center Updates
  const donutCenterAmt = document.getElementById('donut-center-amount');
  const donutCenterLabel = document.getElementById('donut-center-label');
  const totalMonthlySpend = state.insights?.monthlySpend ? `₹${state.insights.monthlySpend}` : '₹1,984';

  const selectCategory = (catId, name, amt, pct) => {
    document.querySelectorAll('.donut-segment').forEach(seg => {
      if (seg.getAttribute('data-cat-id') === catId) {
        seg.classList.add('active');
      } else {
        seg.classList.remove('active');
      }
    });
    document.querySelectorAll('.donut-legend-row').forEach(row => {
      if (row.getAttribute('data-legend-cat') === catId) {
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    });
    if (donutCenterAmt && donutCenterLabel) {
      donutCenterAmt.textContent = amt;
      donutCenterLabel.textContent = `${name} (${pct})`;
    }
  };

  const resetCategorySelection = () => {
    document.querySelectorAll('.donut-segment').forEach(seg => seg.classList.remove('active'));
    document.querySelectorAll('.donut-legend-row').forEach(row => row.classList.remove('active'));
    if (donutCenterAmt && donutCenterLabel) {
      donutCenterAmt.textContent = totalMonthlySpend;
      donutCenterLabel.textContent = 'Total Spend';
    }
  };

  document.querySelectorAll('.donut-segment').forEach(seg => {
    seg.addEventListener('mouseenter', () => {
      selectCategory(
        seg.getAttribute('data-cat-id'),
        seg.getAttribute('data-cat-name'),
        seg.getAttribute('data-cat-amt'),
        seg.getAttribute('data-cat-pct')
      );
    });
    seg.addEventListener('click', () => {
      selectCategory(
        seg.getAttribute('data-cat-id'),
        seg.getAttribute('data-cat-name'),
        seg.getAttribute('data-cat-amt'),
        seg.getAttribute('data-cat-pct')
      );
    });
  });

  document.querySelectorAll('.donut-legend-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const catId = row.getAttribute('data-legend-cat');
      const seg = document.querySelector(`.donut-segment[data-cat-id="${catId}"]`);
      if (seg) {
        selectCategory(
          catId,
          seg.getAttribute('data-cat-name'),
          seg.getAttribute('data-cat-amt'),
          seg.getAttribute('data-cat-pct')
        );
      }
    });
    row.addEventListener('click', () => {
      const catId = row.getAttribute('data-legend-cat');
      const seg = document.querySelector(`.donut-segment[data-cat-id="${catId}"]`);
      if (seg) {
        selectCategory(
          catId,
          seg.getAttribute('data-cat-name'),
          seg.getAttribute('data-cat-amt'),
          seg.getAttribute('data-cat-pct')
        );
      }
    });
  });

  const donutWrap = document.querySelector('.donut-chart-container');
  if (donutWrap) {
    donutWrap.addEventListener('mouseleave', resetCategorySelection);
  }

  // Interactive Trend Graph Point inspection
  const ttMonth = document.getElementById('tt-month');
  const ttVal = document.getElementById('tt-val');
  const ttChange = document.getElementById('tt-change');

  document.querySelectorAll('.trend-point-group').forEach(group => {
    const updateTooltip = () => {
      document.querySelectorAll('.trend-point-group').forEach(g => g.classList.remove('active'));
      group.classList.add('active');
      const month = group.getAttribute('data-month');
      const val = group.getAttribute('data-val');
      const change = group.getAttribute('data-change');
      if (ttMonth) ttMonth.textContent = `${month} 2026`;
      if (ttVal) ttVal.textContent = val;
      if (ttChange) ttChange.textContent = change;
    };

    group.addEventListener('mouseenter', updateTooltip);
    group.addEventListener('click', updateTooltip);
  });

  // Money Leak review button actions
  document.querySelectorAll('.leak-review-btn').forEach(btn => {
    btn.onclick = () => {
      const subId = btn.getAttribute('data-sub-id');
      if (subId) {
        state.optimizerStep = 2; // Jump straight to optimizer Attention / Leakage section
        navigateTo('optimize');
      } else {
        navigateTo('optimize');
      }
    };
  });

  // AI Master Insight CTA Buttons
  const aiOptBtn = document.getElementById('insights-ai-opt-btn');
  if (aiOptBtn) {
    aiOptBtn.onclick = () => {
      state.optimizerStep = 1;
      navigateTo('optimize');
    };
  }

  const aiRecsBtn = document.getElementById('insights-ai-recs-btn');
  if (aiRecsBtn) {
    aiRecsBtn.onclick = () => {
      state.optimizerStep = 4; // Strategic recommendation and releases
      navigateTo('optimize');
    };
  }

  // Count-up animation for numbers on load
  document.querySelectorAll('.count-up-val').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (!isNaN(target) && target > 0) {
      let current = 0;
      const duration = 650;
      const startTime = performance.now();
      const prefix = el.textContent.startsWith('₹') ? '₹' : '';

      const animateCount = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        current = Math.floor(easeOutQuad * target);
        el.textContent = `${prefix}${current.toLocaleString('en-IN')}`;
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          el.textContent = `${prefix}${target.toLocaleString('en-IN')}`;
        }
      };
      requestAnimationFrame(animateCount);
    }
  });

  const reviewLeakageBtn = document.getElementById('insights-review-leakage-btn');
  if (reviewLeakageBtn) reviewLeakageBtn.onclick = () => navigateTo('optimize');

  // Optimizer Multi-Step Flow Handlers
  // Top Step Pills
  document.querySelectorAll('[data-opt-step]').forEach(pill => {
    pill.onclick = () => {
      const step = parseInt(pill.getAttribute('data-opt-step'), 10);
      if (step) {
        state.optimizerStep = step;
        renderApp();
      }
    };
  });

  // Step 1: Overview
  const saveBudgetBtn = document.getElementById('opt-save-budget-btn');
  if (saveBudgetBtn) {
    saveBudgetBtn.onclick = () => {
      const input = document.getElementById('opt-budget-input');
      const val = parseFloat(input.value) || 1000;
      state.user.monthlyBudget = val;
      api.updateProfile({ ...state.user, monthlyBudget: val });
      renderApp();
    };
  }

  const nextToAttention = document.getElementById('opt-next-to-attention');
  if (nextToAttention) {
    nextToAttention.onclick = () => {
      state.optimizerStep = 2;
      renderApp();
    };
  }

  // Step 2: Attention
  const backToOverview = document.getElementById('opt-back-to-overview');
  if (backToOverview) {
    backToOverview.onclick = () => {
      state.optimizerStep = 1;
      renderApp();
    };
  }

  const nextToPlan = document.getElementById('opt-next-to-plan');
  if (nextToPlan) {
    nextToPlan.onclick = () => {
      state.optimizerStep = 3;
      renderApp();
    };
  }

  // Step 3: AI Plan
  const backToAttention = document.getElementById('opt-back-to-attention');
  if (backToAttention) {
    backToAttention.onclick = () => {
      state.optimizerStep = 2;
      renderApp();
    };
  }

  const nextToFuture = document.getElementById('opt-next-to-future');
  if (nextToFuture) {
    nextToFuture.onclick = () => {
      state.optimizerStep = 4;
      renderApp();
    };
  }

  const applyPlanBtn = document.getElementById('opt-apply-plan-btn');
  if (applyPlanBtn) {
    applyPlanBtn.onclick = () => {
      state.planApplied = true;
      renderApp();
    };
  }

  // Step 4: Future Recommendations
  const backToPlan = document.getElementById('opt-back-to-plan');
  if (backToPlan) {
    backToPlan.onclick = () => {
      state.optimizerStep = 3;
      renderApp();
    };
  }

  const nextToSwitch = document.getElementById('opt-next-to-switch');
  if (nextToSwitch) {
    nextToSwitch.onclick = () => {
      state.optimizerStep = 5;
      renderApp();
    };
  }

  const viewReleasesBtn = document.getElementById('opt-view-releases-btn');
  if (viewReleasesBtn) {
    viewReleasesBtn.onclick = () => {
      const carousel = document.getElementById('opt-future-carousel');
      if (carousel) carousel.scrollIntoView({ behavior: 'smooth' });
    };
  }

  const addWishlistAll = document.getElementById('opt-add-wishlist-all');
  if (addWishlistAll) {
    addWishlistAll.onclick = async () => {
      const primeMovies = ['m_dune2', 'm_gladiator2', 'm_deadpool', 'm_ringsofpower2', 'm_squidgame2', 'm_theboys4'];
      for (const mId of primeMovies) {
        if (!state.wishlist.some(w => (w.content_id || w.id) === mId)) {
          const added = { content_id: mId, id: mId, added_at: new Date().toISOString() };
          state.wishlist.push(added);
          try {
            await api.addToWishlist(added);
          } catch (e) {
            // ignore network/storage warning
          }
        }
      }
      renderApp();
    };
  }

  // Step 5: Service Switch
  const backToFuture = document.getElementById('opt-back-to-future');
  if (backToFuture) {
    backToFuture.onclick = () => {
      state.optimizerStep = 4;
      renderApp();
    };
  }

  const completeJourney = document.getElementById('opt-complete-journey');
  if (completeJourney) {
    completeJourney.onclick = () => {
      state.optimizerStep = 1;
      renderApp();
    };
  }

  document.querySelectorAll('.attention-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const subId = btn.getAttribute('data-sub-id');
      if (subId) navigateTo('detail', subId);
    };
  });

  document.querySelectorAll('.opt-action-btn').forEach(btn => {
    btn.onclick = () => {
      const subId = btn.getAttribute('data-sub-id');
      navigateTo('detail', subId);
    };
  });

  // Dedicated Compare Screen Specifics
  const compSelectA = document.getElementById('compare-select-a');
  if (compSelectA) {
    compSelectA.onchange = (e) => {
      state.compareServiceA = e.target.value;
      renderApp();
    };
  }

  const compSelectB = document.getElementById('compare-select-b');
  if (compSelectB) {
    compSelectB.onchange = (e) => {
      state.compareServiceB = e.target.value;
      renderApp();
    };
  }

  document.querySelectorAll('[data-preset-a]').forEach(btn => {
    btn.onclick = () => {
      state.compareServiceA = btn.getAttribute('data-preset-a');
      state.compareServiceB = btn.getAttribute('data-preset-b');
      renderApp();
    };
  });

  document.querySelectorAll('[data-attention-action]').forEach(btn => {
    btn.onclick = () => {
      const subId = btn.getAttribute('data-sub-id');
      if (subId) navigateTo('detail', subId);
      else openOTTComparisonModal();
    };
  });

  // Wishlist buttons on movie cards
  document.querySelectorAll('.movie-wishlist-btn').forEach(btn => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const contentId = btn.getAttribute('data-wishlist-id');
      const title = btn.getAttribute('data-wishlist-title');
      const poster_url = btn.getAttribute('data-wishlist-poster');
      const platform = btn.getAttribute('data-wishlist-platform');

      const isWishlisted = state.wishlist.some(w => (w.content_id === contentId || w.id === contentId));

      try {
        if (isWishlisted) {
          await api.removeFromWishlist(contentId);
          state.wishlist = state.wishlist.filter(w => w.content_id !== contentId && w.id !== contentId);
        } else {
          const added = await api.addToWishlist({ content_id: contentId, title, poster_url, platform });
          state.wishlist.push(added);
        }
        renderApp();
      } catch (err) {
        console.warn('Wishlist toggle error:', err);
      }
    };
  });

  // Trailer Preview Links
  document.querySelectorAll('.movie-trailer-link').forEach(link => {
    link.onclick = (e) => {
      e.stopPropagation();
      const url = link.getAttribute('data-trailer-url');
      const title = link.getAttribute('data-trailer-title');
      openTrailerModal(title, url);
    };
  });

  // Profile Screen Specifics
  const profEditBtn = document.getElementById('profile-edit-btn');
  if (profEditBtn) profEditBtn.onclick = openEditProfileModal;

  const profSaveBudgetBtn = document.getElementById('profile-save-budget-btn');
  if (profSaveBudgetBtn) {
    profSaveBudgetBtn.onclick = async () => {
      const input = document.getElementById('profile-monthly-budget');
      const val = parseFloat(input?.value) || 1000;
      state.user.monthlyBudget = val;
      await api.updateProfile(state.user);
      loadOptimizer(val);
      renderApp();
    };
  }

  // Profile Movie Chips
  document.querySelectorAll('[data-movie-chip]').forEach(chip => {
    chip.onclick = async () => {
      const val = chip.getAttribute('data-movie-chip');
      let current = state.user.movieInterests || [];
      if (current.includes(val)) current = current.filter(c => c !== val);
      else current.push(val);
      state.user.movieInterests = current;
      renderApp();
      await api.updateProfile(state.user);
      loadRecommendations();
    };
  });

  // Profile Music Chips
  document.querySelectorAll('[data-music-chip]').forEach(chip => {
    chip.onclick = async () => {
      const val = chip.getAttribute('data-music-chip');
      let current = state.user.musicUse || [];
      if (current.includes(val)) current = current.filter(c => c !== val);
      else current.push(val);
      state.user.musicUse = current;
      renderApp();
      await api.updateProfile(state.user);
    };
  });

  // Profile Gaming Chips
  document.querySelectorAll('[data-gaming-chip]').forEach(chip => {
    chip.onclick = async () => {
      const val = chip.getAttribute('data-gaming-chip');
      let current = state.user.gamingInterests || [];
      if (current.includes(val)) current = current.filter(c => c !== val);
      else current.push(val);
      state.user.gamingInterests = current;
      renderApp();
      await api.updateProfile(state.user);
    };
  });

  // Profile Productivity Chips
  document.querySelectorAll('[data-prod-chip]').forEach(chip => {
    chip.onclick = async () => {
      const val = chip.getAttribute('data-prod-chip');
      let current = state.user.productivityInterests || [];
      if (current.includes(val)) current = current.filter(c => c !== val);
      else current.push(val);
      state.user.productivityInterests = current;
      renderApp();
      await api.updateProfile(state.user);
    };
  });

  // Profile Connected Devices Chips
  document.querySelectorAll('[data-device-chip]').forEach(chip => {
    chip.onclick = async () => {
      const val = chip.getAttribute('data-device-chip');
      let current = state.user.connectedDevices || [];
      if (current.includes(val)) current = current.filter(c => c !== val);
      else current.push(val);
      state.user.connectedDevices = current;
      renderApp();
      await api.updateProfile(state.user);
    };
  });

  // Profile Goal Cards
  document.querySelectorAll('[data-goal-id]').forEach(card => {
    card.onclick = async () => {
      const goal = card.getAttribute('data-goal-id');
      state.user.optimizationGoal = goal;
      renderApp();
      await api.updateProfile(state.user);
      loadOptimizer();
    };
  });

  // Profile Notification Toggles
  ['renewals', 'trials', 'lowusage', 'ghosts'].forEach(key => {
    const el = document.getElementById(`toggle-${key}`);
    if (el) {
      el.onchange = async () => {
        const map = { renewals: 'renewals', trials: 'trials', lowusage: 'lowUsage', ghosts: 'ghostSubscriptions' };
        state.user.notificationSettings = {
          ...state.user.notificationSettings,
          [map[key]]: el.checked
        };
        await api.updateProfile(state.user);
      };
    }
  });
}

// App Initialization on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  modal = setupModal();
  aiAssistant = setupAiAssistant((actionType, payload) => {
    if (actionType === 'navigate_insights') navigateTo('insights');
    else if (actionType === 'navigate_optimize') navigateTo('optimize');
    else if (actionType === 'open_detail' && payload.id) navigateTo('detail', payload.id);
    else if (actionType === 'open_comparison' && payload.serviceA && payload.serviceB) openComparisonModal(payload.serviceA, payload.serviceB);
    else if (actionType === 'open_ott_comparison') openOTTComparisonModal();
  });

  // Header quick avatar click -> Profile
  const headerAvatar = document.getElementById('header-avatar');
  if (headerAvatar) headerAvatar.onclick = () => navigateTo('profile');

  initializeData();
});
