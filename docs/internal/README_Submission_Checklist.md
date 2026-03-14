# CardIQ — Capstone Submission Package

AI for Financial Services — eMBA Capstone — March 2026

---

## Deliverables

| # | File | Rubric Requirement | Status |
|---|------|--------------------|--------|
| 1 | `1_System_Design_Packet.docx` | System Design Packet — all 8 components: system instruction, input template, output schema, user interaction guide, workflow map, refusal behavior policy, HITL design, escalation rules. Plus: instruction hierarchy (3-tier), compliance framework (CARD Act, TILA, ECOA, Plaid privacy). | Ready |
| 2 | `2_Evaluation_Testing_Report.docx` | Evaluation & Testing Report — 10 test cases (happy path, ambiguous, adversarial x3, out-of-scope, stale data, edge case x2, documented failure + iteration). Success/failure criteria, verbatim API responses, reproducibility analysis. | Ready |
| 3 | `3_Failure_Modes_Risk_Analysis.docx` | Failure Modes & Risk Analysis — 10 failure modes with severity, likelihood, mitigation. Includes user misuse risks (FM-05, FM-07, FM-08), regulatory risk (FM-10). RACI ownership matrix. | Ready |
| 4 | `4_GenAI_Transparency_Log.docx` | GenAI Usage Transparency Log — tools, model versions, 7 key prompts, human vs. AI authorship breakdown. | Ready |
| 5 | `5_Executive_One_Pager.docx` | Executive One-Page Summary — problem, 3 named personas, solution, 6 risks & controls, will/will-not-do matrix. | Ready |
| 6 | `6_Product_Requirements_Document.docx` | PRD — goals, user stories, functional requirements, competitive landscape, 20 supported cards. | Ready |
| 7 | `7_SharkTank_Presentation.pptx` | Shark Tank-Style Presentation (10 slides, 10 min + 5 min Q&A) | Ready |

## Working Prototype

- **Live URL**: https://cardiq.fast-app.org
- **Source Code**: https://github.com/skdhir/CardIQ
- **Tech Stack**: Next.js 14 (App Router), TypeScript, File-based JSON Store, Claude API (`claude-sonnet-4-6`), AWS Amplify
- **Demo Accounts**:
  - `sarah.chen@demo.com` / `Demo1234!` — Sarah Chen (Amex Gold, Citi Strata Premier, Marriott Bonvoy Boundless)
  - `marcus.johnson@demo.com` / `Demo1234!` — Marcus Johnson (Amex Platinum, Chase Sapphire Reserve, Capital One Savor, Wells Fargo Active Cash, Delta SkyMiles Gold, Discover It, Macy's)
  - `emily.rodriguez@demo.com` / `Demo1234!` — Emily Rodriguez (Amex Gold, Chase Sapphire Reserve)

## Key Architecture Highlights

1. **3-Tier Instruction Hierarchy** — System Instruction (immutable) > Developer Context (per-session) > User Message (runtime)
2. **Verified Card Terms Database** — 20 top U.S. consumer cards, weekly review cycle
3. **Structured JSON Output** — Typed TypeScript interfaces with confidence levels, rationale, tradeoffs
4. **Finance-Specific Guardrails** — No investment advice, no new card recs, no guaranteed outcomes, prohibited terms list
5. **Disclaimers on every AI output** — "CardIQ provides information, not financial advice"
6. **Human-in-the-Loop** — Confidence badges (HIGH/MEDIUM/LOW), "Report an Issue" on all AI surfaces, named operational roles with SLAs
7. **10 Evaluation Test Cases** — Including documented v1 failure → v2 remediation, 3 adversarial tests, reproducibility analysis
8. **Statement Upload** — PDF/CSV via Claude Document Understanding
9. **AI Chat Support** — Floating widget on all pages
10. **Sample CSV Statements** — Pre-built demo statements for testing

## Rubric Alignment

| Category | Points | Evidence |
|----------|--------|----------|
| Problem Definition & Use-Case Clarity | /10 | 3 named personas (Sarah, Marcus, Emily), $300-$600 problem quantified, realistic financial context |
| System & Instruction Design | /15 | 3-tier hierarchy in `lib/claude.ts` + System Design Packet Sections 1-2. All 4 endpoints share same SYSTEM_INSTRUCTION |
| Language & Guardrails | /15 | 8 acceptable/prohibited example pairs, prohibited terms list, tone-by-segment table, advice vs. information distinction |
| Evaluation Framework | /20 | 10 test cases (4+ required), success/failure criteria tables, verbatim API responses, documented failure + iteration (TC-7), reproducibility analysis |
| Failure Modes & Risk Analysis | /15 | 10 modes (5+ required), includes user misuse (FM-05/07/08), regulatory risk (FM-10), RACI ownership matrix |
| Human-in-the-Loop & Escalation | /10 | Named roles (Benefits Data Analyst, AI Quality Reviewer, Compliance Officer), escalation triggers with thresholds, feedback loop diagram, confidence warnings in UI, report issue button |
| Compliance & Financial Realism | /10 | CARD Act, TILA, SEC/FINRA classification, Plaid privacy (CCPA), ECOA/fair lending, regulatory classification analysis |
| Professionalism & Coherence | /5 | All docs aligned, consistent model version (`claude-sonnet-4-6`), cross-referenced between documents |
