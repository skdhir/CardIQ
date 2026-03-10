# One-Pager: CardIQ — AI-Powered Credit Card Benefits Maximization Platform

## 1. TL;DR

CardIQ is an AI-powered platform that helps consumers extract the full value from their credit cards by tracking benefit usage, identifying unclaimed perks, and recommending optimal card selection for every purchase. The average premium cardholder leaves $300–$600 annually in unused statement credits, forgotten perks, and suboptimal card choices. As credit card issuers pile on complex, time-gated benefits — the Amex Platinum alone now offers over $3,500 in annual value across dozens of credits — no consumer can reasonably track it all. CardIQ replaces spreadsheets and guesswork with a personalized dashboard and proactive notification system, powered by LLM-native reasoning across a verified database of the top 20 U.S. credit cards. The platform delivers two core capabilities: a real-time Benefits Status view (used vs. available) and an AI Purchase Optimizer that cross-references spending patterns against card benefits to maximize every dollar.

## 2. Goals

### Business Goals
- Establish CardIQ as the category-defining platform for credit card benefits intelligence — distinct from referral-fee-driven comparison sites
- Build and maintain a verified benefits database covering the top 20 U.S. credit cards with ≥99% accuracy on terms, credit amounts, and eligibility windows
- Achieve ≥35% notification action rate (user takes recommended action after receiving an alert) within the first 6 months
- Demonstrate measurable user value: average benefits capture rate increase of ≥40% within 90 days of onboarding

### User Goals
- See a clear, real-time picture of every benefit available across all held cards — what's been used, what's expiring, and what's untouched
- Receive proactive alerts for expiring credits, upcoming statement deadlines, and time-sensitive perks before value is lost
- Know which card to use for every purchase to maximize rewards and trigger eligible benefits
- Understand whether each card's annual fee is justified by actual benefit usage, with transparent ROI calculations

### Non-Goals
- Building a credit card marketplace or earning affiliate referral revenue from card applications
- Providing credit score optimization, credit repair, or credit monitoring services
- Offering investment advice, loan products, or general banking services
- Supporting business credit cards or commercial accounts in the initial release

## 3. User Stories

### Emma, the Unaware Cardholder (30s, dual-income household)
Emma has an Amex Gold card and a Chase Freedom Unlimited. She chose the Amex Gold for the dining rewards but has no idea she's entitled to $120/year in Uber Cash, $120 in dining credits at participating restaurants, $84 in Dunkin' credits, and a $100 Resy dining credit. She's been paying $325/year in annual fees while capturing less than 30% of her available benefits. She tried tracking credits manually but gave up after two months. She needs a dashboard that shows exactly what she's used, what she hasn't, and what's about to expire — without having to think about it.

### Marcus, the New Cardholder (20s, early career)
Marcus just got approved for a Chase Sapphire Preferred after reading reviews online. He knows about the sign-up bonus but hasn't explored beyond that. He doesn't realize his card includes a $50 annual hotel credit through Chase Travel, a complimentary DoorDash DashPass membership, trip delay insurance, primary rental car coverage, and 3x points on dining he's currently earning at 1x by using his debit card. He needs an onboarding experience that surfaces everything his card offers and a notification system that nudges him to use benefits before they reset.

### Priya, the Portfolio Evaluator (40s, established credit profile)
Priya holds an Amex Platinum ($895/year), a Chase Sapphire Reserve ($550/year), and a Capital One Venture X ($395/year) — totaling $1,840 in annual fees. She suspects there's overlap between her cards but can't determine which to keep and which to downgrade. She needs a portfolio-level view that shows benefit overlap, total ROI per card, and a clear recommendation on whether each card's fee is justified by her actual usage patterns. She wants to see: "Your Amex Platinum delivered $1,100 in value last year vs. $895 in fees — keep it. Your Sapphire Reserve delivered $320 vs. $550 — consider downgrading to the Preferred."

## 4. Competitive Landscape

### Current Market
The credit card tools market is dominated by three types of players, all of which fail at comprehensive benefits tracking:

**Comparison & Referral Sites (Credit Karma, NerdWallet, Bankrate)** — These platforms help consumers choose new cards but offer zero post-acquisition value. Once you have the card, they provide no tracking of your benefits usage, no purchase optimization, and no expiration alerts. Their revenue model (affiliate referral fees) actively incentivizes recommending new cards over helping you maximize the ones you already hold.

