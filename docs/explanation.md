# Fulcrum — Explanation Document

**Criterion, Background, and Context**

This document explains the thinking behind Fulcrum: the performance criterion the
product is built around, the background that motivated the project, and the
context of the current prototype. It is written for anyone opening the
repository for the first time — a developer extending the codebase, an analyst
evaluating the methodology, or a stakeholder deciding whether to take the
prototype further.

---

## 1. Background

### The problem Fulcrum addresses

England's second division — the EFL Championship — is one of the most
data-rich yet context-poor leagues in world football. Forty-six league matches
per club, twenty-four clubs, relentless fixture congestion, heavy use of loans
and squad rotation, and enormous financial pressure created by promotion
(estimated at well over £100m in Premier League distributions and parachute
payments). Scouting decisions in this environment carry unusually high stakes.

The trouble is that raw performance data misleads in the Championship more
than in most leagues:

- **Team strength varies wildly.** A relegation-battling side's star attacker
  posts numbers that a mid-table player would beat comfortably on a stronger
  team. Raw goals, assists, and duel counts do not separate "good player"
  from "big fish in a small pond" — or the reverse.
- **Match state distorts output.** A striker who scores a fourth goal when
  already 3-0 up is doing something very different from one who equalises in
  the 88th minute. Conventional tallies weight both identically.
- **Role expectations differ by position.** A centre-back is not supposed to
  create chances; judging every player on the same statistical template
  punishes specialists and rewards generalists.
- **Sample sizes are deceptive.** A player with twelve excellent matches is
  a different proposition from one with twelve excellent matches inside a
  forty-game season. Confidence in the estimate matters as much as the
  estimate itself.

Professional clubs solve this with internal analytics teams. Public
consumers of the game — smaller clubs, agencies, journalists, serious fans —
are left choosing between raw stat sheets and opinion. Fulcrum is an attempt
to occupy that middle ground: an analytics layer that adjusts performance
data for the circumstances in which it was produced, presented in a format
a scout can actually use.

### Why the name

A fulcrum is the point on which a lever pivots — the small, well-placed
element that multiplies force. The metaphor is deliberate: the metric is not
meant to be a big, heavy system that replaces scouting judgment. It is a
pivot point that multiplies it.

### Why start with the Championship

Three reasons, in order of importance:

1. **Need.** The gap described above is widest in the Championship, where
   data budgets are smallest relative to decision stakes.
2. **Coverage.** A single-division scope keeps the prototype's data model,
   filters, and comparison logic honest. Expanding later is a data problem,
   not a design problem.
3. **Roadmap.** League One and the Scottish Premiership are natural next
   steps — similar competitive structures, similar analytics gaps, and
   overlapping scouting interest. The competition selector in the header
   exists from day one so expansion never requires a redesign.

---

## 2. The Criterion — the Context-Adjusted Performance Metric

### Definition

Fulcrum's headline number is a **context-adjusted player performance score**:
a single percentile-scaled value (0–100) estimating how well a player
performed *relative to what should have been expected of their role, in
their team's situation, against that opposition, with that much evidence
behind it*.

It is not a "best player" ranking. It is a "performed above or below
expectation, given circumstances" ranking. The distinction is the entire
product.

### The five adjustments

The score is built by adjusting raw performance through five multiplicative
context layers. Each layer is described below as it is modelled in this
prototype; in production each would be a fitted statistical model rather than
a hand-set parameter.

#### 2.1 Role-expectation baseline

Every player carries a positional archetype (advanced forward, inverted
winger, deep-lying playmaker, ball-winning midfielder, and so on). For each
archetype, Fulcrum maintains an **expected output profile** across six
sub-components:

| Sub-component | Roughly measures |
|---|---|
| Finishing | Goal conversion quality, shot locations |
| Creation | Chances created, key passes, expected-assist quality |
| Progression | Carries and passes that move the ball upfield |
| Defending | Tackles, interceptions, recoveries in good zones |
| Aerial | Duels won in the air, both boxes |
| Pressing | Pressures applied, counter-press participation |

The radar chart in the player profile always draws two shapes: the player's
actual output and the dashed **role baseline**. A player who exceeds their
baseline in every direction is genuinely outperforming their job description;
a player who only exceeds it in one direction is a specialist, and the
scouting note should say which is which.

#### 2.2 Match-state adjustment

