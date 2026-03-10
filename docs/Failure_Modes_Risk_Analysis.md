# CardIQ — Failure Modes & Risk Analysis

Severity Ratings, Mitigation Plans & User Misuse Risks
AI for Financial Services — eMBA Capstone — March 2026

---

## 1. Overview

This document identifies and analyzes realistic failure modes for CardIQ's AI-powered credit card benefits optimization engine. Each failure mode is rated by severity and likelihood, and paired with a concrete mitigation plan.

Per course requirements, this analysis explicitly addresses **user misuse risks** in addition to technical failure modes.

### Severity Definitions

| Rating | Definition |
|--------|-----------|
| **CRITICAL** | Directly causes user to lose money or violates regulatory requirements |
| **HIGH** | Degrades user trust or causes measurable negative outcomes |
| **MEDIUM** | Reduces recommendation quality or creates user confusion |
| **LOW** | Minor UX or accuracy degradation with no direct financial harm |

---

## 2. Failure Mode Registry

### FM-01 — Hallucination of Card Benefit Terms

| Attribute | Detail |
|-----------|--------|
| **Category** | Technical Failure |
| **Severity** | CRITICAL |
| **Likelihood** | LOW (with mitigations active) |
| **Description** | Model cites an incorrect benefit amount, eligibility window, or redemption requirement. User acts on false information and either misses a benefit or expects value that doesn't exist. |
| **Example** | Model states Chase Freedom Unlimited includes a "$200 annual travel credit." Actual benefit: none — that's the Sapphire Reserve. User expects a credit that never posts. |
| **Mitigation** | 1. System instruction requires all cited terms come from verified DB. 2. Structured output schema includes source field. 3. Monthly hallucination audit (50 random recommendations verified against DB). 4. Users can flag inaccuracies; resolved within 48h. |
| **Residual Risk** | DB can lag issuer term changes. Mitigated by weekly review cycle and automated change detection on issuer pages. |
| **Documented Evidence** | Test Case 7 (Evaluation Report) caught this exact failure in v1 and confirmed remediation in v2. |

---

### FM-02 — Stale Card Terms Database

| Attribute | Detail |
|-----------|--------|
| **Category** | Data Quality Risk |
| **Severity** | HIGH |
| **Likelihood** | MEDIUM (issuers change terms mid-year) |
| **Description** | CardIQ's verified card terms DB becomes outdated when an issuer modifies benefits between scheduled review cycles. User acts on stale information. |
| **Example** | Amex removes the Dunkin' credit from the Gold card in April. CardIQ's DB isn't updated until the weekly review. For up to 7 days, users are told they have an $84/year Dunkin' benefit that no longer exists. |
| **Mitigation** | 1. Weekly DB review cycle by Benefits Data Analyst. 2. Automated issuer website change detection (alert on page diff). 3. User-facing "Last verified" date on each card's benefit list. 4. Material changes affecting >100 users trigger immediate out-of-cycle review. |
| **Residual Risk** | Some issuer changes happen without public announcement. User-reported inaccuracies are the secondary detection mechanism. |

---

### FM-03 — User Acts on Expired Benefit

| Attribute | Detail |
|-----------|--------|
| **Category** | Technical + User Risk |
| **Severity** | HIGH |
| **Likelihood** | MEDIUM (monthly resets are easy to miss) |
| **Description** | The benefit tracking system shows a benefit as "available" when it has already reset or expired. User attempts to claim it and discovers it's unavailable. |
| **Example** | Amex Gold Uber Cash resets monthly on the 1st. It's March 2 and the system still shows February's $10 as "unused" because the tracking state hasn't updated. User tries to use it and finds $0 balance. |
| **Mitigation** | 1. Benefit reset dates are calendar-anchored in the DB with automated status transitions at midnight UTC on reset day. 2. Benefits expiring within 48 hours are flagged with a warning badge. 3. Confidence downgraded to MEDIUM for benefits within 24 hours of reset. 4. Users can manually override status if system state is wrong. |
| **Residual Risk** | Some benefits (e.g., semi-annual Saks credit) have less predictable reset behavior. Manual verification recommended for high-value claims. |

