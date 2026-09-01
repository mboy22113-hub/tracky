import { KNOWN_SERVICES } from '../data/services.js';
import { POPULAR_COMPARISON_PRESETS, buildComparisonData } from '../data/comparisons.js';
import { getServiceLogo } from '../components/brandLogos.js';

export function renderCompareScreen(state) {
  const serviceAId = state.compareServiceA || 'netflix';
  const serviceBId = state.compareServiceB || 'primevideo';

  const comp = buildComparisonData(serviceAId, serviceBId, state.user);
  const { serviceA, serviceB, winner, personalizedAiVerdict, keyDifferences } = comp;

  const isWinnerA = winner === serviceA.name;
  const isWinnerB = winner === serviceB.name;

  const logoA = getServiceLogo(serviceA.name || serviceA.id, '#2F6FED');
  const logoB = getServiceLogo(serviceB.name || serviceB.id, '#FA243C');

  return `
    <div class="scroll">
      <!-- 1. VS Battle Header -->
      <div class="opt-hero">
        <h1>VS Battle Arena</h1>
        <p>Head-to-head service comparison & AI matchmaker</p>
      </div>

      <!-- 2. Popular Matchup Pills -->
      <div class="pills" id="compare-presets-pills" style="margin-top:12px;">
        ${POPULAR_COMPARISON_PRESETS.map(p => `
          <button class="pill ${((serviceAId === p.idA && serviceBId === p.idB) || (serviceAId === p.idB && serviceBId === p.idA)) ? 'active' : ''}" 
                  data-preset-a="${p.idA}" data-preset-b="${p.idB}" id="preset-${p.id}">
            ⚔️ ${p.label}
          </button>
        `).join('')}
      </div>

      <!-- 3. STRONG SERVICE A  VS  SERVICE B BATTLE CARD -->
      <div class="compare-battle-arena glass" style="margin-top:14px; padding:16px 14px; border-radius:var(--r-lg); border:1.5px solid var(--line); position:relative; background:linear-gradient(180deg, var(--white) 0%, var(--bg-deep) 100%);">
        
        <div style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:8px;">
          <!-- Fighter A -->
          <div class="fighter-card ${isWinnerA ? 'is-winner' : ''}" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:12px 8px; border-radius:14px; background:${isWinnerA ? 'rgba(47,111,237,0.06)' : 'var(--white)'}; border:${isWinnerA ? '2px solid var(--primary)' : '1px solid var(--line)'}; position:relative;">
            ${isWinnerA ? '<span style="position:absolute; top:-9px; font-size:9px; font-weight:800; color:#fff; background:var(--primary); padding:2px 8px; border-radius:10px; text-transform:uppercase;">WINNER</span>' : ''}
            <div class="sub-logo-wrap" style="width:48px; height:48px; border-radius:14px; margin-bottom:6px;">
              ${logoA}
            </div>
            <div style="font-size:13px; font-weight:800; color:var(--navy); line-height:1.2;">${serviceA.name}</div>
            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:4px;">₹${Math.round(serviceA.price)}<span style="font-size:10px; color:var(--muted);">/mo</span></div>
            <div style="font-size:10px; color:var(--muted); font-weight:700; margin-top:2px;">★ ${serviceA.rating} · ${serviceA.score}/10</div>
          </div>

          <!-- Central VS Lightning Crest -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 4px;">
            <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, #2F6FED, #16213E); color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; box-shadow:0 4px 12px rgba(47,111,237,0.35); letter-spacing:0.5px;">
              VS
            </div>
          </div>

          <!-- Fighter B -->
          <div class="fighter-card ${isWinnerB ? 'is-winner' : ''}" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:12px 8px; border-radius:14px; background:${isWinnerB ? 'rgba(47,111,237,0.06)' : 'var(--white)'}; border:${isWinnerB ? '2px solid var(--primary)' : '1px solid var(--line)'}; position:relative;">
            ${isWinnerB ? '<span style="position:absolute; top:-9px; font-size:9px; font-weight:800; color:#fff; background:var(--primary); padding:2px 8px; border-radius:10px; text-transform:uppercase;">WINNER</span>' : ''}
            <div class="sub-logo-wrap" style="width:48px; height:48px; border-radius:14px; margin-bottom:6px;">
              ${logoB}
            </div>
            <div style="font-size:13px; font-weight:800; color:var(--navy); line-height:1.2;">${serviceB.name}</div>
            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:4px;">₹${Math.round(serviceB.price)}<span style="font-size:10px; color:var(--muted);">/mo</span></div>
            <div style="font-size:10px; color:var(--muted); font-weight:700; margin-top:2px;">★ ${serviceB.rating} · ${serviceB.score}/10</div>
          </div>
        </div>

        <!-- Custom dropdown match selector -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; padding-top:12px; border-top:1px solid var(--line);">
          <div>
            <label class="field-label" style="font-size:10.5px; font-weight:700; color:var(--muted); margin-bottom:4px; display:block;">Change Fighter A</label>
            <select id="compare-select-a" class="custom-select">
              ${KNOWN_SERVICES.map(s => `
                <option value="${s.id}" ${s.id === serviceA.id ? 'selected' : ''}>${s.name} (₹${Math.round(s.price)})</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="field-label" style="font-size:10.5px; font-weight:700; color:var(--muted); margin-bottom:4px; display:block;">Change Fighter B</label>
            <select id="compare-select-b" class="custom-select">
              ${KNOWN_SERVICES.map(s => `
                <option value="${s.id}" ${s.id === serviceB.id ? 'selected' : ''}>${s.name} (₹${Math.round(s.price)})</option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- 4. 🏆 BEST MATCH FOR YOU (Hero Winner Callout) -->
      <div class="winner-champion-card glass" style="margin-top:14px; padding:14px 16px; border-radius:var(--r-md); background:linear-gradient(135deg, rgba(239,245,255,0.95), rgba(255,255,255,0.95)); border:1.5px solid rgba(47,111,237,0.35); box-shadow:0 8px 20px -6px rgba(47,111,237,0.25);">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:20px;">🏆</span>
          <div>
            <div style="font-size:10.5px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:0.4px;">Best Match For You</div>
            <div style="font-size:15px; font-weight:800; color:var(--navy); margin-top:1px;">${winner}</div>
          </div>
          <span class="action-tag keep" style="margin-left:auto; font-size:11px; padding:3px 9px;">AI CHOICE</span>
        </div>
      </div>

      <!-- 5. AI VERDICT (Visually Distinct Verdict Area) -->
      <div class="ai-verdict-card glass" style="margin-top:12px;">
        <div class="verdict-header">
          <div class="verdict-trophy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6FED" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <div class="verdict-label">AI Battle Verdict</div>
            <div class="verdict-winner">Why <span style="color:var(--primary);">${winner}</span> Wins</div>
          </div>
        </div>
        <div class="verdict-body">
          "${personalizedAiVerdict}"
        </div>
      </div>

      <!-- 6. HEAD-TO-HEAD METRICS ROW COMPARISON -->
      <div class="opt-card glass" style="margin-top:14px;">
        <h3 style="font-size:13.5px; font-weight:800; color:var(--navy); margin-bottom:10px;">Head-to-Head Comparison</h3>
        
        <div class="specs-table-wrap" style="margin-top:0;">
          <table class="specs-table">
            <thead>
              <tr>
                <th style="width:34%;">Metric</th>
                <th style="width:33%; text-align:center;">${serviceA.name}</th>
                <th style="width:33%; text-align:center;">${serviceB.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="spec-label">Monthly Price</td>
                <td class="spec-val ${serviceA.price <= serviceB.price ? 'highlight' : ''}" style="text-align:center;">₹${Math.round(serviceA.price)}/mo</td>
                <td class="spec-val ${serviceB.price <= serviceA.price ? 'highlight' : ''}" style="text-align:center;">₹${Math.round(serviceB.price)}/mo</td>
              </tr>
              <tr>
                <td class="spec-label">Best For</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceA.bestFor}</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceB.bestFor}</td>
              </tr>
              <tr>
                <td class="spec-label">Quality Tier</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceA.audioVideoQuality}</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceB.audioVideoQuality}</td>
              </tr>
              <tr>
                <td class="spec-label">Free / Trial</td>
                <td class="spec-val" style="text-align:center;">${serviceA.freePlan}</td>
                <td class="spec-val" style="text-align:center;">${serviceB.freePlan}</td>
              </tr>
              <tr>
                <td class="spec-label">Offline Downloads</td>
                <td class="spec-val" style="text-align:center;">${serviceA.offlineSupport}</td>
                <td class="spec-val" style="text-align:center;">${serviceB.offlineSupport}</td>
              </tr>
              <tr>
                <td class="spec-label">Family Sharing</td>
                <td class="spec-val" style="text-align:center;">${serviceA.familyPlan}</td>
                <td class="spec-val" style="text-align:center;">${serviceB.familyPlan}</td>
              </tr>
              <tr>
                <td class="spec-label">Student Discount</td>
                <td class="spec-val" style="text-align:center;">${serviceA.studentDiscount}</td>
                <td class="spec-val" style="text-align:center;">${serviceB.studentDiscount}</td>
              </tr>
              <tr>
                <td class="spec-label">AI / Smart Features</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceA.aiFeatures}</td>
                <td class="spec-val" style="text-align:center; font-size:11px;">${serviceB.aiFeatures}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 7. Key Differences Highlights -->
      <div class="opt-card glass" style="margin-top:14px;">
        <h3 style="font-size:13.5px; font-weight:800; color:var(--navy);">Key Matchup Differences</h3>
        <ul class="compare-diff-list" style="margin-top:10px;">
          ${keyDifferences.map(diff => `
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${diff}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- 8. Side-by-Side Pros & Cons -->
      <div class="pros-cons-grid" style="margin-top:14px; margin-bottom:24px;">
        <div class="pros-cons-col glass">
          <div class="pros-cons-title" style="color:var(--navy);">${serviceA.name}</div>
          <div class="pros-subhead">Pros</div>
          <ul class="pros-list">
            ${(serviceA.pros || []).map(p => `<li><span class="check">✓</span> ${p}</li>`).join('')}
          </ul>
          <div class="cons-subhead">Cons</div>
          <ul class="cons-list">
            ${(serviceA.cons || []).map(c => `<li><span class="cross">✕</span> ${c}</li>`).join('')}
          </ul>
        </div>

        <div class="pros-cons-col glass">
          <div class="pros-cons-title" style="color:var(--navy);">${serviceB.name}</div>
          <div class="pros-subhead">Pros</div>
          <ul class="pros-list">
            ${(serviceB.pros || []).map(p => `<li><span class="check">✓</span> ${p}</li>`).join('')}
          </ul>
          <div class="cons-subhead">Cons</div>
          <ul class="cons-list">
            ${(serviceB.cons || []).map(c => `<li><span class="cross">✕</span> ${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

