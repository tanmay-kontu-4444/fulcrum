// Fulcrum — Championship mock dataset (2024/25 realistic)
// Structure designed so real data can be plugged in later.

window.FULCRUM_DATA = (function () {
  const CLUBS = {
    leeds:    { name: "Leeds United",       short: "LEE", primary: "#FFCD00" },
    burnley:  { name: "Burnley",            short: "BUR", primary: "#6C1D45" },
    sund:     { name: "Sunderland",         short: "SUN", primary: "#EB172B" },
    sheffu:   { name: "Sheffield United",   short: "SHU", primary: "#EE2737" },
    wba:      { name: "West Bromwich",      short: "WBA", primary: "#122F67" },
    norwich:  { name: "Norwich City",       short: "NOR", primary: "#00A650" },
    boro:     { name: "Middlesbrough",      short: "MID", primary: "#DC143C" },
    coventry: { name: "Coventry City",      short: "COV", primary: "#4B92DB" },
    bristolc: { name: "Bristol City",       short: "BRC", primary: "#E21C38" },
    watford:  { name: "Watford",            short: "WAT", primary: "#FBEE23" },
    black:    { name: "Blackburn Rovers",   short: "BLA", primary: "#009EE0" },
    hull:     { name: "Hull City",          short: "HUL", primary: "#F5A12D" },
    prest:    { name: "Preston North End",  short: "PNE", primary: "#B4975A" },
    swansea:  { name: "Swansea City",       short: "SWA", primary: "#121212" },
    qpr:      { name: "Queens Park Rangers",short: "QPR", primary: "#1D5BA4" },
    millwall: { name: "Millwall",           short: "MIL", primary: "#001F5B" },
  };

  // Trend generator — realistic 12-match progression around a base value
  function trend(base, jitter, seed) {
    const arr = [];
    let s = seed;
    for (let i = 0; i < 12; i++) {
      s = (s * 9301 + 49297) % 233280;
      const rand = (s / 233280) - 0.5;
      const drift = Math.sin(i / 3 + seed) * jitter * 0.4;
      const val = Math.max(0, Math.min(10, base + rand * jitter + drift));
      arr.push(+val.toFixed(2));
    }
    return arr;
  }

  const PLAYERS = [
    {
      id: "p01",
      name: "Callum Whitmore",
      club: "leeds", position: "AM", role: "Creative 10",
      age: 24, minutes: 2418, matches: 29,
      caScore: 8.74, actionValue: 0.68, roleFit: 92, consistency: 88, sampleConf: 96,
      goals: 9, assists: 12, xg: 8.2, xa: 10.9, keyPasses: 71, pressures: 412,
      undervalued: false,
      radar: { finishing: 78, creation: 94, progression: 88, defending: 42, aerial: 38, pressing: 71 },
      trend: trend(8.6, 0.9, 11),
      note: "Elite creator against low-block Championship sides. Consistently generates chances above role expectation, especially in second-half phases when opposition tires."
    },
    {
      id: "p02",
      name: "Idris Adebayo",
      club: "sund", position: "ST", role: "Poacher",
      age: 21, minutes: 1987, matches: 26,
      caScore: 8.42, actionValue: 0.71, roleFit: 89, consistency: 74, sampleConf: 84,
      goals: 16, assists: 3, xg: 12.4, xa: 2.1, keyPasses: 22, pressures: 288,
      undervalued: true,
      radar: { finishing: 92, creation: 48, progression: 55, defending: 22, aerial: 74, pressing: 68 },
      trend: trend(8.3, 1.1, 27),
      note: "Consistently outperforms xG on a mid-table side. Context-adjusted score suggests Premier League readiness despite modest raw output. High conversion under low service."
    },
    {
      id: "p03",
      name: "Marek Havlík",
      club: "burnley", position: "DM", role: "Deep-lying Playmaker",
      age: 28, minutes: 2650, matches: 30,
      caScore: 8.31, actionValue: 0.44, roleFit: 95, consistency: 92, sampleConf: 98,
      goals: 2, assists: 6, xg: 1.8, xa: 5.4, keyPasses: 44, pressures: 511,
      undervalued: false,
      radar: { finishing: 40, creation: 78, progression: 91, defending: 82, aerial: 68, pressing: 79 },
      trend: trend(8.2, 0.6, 33),
      note: "Metronome for a possession-heavy side. High role-fit reflects near-perfect execution of the Compton system's demands on the pivot."
    },
    {
      id: "p04",
      name: "Tomás Rivera",
      club: "wba", position: "RW", role: "Inverted Winger",
      age: 22, minutes: 2144, matches: 28,
      caScore: 8.18, actionValue: 0.62, roleFit: 84, consistency: 79, sampleConf: 90,
      goals: 11, assists: 8, xg: 9.3, xa: 6.7, keyPasses: 58, pressures: 366,
      undervalued: true,
      radar: { finishing: 82, creation: 76, progression: 84, defending: 44, aerial: 32, pressing: 72 },
      trend: trend(8.1, 1.0, 44),
      note: "Ball-carrying threat with above-average finishing versus expected. Undervalued relative to league perception — mid-table team suppresses raw counting stats."
    },
    {
      id: "p05",
      name: "Jonas Bergqvist",
      club: "sheffu", position: "CB", role: "Ball-playing Defender",
      age: 26, minutes: 2790, matches: 31,
      caScore: 8.07, actionValue: 0.31, roleFit: 90, consistency: 91, sampleConf: 99,
      goals: 1, assists: 2, xg: 1.2, xa: 1.9, keyPasses: 14, pressures: 298,
      undervalued: false,
      radar: { finishing: 22, creation: 44, progression: 86, defending: 91, aerial: 84, pressing: 62 },
      trend: trend(7.9, 0.5, 55),
      note: "Line-breaking passing volume in the top decile for CBs. Strong role-fit with clear progression on both defensive and buildup metrics."
    },
    {
      id: "p06",
      name: "Oluwaseun Okafor",
      club: "coventry", position: "LB", role: "Overlapping Full-back",
      age: 23, minutes: 2312, matches: 27,
      caScore: 7.94, actionValue: 0.55, roleFit: 87, consistency: 82, sampleConf: 92,
      goals: 3, assists: 9, xg: 2.1, xa: 7.8, keyPasses: 39, pressures: 401,
      undervalued: true,
      radar: { finishing: 48, creation: 74, progression: 82, defending: 71, aerial: 58, pressing: 78 },
      trend: trend(7.9, 0.8, 66),
      note: "Elite crossing volume and quality for the profile. Wider metrics suggest a modern full-back projection — high upside if paired with a stable RB."
    },
    {
      id: "p07",
      name: "Freddie Ashcroft",
      club: "norwich", position: "CM", role: "Box-to-box",
      age: 25, minutes: 2520, matches: 29,
      caScore: 7.88, actionValue: 0.52, roleFit: 85, consistency: 86, sampleConf: 94,
      goals: 6, assists: 7, xg: 5.4, xa: 6.2, keyPasses: 41, pressures: 478,
      undervalued: false,
      radar: { finishing: 66, creation: 71, progression: 78, defending: 74, aerial: 62, pressing: 84 },
      trend: trend(7.8, 0.7, 77),
      note: "All-phase midfielder with balanced sub-scores. No single elite trait, but consistency and role-fit make him a reliable transfer target."
    },
    {
      id: "p08",
      name: "Nikolai Vranić",
      club: "boro", position: "GK", role: "Sweeper-Keeper",
      age: 27, minutes: 2610, matches: 29,
      caScore: 7.81, actionValue: 0.28, roleFit: 88, consistency: 89, sampleConf: 96,
      goals: 0, assists: 1, xg: 0, xa: 0.4, keyPasses: 8, pressures: 12,
      undervalued: false,
      radar: { finishing: 8, creation: 32, progression: 71, defending: 90, aerial: 78, pressing: 24 },
      trend: trend(7.8, 0.6, 88),
      note: "Post-shot xG prevention +6.4 across the sample. High-line comfort separates him from typical Championship keepers."
    },
    {
      id: "p09",
      name: "Rhys Coulter",
      club: "bristolc", position: "ST", role: "Target Forward",
      age: 29, minutes: 2280, matches: 28,
      caScore: 7.72, actionValue: 0.58, roleFit: 82, consistency: 78, sampleConf: 91,
      goals: 13, assists: 4, xg: 11.1, xa: 3.6, keyPasses: 24, pressures: 244,
      undervalued: false,
      radar: { finishing: 84, creation: 52, progression: 48, defending: 34, aerial: 92, pressing: 66 },
      trend: trend(7.7, 0.9, 99),
      note: "Reference-standard aerial threat. Score is suppressed by role — target forward action value ceilings are typically lower than mobile 9s."
    },
    {
      id: "p10",
      name: "Amir Sadeghi",
      club: "watford", position: "AM", role: "Half-space Creator",
      age: 20, minutes: 1620, matches: 24,
      caScore: 7.68, actionValue: 0.64, roleFit: 80, consistency: 71, sampleConf: 78,
      goals: 5, assists: 8, xg: 4.6, xa: 7.9, keyPasses: 52, pressures: 302,
      undervalued: true,
      radar: { finishing: 68, creation: 88, progression: 82, defending: 38, aerial: 28, pressing: 64 },
      trend: trend(7.6, 1.2, 110),
      note: "Youth signal is strong — trajectory over last 8 matches indicates continued growth. Sample confidence flags moderate caution."
    },
    {
      id: "p11",
      name: "Dean Marchetti",
      club: "black", position: "RB", role: "Defensive Full-back",
      age: 26, minutes: 2481, matches: 28,
      caScore: 7.62, actionValue: 0.36, roleFit: 91, consistency: 88, sampleConf: 95,
      goals: 1, assists: 3, xg: 0.9, xa: 3.1, keyPasses: 22, pressures: 396,
      undervalued: false,
      radar: { finishing: 32, creation: 54, progression: 62, defending: 89, aerial: 72, pressing: 80 },
      trend: trend(7.6, 0.5, 121),
      note: "Duel win-rate 68%. Undersold by counting stats but role-fit and defensive rating make him a rotation-quality Premier League profile."
    },
    {
      id: "p12",
      name: "Kaito Yamada",
      club: "hull", position: "LW", role: "Direct Winger",
      age: 23, minutes: 2090, matches: 27,
      caScore: 7.58, actionValue: 0.59, roleFit: 81, consistency: 74, sampleConf: 88,
      goals: 8, assists: 6, xg: 6.4, xa: 5.8, keyPasses: 44, pressures: 322,
      undervalued: true,
      radar: { finishing: 74, creation: 72, progression: 88, defending: 38, aerial: 34, pressing: 68 },
      trend: trend(7.6, 1.0, 132),
      note: "Progressive carries per 90 rank 3rd in the league. Explosive first-step data suggests untapped ceiling under a transition-heavy system."
    },
    {
      id: "p13",
      name: "Elliot Sunder",
      club: "prest", position: "CM", role: "Deep Playmaker",
      age: 30, minutes: 2603, matches: 30,
      caScore: 7.51, actionValue: 0.41, roleFit: 89, consistency: 90, sampleConf: 98,
      goals: 3, assists: 5, xg: 2.8, xa: 4.9, keyPasses: 37, pressures: 442,
      undervalued: false,
      radar: { finishing: 42, creation: 74, progression: 84, defending: 68, aerial: 60, pressing: 72 },
      trend: trend(7.5, 0.5, 143),
      note: "Veteran floor. Age curve limits ceiling, but role fit and consistency make him a bridge signing profile."
    },
    {
      id: "p14",
      name: "Bogdan Iliev",
      club: "qpr", position: "CB", role: "Stopper",
      age: 24, minutes: 2340, matches: 27,
      caScore: 7.44, actionValue: 0.29, roleFit: 86, consistency: 84, sampleConf: 93,
      goals: 2, assists: 0, xg: 1.4, xa: 0.3, keyPasses: 8, pressures: 268,
      undervalued: true,
      radar: { finishing: 28, creation: 32, progression: 64, defending: 92, aerial: 88, pressing: 58 },
      trend: trend(7.4, 0.6, 154),
      note: "Aerial dominance and duel-winning are top-quartile. Passing range limits ceiling in possession-heavy systems, but as a stopper the profile is elite."
    },
    {
      id: "p15",
      name: "Luca Rimoldi",
      club: "swansea", position: "AM", role: "Second Striker",
      age: 25, minutes: 2018, matches: 26,
      caScore: 7.38, actionValue: 0.57, roleFit: 78, consistency: 76, sampleConf: 89,
      goals: 10, assists: 5, xg: 8.1, xa: 4.4, keyPasses: 38, pressures: 314,
      undervalued: false,
      radar: { finishing: 78, creation: 72, progression: 74, defending: 44, aerial: 52, pressing: 62 },
      trend: trend(7.4, 0.9, 165),
      note: "Second-striker profile with reliable finishing above expected. Slight role ambiguity between roaming 10 and split-9 caps role-fit component."
    },
    {
      id: "p16",
      name: "Malik Osei-Bonsu",
      club: "millwall", position: "DM", role: "Destroyer",
      age: 23, minutes: 2270, matches: 28,
      caScore: 7.30, actionValue: 0.34, roleFit: 87, consistency: 85, sampleConf: 94,
      goals: 1, assists: 1, xg: 0.7, xa: 1.2, keyPasses: 12, pressures: 552,
      undervalued: true,
      radar: { finishing: 24, creation: 46, progression: 66, defending: 90, aerial: 76, pressing: 88 },
      trend: trend(7.3, 0.6, 176),
      note: "Pressure volume is league-leading. Undervalued profile — tactical fouling and interception-first defending rarely surface in traditional ratings."
    }
  ];

  // Example match — Sunderland 2-1 Leeds. Used in Match Context section.
  const MATCH_EXAMPLE = {
    home: { club: "sund", goals: 2, xg: 1.4, possession: 43 },
    away: { club: "leeds", goals: 1, xg: 2.1, possession: 57 },
    date: "2025-11-08",
    focus: "p02", // Adebayo
    // Time-stamped actions contributing to context-adjusted score
    actions: [
      { min: 12, type: "Pressing regain",     rawValue: 0.04, contextMult: 1.35, contribution: 0.054, note: "High press vs. league-best buildup — context bonus applied." },
      { min: 27, type: "Chance created",       rawValue: 0.09, contextMult: 1.12, contribution: 0.101, note: "Half-space cutback — above role expectation for a poacher." },
      { min: 34, type: "Goal (open play)",     rawValue: 0.71, contextMult: 1.28, contribution: 0.909, note: "Finish outperforms xG (0.24). Opponent strength multiplier applied." },
      { min: 58, type: "Ball retention",       rawValue: 0.02, contextMult: 0.92, contribution: 0.018, note: "Standard action — no meaningful context adjustment." },
      { min: 73, type: "Aerial duel won",      rawValue: 0.05, contextMult: 1.15, contribution: 0.058, note: "Won vs. central defender ranked A-tier in aerials." },
      { min: 81, type: "Goal (open play)",     rawValue: 0.68, contextMult: 1.22, contribution: 0.830, note: "Late winner, chase-state suppression modeled — outperformed expectation." },
      { min: 89, type: "Defensive recovery",   rawValue: 0.03, contextMult: 1.08, contribution: 0.032, note: "Tracking back beyond role norm for a 9." }
    ]
  };

  return { CLUBS, PLAYERS, MATCH_EXAMPLE };
})();