**Rewards Aggregators (MaxRewards, CardPointers)** — These tools track rewards multipliers and recommend which card to use at checkout. However, they focus narrowly on points/cashback earning rates and largely ignore the broader benefits ecosystem: statement credits, travel protections, purchase protections, lounge access, hotel status, and time-gated perks. They also use rules-based logic rather than personalized AI reasoning.

**Issuer Apps (Amex App, Chase App)** — Card issuers surface some benefit tracking within their own apps, but only for their own cards. A consumer holding cards from three issuers must check three separate apps, manually track overlapping benefits, and piece together a portfolio-level picture themselves. There is no unified view.

### CardIQ's Differentiation
CardIQ is the first platform built around a unified, AI-powered benefits intelligence layer that works across issuers. The key differentiators are:

- **Holistic, cross-issuer view**: One dashboard for all cards, all benefits, all issuers — not fragmented across apps
- **Full-spectrum benefit tracking**: Not just rewards rates, but statement credits, travel perks, purchase protections, insurance coverage, hotel/airline status, and sign-up bonus progress
- **LLM-native reasoning**: Personalized recommendations powered by AI that understands the interplay between your spending patterns, benefit windows, and card portfolio — not static rules
- **Proactive, not reactive**: Push notifications for expiring credits, optimal payment timing, and purchase-level card recommendations — the platform works for you even when you're not looking at it
- **No affiliate revenue model**: CardIQ's incentive is to maximize the value of your existing cards, not sell you new ones

## 5. Supported Card Database (Top 20 U.S. Cards)

CardIQ launches with a curated, verified database of the 20 most widely held U.S. consumer credit cards, spanning the major issuers and covering a range of fee levels and benefit complexity:

### Premium Travel Cards
1. **American Express Platinum** — $895/yr. Lounge access, $200 Uber Cash, $120 Uber One credit, $200 airline fee credit, $200 hotel credit, $189 CLEAR Plus credit, $155 Walmart+ credit, $120 digital entertainment credit, Resy credits, Equinox credit, Saks credit, hotel elite status (Marriott Gold, Hilton Gold)
2. **Chase Sapphire Reserve** — $550/yr. $300 travel credit, $500 The Edit hotel credit, $300 dining credit (Sapphire Tables), $300 StubHub credit, Priority Pass lounge access, primary rental car insurance, trip delay/cancellation insurance
3. **Capital One Venture X** — $395/yr. $300 travel credit via Capital One Travel, 10,000 bonus miles annually, Priority Pass lounge access, Capital One Lounges, trip cancellation insurance

### Mid-Tier Rewards Cards
4. **Chase Sapphire Preferred** — $95/yr. $50 hotel credit, DoorDash DashPass, 5x on Chase Travel, 3x dining, trip delay insurance, primary rental car coverage
5. **American Express Gold** — $325/yr. $120 Uber Cash, $120 dining credits, $100 Resy credit, $84 Dunkin' credit, 4x at U.S. supermarkets, 3x on flights
6. **Capital One Venture** — $95/yr. 2x miles on all purchases, $250 Capital One Travel credit (first year), 15+ transfer partners
7. **Citi Strata Premier** — $95/yr. $100 hotel credit via Citi Travel, 3x on travel/gas/restaurants/groceries/supermarkets

### Cash Back Cards
8. **Chase Freedom Unlimited** — $0/yr. 1.5% on everything, 3% dining/drugstores, 5% Chase Travel, DoorDash DashPass
9. **Chase Freedom Flex** — $0/yr. 5% rotating quarterly categories, 3% dining/drugstores, purchase protection, cell phone protection
10. **Citi Double Cash** — $0/yr. 2% on all purchases (1% on purchase + 1% on payment)
11. **Wells Fargo Active Cash** — $0/yr. 2% on all purchases, cell phone protection, $200 welcome bonus
12. **Capital One Savor** — $95/yr. 3% dining/entertainment/groceries/streaming, 8% Capital One Entertainment, 5% Capital One Travel hotels
13. **Discover it Cash Back** — $0/yr. 5% rotating quarterly categories, first-year cashback match, no foreign transaction fees
14. **Amex Blue Cash Preferred** — $95/yr. 6% at U.S. supermarkets (up to $6k/yr), 6% streaming, 3% transit/gas, purchase protection
15. **Amex Blue Cash Everyday** — $0/yr. 3% groceries/gas/online retail, Disney+/Hulu streaming credit
16. **Capital One Quicksilver** — $0/yr. 1.5% on everything, $200 welcome bonus
17. **Bank of America Customized Cash Rewards** — $0/yr. 3% in chosen category, 2% grocery/wholesale, Preferred Rewards boost up to 5.25%