---

### FM-04 — Recommendation Quality Disparity Across Card Tiers

| Attribute | Detail |
|-----------|--------|
| **Category** | Bias / Fairness Risk |
| **Severity** | MEDIUM |
| **Likelihood** | MEDIUM |
| **Description** | Premium cardholders (Amex Platinum, CSR) receive richer, more detailed recommendations because their cards have more benefits data in the DB. No-fee cardholders get generic or shallow advice, creating an uneven user experience. |
| **Example** | Priya (3 premium cards, 25+ benefits) gets highly specific, high-confidence advice. Marcus (1 no-fee card, 2 benefits) gets "Your Freedom Unlimited is a solid default card" — technically correct but not valuable. |
| **Mitigation** | 1. Quarterly quality audit comparing recommendation depth across card tiers. 2. For cards with <3 benefits, system supplements with rewards rate optimization advice (which doesn't depend on benefit count). 3. No-fee cards highlight protections (cell phone protection, purchase protection) that users often overlook. |
| **Residual Risk** | Inherent asymmetry — premium cards genuinely have more benefits. CardIQ can optimize presentation but cannot manufacture value where it doesn't exist. |

---

### FM-05 — User Over-Reliance on AI Recommendations

| Attribute | Detail |
|-----------|--------|
| **Category** | User Misuse Risk |
| **Severity** | HIGH |
| **Likelihood** | MEDIUM (common pattern with AI tools) |
| **Description** | User treats CardIQ recommendations as authoritative financial guidance and follows them without independent judgment, particularly for high-stakes decisions like whether to keep or cancel a premium card. |
| **Example** | CardIQ's portfolio view shows Priya's Amex Platinum at a negative ROI (captured $700 vs. $895 fee). She cancels the card based solely on this recommendation, forfeiting 15 years of account history and relationship benefits not tracked by CardIQ (retention offers, welcome bonus eligibility cycles). |
| **Mitigation** | 1. All recommendations include explicit caveats: "This analysis is based on tracked benefits only and may not reflect all factors in your decision." 2. Downgrade/cancel recommendations always include: "Consider calling your issuer to discuss retention offers before acting." 3. Onboarding sets expectation: "CardIQ is a decision support tool, not a financial advisor." 4. Footer on every recommendation card: "CardIQ provides information, not financial advice." |
| **Residual Risk** | Users may not read disclaimers. In-product friction (confirmation dialogs for high-impact actions) reduces but doesn't eliminate risk. |

---

### FM-06 — Plaid API Outage or Data Sync Failure

| Attribute | Detail |
|-----------|--------|
| **Category** | Infrastructure Risk |
| **Severity** | MEDIUM |
| **Likelihood** | LOW (Plaid has 99.9%+ uptime, but outages happen) |
| **Description** | Plaid API is unavailable, preventing transaction data refresh. Recommendations are based on stale data without the user realizing. |
| **Mitigation** | 1. Graceful degradation: fall back to most recent cached data with confidence downgraded to LOW. 2. Data freshness timestamp displayed prominently in dashboard. 3. Manual card entry supported as fallback (no Plaid required). 4. Users notified if data is >7 days stale with recommendation to re-sync. |
| **Residual Risk** | Extended outages (>48h) mean users operating on increasingly stale data. Manual entry fallback partially mitigates. |

---

### FM-07 — User Gaming Benefit Tracking

| Attribute | Detail |
|-----------|--------|
| **Category** | User Misuse Risk |
| **Severity** | LOW |
| **Likelihood** | LOW-MEDIUM |
| **Description** | User deliberately marks benefits as "unused" when they've already been claimed, in order to inflate their capture rate or trigger additional notifications. |
| **Example** | User redeemed their Amex Platinum Uber Cash but marks it as "unused" in CardIQ. Dashboard shows inflated available value. User then references this inflated number when deciding whether to keep the card — leading to a suboptimal decision based on false data. |
| **Mitigation** | 1. When Plaid data is connected, benefit usage is automatically verified against transaction history (user cannot manually override Plaid-confirmed usage). 2. For manually-tracked benefits, status is user-controlled with a disclaimer: "Manual tracking reflects your self-reported usage." 3. Portfolio ROI calculations use Plaid-verified data where available. |
| **Residual Risk** | Users without Plaid connection can manipulate their own tracking data. This harms only the individual user, not the system. |

---

### FM-08 — Reputational Risk from Shared Recommendations

| Attribute | Detail |
|-----------|--------|
| **Category** | User Misuse Risk |
| **Severity** | MEDIUM |
| **Likelihood** | MEDIUM (screenshots are easy; social sharing is common) |
| **Description** | User screenshots a personalized CardIQ recommendation and shares it publicly (Reddit, Twitter, group chats) as general "financial advice." The recommendation was based on that specific user's portfolio, benefit usage, and data freshness — it may mislead others with different circumstances. |
| **Example** | Priya's CardIQ shows "Your Amex Platinum is worth keeping — $1,100 captured vs. $895 fee." She screenshots and posts on r/creditcards. Other users see this as an endorsement of the Amex Platinum, but Priya's result reflects her specific travel patterns and benefit usage — not a general recommendation. |
| **Mitigation** | 1. Every recommendation card includes a footer: "Personalized for [user] as of [date]. Not financial advice. Your results may differ." 2. Shared screenshots inherently include this footer text. 3. Terms of Service prohibit representing CardIQ outputs as professional financial advice. |
| **Residual Risk** | Users can crop screenshots to remove disclaimers. Standard risk for any consumer-facing tool. |

---

### FM-09 — User Selects Wrong Card During Onboarding

| Attribute | Detail |
|-----------|--------|
| **Category** | User Error |
| **Severity** | HIGH |
| **Likelihood** | LOW-MEDIUM (card names are similar; e.g., "Sapphire Preferred" vs. "Sapphire Reserve") |
| **Description** | User selects the wrong card from the top-20 list during onboarding. All subsequent recommendations are based on incorrect card terms. |
| **Example** | Marcus selects "Chase Sapphire Reserve" ($550/yr, $300 travel credit, lounge access) but actually holds the "Chase Sapphire Preferred" ($95/yr, $50 hotel credit, no lounge access). CardIQ tells him he has $300 in travel credits and Priority Pass lounge access. He shows up at the lounge and is turned away. |
| **Mitigation** | 1. Onboarding confirmation step: after card selection, system displays annual fee and top 3 benefits — "Does this match your card?" 2. When Plaid is connected, card product is identified automatically (no manual selection needed). 3. "Wrong card?" link in the benefit dashboard allows quick correction. 4. System flags mismatches: if Plaid shows a $95/yr fee but user selected a card with $550/yr fee, an alert is triggered. |
| **Residual Risk** | Users without Plaid who skip the confirmation step may not catch the error. Periodic "verify your cards" prompt (quarterly) mitigates. |

---

## 3. Risk Summary Matrix

| ID | Failure Mode | Severity | Likelihood | Mitigated? |
|----|-------------|----------|-----------|-----------|
| FM-01 | Hallucination of card terms | CRITICAL | LOW | Yes — verified DB + system instruction + audit |
| FM-02 | Stale card terms DB | HIGH | MEDIUM | Yes — weekly review + change detection |
| FM-03 | User acts on expired benefit | HIGH | MEDIUM | Yes — calendar-anchored resets + warnings |
| FM-04 | Recommendation quality disparity | MEDIUM | MEDIUM | Partial — audit + supplemental advice |
| FM-05 | User over-reliance | HIGH | MEDIUM | Partial — disclaimers + friction |
| FM-06 | Plaid API outage | MEDIUM | LOW | Yes — graceful degradation + manual fallback |
| FM-07 | User gaming benefit tracking | LOW | LOW-MED | Yes — Plaid verification where available |
| FM-08 | Reputational risk (shared recs) | MEDIUM | MEDIUM | Partial — footer disclaimers |
| FM-09 | Wrong card selected at onboarding | HIGH | LOW-MED | Yes — confirmation step + Plaid auto-ID |
