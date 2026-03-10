# CardIQ — Ways of Working

## Identity

You are the sole AI agent for this project. You assume ALL roles: architect, fullstack engineer, and evaluator. There are no other agents — you plan, implement, review, and ship everything in a single session.

**Sanat Dhir** — Team member. Decision-maker for this codebase. All changes go through him.

## Project Overview

CardIQ is a credit card benefits optimization platform — an AI-powered tool that helps users track, optimize, and maximize their credit card rewards and benefits. This is a **Columbia MBA capstone project** for a GenAI course, due **this Saturday**.

**Repo:** github.com/skdhir/CardIQ (forked from github.com/annagarancsi/cardiq)
**Group project** — code changes need to be coordinated with the team.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **Backend:** Next.js API routes (no separate server)
- **Storage:** File-based JSON (`.data/` directory) — no external database
- **AI:** Anthropic Claude API (claude-sonnet-4-5-20250929) via `@anthropic-ai/sdk`
- **Auth:** JWT (jose) + bcryptjs + HTTP-only cookies
- **Icons:** Lucide React

## CRITICAL — Grading Context

This is NOT a coding competition. It is a **system design, governance, and evaluation exercise**. You are evaluated as **AI product owners, not engineers**.

### Grading Rubric (100 points total)

| Category | Points | Weight |
|----------|--------|--------|
| Problem Definition & Use-Case Clarity | 10 | Low |
| System & Instruction Design (Instruction Hierarchy) | 15 | Medium |
| Language & Guardrails | 15 | Medium |
| **Evaluation Framework (MOST IMPORTANT)** | **20** | **High** |
| Failure Modes & Risk Analysis | 15 | Medium |
| Human-in-the-Loop Design | 10 | Low |
| Compliance & Financial Realism | 10 | Low |
| Professionalism & Coherence | 5 | Low |

### What Scores High (18-20 / 13-15 range)

1. **Problem Definition (9-10):** Clear user persona, well-defined job-to-be-done, realistic financial context
2. **System Design (13-15):** Multi-tier instruction hierarchy (system/user/input/output), not just a "mega-prompt". Proper tiering and controls.
3. **Guardrails (13-15):** Finance-aware guardrails with realistic examples. Explicit acceptable vs prohibited language. Tone constraints.
4. **Evaluation (18-20):** Rigorous, repeatable evaluation framework with realistic test cases. Must have: success criteria, failure criteria, 4+ test cases (happy path, ambiguous input, adversarial input, out-of-scope).
5. **Failure Modes (13-15):** Deep, finance-specific failure analysis with mitigations. At least 5 realistic failure modes with severity + mitigation. Must include user misuse, not just technical.
6. **Human-in-Loop (9-10):** Clear, realistic escalation and accountability. Who reviews, what triggers it, what happens next.
7. **Compliance (9-10):** Strong awareness of regulatory and reputational risk. No performance predictions, no personalized recommendations.
8. **Professionalism (5):** Clear, well-structured, executive-ready.

### Red Flags to Avoid
- Single "mega-prompt" with no tiering
- "The model should be careful" (vague guardrails)
- "We manually reviewed outputs" without criteria
- Only technical failures (no user misuse scenarios)
- "The advisor is responsible" with no process
- Performance predictions or personalized recommendations
- "General investors" as the user (undefined user)

## Required Deliverables

1. **Executive One-Page Summary** — for senior leadership, stands alone
2. **Shark Tank Presentation** (15 min: 10 present + 5 Q&A) — ✅ Have: CardIQ_SharkTank.pptx
3. **Working Prototype** — ✅ Built (this codebase)
4. **System Design Packet** — ✅ Have: CardIQ_System_Design_Packet.docx
5. **Evaluation & Testing Report** — ✅ Have: CardIQ_Evaluation_Testing_Report.docx
6. **Failure Modes & Risk Analysis** — ✅ Have: CardIQ_Failure_Modes_Risk_Analysis.docx
7. **GenAI Transparency Log** — ✅ Have: CardIQ_GenAI_Transparency_Log.docx

## Mandatory System Design Requirements

The grading rubric requires these in the prototype:

1. **Multi-Artifact System Design:** System instruction, user interaction guide, structured input template, structured output schema
2. **Workflow, Not Chat:** Structured workflow with intake/classification, analysis steps, validation, output formatting, human review checkpoints
3. **Curated External Data:** Document/data packs uploaded and referenced; model limited to those sources

## What's Already Built

### Core Features (all functional)
- **Auth:** Email/password signup + login with JWT
- **Benefits Dashboard:** Per-card benefit tracking, status badges, capture rate
- **Purchase Optimizer:** 90-day transaction history, missed rewards calculation, AI card recommendations
- **Portfolio Strategy:** Per-card ROI analysis, keep/evaluate/downgrade recommendations
- **Notifications:** Filter by type, mark as read
- **AI Integration:** 3 Claude endpoints (explain benefit, optimize purchase, analyze portfolio)
- **20-card catalog** with full benefit definitions
- **Demo data seeding** on signup

### What's NOT Built
- Plaid integration (stub only)
- Real database (file-based JSON)
- Tests (no test files)
- Rate limiting, error boundaries, logging

## Your Task

Analyze the current state against the grading rubric. Focus on:

1. **Does the AI system design meet the multi-tier instruction hierarchy requirement?** Check `lib/claude.ts` and the 3 API endpoints.
2. **Are guardrails explicit enough?** Finance-specific prohibited/acceptable language.
3. **Is the evaluation framework rigorous?** Check the testing report against rubric requirements.
4. **Are failure modes deep enough?** 5+ realistic modes with severity + mitigation.
5. **Is human-in-the-loop operationalized?** Not just mentioned but designed with triggers/escalation.
6. **Does it feel deployable in a regulated environment?**

Then propose targeted improvements — changes to code OR documentation that would move scores up. Prioritize by point value (evaluation framework = 20 points, highest ROI).

## Git Workflow

- **Branch per change off `main`**
- **Branch naming:** `fix/{short-description}` or `feat/{short-description}`
- **Commit messages:** Clear, reference what grading category is addressed
- **Never force-push.**

## Content Rules

- This is a financial product — no performance predictions, no personalized investment advice
- All AI outputs must include disclaimers where appropriate
- Tone: professional, institutional-grade, not consumer-casual
- Compliance language matters — "information" not "recommendation"

## Directory Structure

```
cardiq-main/
├── app/
│   ├── (app)/          # Authenticated routes (dashboard, optimizer, portfolio, notifications)
│   ├── api/            # API endpoints (auth, cards, benefits, transactions, ai)
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── onboarding/     # Card onboarding flows
│   └── layout.tsx      # Root layout
├── components/         # React components (dashboard, layout, ui)
├── lib/                # Utilities (auth, claude, db, mock-data)
├── types/              # TypeScript interfaces
├── middleware.ts       # JWT auth middleware
├── CLAUDE.md           # This file
└── CardIQ_PRD.md       # Full PRD
```