### Hotel & Airline Cards
18. **Marriott Bonvoy Boundless (Chase)** — $95/yr. Free night award annually (up to 35k points), 6x at Marriott properties, Silver Elite status
19. **Delta SkyMiles Gold (Amex)** — $150/yr. Free checked bag, priority boarding, 2x at restaurants/U.S. supermarkets, $200 Delta flight credit (on qualifying spend)
20. **World of Hyatt (Chase)** — $95/yr. Free night annually, Discoverist status, 4x at Hyatt, 2x dining/fitness/transit, milestone night bonuses

## 6. Functional Requirements

### Benefits Status Engine (P0 — Launch Critical)

**Card Recognition & Benefit Mapping**
- User selects their cards from the supported top-20 list or connects via Plaid for automatic card identification
- **Custom card import**: users holding cards outside the top-20 list can add them manually by entering the card name and issuer. CardIQ performs an AI-powered search of publicly available card terms and benefits, auto-populates the benefit catalog for that card, and integrates it into the dashboard. Users can review and confirm the imported benefits before activation. Custom cards receive the same tracking, notifications, and optimization features as pre-loaded cards, though accuracy is flagged as "AI-verified" (vs. "manually verified" for top-20 cards) until confirmed by the CardIQ team
- System maps each card to its complete, verified benefit catalog: statement credits, rewards multipliers, travel perks, purchase protections, insurance coverage, elite status, and sign-up bonuses
- Benefit catalog updated monthly by the CardIQ team with automated change detection against issuer websites

**Benefits Dashboard**
- Per-card benefits status view: each benefit shown as used, unused, partially used, or expired, with dollar values
- Portfolio-level summary: total benefits available, total captured, total missed/expired, and overall capture rate percentage
- Annual fee ROI calculator: value captured vs. annual fee paid, displayed per card and across the full portfolio
- Expiring benefits alerts: prominently surface credits and perks with upcoming reset dates (monthly, semi-annual, annual)

**Benefit Tracking Logic**
- For statement credits (e.g., Uber Cash, dining credits): track via transaction matching against Plaid data or manual user confirmation
- For one-time and periodic perks (e.g., lounge access, free night certificates): user check-off with optional photo/receipt upload
- For insurance and protections (e.g., rental car coverage, trip delay): display eligibility status; flag when a qualifying purchase was made on a different card that doesn't carry the protection
- For sign-up bonuses: track progress toward spend requirements with timeline and projected completion date

### Purchase Optimization Engine (P0)

**Spending Analysis**
- Ingest 90 days of transaction history via Plaid or manual statement upload (CSV/PDF)
- Categorize transactions by merchant category code (MCC): dining, travel, groceries, gas, streaming, entertainment, drugstores, clothing, etc.
- Map each category to the user's best available card based on rewards rate and active promotions

**Recommendation System**
- Per-purchase card recommendation: "Use your Amex Gold at this grocery store for 4x points instead of your Chase Freedom Unlimited at 1.5x"
- Monthly spending report: show how much additional value could have been captured with optimal card usage
- Category gap analysis: identify spending categories where the user has no elevated rewards card and quantify the missed value

**Notification Layer (P0)**
- Push notifications for: expiring statement credits (7-day and 1-day warnings), statement close dates, quarterly category activation reminders (e.g., Chase Freedom Flex, Discover it), and annual fee renewal decisions
- Weekly digest: summary of benefits used, benefits expiring soon, and top purchase optimization opportunities
- Contextual card recommendation notifications: when a recurring charge is detected on a suboptimal card

### Portfolio Strategy (P1 — Post-Launch)
- Card overlap analysis: identify redundant benefits across cards and quantify overlap in dollar terms
- Downgrade/upgrade recommendations: model the impact of switching from Chase Sapphire Reserve to Preferred, or vice versa, based on actual usage
- Annual fee justification report: generate a plain-language summary of whether each card earns its fee, with recommended actions

