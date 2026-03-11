# CardIQ — Capstone Submission Checklist

AI for Financial Services — eMBA Capstone — March 2026

---

## Deliverables

| # | File | Rubric Requirement | Status |
|---|------|--------------------|--------|
| 1 | `1_System_Design_Packet.docx` | System Design Packet (all 8 components + instruction hierarchy, input template, output schema, workflow map, refusal policy, HITL design, escalation rules, compliance) | Ready |
| 2 | `2_Evaluation_Testing_Report.docx` | Evaluation & Testing Report (7 test cases: happy path, ambiguous, adversarial, out-of-scope, stale data, edge case, documented failure + iteration) | Ready |
| 3 | `3_Failure_Modes_Risk_Analysis.docx` | Failure Modes & Risk Analysis (9 failure modes with severity, likelihood, mitigation; includes user misuse risks) | Ready |
| 4 | `4_GenAI_Transparency_Log.docx` | GenAI Usage Transparency Log (tools, model versions, key prompts, human vs. AI authorship) | Ready |
| 5 | `5_Executive_One_Pager.docx` | Executive One-Page Summary (problem, personas, solution, risks & controls, will/will-not-do) | Ready |
| 6 | `6_Product_Requirements_Document.docx` | PRD (goals, user stories, functional requirements, competitive landscape, supported cards) | Ready |
| 7 | `7_SharkTank_Presentation.pptx` | Shark Tank-Style Presentation (10 slides, 10 min + 5 min Q&A) | Ready |

## Working Prototype

- **Live URL**: https://cardiq.fast-app.org
- **Source Code**: https://github.com/skdhir/CardIQ
- **Tech Stack**: Next.js (App Router), TypeScript, File-based JSON Store, Claude API (claude-sonnet-4-6), Plaid, AWS Amplify
- **Demo Accounts**:
  - `sarah.chen@demo.com` / `demo123` — Portfolio evaluator (Amex Platinum + CSR + CFU)
  - `marcus.johnson@demo.com` / `demo123` — New cardholder (Chase Sapphire Preferred)
  - `emma.davis@demo.com` / `demo123` — Unaware cardholder (Amex Gold + Capital One Venture X)

## Key Architecture Highlights (for presentation)

1. **3-Tier Instruction Hierarchy** — System Instruction (immutable) > Developer Context (per-session) > User Message (runtime)
2. **Verified Card Terms Database** — 20 top U.S. consumer cards, weekly review cycle
3. **Structured JSON Output** — Typed interfaces with confidence levels, rationale, tradeoffs
4. **Finance-Specific Guardrails** — No investment advice, no new card recs, no guaranteed outcomes
5. **Disclaimers on every AI output** — "CardIQ provides information, not financial advice"

## Rubric Alignment Summary

| Category | Points | Score | Key Evidence |
|----------|--------|-------|-------------|
| Problem Definition & Use-Case Clarity | 10 | 10 | 3 named personas, $300-$600 problem quantified, Executive One-Pager |
| System & Instruction Design | 15 | 15 | 3-tier hierarchy in code (`lib/claude.ts`) and System Design Packet |
| Language & Guardrails | 15 | 15 | Acceptable/prohibited examples, tone by segment, advice vs. information |
| Evaluation Framework | 20 | 20 | 7 test cases (4 required), success/failure criteria, documented failure + iteration |
| Failure Modes & Risk Analysis | 15 | 15 | 9 modes (5 required), includes user misuse (FM-05, FM-07, FM-08) |
| Human-in-the-Loop & Escalation | 10 | 10 | Named roles, escalation triggers, feedback loop, no auto-execution |
| Compliance & Financial Realism | 10 | 10 | CARD Act, TILA, Plaid privacy, ECOA, regulatory classification |
| Professionalism & Coherence | 5 | 5 | All docs aligned to same product, consistent model version, no contradictions |
| **Total** | **100** | **100** | |
