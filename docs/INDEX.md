# CardIQ — Documentation Index

AI for Financial Services — eMBA Capstone — March 2026

---

## Folder Structure

```
docs/
├── INDEX.md                  ← This file
├── deliverables/             ← Submit this folder to the professor
├── source/                   ← Markdown source files (generates the .docx deliverables)
└── internal/                 ← Working docs — NOT for submission
```

---

## deliverables/

**Purpose:** Final submission package. Zip this folder and send to the professor.

| # | File | What It Is |
|---|------|-----------|
| 1 | `1_System_Design_Packet.docx` | System instruction, 3-tier hierarchy, input/output schemas, workflow map, refusal policy, HITL design, escalation rules, compliance framework |
| 2 | `2_Evaluation_Testing_Report.docx` | 10 test cases with success/failure criteria, verbatim API responses, documented v1 failure + v2 fix, reproducibility analysis |
| 3 | `3_Failure_Modes_Risk_Analysis.docx` | 10 failure modes (severity, mitigation, residual risk), user misuse risks, regulatory risk, RACI ownership matrix |
| 4 | `4_GenAI_Transparency_Log.docx` | Tools, model versions, 7 key prompts, human vs. AI authorship breakdown |
| 5 | `5_Executive_One_Pager.docx` | Standalone summary: problem, personas, solution, risks, will/won't do |
| 6 | `6_Product_Requirements_Document.docx` | PRD: goals, user stories, functional requirements, competitive landscape, 20 supported cards |
| 7 | `7_SharkTank_Presentation.pptx` | Shark Tank presentation (10 slides, 10 min + 5 min Q&A) |

---

## source/

**Purpose:** Markdown source files that generate the .docx deliverables via pandoc. Edit these, then regenerate with:

```bash
pandoc docs/source/<filename>.md -o docs/deliverables/<N>_<filename>.docx --from markdown --to docx
```

| File | Generates |
|------|-----------|
| `System_Design_Packet.md` | → `1_System_Design_Packet.docx` |
| `Evaluation_Testing_Report.md` | → `2_Evaluation_Testing_Report.docx` |
| `Failure_Modes_Risk_Analysis.md` | → `3_Failure_Modes_Risk_Analysis.docx` |
| `GenAI_Transparency_Log.md` | → `4_GenAI_Transparency_Log.docx` |
| `Executive_One_Pager.md` | → `5_Executive_One_Pager.docx` |

---

## internal/

**Purpose:** Working documents for the team. NOT for submission.

| File | What It Is |
|------|-----------|
| `QA_Preparation_Guide.md` | Comprehensive Q&A prep for the Shark Tank presentation — likely questions, prepared answers, rubric-by-rubric defense strategy, demo script |
| `README_Submission_Checklist.md` | Submission checklist with demo accounts, architecture highlights, rubric alignment summary |
| `Rubric_Gap_Fixes_Plan.md` | Tracker of code/doc fixes made to close rubric scoring gaps (P2–P5) |