### Trust & Safety (P0)
- Monthly verification of card benefits database against issuer websites and terms documents
- Quarterly accuracy audits: random sample of 100 recommendations checked against verified card terms
- Factual accuracy target: ≥99% on benefit descriptions, credit amounts, and eligibility windows
- Transparent confidence labeling: flag any recommendation based on inferred (vs. confirmed) benefit usage

## 7. User Experience

### Primary User Journey
1. User creates an account and selects their cards from the top-20 list (1 minute)
2. Optionally connects bank accounts via Plaid for automatic transaction data and card identification (2 minutes)
3. System builds a personalized benefits map for each card, showing all available benefits with current status (30 seconds)
4. User sees their Benefits Dashboard: capture rate, unused credits, expiring perks, and annual fee ROI — all within 5 minutes of onboarding
5. Ongoing: proactive notifications for expiring credits, optimal card recommendations at point of purchase, and weekly optimization digests

### Key Interaction Surfaces

**Benefits Dashboard (Home Screen)**
The primary view is a card-by-card benefits status display. Each card shows a progress bar (benefits captured / benefits available), dollar value captured vs. annual fee, and a prioritized list of unused benefits sorted by expiration urgency. A portfolio-level summary sits at the top: total annual fee spend, total value captured, total value left on the table, and overall capture rate.

**Benefit Detail View**
Tapping any benefit expands to show: what it is, how to claim it, when it expires, current usage status, and dollar value. For complex benefits like the Amex Platinum's Resy dining credit or Chase Sapphire Reserve's The Edit hotel credit, the platform provides step-by-step instructions for redemption.

**Purchase Optimization Feed**
A chronological view of recent transactions, each annotated with whether the user used the optimal card. Transactions where a better card was available are flagged with the potential value difference. Users can filter by category, card, or time period.

**Notification Center**
All push notifications are archived here. Categories include: expiring credits, card recommendation nudges, quarterly category activations, annual fee renewal reminders, and weekly digests.

### Edge Cases & Constraints
- Handle benefit terms that change mid-year (e.g., Amex refreshing credit categories): flag affected users and update dashboard within 48 hours
- Support users who decline Plaid connection: manual card selection and self-reported benefit tracking with reduced automation
- Address overlapping benefit windows (semi-annual vs. annual resets) with clear date labeling per benefit
- Manage cards with spend-gated benefits (e.g., Delta Gold's $200 credit after $10k spend): track progress toward qualification thresholds
- Handle promotional or limited-time benefits separately from permanent card features

## 8. Narrative

It's the last week of June. Emma gets a notification from CardIQ: "You have $60 in unused Amex Gold Resy dining credits that expire June 30. Tap to see participating restaurants near you." She didn't even know the credit reset semi-annually. She books dinner that weekend and captures $50 she would have lost. Over the next three months, CardIQ surfaces her Uber Cash, Dunkin' credits, and dining credits one by one. By year-end, she's captured $380 of her $444 in available Amex Gold benefits — up from $120 the prior year. Her annual fee ROI flips from negative to decisively positive.

Marcus opens CardIQ for the first time after getting his Chase Sapphire Preferred. The dashboard shows him seven benefits he didn't know about, including DoorDash DashPass (which he's been paying $9.99/month for separately) and a $50 hotel credit he can use on his upcoming trip. CardIQ also flags that he's been using his debit card for dining — leaving 3x points on the table every meal. He switches his default payment method and captures an additional $240 in rewards value over the next year. The ROI on his $95 annual fee is no longer a question.

Priya logs in to review her three premium cards. CardIQ's portfolio view shows her something she suspected but couldn't quantify: her Amex Platinum and Chase Sapphire Reserve have $400 in overlapping lounge access and travel credit value. The platform recommends downgrading her Sapphire Reserve to the Preferred, saving $455 in annual fees while losing only $180 in non-overlapping benefits. Net savings: $275/year. She also discovers she's been neglecting her Capital One Venture X's $300 annual travel credit entirely — three years of value, gone. She books a flight through Capital One Travel that afternoon.

CardIQ didn't sell any of them a new card. It helped them stop leaving money on the table with the cards they already have.

## 9. Success Metrics

### Benefits Capture & Value
- **Benefits capture rate improvement**: users increase from baseline capture rate to ≥70% within 90 days
- **Dollar value recovered**: average user recovers ≥$250/year in previously unused benefits
- **Annual fee ROI awareness**: ≥80% of users can identify whether each card's fee is justified within 30 days of onboarding
- **Missed value reduction**: total dollar value of expired/unused benefits decreases ≥50% vs. pre-CardIQ baseline

