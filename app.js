// Fulcrum app — theme, filters, sort, selection, radar + trend + actions
(function () {
  const D = window.FULCRUM_DATA;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Selected player is declared up-front so all render fns can reference it safely.
  let currentPlayer = D.PLAYERS[0];

  // -----------------------------------------------------------------------
  // THEME
  // -----------------------------------------------------------------------
  const root = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const themeIcon = $("#theme-icon");
  const SUN_PATH = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
  const MOON_PATH = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

  function setTheme(theme, redraw = true) {
    root.setAttribute("data-theme", theme);
    themeIcon.innerHTML = theme === "dark" ? MOON_PATH : SUN_PATH;
    try { localStorage.setItem("fulcrum-theme", theme); } catch (e) {}
    if (redraw) {
      renderRadar(currentPlayer);
      renderTrend(currentPlayer);
    }
  }
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  });
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("fulcrum-theme") || "dark"; } catch (e) {}
  // First run: don't call renderers before they're defined further down.
  setTheme(savedTheme, false);

  // -----------------------------------------------------------------------
  // LEADERBOARD — render, sort, filter, select
  // -----------------------------------------------------------------------
  const state = {
    sortKey: "caScore",
    sortDir: "desc",
    filters: { position: "all", focus: "all" },
    search: ""
  };

  const tbody = $("#tbody");

  function fmt(n, digits = 2) {
    return typeof n === "number" ? n.toFixed(digits) : n;
  }
  function fmtInt(n) {
    return typeof n === "number" ? n.toLocaleString("en-US") : n;
  }
  function initials(name) {
    return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  }

  function passesFilters(p) {
    const { position, focus } = state.filters;
    // Position filter (group wingers under "LW")
    if (position !== "all") {
      const posGroup = p.position === "RW" || p.position === "LW" ? "LW"
                     : p.position === "RB" || p.position === "LB" ? "LB"
                     : p.position;
      if (posGroup !== position) return false;
    }
    if (focus === "undervalued" && !p.undervalued) return false;
    if (focus === "highconf" && p.sampleConf < 92) return false;
    if (focus === "under23" && p.age >= 23) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const club = D.CLUBS[p.club].name.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !club.includes(q)) return false;
    }
    return true;
  }

  function sortedPlayers() {
    const rows = D.PLAYERS.filter(passesFilters);
    const k = state.sortKey;
    const dir = state.sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      let av = a[k], bv = b[k];
      if (k === "club") { av = D.CLUBS[a.club].name; bv = D.CLUBS[b.club].name; }
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
    return rows;
  }

  function renderTable() {
    const rows = sortedPlayers();
    tbody.innerHTML = rows.map((p, i) => {
      const club = D.CLUBS[p.club];
      const scorePct = Math.round((p.caScore / 10) * 100);
      const selected = p.id === currentPlayer.id ? "selected" : "";
      return `
        <tr class="${selected}" data-id="${p.id}" tabindex="0">
          <td class="num" style="color: var(--text-faint);">${String(i + 1).padStart(2, "0")}</td>
          <td>
            <div class="player-cell">
              <div class="avatar">${initials(p.name)}</div>
              <div>
                <div class="player-name">${p.name}</div>
                <div class="player-meta">${p.age} · ${p.position} · ${p.role}${p.undervalued ? ' · <span style="color: var(--accent)">Undervalued</span>' : ''}</div>
              </div>
            </div>
          </td>
          <td class="hide-sm">
            <div class="club-cell">
              <span class="club-dot" style="background: ${club.primary}"></span>
              <span>${club.name}</span>
            </div>
          </td>
          <td class="hide-sm"><span class="badge">${p.position}</span></td>
          <td class="right">
            <div class="score" style="justify-content: flex-end">
              <div class="score-bar"><div style="width: ${scorePct}%"></div></div>
              <div class="score-val num">${fmt(p.caScore)}</div>
            </div>
          </td>
          <td class="right num hide-sm">${fmt(p.actionValue, 2)}</td>
          <td class="right num hide-sm">${p.roleFit}</td>
          <td class="right num hide-sm">${fmtInt(p.minutes)}</td>
          <td class="right num hide-sm">${p.consistency}</td>
          <td class="right hide-sm">
            <div class="conf" style="justify-content: flex-end">
              <span>${p.sampleConf}%</span>
              <div class="conf-bar"><div style="width: ${p.sampleConf}%"></div></div>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Update sort caret indicators
    $$("thead th.sortable").forEach(th => {
      const isActive = th.dataset.sort === state.sortKey;
      th.classList.toggle("sorted", isActive);
      const caret = th.querySelector(".sort-caret");
      if (caret) caret.textContent = isActive ? (state.sortDir === "asc" ? "▲" : "▼") : "▲▼";
    });

    // Attach row handlers
    $$("#tbody tr").forEach(tr => {
      tr.addEventListener("click", () => selectPlayer(tr.dataset.id));
      tr.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPlayer(tr.dataset.id); }
      });
    });
  }

  // Sort clicks
  $$("thead th.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        // Numeric fields default to desc; string to asc
        state.sortDir = (key === "name" || key === "club" || key === "position") ? "asc" : "desc";
      }
      renderTable();
    });
  });

  // Filter chip clicks
  $$(".filter-group").forEach(group => {
    const filterKey = group.dataset.filter;
    group.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.filters[filterKey] = chip.dataset.value;
        renderTable();
      });
    });
  });

  // Search
  $("#search").addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    renderTable();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("#search").focus();
    }
  });

  // -----------------------------------------------------------------------
  // PLAYER DETAIL
  // -----------------------------------------------------------------------
  function selectPlayer(id) {
    const p = D.PLAYERS.find(x => x.id === id);
    if (!p) return;
    currentPlayer = p;
    renderProfile(p);
    renderRadar(p);
    renderTrend(p);
    renderExpectations(p);
    renderTable(); // update selected row highlight
  }

  function renderProfile(p) {
    const c = D.CLUBS[p.club];
    $("#p-name").textContent = p.name;
    $("#p-avatar").textContent = initials(p.name);
    $("#p-club").textContent = c.name;
    $("#p-clubdot").style.background = c.primary;
    $("#p-position").textContent = `${p.position} · ${p.role}`;
    $("#p-age").textContent = `${p.age} yrs`;
    $("#p-score").textContent = fmt(p.caScore);
    $("#p-minutes").textContent = fmtInt(p.minutes);
    $("#p-matches").textContent = `${p.matches} matches`;
    $("#p-ga").textContent = `${p.goals} + ${p.assists}`;
    $("#p-xga").textContent = `xG ${fmt(p.xg, 1)} · xA ${fmt(p.xa, 1)}`;
    $("#p-consistency").textContent = p.consistency;
    $("#p-sample").textContent = `${p.sampleConf}% sample conf.`;
    $("#p-note").textContent = p.note;
    const flag = $("#p-flag");
    flag.hidden = !p.undervalued;
    // Update section heading
    $("#detail-heading").innerHTML = `${p.name} <span style="color: var(--text-faint); font-weight: 500; font-size: 60%;"> · ${c.name}</span>`;
  }

  // -----------------------------------------------------------------------
  // ROLE-EXPECTATION BARS (per sub-component)
  // -----------------------------------------------------------------------
  const ROLE_EXPECT = {
    // expected percentile baseline per component per role family
    GK:  { finishing: 5,  creation: 25, progression: 55, defending: 78, aerial: 65, pressing: 15 },
    CB:  { finishing: 15, creation: 35, progression: 60, defending: 82, aerial: 78, pressing: 55 },
    LB:  { finishing: 30, creation: 55, progression: 65, defending: 70, aerial: 55, pressing: 68 },
    RB:  { finishing: 30, creation: 55, progression: 65, defending: 70, aerial: 55, pressing: 68 },
    DM:  { finishing: 20, creation: 55, progression: 68, defending: 78, aerial: 62, pressing: 72 },
    CM:  { finishing: 45, creation: 65, progression: 72, defending: 65, aerial: 55, pressing: 72 },
    AM:  { finishing: 62, creation: 78, progression: 72, defending: 38, aerial: 40, pressing: 60 },
    LW:  { finishing: 62, creation: 68, progression: 78, defending: 40, aerial: 38, pressing: 62 },
    RW:  { finishing: 62, creation: 68, progression: 78, defending: 40, aerial: 38, pressing: 62 },
    ST:  { finishing: 78, creation: 55, progression: 55, defending: 25, aerial: 68, pressing: 62 }
  };
  const LABELS = { finishing: "Finishing", creation: "Creation", progression: "Progression", defending: "Defending", aerial: "Aerial", pressing: "Pressing" };

  function renderExpectations(p) {
    const expect = ROLE_EXPECT[p.position] || ROLE_EXPECT.CM;
    const rows = Object.keys(LABELS).map(k => {
      const actual = p.radar[k];
      const exp = expect[k];
      const delta = actual - exp;
      const cls = delta >= 0 ? "good" : "bad";
      const sign = delta >= 0 ? "+" : "";
      return `
        <div class="expect-row">
          <div class="expect-top">
            <span class="label">${LABELS[k]}</span>
            <span class="val">${actual} <span class="${cls}">${sign}${delta}</span></span>
          </div>
          <div class="expect-bar">
            <div class="expected" style="width: ${exp}%"></div>
            <div class="actual" style="width: ${actual}%"></div>
          </div>
        </div>
      `;
    }).join("");
    $("#expect-list").innerHTML = rows;
    // Radar legend re-uses the same layout for readability
    $("#radar-legend").innerHTML = Object.keys(LABELS).map(k => {
      const actual = p.radar[k];
      return `
        <div class="expect-row">
          <div class="expect-top">
            <span class="label">${LABELS[k]}</span>
            <span class="val num">${actual}</span>
          </div>
          <div class="expect-bar"><div class="actual" style="width: ${actual}%"></div></div>
        </div>
      `;
    }).join("");
  }

  // -----------------------------------------------------------------------
  // RADAR CHART (SVG)
  // -----------------------------------------------------------------------
  function renderRadar(p) {
    const svg = $("#radar");
    if (!svg) return;
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue("--accent").trim() || "#C7F284";
    const border = cs.getPropertyValue("--border-strong").trim() || "rgba(255,255,255,.16)";
    const faint = cs.getPropertyValue("--text-faint").trim() || "#64685F";
    const surface3 = cs.getPropertyValue("--surface-3").trim() || "#22261F";

    const axes = ["finishing", "creation", "progression", "defending", "aerial", "pressing"];
    const N = axes.length;
    const R = 130;
    // Points at angle -90deg start (top), clockwise
    function pt(i, r) {
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    }

    let html = "";
    // Grid rings (25/50/75/100)
    [0.25, 0.5, 0.75, 1].forEach(f => {
      const poly = axes.map((_, i) => pt(i, R * f).join(",")).join(" ");
      html += `<polygon points="${poly}" fill="none" stroke="${border}" stroke-width="1" stroke-opacity="0.5" />`;
    });
    // Axes lines
    axes.forEach((_, i) => {
      const [x, y] = pt(i, R);
      html += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${border}" stroke-opacity="0.4" stroke-width="1" />`;
    });
    // Role expectation baseline polygon
    const expect = ROLE_EXPECT[p.position] || ROLE_EXPECT.CM;
    const expectPts = axes.map((k, i) => pt(i, R * (expect[k] / 100)).join(",")).join(" ");
    html += `<polygon points="${expectPts}" fill="${faint}" fill-opacity="0.10" stroke="${faint}" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.6" />`;
    // Actual polygon
    const actualPts = axes.map((k, i) => pt(i, R * (p.radar[k] / 100)).join(",")).join(" ");
    html += `<polygon points="${actualPts}" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="2" stroke-linejoin="round" />`;
    // Dots on actual
    axes.forEach((k, i) => {
      const [x, y] = pt(i, R * (p.radar[k] / 100));
      html += `<circle cx="${x}" cy="${y}" r="3" fill="${accent}" />`;
    });
    // Axis labels
    axes.forEach((k, i) => {
      const [x, y] = pt(i, R + 18);
      const anchor = Math.abs(x) < 1 ? "middle" : x > 0 ? "start" : "end";
      html += `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle"
        fill="${faint}" font-size="10" font-family="ui-sans-serif, system-ui" letter-spacing="0.10em">
        ${LABELS[k].toUpperCase()}
      </text>`;
    });

    svg.innerHTML = html;
  }

  // -----------------------------------------------------------------------
  // TREND CHART (SVG line)
  // -----------------------------------------------------------------------
  function renderTrend(p) {
    const svg = $("#trend");
    if (!svg) return;
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue("--accent").trim() || "#C7F284";
    const faint = cs.getPropertyValue("--text-faint").trim() || "#64685F";
    const hairline = cs.getPropertyValue("--hairline").trim() || "rgba(255,255,255,.05)";
    const textMuted = cs.getPropertyValue("--text-muted").trim() || "#9AA095";
    const surface2 = cs.getPropertyValue("--surface-2").trim() || "#1A1D19";
    const accentSoft = cs.getPropertyValue("--accent-soft").trim() || "rgba(199,242,132,.10)";

    const W = 600, H = 220;
    const M = { t: 12, r: 12, b: 24, l: 30 };
    const w = W - M.l - M.r;
    const h = H - M.t - M.b;

    const data = p.trend;
    const min = 4, max = 10;
    const roleExp = (ROLE_EXPECT[p.position] || ROLE_EXPECT.CM);
    // Approximate role baseline for chart: normalize role AV-ish expectation (use 6.5 baseline)
    const baseline = 6.5 + (roleExp.creation + roleExp.progression) / 400; // ~6.5-7.0

    function x(i) { return M.l + (i / (data.length - 1)) * w; }
    function y(v) { return M.t + (1 - (v - min) / (max - min)) * h; }

    let html = "";
    // Y-axis grid ticks
    [5, 6, 7, 8, 9].forEach(v => {
      html += `<line x1="${M.l}" x2="${M.l + w}" y1="${y(v)}" y2="${y(v)}" stroke="${hairline}" />`;
      html += `<text x="${M.l - 6}" y="${y(v)}" text-anchor="end" dominant-baseline="middle"
        fill="${faint}" font-size="10" font-family="ui-monospace, monospace">${v}</text>`;
    });
    // Baseline (role expectation)
    html += `<line x1="${M.l}" x2="${M.l + w}" y1="${y(baseline)}" y2="${y(baseline)}"
      stroke="${textMuted}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />`;

    // Area under curve
    const areaPath = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ")
      + ` L${x(data.length - 1)},${M.t + h} L${x(0)},${M.t + h} Z`;
    html += `<path d="${areaPath}" fill="${accentSoft}" />`;

    // Line
    const linePath = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
    html += `<path d="${linePath}" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;

    // Dots
    data.forEach((v, i) => {
      html += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${accent}" stroke="${surface2}" stroke-width="1.5" />`;
    });

    // X-axis labels (matches)
    data.forEach((v, i) => {
      if (i % 2 === 0) {
        html += `<text x="${x(i)}" y="${M.t + h + 16}" text-anchor="middle"
          fill="${faint}" font-size="10" font-family="ui-monospace, monospace">M${i + 1}</text>`;
      }
    });

    svg.innerHTML = html;
  }

  // -----------------------------------------------------------------------
  // MATCH CONTEXT — actions list
  // -----------------------------------------------------------------------
  function renderActions() {
    const list = $("#actions-list");
    if (!list) return;
    list.innerHTML = D.MATCH_EXAMPLE.actions.map(a => {
      const bar = Math.min(100, Math.round(a.contribution * 100));
      return `
        <div class="action-row">
          <div class="action-min num">${a.min}'</div>
          <div class="action-body">
            <div class="type">${a.type}</div>
            <div class="note">${a.note}</div>
          </div>
          <div class="action-nums">
            <div class="contrib num">${a.contribution >= 0.1 ? "+" : ""}${fmt(a.contribution, a.contribution < 0.1 ? 3 : 2)}</div>
            <div class="breakdown">${fmt(a.rawValue, 2)} × ${fmt(a.contextMult, 2)}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // -----------------------------------------------------------------------
  // ACTIVE NAV LINK ON SCROLL
  // -----------------------------------------------------------------------
  const navLinks = $$(".nav-link");
  const sections = navLinks.map(l => document.querySelector(l.getAttribute("href")));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        const id = e.target.id;
        // Player detail section maps to "Players" nav link (as does the leaderboard)
        const targetHref = "#" + id;
        const link = navLinks.find(l => l.getAttribute("href") === targetHref)
                  || (id === "player-detail" ? navLinks.find(l => l.getAttribute("href") === "#leaderboard") : null);
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  sections.filter(Boolean).forEach(s => io.observe(s));
  // Also observe player-detail
  const pd = document.getElementById("player-detail");
  if (pd) io.observe(pd);

  // -----------------------------------------------------------------------
  // INITIAL RENDER
  // -----------------------------------------------------------------------
  renderTable();
  renderProfile(currentPlayer);
  renderExpectations(currentPlayer);
  renderRadar(currentPlayer);
  renderTrend(currentPlayer);
  renderActions();

  // Re-render radar/trend on resize (SVG uses viewBox but computed colors may need refresh)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderRadar(currentPlayer);
      renderTrend(currentPlayer);
    }, 120);
  });
})();
