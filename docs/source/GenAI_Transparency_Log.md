# CardIQ — GenAI Usage Transparency Log

Tools, Models, Prompts & Human vs. AI Authorship
AI for Financial Services — eMBA Capstone — March 2026

---

## 1. Purpose

This log documents all AI tools used in the development of the CardIQ platform and course deliverables, in accordance with course requirements for GenAI transparency. It records tool versions, key prompts, and distinguishes human-authored content from AI-generated content.

---

## 2. Tools & Model Versions

| Tool | Model / Version | Purpose | Used In |
|------|----------------|---------|---------|
| Claude.ai (claude.ai) | Claude Sonnet 4 | Concept development, document drafting, PRD refinement | Early concept, PRD |
| Claude Code (CLI) | Claude Opus 4.6 | Code generation, system design, document rewriting, prototype fixes | All code, all final deliverables |
| Claude API (CardIQ app) | claude-sonnet-4-6 | Live AI recommendation engine in working prototype | CardIQ application |
| ChatGPT (research) | GPT-4o | Initial market research and competitive landscape mapping | Early concept phase only |
| Plaid Sandbox API | N/A (third-party) | Simulated bank/card data for prototype development | CardIQ app — onboarding |
| File-based JSON store | N/A (infrastructure) | Lightweight data store for user profiles, benefit tracking, card data | CardIQ app — backend |

---

## 3. Key Prompts Used

### 3.1 Concept Development

**Prompt (Claude.ai, Session 1):**
> "I need to design a high-impact GenAI use case in financial services for my eMBA course. The platform should be consumer-facing, use LLMs natively (not as a wrapper over rules), and address a real gap in the market. Help me brainstorm and then develop the strongest concept."

- **Human input:** LLM-native constraint, financial services domain, decision to reject affiliate-model competitors
- **AI contribution:** Competitive landscape synthesis, identification of the benefits-tracking gap, initial framing

### 3.2 PRD Development

**Prompt (Claude.ai, Session 3):**
> "Generate a Product Requirements Document for CardIQ covering: goals, user stories, functional requirements, UX flow, success metrics, and a 12-month milestone plan."

- **Human input:** All business goals, non-goals, metric thresholds (>= 99% accuracy, >= 40% acceptance rate), phased milestone structure, all three user personas (Marcus, Emma, Priya)
- **AI contribution:** Document structure, prose for UX section, detailed functional requirements, narrative scenario

### 3.3 Prototype Development

**Prompt (Claude Code, multiple sessions):**
> "Build a Next.js App Router application for CardIQ with: Plaid OAuth onboarding, benefits dashboard, AI-powered purchase optimizer, portfolio ROI view, and three Claude API features. Use Supabase for data."

- **Human input:** All architectural decisions (Next.js, Supabase), Plaid as primary onboarding, three AI feature specifications
- **AI contribution:** All code generation, database migrations, API routes, component structure

### 3.4 System Design & Instruction Hierarchy

**Prompt (Claude Code, remediation session):**
> "The prototype code stuffs instructions in the user message with no system prompt. Rewrite lib/claude.ts to implement a 3-tier instruction hierarchy: system instruction (immutable guardrails) as the system parameter, developer context (per-session data) injected into the message, user message constrained by both. Add structured JSON output schemas with confidence levels, tradeoffs, and rationale."

- **Human input:** Decision to implement 3-tier hierarchy, all guardrail requirements, output schema design, the specific acceptable/prohibited language examples
- **AI contribution:** Code implementation, system prompt prose, JSON schema structure

### 3.5 Deliverable Rewriting

**Prompt (Claude Code, final session):**
> "Rewrite all deliverables as markdown. System Design Packet must include all 8 required components plus instruction hierarchy, language tables, tone by segment, compliance depth (CARD Act, TILA, Plaid privacy), named HITL roles, and feedback loop. Evaluation Report needs 7 test cases aligned to the actual prototype (not credit scoring), including one documented failure and iteration. Failure Modes needs 9 modes aligned to benefits optimization with user misuse risks."

- **Human input:** All structural requirements, the decision to align everything to benefits optimization (Option A), the specific test case scenarios, all compliance frameworks to include, role definitions
- **AI contribution:** Document drafting, prose, formatting, detailed examples
- *Note: This session produced the initial 7 test cases and 9 failure modes. Later sessions (3.6) expanded to 10 test cases and 10 failure modes.*

### 3.6 Rubric Alignment & Guardrail Hardening

**Prompt (Claude Code, rubric audit session):**
> "Do a detailed check against what is asked and against rubric in this capstone project. Create tracker items for gaps. Do the code fixes first, then update docs."

- **Human input:** Decision to audit against rubric, prioritization of code-level fixes before doc updates, approval of each fix (P1–P5)
- **AI contribution:** Gap identification, implementation of ConfidenceWarning component, ReportIssueButton component, report API endpoint, prohibited terms list, chat endpoint alignment with main SYSTEM_INSTRUCTION, additional test cases (TC-8/9/10), FM-10, RACI matrix, reproducibility analysis

### 3.7 Final Deliverable Packaging

**Prompt (Claude Code, final packaging session):**
> "Update all md files under docs. Move deliverables to docs/deliverables/. Regenerate/update so I can zip and send. Create a Q&A preparation document for the Shark Tank presentation."

