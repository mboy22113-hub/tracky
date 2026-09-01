import { getServiceLogo } from './brandLogos.js';
import { KNOWN_SERVICES } from '../data/services.js';

export function renderComparisonModal(data, onSelectA, onSelectB) {
  if (!data) return '<p style="padding:16px;text-align:center;">Select services to compare</p>';

  const { serviceA, serviceB, winner, personalizedAiVerdict, keyDifferences, prosA, prosB, consA, consB } = data;

  const logoA = getServiceLogo(serviceA.name || serviceA.id, '#2F6FED');
  const logoB = getServiceLogo(serviceB.name || serviceB.id, '#141414');

  return `
    <div style="padding:4px 0 16px 0;" id="comparison-view-root">
      <!-- Service Selectors / Switchers -->
      <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;">
        <div style="flex:1;">
          <div class="field-label">Service 1</div>
          <select id="compare-select-a" class="field-input" style="padding:8px 10px;font-size:12px;">
            ${KNOWN_SERVICES.map(s => `
              <option value="${s.id}" ${(s.name.toLowerCase() === serviceA.name.toLowerCase() || s.id === serviceA.id) ? 'selected' : ''}>${s.name} (₹${s.price}/mo)</option>
            `).join('')}
          </select>
        </div>

        <div style="font-size:11px;font-weight:800;color:var(--muted);margin-top:16px;">VS</div>

        <div style="flex:1;">
          <div class="field-label">Service 2</div>
          <select id="compare-select-b" class="field-input" style="padding:8px 10px;font-size:12px;">
            ${KNOWN_SERVICES.map(s => `
              <option value="${s.id}" ${(s.name.toLowerCase() === serviceB.name.toLowerCase() || s.id === serviceB.id) ? 'selected' : ''}>${s.name} (₹${s.price}/mo)</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Quick Comparison Presets -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;">
        <button class="chat-prompt-pill compare-preset-btn" data-preset-a="spotify" data-preset-b="applemusic">Spotify vs Apple Music</button>
        <button class="chat-prompt-pill compare-preset-btn" data-preset-a="netflix" data-preset-b="primevideo">Netflix vs Prime Video</button>
        <button class="chat-prompt-pill compare-preset-btn" data-preset-a="netflix" data-preset-b="jiohotstar">Netflix vs JioHotstar</button>
      </div>

      <!-- Side by side comparison cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
        <!-- Service A -->
        <div style="background:var(--white);border:${winner === serviceA.name ? '2px solid var(--primary)' : '1px solid var(--line)'};border-radius:16px;padding:14px 12px;text-align:center;box-shadow:var(--shadow-sm);position:relative;">
          ${winner === serviceA.name ? `
            <span style="position:absolute;top:-9px;right:10px;background:var(--primary);color:#fff;font-size:8.5px;font-weight:800;padding:2px 6px;border-radius:10px;letter-spacing:0.3px;">AI TOP PICK</span>
          ` : ''}
          <div class="sub-logo-wrap" style="width:42px;height:42px;margin:0 auto 8px auto;">
            ${logoA}
          </div>
          <div style="font-size:14px;font-weight:800;color:var(--navy);">${serviceA.name}</div>
          <div style="font-size:15px;font-weight:800;color:var(--primary);margin-top:2px;">₹${Math.round(serviceA.price)}<span style="font-size:10px;color:var(--muted-soft);font-weight:500;">/mo</span></div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px;font-weight:600;">Value: ${serviceA.valueScore || '7.5/10'}</div>
          <div class="status ${serviceA.userStatus && serviceA.userStatus.includes('Subscribed') ? 'active' : 'low'}" style="margin-top:6px;font-size:9.5px;">
            <div class="dot"></div>${serviceA.userStatus || 'Active Plan'}
          </div>
        </div>

        <!-- Service B -->
        <div style="background:var(--white);border:${winner === serviceB.name ? '2px solid var(--primary)' : '1px solid var(--line)'};border-radius:16px;padding:14px 12px;text-align:center;box-shadow:var(--shadow-sm);position:relative;">
          ${winner === serviceB.name ? `
            <span style="position:absolute;top:-9px;right:10px;background:var(--primary);color:#fff;font-size:8.5px;font-weight:800;padding:2px 6px;border-radius:10px;letter-spacing:0.3px;">AI TOP PICK</span>
          ` : ''}
          <div class="sub-logo-wrap" style="width:42px;height:42px;margin:0 auto 8px auto;">
            ${logoB}
          </div>
          <div style="font-size:14px;font-weight:800;color:var(--navy);">${serviceB.name}</div>
          <div style="font-size:15px;font-weight:800;color:var(--primary);margin-top:2px;">₹${Math.round(serviceB.price)}<span style="font-size:10px;color:var(--muted-soft);font-weight:500;">/mo</span></div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px;font-weight:600;">Value: ${serviceB.valueScore || '7.5/10'}</div>
          <div class="status ${serviceB.userStatus && serviceB.userStatus.includes('Subscribed') ? 'active' : 'low'}" style="margin-top:6px;font-size:9.5px;">
            <div class="dot"></div>${serviceB.userStatus || 'Active Plan'}
          </div>
        </div>
      </div>

      <!-- AI Advisor Verdict -->
      <div style="margin-top:14px;background:var(--primary-soft);padding:12px 14px;border-radius:14px;border:1px solid rgba(47,111,237,0.15);">
        <div style="display:flex;align-items:center;gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--primary);"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <div style="font-size:11px;font-weight:800;color:var(--primary);text-transform:uppercase;letter-spacing:0.3px;">Personalized AI Recommendation</div>
        </div>
        <div style="font-size:12px;color:#16213E;margin-top:6px;line-height:1.5;font-weight:500;">${personalizedAiVerdict || 'Both services deliver solid content; compare based on your specific listening/viewing frequency.'}</div>
      </div>

      <!-- Key Differences -->
      ${keyDifferences && keyDifferences.length > 0 ? `
        <div style="margin-top:14px;background:var(--white);border:1px solid var(--line);border-radius:14px;padding:12px 14px;">
          <div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:8px;">Key Differences</div>
          ${keyDifferences.map(diff => `
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:6px;display:flex;gap:7px;line-height:1.45;">
              <span style="color:var(--primary);font-weight:800;">•</span>
              <span>${diff}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Pros / Cons Breakdown -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">
        <div style="background:var(--white);border:1px solid var(--line);border-radius:12px;padding:10px;">
          <div style="font-size:11px;font-weight:800;color:var(--navy);margin-bottom:6px;">${serviceA.name} Highlights</div>
          ${(prosA || ['Reliable streaming', 'High compatibility']).slice(0, 2).map(p => `
            <div style="font-size:10.5px;color:var(--success);margin-bottom:4px;display:flex;gap:4px;">
              <span>✓</span><span>${p}</span>
            </div>
          `).join('')}
        </div>
        <div style="background:var(--white);border:1px solid var(--line);border-radius:12px;padding:10px;">
          <div style="font-size:11px;font-weight:800;color:var(--navy);margin-bottom:6px;">${serviceB.name} Highlights</div>
          ${(prosB || ['Extensive catalog', 'Good mobile support']).slice(0, 2).map(p => `
            <div style="font-size:10.5px;color:var(--success);margin-bottom:4px;display:flex;gap:4px;">
              <span>✓</span><span>${p}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderUniversalComparison(data) {
  return renderComparisonModal(data);
}

export function renderOTTComparison(data) {
  return renderComparisonModal(data);
}
