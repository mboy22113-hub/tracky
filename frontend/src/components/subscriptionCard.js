import { getServiceLogo } from './brandLogos.js';

/**
 * Renders the enhanced subscription card used across Home and Subscriptions lists
 * Features:
 * - Real vector SVG brand logo (no broken images / emoji)
 * - Service name
 * - Category
 * - Monthly price (e.g. ₹199/mo or Free)
 * - "Used X days" information
 * - Renewal information (e.g. Renews in 3 days or Renews on 5 Sep)
 * - Usage status badge (Low usage, Active, High usage, Moderate usage)
 * - Zero undefined / null / NaN leaks
 */

function formatPrice(sub) {
  if (sub.free || sub.price === 0) {
    return '<span class="price-free">Free</span>';
  }
  const numericPrice = typeof sub.price === 'number' && !isNaN(sub.price) ? Math.round(sub.price) : 0;
  return `₹${numericPrice}<span class="price-cycle">/mo</span>`;
}

function getStatusDetails(sub) {
  const status = (sub.status || '').toLowerCase();
  if (status === 'low') {
    return { className: 'low', label: sub.statusLabel || 'Low usage' };
  }
  if (status === 'high') {
    return { className: 'high', label: sub.statusLabel || 'High usage' };
  }
  if (status === 'moderate') {
    return { className: 'moderate', label: sub.statusLabel || 'Moderate usage' };
  }
  return { className: 'active', label: sub.statusLabel || 'Active' };
}

function formatRenewal(sub) {
  if (sub.free) return 'Free Tier';
  if (sub.renewsIn) {
    return sub.renewsIn.toLowerCase().startsWith('renews') ? sub.renewsIn : `Renews in ${sub.renewsIn}`;
  }
  if (sub.nextRenewal && sub.nextRenewal !== '—') {
    return `Renews on ${sub.nextRenewal}`;
  }
  return 'Active';
}

function getCategoryName(sub) {
  const cat = sub.categoryLabel || sub.category || 'General';
  // Capitalize neatly
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

// Home screen subscription item card
export function renderHomeSubItem(sub = {}) {
  const name = sub.name || 'Subscription';
  const category = getCategoryName(sub);
  const priceDisplay = formatPrice(sub);
  const usedDays = typeof sub.usedDays === 'number' && !isNaN(sub.usedDays) ? sub.usedDays : 0;
  const renewalText = formatRenewal(sub);
  const { className: statusClass, label: statusLabel } = getStatusDetails(sub);
  const logoSvg = getServiceLogo(sub.name || sub.id, sub.color || '#2F6FED');

  const specialBadge = sub.appInstalled === false ? `
    <span class="status danger" style="font-size:9.5px;background:var(--danger-soft);color:var(--danger);font-weight:700;padding:2px 6px;border-radius:6px;">
      👻 Ghost App
    </span>
  ` : sub.trialDaysLeft ? `
    <span class="status amber" style="font-size:9.5px;background:var(--amber-soft);color:var(--amber);font-weight:700;padding:2px 6px;border-radius:6px;">
      🎁 Trial (${sub.trialDaysLeft}d left)
    </span>
  ` : '';

  return `
    <div class="sub-card-enhanced" data-sub-id="${sub.id || ''}" id="sub-card-${sub.id || 'item'}">
      <div class="sub-card-header">
        <div class="sub-logo-wrap">
          ${logoSvg}
        </div>
        <div class="sub-meta-primary">
          <div class="sub-title">${name}</div>
          <div class="sub-category-tag">${category}</div>
        </div>
        <div class="sub-pricing-col">
          <div class="sub-price-val">${priceDisplay}</div>
        </div>
      </div>

      <div class="sub-card-footer">
        <div class="sub-usage-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Used ${usedDays} day${usedDays === 1 ? '' : 's'}</span>
        </div>
        <div class="sub-renewal-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span>${renewalText}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-left:auto;">
          <div class="status ${statusClass}">
            <div class="dot"></div>${statusLabel}
          </div>
          ${specialBadge}
        </div>
      </div>
    </div>
  `;
}

// Subscriptions screen comprehensive card
export function renderSubCard(sub = {}) {
  const name = sub.name || 'Subscription';
  const category = getCategoryName(sub);
  const priceDisplay = formatPrice(sub);
  const usedDays = typeof sub.usedDays === 'number' && !isNaN(sub.usedDays) ? sub.usedDays : 0;
  const renewalText = formatRenewal(sub);
  const { className: statusClass, label: statusLabel } = getStatusDetails(sub);
  const logoSvg = getServiceLogo(sub.name || sub.id, sub.color || '#2F6FED');

  const extraBadge = sub.appInstalled === false ? `
    <span class="status danger" style="font-size:9.5px;background:var(--danger-soft);color:var(--danger);font-weight:700;padding:2px 7px;border-radius:6px;display:inline-flex;align-items:center;gap:3px;">
      <span>👻</span>Ghost App
    </span>
  ` : sub.trialDaysLeft ? `
    <span class="status amber" style="font-size:9.5px;background:var(--amber-soft);color:var(--amber);font-weight:700;padding:2px 7px;border-radius:6px;display:inline-flex;align-items:center;gap:3px;">
      <span>🎁</span>Trial (${sub.trialDaysLeft}d left)
    </span>
  ` : '';

  return `
    <div class="sub-card-enhanced" data-sub-id="${sub.id || ''}" id="sub-card-${sub.id || 'item'}">
      <div class="sub-card-header">
        <div class="sub-logo-wrap">
          ${logoSvg}
        </div>
        <div class="sub-meta-primary">
          <div class="sub-title">${name}</div>
          <div class="sub-category-tag">${category}</div>
        </div>
        <div class="sub-pricing-col">
          <div class="sub-price-val">${priceDisplay}</div>
        </div>
      </div>

      <div class="sub-card-footer">
        <div class="sub-usage-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Used ${usedDays} day${usedDays === 1 ? '' : 's'}</span>
        </div>
        <div class="sub-renewal-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span>${renewalText}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-left:auto;">
          <div class="status ${statusClass}">
            <div class="dot"></div>${statusLabel}
          </div>
          ${extraBadge}
        </div>
      </div>
    </div>
  `;
}
