# CardIQ — Executive Summary

AI-Powered Credit Card Benefits Maximization Platform

---

## The Problem

The average premium credit cardholder leaves **$300-$600 per year** in unused statement credits, forgotten perks, and suboptimal card choices. A single card like the Amex Platinum now offers over $2,000 in potential annual value across a dozen different credits — each with different reset dates, activation requirements, and eligibility rules. No consumer can reasonably track it all.

Existing tools don't solve this. Comparison sites (NerdWallet, Credit Karma) help consumers *choose* cards but offer zero post-acquisition value. Issuer apps (Amex, Chase) track only their own cards. No platform provides a unified, cross-issuer view of all benefits across a consumer's full card portfolio.

## Who It's For

Three consumer segments are underserved today: **new cardholders** who don't know what benefits they have (Marcus, 20s, first rewards card), **unaware cardholders** who have valuable cards but forget to use perks before they expire (Emma, 30s, leaves $400/yr on the table), and **portfolio evaluators** who need to decide which premium cards are worth the annual fee (Priya, 40s, $1,500+/yr in fees across 4 cards).

## The Solution

CardIQ is an AI-powered platform that helps consumers extract the full value from credit cards they already hold. It provides:

- **Benefits Dashboard:** Real-time tracking of every benefit across all cards — what's been used, what's available, what's expiring. Dollar values, progress bars, and capture rates per card and across the portfolio.
- **Purchase Optimizer:** AI-powered recommendation for which card to use at every merchant, based on verified rewards rates. Shows the dollar impact of suboptimal card usage.
- **Portfolio Strategy:** Annual fee ROI analysis per card — benefits captured vs. fee paid. Keep/downgrade/evaluate recommendation with plain-language rationale.
- **Statement Upload:** Upload PDF or CSV bank statements to import real transaction history. AI extracts, categorizes, and analyzes purchases to show exactly where rewards are being left on the table.

The AI engine (Claude API) reasons across the user's full card portfolio, grounded in a **verified database of the top 20 U.S. consumer credit cards** with benefit terms updated weekly.

## Key Risks & Controls

| Risk | Control |
|------|---------|
| **AI hallucination of card terms** | Every cited term validated against verified database. Monthly red-team audits. Documented in Test Case 7 (v1 failure → v2 pass). |
| **User treats output as financial advice** | Every AI output includes disclaimer: "CardIQ provides information, not financial advice." Confidence badges (HIGH/MEDIUM/LOW) on all recommendations. "Report an Issue" button on every AI surface. |
| **Stale benefit data** | Weekly DB review cycle. Automated change detection on issuer pages. User-facing "last verified" dates. |
| **Prompt injection / misuse** | 3-tier instruction hierarchy with immutable system guardrails. Injection attempts ignored and redirected. Tested in TC-3. |
| **Scope creep into regulated territory** | Hard prohibitions on investment advice, credit repair, loan origination, and new card recommendations. Prohibited terms list enforced at system instruction level. |
| **Regulatory classification risk** | All outputs use informational framing. Quarterly legal review. Architecture supports rapid feature disabling if regulatory concern arises. |

## What CardIQ Will and Will Not Do

| Will Do | Will NOT Do |
|---------|------------|
| Track and surface benefits across all held cards | Recommend new card applications |
| Recommend which existing card to use per purchase | Provide investment or asset allocation advice |
| Calculate annual fee ROI with plain-language rationale | Offer credit repair or dispute services |
| Alert users to expiring credits and activation deadlines | Guarantee specific financial outcomes |
| Present information from verified card terms | Make automated decisions without user confirmation |
| Import transactions from uploaded bank statements (PDF/CSV) | Store or retain uploaded statement files |
