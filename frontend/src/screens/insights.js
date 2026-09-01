export function renderInsightsScreen(state) {
  const { insights, insightsPeriod = 'thismonth' } = state;
  
  // Default fallback if insights data not yet populated
  const ins = insights || {
    monthlySpend: 1984,
    previousSpend: 1770,
    spendChangePct: 12,
    yearlyProjection: 23808,
    potentialSavings: 699,
    attentionCount: 3,
    attentionReason: 'Renewals, low usage, ghost subscriptions, or trials',
    categories: [
      { id: 'ott', label: 'OTT & Entertainment', emoji: '🎬', amount: 850, percentage: 43, color: '#2F6FED', count: 3 },
      { id: 'productivity', label: 'Productivity', emoji: '💼', amount: 499, percentage: 25, color: '#7C3AED', count: 1 },
      { id: 'gaming', label: 'Gaming', emoji: '🎮', amount: 299, percentage: 15, color: '#C98A2C', count: 1 },
      { id: 'other', label: 'Other Services', emoji: '🛍️', amount: 217, percentage: 11, color: '#16213E', count: 2 },
      { id: 'music', label: 'Music', emoji: '🎵', amount: 119, percentage: 6, color: '#2FAE6B', count: 1 }
    ],
    spendingTrend: [
      { month: 'Apr', value: 1450, change: '+₹0', changePct: '0%' },
      { month: 'May', value: 1600, change: '+₹150', changePct: '+10.3%' },
      { month: 'Jun', value: 1720, change: '+₹120', changePct: '+7.5%' },
      { month: 'Jul', value: 1840, change: '+₹120', changePct: '+7.0%' },
      { month: 'Aug', value: 1984, change: '+₹144', changePct: '+7.8%' },
      { month: 'Sep', value: 1984, change: '±₹0', changePct: '0%' }
    ],
    trendInsight: 'Your subscription spending increased by 37% over the last 5 months.',
    trendDirection: 'up',
    valueMetrics: [
      { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', cost: 119, usageHours: 35, costPerHour: 3, status: 'good', statusLabel: 'Great Value', badge: '✅ ₹3/hr' },
      { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', cost: 299, usageHours: 20, costPerHour: 15, status: 'good', statusLabel: 'Good Value', badge: '✅ ₹15/hr' },
      { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', cost: 199, usageHours: 3, costPerHour: 66, status: 'warning', statusLabel: 'Low Value', badge: '⚠️ ₹66/hr' },
      { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', cost: 499, usageHours: 2, costPerHour: 249, status: 'danger', statusLabel: 'Overpaying', badge: '⚠️ ₹249/hr' }
    ],
    valueInsight: 'Canva and Netflix have the highest cost per hour because of low usage.',
    weeklyActivity: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      mostActive: { name: 'Spotify', detail: '35 hrs / 7 days active' },
      leastActive: { name: 'Canva', detail: '2 hrs / 1 day active' },
      services: [
        { id: 'spotify', name: 'Spotify', icon: '🎧', color: '#1DB954', activeDays: 7, percentage: 100, intensity: [3, 4, 4, 5, 5, 4, 3] },
        { id: 'primevideo', name: 'Prime Video', icon: '🎬', color: '#00A8E1', activeDays: 5, percentage: 71, intensity: [0, 2, 0, 3, 4, 5, 4] },
        { id: 'netflix', name: 'Netflix', icon: '🍿', color: '#E50914', activeDays: 2, percentage: 28, intensity: [0, 0, 0, 0, 1, 2, 0] },
        { id: 'canva', name: 'Canva', icon: '🎨', color: '#00C4CC', activeDays: 1, percentage: 14, intensity: [0, 0, 2, 0, 0, 0, 0] }
      ]
    },
    moneyLeaks: [
      { id: 'leak_ghost', type: 'ghost', icon: '👻', title: 'Ghost Subscription', description: 'Deleted app but active subscription detected.', serviceName: 'Duolingo Super', serviceId: 'duolingo', riskLevel: 'High Risk', riskClass: 'high', potentialSavings: 299, actionLabel: 'Review →' },
      { id: 'leak_trial', type: 'trial', icon: '🎁', title: 'Free Trial Ending', description: 'Trial ends in 2 days. Auto-renews soon.', serviceName: 'Canva Pro', serviceId: 'canva', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 499, actionLabel: 'Review →' },
      { id: 'leak_low_usage', type: 'low_usage', icon: '⚠️', title: 'Low Usage', description: 'Netflix has not been used for 18 days.', serviceName: 'Netflix Basic', serviceId: 'netflix', riskLevel: 'Medium Risk', riskClass: 'medium', potentialSavings: 199, actionLabel: 'Review →' },
      { id: 'leak_overlap', type: 'overlap', icon: '💸', title: 'Duplicate / Overlapping Services', description: 'Multiple services provide similar functionality.', serviceName: 'Apple Music & Spotify', serviceId: 'spotify', riskLevel: 'Low Risk', riskClass: 'low', potentialSavings: 119, actionLabel: 'Review →' }
    ],
    aiInsight: {
      title: 'Trackey AI Insight',
      text: 'Your spending is increasing mainly because of productivity and OTT subscriptions. You actively use Spotify and Prime Video, but Netflix and Canva provide significantly lower value per rupee.',
      potentialSavings: 699,
      action1: 'Optimize Now →',
      action2: 'View Recommendations →'
    }
  };

  const periods = [
    { id: 'thismonth', label: 'This Month' },
    { id: 'lastmonth', label: 'Last Month' },
    { id: 'last3', label: '3 Months' }
  ];

  // SVG Donut calculations (circumference of r=38 is 2 * Math.PI * 38 ≈ 238.761)
  const circumference = 238.761;
  let runningOffset = 0;
  const donutSegments = ins.categories.map((c, index) => {
    const segLength = (c.percentage / 100) * circumference;
    const strokeDasharray = `${segLength.toFixed(2)} ${(circumference - segLength).toFixed(2)}`;
    const strokeDashoffset = (-runningOffset).toFixed(2);
    runningOffset += segLength;
    return {
      ...c,
      segLength,
      strokeDasharray,
      strokeDashoffset,
      animationDelay: `${0.1 + index * 0.12}s`
    };
  });

  // SVG Line and Area Graph Calculations
  const trendValues = ins.spendingTrend || [];
  const minVal = Math.min(...trendValues.map(t => t.value), 1400);
  const maxVal = Math.max(...trendValues.map(t => t.value), 2000);
  const range = maxVal - minVal || 1;
  const svgWidth = 320;
  const svgHeight = 110;
  const paddingX = 24;
  const chartWidth = svgWidth - paddingX * 2;
  const stepX = chartWidth / (trendValues.length - 1 || 1);

  const coordinates = trendValues.map((t, idx) => {
    const x = paddingX + idx * stepX;
    const y = 90 - ((t.value - minVal) / range) * 60;
    return { ...t, x, y, index: idx };
  });

  const pointsString = coordinates.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPointsString = `${coordinates[0]?.x.toFixed(1)},100 ` + pointsString + ` ${coordinates[coordinates.length - 1]?.x.toFixed(1)},100`;

  return `
    <div class="scroll insights-dashboard" id="insights-container">
      
      <!-- PAGE HEADER -->
      <div class="insights-header-block animate-slide-up" style="animation-delay: 0.05s;">
        <div class="insights-header-content">
          <h1>Subscription Insights</h1>
          <p>Understand where your subscription money goes.</p>
        </div>

        <!-- Period Filter Selector -->
        <div class="period-toggle-pills" role="tablist" aria-label="Insights Period">
          ${periods.map(p => `
            <button class="period-toggle-btn ${insightsPeriod === p.id ? 'active' : ''}" 
                    data-insights-period="${p.id}"
                    role="tab"
                    aria-selected="${insightsPeriod === p.id ? 'true' : 'false'}">
              ${p.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 1: KEY INSIGHTS SUMMARY (3 Compact Animated Cards) -->
      <div class="insights-summary-grid">
        <!-- 1. Total Spending -->
        <div class="summary-metric-card glass animate-slide-up" style="animation-delay: 0.1s;">
          <div class="summary-card-top">
            <div class="summary-icon-pill bg-blue">💰</div>
            <span class="summary-trend-pill up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m18 15-6-6-6 6"/></svg>
              ${ins.spendChangePct || 12}% vs last mo
            </span>
          </div>
          <div class="summary-card-label">Total Spending</div>
          <div class="summary-card-value count-up-val" data-target="${ins.monthlySpend}">₹${ins.monthlySpend}</div>
          <div class="summary-card-sub">Outflow across active services</div>
        </div>

        <!-- 2. Potential Savings -->
        <div class="summary-metric-card glass animate-slide-up" style="animation-delay: 0.15s;">
          <div class="summary-card-top">
            <div class="summary-icon-pill bg-green">💚</div>
            <span class="summary-saving-tag">Save ₹${ins.potentialSavings}/mo</span>
          </div>
          <div class="summary-card-label">Potential Savings</div>
          <div class="summary-card-value success count-up-val" data-target="${ins.potentialSavings}">₹${ins.potentialSavings}</div>
          <div class="summary-card-sub">Based on low usage & unused plans</div>
        </div>

        <!-- 3. Attention Needed -->
        <div class="summary-metric-card glass animate-slide-up" style="animation-delay: 0.2s;">
          <div class="summary-card-top">
            <div class="summary-icon-pill bg-amber">⚠️</div>
            <span class="summary-alert-tag">Action Needed</span>
          </div>
          <div class="summary-card-label">Attention Needed</div>
          <div class="summary-card-value warn">${ins.attentionCount || 3} services</div>
          <div class="summary-card-sub">${ins.attentionReason || 'Renewals, low usage, ghost plans, or trials'}</div>
        </div>
      </div>

      <!-- SECTION 2: SPENDING BREAKDOWN (Animated Donut / Pie Chart) -->
      <div class="insights-card glass animate-slide-up" style="animation-delay: 0.25s;">
        <div class="insights-card-header">
          <div>
            <h3>Where Your Money Goes</h3>
            <div class="insights-card-subtitle">Category distribution of monthly spend</div>
          </div>
          <span class="category-count-badge">${ins.categories.length} Categories</span>
        </div>

        <div class="donut-chart-container">
          <!-- Donut SVG Ring -->
          <div class="donut-chart-svg-wrap">
            <svg class="donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(22,33,62,0.06)" stroke-width="14"/>
              ${donutSegments.map(seg => `
                <circle class="donut-segment"
                        cx="50" cy="50" r="38"
                        fill="none"
                        stroke="${seg.color}"
                        stroke-width="14"
                        stroke-dasharray="${seg.strokeDasharray}"
                        stroke-dashoffset="${seg.strokeDashoffset}"
                        data-cat-id="${seg.id}"
                        data-cat-name="${seg.label}"
                        data-cat-amt="₹${seg.amount}"
                        data-cat-pct="${seg.percentage}%"
                        style="--target-offset: ${seg.strokeDashoffset}; --anim-delay: ${seg.animationDelay};" />
              `).join('')}
            </svg>
            
            <!-- Interactive Center Content -->
            <div class="donut-center-info" id="donut-center-display">
              <div class="donut-center-amt" id="donut-center-amount">₹${ins.monthlySpend}</div>
              <div class="donut-center-sub" id="donut-center-label">Total Spend</div>
            </div>
          </div>

          <!-- Clean Interactive Legend -->
          <div class="donut-legend-wrap">
            ${ins.categories.map((c, i) => `
              <div class="donut-legend-row" data-legend-cat="${c.id}" style="animation-delay: ${0.2 + i * 0.05}s;">
                <div class="donut-legend-left">
                  <span class="donut-legend-emoji">${c.emoji || '📦'}</span>
                  <span class="donut-legend-color-dot" style="background:${c.color};"></span>
                  <span class="donut-legend-label">${c.label}</span>
                </div>
                <div class="donut-legend-right">
                  <span class="donut-legend-amt">₹${c.amount}</span>
                  <span class="donut-legend-pct" style="color:${c.color};">${c.percentage}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="chart-footer-note">
          <span>💡</span>
          <div>Entertainment & Productivity represent <strong>${(ins.categories[0]?.percentage || 0) + (ins.categories[1]?.percentage || 0)}%</strong> of your total recurring subscription budget.</div>
        </div>
      </div>

      <!-- SECTION 3: MONTHLY SPENDING TREND (Animated Line / Area Graph) -->
      <div class="insights-card glass animate-slide-up" style="animation-delay: 0.3s;">
        <div class="insights-card-header">
          <div>
            <h3>Spending Trend</h3>
            <div class="insights-card-subtitle">6-Month billing trajectory & changes</div>
          </div>
          <span class="trend-delta-pill ${ins.trendDirection || 'up'}">
            ${ins.trendDirection === 'down' ? '↓ -3.8%' : '↑ +37% (5 Mo)'}
          </span>
        </div>

        <!-- Interactive SVG Area & Line Chart -->
        <div class="trend-chart-box">
          <!-- Active Floating Tooltip (Dynamic via JS) -->
          <div class="trend-live-tooltip" id="trend-live-tooltip">
            <span class="tooltip-month" id="tt-month">Aug 2026</span>
            <span class="tooltip-val" id="tt-val">₹1,984</span>
            <span class="tooltip-change" id="tt-change">+₹144 (+7.8%)</span>
          </div>

          <svg class="trend-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2F6FED" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#2F6FED" stop-opacity="0.0"/>
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#2F6FED" flood-opacity="0.3"/>
              </filter>
            </defs>

            <!-- Background Grid Lines -->
            <line x1="${paddingX}" y1="30" x2="${svgWidth - paddingX}" y2="30" stroke="rgba(22,33,62,0.05)" stroke-dasharray="3 3"/>
            <line x1="${paddingX}" y1="60" x2="${svgWidth - paddingX}" y2="60" stroke="rgba(22,33,62,0.05)" stroke-dasharray="3 3"/>
            <line x1="${paddingX}" y1="90" x2="${svgWidth - paddingX}" y2="90" stroke="rgba(22,33,62,0.05)" stroke-dasharray="3 3"/>

            <!-- Area Fill -->
            <polygon class="trend-area-fill" points="${areaPointsString}" fill="url(#trendAreaGradient)" />

            <!-- Smooth Animated Line -->
            <polyline class="trend-draw-line" points="${pointsString}" fill="none" stroke="#2F6FED" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowEffect)"/>

            <!-- Interactive Data Points -->
            ${coordinates.map((c, i) => `
              <g class="trend-point-group" data-month="${c.month}" data-val="₹${c.value}" data-change="${c.change} (${c.changePct})" data-x="${c.x}" data-y="${c.y}" style="--point-delay: ${0.25 + i * 0.07}s;">
                <circle class="trend-point-halo" cx="${c.x}" cy="${c.y}" r="9" fill="#2F6FED" fill-opacity="0.12"/>
                <circle class="trend-point-dot ${i === coordinates.length - 1 ? 'active-pulse' : ''}" cx="${c.x}" cy="${c.y}" r="4.5" fill="#2F6FED" stroke="#FFFFFF" stroke-width="2.5"/>
                <text class="trend-x-label" x="${c.x}" y="106" text-anchor="middle">${c.month}</text>
              </g>
            `).join('')}
          </svg>
        </div>

        <div class="trend-insight-banner">
          <div class="trend-insight-icon">📈</div>
          <div class="trend-insight-text">${ins.trendInsight || 'Your subscription spending increased by 37% over the last 5 months.'}</div>
        </div>
      </div>

      <!-- SECTION 4: USAGE VS MONEY (Animated Bar Graph & Efficiency) -->
      <div class="insights-card glass animate-slide-up" style="animation-delay: 0.35s;">
        <div class="insights-card-header">
          <div>
            <h3>Are You Getting Value?</h3>
            <div class="insights-card-subtitle">Cost per hour calculation based on active usage</div>
          </div>
          <span class="value-rating-tag">Value Score</span>
        </div>

        <div class="value-comparison-list">
          ${ins.valueMetrics.map((m, index) => {
            // max cost/hr in sample is 249
            const barPct = Math.min(100, Math.max(12, (m.costPerHour / 250) * 100));
            return `
              <div class="value-item-row animate-slide-up" style="animation-delay: ${0.35 + index * 0.08}s;">
                <div class="value-item-head">
                  <div class="value-item-brand">
                    <span class="value-item-icon" style="background:${m.color}15; color:${m.color};">${m.icon}</span>
                    <div>
                      <div class="value-item-name">${m.name}</div>
                      <div class="value-item-meta">₹${m.cost}/mo · ${m.usageHours} hrs used</div>
                    </div>
                  </div>
                  <div class="value-item-badge ${m.status}">
                    ${m.badge}
                  </div>
                </div>

                <!-- Animated Bar Graph for Cost/Hour -->
                <div class="value-bar-container">
                  <div class="value-bar-track">
                    <div class="value-bar-fill ${m.status}" 
                         style="width: ${barPct}%; --target-width: ${barPct}%;"
                         title="${m.name}: ₹${m.costPerHour}/hr">
                    </div>
                  </div>
                  <div class="value-bar-stat">
                    <span>${m.statusLabel}</span>
                    <strong>₹${m.costPerHour}/hr</strong>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="value-insight-banner">
          <div class="value-insight-icon">⚖️</div>
          <div class="value-insight-text">${ins.valueInsight || 'Canva and Netflix have the highest cost per hour because of low usage.'}</div>
        </div>
      </div>

      <!-- SECTION 5: USAGE ACTIVITY (Weekly Usage Intensity & Progress) -->
      <div class="insights-card glass animate-slide-up" style="animation-delay: 0.4s;">
        <div class="insights-card-header">
          <div>
            <h3>Subscription Activity</h3>
            <div class="insights-card-subtitle">Weekly day-by-day active engagement</div>
          </div>
          <div class="activity-high-low-pills">
            <span class="act-pill high">🔥 ${ins.weeklyActivity?.mostActive?.name || 'Spotify'}</span>
            <span class="act-pill low">📉 ${ins.weeklyActivity?.leastActive?.name || 'Canva'}</span>
          </div>
        </div>

        <!-- Weekdays Header -->
        <div class="weekly-days-header">
          <span class="weekly-app-col">Service</span>
          <div class="weekly-day-cols">
            ${ins.weeklyActivity?.days.map(d => `<span class="day-col-header">${d}</span>`).join('')}
          </div>
          <span class="weekly-freq-col">Freq</span>
        </div>

        <!-- Weekly Activity Rows -->
        <div class="weekly-activity-list">
          ${ins.weeklyActivity?.services.map((s, index) => `
            <div class="weekly-row animate-slide-up" style="animation-delay: ${0.4 + index * 0.07}s;">
              <div class="weekly-row-app">
                <span class="weekly-app-dot" style="background:${s.color};"></span>
                <span class="weekly-app-name">${s.name}</span>
              </div>

              <!-- Day Intensity Heat Dots -->
              <div class="weekly-day-dots">
                ${(s.intensity || [0,0,0,0,0,0,0]).map((lvl, dIdx) => `
                  <span class="heat-dot lvl-${lvl}" title="${ins.weeklyActivity?.days[dIdx]}: ${lvl > 0 ? lvl + ' hrs' : 'Inactive'}"></span>
                `).join('')}
              </div>

              <!-- Active Frequency Percentage & Bar -->
              <div class="weekly-row-freq">
                <div class="weekly-freq-bar-wrap">
                  <div class="weekly-freq-bar-fill" style="width:${s.percentage}%; background:${s.color};"></div>
                </div>
                <span class="weekly-freq-text">${s.activeDays}/7d</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Highlights Footer -->
        <div class="activity-summary-footer">
          <div class="act-sum-item">
            <span class="act-sum-tag most">🔥 Most Active</span>
            <strong>${ins.weeklyActivity?.mostActive?.name}</strong>
            <span class="act-sum-sub">${ins.weeklyActivity?.mostActive?.detail}</span>
          </div>
          <div class="act-sum-divider"></div>
          <div class="act-sum-item">
            <span class="act-sum-tag least">📉 Least Active</span>
            <strong>${ins.weeklyActivity?.leastActive?.name}</strong>
            <span class="act-sum-sub">${ins.weeklyActivity?.leastActive?.detail}</span>
          </div>
        </div>
      </div>

      <!-- SECTION 6: MONEY LEAK DETECTION (4 Detected Problem Cards) -->
      <div class="insights-card glass animate-slide-up" style="animation-delay: 0.45s;">
        <div class="insights-card-header">
          <div>
            <h3>Potential Money Leaks</h3>
            <div class="insights-card-subtitle">Detected anomalies & recoverable expenses</div>
          </div>
          <span class="leak-total-pill">Save ₹${ins.potentialSavings}/mo</span>
        </div>

        <div class="money-leak-card-list">
          ${ins.moneyLeaks.map((leak, idx) => `
            <div class="money-leak-card ${leak.riskClass || 'medium'} animate-slide-up" style="animation-delay: ${0.45 + idx * 0.08}s;">
              <div class="leak-card-icon-wrap">
                <span class="leak-card-icon">${leak.icon}</span>
              </div>
              <div class="leak-card-content">
                <div class="leak-card-top-row">
                  <span class="leak-card-title">${leak.title}</span>
                  <span class="leak-risk-badge ${leak.riskClass}">${leak.riskLevel}</span>
                </div>
                <div class="leak-card-desc">${leak.description}</div>
                <div class="leak-card-bottom-row">
                  <span class="leak-save-text">Potential saving <strong>₹${leak.potentialSavings}/month</strong></span>
                  <button class="leak-review-btn" data-leak-id="${leak.id}" data-sub-id="${leak.serviceId}">
                    ${leak.actionLabel || 'Review →'}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 7: AI INSIGHT (Premium AI Card with Call-to-Actions) -->
      <div class="ai-master-insight-card animate-slide-up" style="animation-delay: 0.5s;">
        <div class="ai-master-header">
          <div class="ai-sparkle-pill">
            <span class="ai-sparkle-icon">✨</span>
            <span>Trackey AI Intelligence</span>
          </div>
          <div class="ai-savings-pill">
            Potential monthly saving: <strong>₹${ins.aiInsight?.potentialSavings || 699}</strong>
          </div>
        </div>

        <div class="ai-master-body">
          <p class="ai-master-text">
            "${ins.aiInsight?.text || 'Your spending is increasing mainly because of productivity and OTT subscriptions. You actively use Spotify and Prime Video, but Netflix and Canva provide significantly lower value per rupee.'}"
          </p>
        </div>

        <div class="ai-master-actions">
          <button class="ai-action-btn primary" id="insights-ai-opt-btn">
            Optimize Now →
          </button>
          <button class="ai-action-btn secondary" id="insights-ai-recs-btn">
            View Recommendations →
          </button>
        </div>
      </div>

      <div style="height:32px;"></div>
    </div>
  `;
}