Every on-ball action is weighted by the game state in which it occurred.
Leading comfortably is easier than chasing. Fulcrum's prototype uses a simple
state model — drawing, leading narrowly, leading comfortably, trailing
narrowly, trailing heavily — with multipliers in the ~0.85–1.15 band. An
equalising goal in the 88th minute earns materially more credit than a
cosmetic fourth goal at 3-0.

#### 2.3 Team-strength adjustment

A player's raw output is partly a function of the quality of the ten players
around them. Fulcrum adjusts each sub-component by the player's own team's
rolling strength estimate, so that standout numbers posted in a weak side are
discounted slightly and quiet numbers posted while carrying a weak side are
recognised.

#### 2.4 Opposition adjustment

The quality of the opponent faced matters. A goal against a promotion
favourite is not the same achievement as a goal against a side already
relegated in spirit. Fulcrum weights actions by the opposition's rolling
defensive/attacking strength for the relevant component.

#### 2.5 Sample-confidence weighting

The final adjustment is epistemic, not tactical: how much evidence sits
behind the estimate? The prototype surfaces this directly in the UI — every
player carries a confidence band, and the leaderboard's "focus" filters let a
scout isolate **undervalued** profiles (high performance, low recognition),
**high-confidence** profiles (large samples, stable estimates), and **Under
23** profiles (career-stage scouting).

The match ledger in the Match Context section shows the raw calculation the
way an analyst would sanity-check it: each action row lists the raw value
produced, the context multiplier applied, and the resulting contribution.
The arithmetic is deliberately visible. Black-box metrics earn distrust.

### What the criterion is explicitly not

- **Not a betting input.** Fulcrum does not predict match outcomes. The
  metric evaluates past player performance in context; it says nothing
  directly about future team results.
- **Not a replacement for scouting.** It is a triage layer. The scouting note
  attached to each profile is the product; the number is the doorbell.
- **Not a fantasy-football asset.** No price, no ownership, no projected
  points — none of the framing that makes a metric optimise for
  entertainment value over decision value.

### Known limitations

Honest limitations, stated up front:

- **The data in this repository is simulated.** Player names, clubs, scores,
  and match events are realistic mock values for demonstrating the interface.
  The data layer is cleanly separated (`data.js`) so real feeds can replace it
  without touching UI code.
- **Multipliers are hand-set.** In production, the five adjustment layers
  would be fitted models validated against out-of-sample performance — the
  prototype merely demonstrates where they attach.
- **No defensive positioning data.** Without tracking data, defensive
  sub-components rest on event data and are the weakest part of the model.
- **A single match ledger.** The Match Context section demonstrates the
  calculation on one match; a production build renders this per player,
  per match.

---

## 3. Context — the prototype

### Scope of what is in this repository

A single-page web application, fully static, no build step:

| File | Purpose |
|---|---|
| `index.html` | The complete app — semantic markup, embedded design system |
| `app.js` | Interactivity — theme toggle, sort, filter, search, player select, radar and trend rendering |
| `data.js` | The data layer — 16 players, 16 clubs, one worked match example (all simulated) |
| `README.md` | Quick start and project orientation |
| `docs/explanation.md` | This document |

### Product positioning (unchanged from the design brief)

- A professional analytics product for **scouts, analysts, coaches, and
  serious fans**.
- Not a betting site, not a fantasy app, not a generic AI landing page.
- Dark-first interface with a working light mode; a single accent colour;
  restrained, dense, information-forward design.

### Design decisions worth knowing

- **Typography.** Cabinet Grotesk (display), Satoshi (body), JetBrains Mono
  (numeric values) — chosen to read as a working analytical tool rather than a
  consumer product.
- **The accent.** A single "pitch-lime" (`#C7F284` dark / `#4B7B1F` light).
  No purple gradients, no glowing blobs, no decorative illustration.
- **Visible arithmetic.** The match ledger and the radar's dashed baseline
  exist so a skeptical analyst can interrogate the metric rather than trust it.
- **Small radii, layered surfaces, alpha-blended borders.** The visual
  language of a terminal-adjacent analytics workspace.

### Where this goes next

1. Replace `data.js` with a real data pipeline (event data feed, fitted
   adjustment models, confidence intervals from actual sample sizes).
2. Per-match ledger rendering for every player (the UI already supports it —
   it is a data problem).
3. League One and Scottish Premiership expansion via the competition
   selector.
4. The **match-impact rating** — a per-match, single-number summary of a
   player's contribution to the result. This is deliberately *not* in the
   prototype; the Match Context section labels it as a future addition
   because shipping half a metric is worse than naming the gap.
