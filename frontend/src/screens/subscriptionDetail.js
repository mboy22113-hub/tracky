import { getServiceLogo } from '../components/brandLogos.js';

export function renderSubscriptionDetailScreen(sub) {
  if (!sub) {
    return `
      <div class="scroll" style="padding-top:40px;text-align:center;">
        <p style="color:var(--muted);">No subscription selected.</p>
        <button class="cta" id="detail-back-btn" style="margin-top:16px;">Back to Subscriptions</button>
      </div>
    `;
  }

  const usedDays = typeof sub.usedDays === 'number' && !isNaN(sub.usedDays) ? sub.usedDays : 0;
  const costPerUse = (!sub.free && usedDays > 0) ? `₹${Math.round(sub.price / usedDays)}` : (sub.free ? 'Free' : '—');
  const priceDisplay = sub.free ? 'Free' : `₹${Math.round(sub.price)}`;
  const logoSvg = getServiceLogo(sub.name || sub.id, sub.color || '#2F6FED');

  return `
    <div class="scroll">
      <div style="padding-top:16px; display:flex; align-items:center; justify-content:space-between;">
        <button class="back-btn" id="detail-back-btn" title="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button class="d-btn ghost" id="detail-edit-btn" style="flex:none;padding:7px 14px;border-radius:10px;">Edit</button>
      </div>

      <!-- Detail Hero -->
      <div class="detail-hero">
        <div class="sub-logo-wrap" style="width:64px;height:64px;border-radius:18px;box-shadow:var(--shadow-md, 0 4px 14px rgba(0,0,0,0.1));">
          ${logoSvg}
        </div>
        <div class="detail-name">${sub.name || 'Subscription'}</div>
        <div class="detail-cat">${sub.categoryLabel || sub.category || 'General'}</div>
        <div class="detail-price">
          <span>${priceDisplay}</span>
          <span class="detail-cycle">${sub.free ? '' : '/ month'}</span>
        </div>
      </div>

      <!-- Quick Metrics Pills -->
      <div class="detail-pillrow">
        <div class="detail-pill">Used ${usedDays} day${usedDays === 1 ? '' : 's'}</div>
        <div class="detail-pill">Value: ${sub.valueScore || '7.0/10'}</div>
        <div class="detail-pill">${sub.redundancy || 'Low overlap'}</div>
      </div>

      <!-- Detail Grid -->
      <div class="detail-grid glass">
        <div>
          <div class="detail-cell-label">Usage This Month</div>
          <div class="detail-cell-value">${usedDays} days</div>
        </div>
        <div>
          <div class="detail-cell-label">Cost per Use</div>
          <div class="detail-cell-value">${costPerUse}</div>
        </div>
        <div>
          <div class="detail-cell-label">AutoPay</div>
          <div class="detail-cell-value" style="font-size:13px;">${sub.autopay || 'Enabled'}</div>
        </div>
        <div>
          <div class="detail-cell-label">Next Renewal</div>
          <div class="detail-cell-value" style="font-size:13px;">${sub.nextRenewal || '—'}</div>
        </div>
      </div>

      <!-- AI Recommendation Box -->
      <div class="ai-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <div>
          <strong style="color:var(--navy);display:block;margin-bottom:2px;">AI Insight</strong>
          ${sub.recommendation || 'Keep tracking this subscription to receive personalized renewal advice.'}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="detail-actions">
        <button class="d-btn ghost" id="detail-compare-btn">Compare</button>
        ${sub.pauseSupported ? '<button class="d-btn primary" id="detail-pause-btn">Pause</button>' : ''}
        <button class="d-btn danger" id="detail-delete-btn">Delete</button>
      </div>
    </div>
  `;
}
