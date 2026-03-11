# CardIQ — Rubric Gap Fixes: Design & Implementation Plan

**Date:** 2026-03-11
**Purpose:** Close identified scoring gaps against the capstone grading rubric.
**Scope:** Code-level fixes only. Doc updates (Evaluation Report test cases TC-8/9/10) to be done separately.

---

## Fix Tracker

| ID | Category | Fix | Est. Points | Status |
|----|----------|-----|-------------|--------|
| P2 | Language & Guardrails (15 pts) | Add 6+ ACCEPTABLE/PROHIBITED examples to SYSTEM_INSTRUCTION | +2-3 | Pending |
| P3 | Human-in-the-Loop (10 pts) | Add "Report Issue" button on AI outputs + LOW confidence warning banner | +2-3 | Pending |
| P4 | Compliance (10 pts) | Add portfolio advice caveats to system instruction | +1 | Pending |
| P5 | System Design (15 pts) | Align chat endpoint prompt with main SYSTEM_INSTRUCTION | +1 | Pending |

**Estimated total gain: +6-8 points (from ~85 to ~91-93)**

---

## P2: Expand ACCEPTABLE/PROHIBITED Language Examples

### Problem
System instruction has only 2 acceptable/prohibited example pairs. Rubric requires "clear, finance-aware guardrails with realistic examples" for 13-15 range. Currently scoring 11-12.

### Design
Add 6 new example pairs to `LANGUAGE RULES` section in `SYSTEM_INSTRUCTION` covering:
1. **Predictive language** — prohibit guarantees, allow estimates
2. **Comparative claims** — prohibit absolute card rankings, allow factual comparisons
3. **Behavioral nudging** — prohibit pressure tactics, allow neutral information
4. **Action language** — prohibit directives ("cancel your card"), allow informational framing
5. **Scope boundary** — prohibit credit score/investment talk, show proper redirect
6. **Confidence framing** — prohibit certainty on stale data, allow caveated guidance

### Implementation
**File:** `lib/claude.ts` — `SYSTEM_INSTRUCTION` constant, LANGUAGE RULES section (after line 45)

### Verification
- All 3 AI endpoints (`/api/ai/explain`, `/api/ai/optimize`, `/api/ai/portfolio`) inherit from same `SYSTEM_INSTRUCTION`
- Chat endpoint (P5) will be aligned separately
- TypeScript build must pass

---

## P3: "Report Issue" Button + LOW Confidence Warning

### Problem
Human-in-the-Loop scoring (10 pts) requires escalation triggers, who reviews, and what happens next. Currently no user-initiated dispute flow and no confidence-based warnings. Scoring 6-7.

### Design

**3a. Report Issue Button:**
- New reusable component `components/ui/ReportIssueButton.tsx`
- Renders a small "Report an issue" link below any AI output
- On click: opens a small modal/inline form with a text reason
- Submits to new `POST /api/ai/report` endpoint
- Endpoint stores report as JSON in `.data/reports.json` (consistent with existing file-based storage)
- Shows "Thank you — our team will review within 48 hours" confirmation

**3b. LOW Confidence Warning Banner:**
- New reusable component `components/ui/ConfidenceWarning.tsx`
- Accepts `confidence: "HIGH" | "MEDIUM" | "LOW"` prop
- LOW: Shows amber banner — "This analysis has limited confidence. Please verify with your card issuer before acting."
- MEDIUM: Shows subtle note — "Some data may be estimated. Verify specific terms with your issuer."
- HIGH: No banner (clean output)
- Integrate into BenefitDetailModal (explain endpoint), Optimizer page, Portfolio page

### Implementation
**New files:**
- `components/ui/ReportIssueButton.tsx`
- `components/ui/ConfidenceWarning.tsx`
- `app/api/ai/report/route.ts`

**Modified files:**
- `components/dashboard/BenefitDetailModal.tsx` — add ReportIssueButton + ConfidenceWarning
- `app/(app)/optimizer/page.tsx` — add ReportIssueButton + ConfidenceWarning
- `app/(app)/portfolio/page.tsx` — add ReportIssueButton + ConfidenceWarning

### Verification
- Report endpoint stores to `.data/reports.json`
- Confidence warning renders conditionally based on AI response confidence level
- TypeScript build must pass

---

## P4: Portfolio Advice Caveats

### Problem
Portfolio analysis returns keep/downgrade/evaluate without caveating what it excludes. This is a compliance gap — users may over-rely on incomplete analysis (FM-05).

### Design
Add caveat instruction to `getPortfolioAdvice()` user message template:
> "Important: Your analysis should note that it covers only tracked benefits. Other factors not included: retention offers from issuers, signup bonus eligibility, credit score impact, relationship value with the bank, and personal spending changes. Include this caveat in your overallSummary."

### Implementation
**File:** `lib/claude.ts` — `getPortfolioAdvice()` function, user message content

### Verification
- Portfolio API response includes caveat language in overallSummary
- No change to return type

---

## P5: Align Chat Endpoint with Main SYSTEM_INSTRUCTION

### Problem
`app/api/ai/chat/route.ts` has its own lightweight system prompt that doesn't reference the 3-tier hierarchy. A grader checking code sees two different governance regimes — weakens system design score.

### Design
Refactor chat endpoint to import and extend `SYSTEM_INSTRUCTION` from `lib/claude.ts`:
- Export `SYSTEM_INSTRUCTION` from `lib/claude.ts`
- Chat endpoint uses `SYSTEM_INSTRUCTION` as base, appends chat-specific context (conciseness, app navigation help)
- Preserves user card context injection

### Implementation
**Files:**
- `lib/claude.ts` — export `SYSTEM_INSTRUCTION` and `MODEL` constants
- `app/api/ai/chat/route.ts` — import and extend instead of defining own prompt

### Verification
- Chat responses still obey all guardrails from Tier 1
- Chat remains concise (2-4 sentences)
- TypeScript build must pass

---

## Doc Updates (Post-Code, Manual)

After code fixes are verified:
1. **Evaluation Report** — Add TC-8 (guaranteed outcome), TC-9 (new card rec), TC-10 (schema failure) test cases
2. **System Design Packet** — Update Section 3 input template note, reference chat alignment
3. **Failure Modes** — Add RACI ownership row if time permits
4. **GenAI Transparency Log** — Add this session's changes

---

## Testing Protocol

1. `npx tsc --noEmit` — zero errors
2. Manual test: login as demo user, verify chat widget works
3. Manual test: check portfolio page shows confidence + report button
4. Manual test: check optimizer shows confidence + report button
5. Manual test: click "Report Issue", verify stored in `.data/reports.json`
