export function weeklyLimits(usage) {
  const bucket = usage.rateLimitsByLimitId == null
    ? usage.rateLimits
    : usage.rateLimitsByLimitId.codex;
  if (!bucket || (bucket.limitId && bucket.limitId !== 'codex')) return [];
  const window = [bucket.primary, bucket.secondary].find(window =>
    window?.windowDurationMins === 10080 && Number.isFinite(window.usedPercent));
  return window ? [{
    label: 'Codex weekly',
    utilization: Math.max(0, Math.min(100, window.usedPercent)),
    resets_at: window.resetsAt == null ? null : new Date(window.resetsAt * 1000).toISOString(),
  }] : [];
}

export function initCodex({ renderRow, fmtUpdated }) {
  const get = id => document.getElementById(id);
  const toggle = get('codexToggle');
  const button = get('codexRefreshBtn');
  const status = get('codexStatus');
  const rows = get('codexRows');
  let enabled = localStorage.getItem('codex-usage-enabled') === 'true';
  let generation = 0;
  let inFlight = false;
  let updatedAt = null;

  async function refresh() {
    if (!enabled || inFlight) return;
    inFlight = true;
    button.disabled = true;
    const requestGeneration = generation;
    status.textContent = 'Refreshing Codex…';
    status.dataset.state = '';
    try {
      const usage = await window.__TAURI__.core.invoke('read_codex_usage');
      if (!enabled || requestGeneration !== generation) return;
      const limits = weeklyLimits(usage);
      rows.innerHTML = limits.map(limit =>
        `<div>${renderRow(limit.label, limit)}<p class="codex-remaining">${Math.round(100 - limit.utilization)}% remaining</p></div>`
      ).join('');
      updatedAt = limits.length ? Date.now() : null;
      status.textContent = limits.length
        ? fmtUpdated(updatedAt)
        : 'No weekly limit reported. Use a ChatGPT subscription login in Codex CLI, then refresh.';
    } catch (error) {
      if (!enabled || requestGeneration !== generation) return;
      rows.replaceChildren();
      updatedAt = null;
      status.dataset.state = 'error';
      status.textContent = typeof error === 'string' ? error : 'Could not refresh Codex. Please retry.';
    } finally {
      inFlight = false;
      button.disabled = false;
      if (enabled && requestGeneration !== generation) void refresh();
    }
  }

  toggle.checked = enabled;
  get('codexSection').classList.toggle('hidden', !enabled);
  toggle.addEventListener('change', () => {
    enabled = toggle.checked;
    generation += 1;
    localStorage.setItem('codex-usage-enabled', String(enabled));
    get('codexSection').classList.toggle('hidden', !enabled);
    rows.replaceChildren();
    updatedAt = null;
    if (enabled) void refresh();
  });
  button.addEventListener('click', refresh);
  get('refreshBtn').addEventListener('click', refresh);
  get('settingsBtn').addEventListener('click', () => {
    const panel = get('settingsPanel');
    if (!panel.classList.contains('hidden')) panel.scrollIntoView({ block: 'nearest' });
  });
  setInterval(refresh, 60_000);
  setInterval(() => {
    if (enabled && updatedAt && !inFlight) status.textContent = fmtUpdated(updatedAt);
  }, 30_000);
  void refresh();
}