- **Human input:** Decision to create submission-ready package, requirement for Q&A preparation document
- **AI contribution:** Document finalization, deliverable organization, Q&A prep content

### 3.8 Statement Upload Feature

**Prompt (Claude Code, statement upload session):**
> "Build a complete statement upload feature: accept PDF or CSV bank statements, use Claude Document Understanding to extract and categorize transactions, show results in the Purchase Optimizer. Support both onboarding (optional per-card upload) and dashboard (per-card upload links). Create sample CSV files for demo."

- **Human input:** Decision to support PDF + CSV, requirement for per-card upload during onboarding and on dashboard, sample CSV specification
- **AI contribution:** Upload API endpoint with Claude Document Understanding integration, 3-step upload UI page, FormData file handling, transaction extraction prompt, 5 sample CSV statement files, per-card upload buttons on dashboard and onboarding review page

### 3.9 AI Response Formatting & Chat Support

**Prompt (Claude Code, AI formatting session):**
> "The AI responses in chat and optimizer are not user-friendly — they're walls of text. Make them digestible with proper formatting. The chat widget already works with Claude but outputs need to be readable with bold, bullets, and clear structure."

- **Human input:** Feedback that AI responses were "overwhelming" and "not good looking", requirement to match app's color scheme, decision to keep chat as floating widget
- **AI contribution:** AIResponse component (lightweight markdown renderer for bold, bullets, numbered lists, code), structured optimizer response card with Best Card / Tradeoffs sections, CHAT_ADDENDUM prompt for concise formatting, integration across chat widget and optimizer

### 3.10 Realistic User Journey & Data Isolation

**Prompt (Claude Code, data isolation session):**
> "After adding a card, it's magically showing transactions — it should ask to upload CSV and then show accordingly. Real users should not see mock data."

- **Human input:** Identification of phantom transaction bug, requirement that only demo accounts see mock data
- **AI contribution:** Modified transaction API to check for demo account prefix before falling back to mock data, empty state UI with upload CTA in optimizer, conditional rendering of category breakdown

---

## 4. Human Authorship vs. AI-Generated Content

| Deliverable / Component | Authorship | Notes |
|------------------------|-----------|-------|
| Core product concept (benefits optimization, cross-issuer view) | **Human** | Originated in human brainstorm |
| CardIQ name | **Human** | Human decision |
| User personas (Marcus, Emma, Priya) | **Human** | Demographics, goals, and scenarios specified by student |
| Competitive positioning | Human + AI | Human directed research; AI synthesized landscape |
| Business goals and success metrics | **Human** | All thresholds human-defined |
| Non-goals and scope boundaries | **Human** | Explicit scope decisions were human-set |
| 3-tier instruction hierarchy design | **Human** | Human decided on tiering structure; AI implemented |
| System prompt content | Human + AI | Human defined constraints and language rules; AI drafted prose; human reviewed |
| Acceptable/prohibited language examples | **Human** | All examples originated from human judgment |
| Tone-by-segment design | **Human** | Human defined segments and tone direction |
| All application code (Next.js, API routes, DB) | AI (human-supervised) | Claude Code generated; human tested and reviewed |
| Card terms database (20 cards) | Human + AI | Human selected cards and verified terms; AI structured the data |
| Test case design and expected behavior | **Human** | All 10 test cases and expected behaviors human-designed |
| Test execution and results documentation | Human + AI | Tests run by student; AI helped document results |
| Failure modes identification | Human + AI | Human identified categories; AI expanded examples and mitigations |
| Compliance framework (CARD Act, TILA, Plaid) | **Human** | Human identified relevant regulations; AI drafted language |
| HITL role definitions | **Human** | Human defined roles, responsibilities, and cadences |
| Executive one-pager | Human + AI | Human defined structure and key messages; AI drafted prose |
| ConfidenceWarning + ReportIssueButton components | AI (human-supervised) | Human specified requirements; AI implemented; human tested |
| Prohibited terms list in system instruction | **Human** | All prohibited terms selected by human judgment |
| RACI ownership matrix | **Human** | Human defined all roles and responsibilities |
| Reproducibility & variance analysis | Human + AI | Human directed testing methodology; AI documented results |
| All final markdown deliverables | AI (human-supervised) | Claude Code drafted; student reviewed and approved |
| Statement upload feature (PDF/CSV via Claude) | AI (human-supervised) | Human specified requirements; AI implemented upload API, extraction prompt, UI |
| AIResponse markdown renderer component | AI (human-supervised) | Human identified UX problem; AI created component and integrated |
| Sample CSV statement files (5 files) | Human + AI | Human specified card/transaction requirements; AI generated realistic transaction data |
| Transaction data isolation (demo vs. real users) | Human + AI | Human identified bug; AI implemented fix with demo-prefix check |
| This transparency log | Human + AI | Human defined categories; AI drafted; human reviewed |

---

## 5. Responsible Use Statement

All AI-generated content was reviewed, approved, and is the academic responsibility of the student author.

- No AI output was submitted without human review and approval
- All factual claims about card terms, market data, and regulatory requirements were independently verified
- AI-generated code was tested in a live prototype environment
- The core product decisions, design choices, ethical constraints, evaluation framework, and scope boundaries all originated with human judgment
- GenAI tools were used as a productivity accelerator — the student takes full academic responsibility for all submitted content