### Engagement & Retention
- **Notification action rate**: ≥35% of push notifications result in a user action (claiming a benefit, switching a card, viewing a detail page)
- **Time-to-first-value**: <5 minutes from sign-up to seeing a complete benefits dashboard
- **Weekly active usage**: ≥60% of users check their dashboard or act on a notification at least once per week
- **Recommendation follow-through**: ≥30% of purchase optimization suggestions are adopted within 30 days

### Accuracy & Trust
- **Benefits database accuracy**: ≥99% of card benefit descriptions, credit amounts, and dates match verified issuer terms
- **Recommendation accuracy**: ≥98% of card-for-purchase recommendations correctly identify the optimal card
- **Database freshness**: all card benefit changes reflected in the platform within 48 hours of issuer announcement
- **User-reported errors**: tracked and resolved within 48 hours; target <0.5% error report rate per active user per month

## 10. Milestones & Sequencing

### Phase 1: Foundation (Months 1–3)
- Build and verify benefits database for all 20 supported cards, including statement credits, rewards structures, perks, protections, and eligibility windows
- Develop Benefits Status Engine: card selection UI, benefit mapping logic, and per-card/portfolio dashboard
- Integrate Plaid for optional transaction data ingestion and automatic card identification
- Implement manual card selection and self-reported benefit tracking as fallback
- Launch alpha with 50 users across a mix of premium, mid-tier, and no-fee cardholders for dashboard calibration
- Deploy baseline LLM recommendation engine (Claude 3.5 Sonnet) for plain-language benefit explanations and purchase optimization

### Phase 2: Optimization & Notifications (Months 4–6)
- Build Purchase Optimization Engine: transaction categorization, card-to-category mapping, and per-purchase recommendations
- Launch notification system: expiring credit alerts, quarterly category reminders, and weekly optimization digests
- Add spending analysis: monthly reports showing actual vs. optimal card usage with dollar-value gap
- Expand to closed beta with 500 users; A/B test notification frequency and framing for action rate optimization
- Implement benefits database change detection pipeline (automated monitoring of issuer terms pages)

### Phase 3: Portfolio Intelligence (Months 7–9)
- Develop card overlap analysis and portfolio-level ROI reporting
- Build downgrade/upgrade recommendation engine with impact modeling
- Add annual fee justification reports with plain-language summaries
- Launch open beta with public waitlist
- Scale infrastructure for 10,000+ concurrent users; optimize Plaid data pipeline for real-time transaction matching

### Phase 4: Scale & Refinement (Months 10–12)
- Optimize notification timing and content based on beta engagement data
- Expand supported card database beyond top 20 based on user demand signals
- Build partnership integrations with select issuers for real-time benefits data (reducing reliance on manual database updates)
- Prepare for general availability launch with full marketing, support infrastructure, and app store presence
- Conduct comprehensive accuracy audit and publish transparency report on benefits database methodology

## 11. Technical Approach

### Model Stack
- **Claude 3.5 Sonnet**: Primary reasoning engine for personalized benefit explanations, purchase recommendations, and portfolio strategy advice
- **Claude Opus**: Secondary model for complex multi-card scenario modeling and natural language generation for notifications
- **text-embedding-3-large**: Semantic matching between merchant transaction descriptions and card benefit categories
- **Fine-tuned BERT classifier**: Transaction categorization (MCC mapping) and benefit-to-transaction matching at scale

### Data Architecture
- **Benefits Database**: Structured repository of card benefits, updated monthly, with version history and change tracking. Each benefit record includes: description, dollar value, eligibility window, reset frequency, activation requirements, and redemption instructions
- **Transaction Pipeline**: Plaid-sourced transaction data normalized into standard categories via MCC codes, enriched with merchant metadata for accurate card-to-purchase matching
- **User State Store**: Per-user benefit tracking state, notification preferences, and historical capture rates for trend analysis

### Regulatory Considerations
- All recommendations are informational, not financial advice — disclosures included in onboarding and recommendation surfaces
- Plaid integration follows standard Open Banking consent flows with clear data usage disclosures
- ECOA/FCRA considerations: CardIQ does not access or display credit scores, does not influence lending decisions, and does not store credit bureau data. Recommendations are based solely on card benefit terms and user transaction data
- Data retention and deletion policies aligned with CCPA/state privacy requirements
