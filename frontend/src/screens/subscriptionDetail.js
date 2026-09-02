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

      ${sub.appInstalled === false ? `
        <!-- Ghost App Warning Banner -->
        <div style="margin-top:14px; padding:14px 16px; background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.25); border-radius:14px; display:flex; align-items:flex-start; gap:12px;">
          <div style="font-size:22px; line-height:1; flex-shrink:0;">👻</div>
          <div>
            <strong style="color:var(--danger, #EF4444); font-size:13.5px; display:block; margin-bottom:3px;">Ghost App Alert Detected</strong>
            <p style="font-size:12px; color:var(--text); margin:0; line-height:1.45;">
              This app is <strong>not installed</strong> on any of your devices, but AutoPay is still charging <strong>${priceDisplay}/mo</strong>. We recommend cancelling this subscription to stop money leakage.
            </p>
          </div>
        </div>
      ` : ''}

      ${sub.trialDaysLeft ? `
        <!-- Free Trial Expiry Banner -->
        <div style="margin-top:14px; padding:14px 16px; background:rgba(217, 119, 6, 0.08); border:1px solid rgba(217, 119, 6, 0.25); border-radius:14px; display:flex; align-items:flex-start; gap:12px;">
          <div style="font-size:22px; line-height:1; flex-shrink:0;">🎁</div>
          <div>
            <strong style="color:var(--amber, #D97706); font-size:13.5px; display:block; margin-bottom:3px;">Free Trial Ending Soon (${sub.trialDaysLeft} days remaining)</strong>
            <p style="font-size:12px; color:var(--text); margin:0; line-height:1.45;">
              Your free trial will expire in <strong>${sub.trialDaysLeft} days</strong> and automatically convert to a recurring charge of <strong>${priceDisplay}/mo</strong>. Cancel before ${sub.nextRenewal || 'renewal'} to avoid being charged.
            </p>
          </div>
        </div>
      ` : ''}

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
        <button class="d-btn primary" id="detail-continue-btn">Continue</button>
        <button class="d-btn ghost" id="detail-pause-btn">Pause</button>
        <button class="d-btn danger" id="detail-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}
