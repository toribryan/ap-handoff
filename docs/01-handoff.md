# 01 · Handoff

What we're building, why, and the decisions that shape it. Read this first;
then use [the style guide](02-style-guide.md) for how it looks and
[the test plan](03-test-plan.md) for how to know it's right.

> **Source of truth.** The prototype in [`prototype/`](../prototype) is the
> spec. The [Figma file](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO)
> mirrors it for review and annotation. These docs point at both and record
> the reasoning neither can show. When the two disagree, the prototype wins and the
> doc gets a fix and a [changelog](../CHANGELOG.md) line.

> **NDA.** The original design files are under NDA. Everything here is recreated
> from scratch with sample data: no screen, string or file is Proctorio's or
> Canvas's. The decisions are the ones made on the product.

## The problem

Integrity tools ask whether a paper is **original**. A paraphrase, an AI
rewrite or a ghostwriter clears every one of them. Instructors want to know
something else: **did you write this?**

AuthorProof asks it directly. When a student submits written work, it builds a
short quiz from that writing. Someone who wrote the paper can answer questions
about it; someone who didn't, can't. The result appears beside the
submission, where instructors already grade.

## Principles that don't bend

These were set before any screen was drawn. A change that breaks one is a
product conversation, not an implementation detail.

| # | Principle | Where it shows |
| --- | --- | --- |
| P1 | **No pass or fail.** A result ships with a confidence level; the instructor decides what to do with it. | Result overview, grading panel, every student-facing string |
| P2 | **Every score traces back to the student's own words.** Each question sits beside the passage it was generated from and the assessment of the answer, so an instructor can check the AI's reasoning. | Result cards, grading view |
| P3 | **Never color alone.** The host platform colors its badge the opposite way from the score, so results always read as words, with an icon where it adds meaning. | Badges, notices |
| P4 | **Nothing added to the instructor's grading workflow.** | Result placement, grading view |

## Feature map

| Surface | Who | Prototype | Figma | States |
| --- | --- | --- | --- | --- |
| 1 · Setup | Instructor | [`flow.html` → Setup](../prototype/flow.html) | [Student flow](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2) | Count 3–5, time limit 5/10/15 min, second attempt on/off |
| 2 · Submit and quiz | Student | [`flow.html` → Student](../prototype/flow.html) | [Student flow](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2) | Idle, uploading, generating, quiz, submitted (with and without retake) |
| 3 · Result | Instructor | [`flow.html` → Result](../prototype/flow.html) | [Student flow](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2) | Sample attempt, live attempt, unanswered questions |
| 4 · Emails *(briefed flow)* | Student | [`emails.html`](../prototype/emails.html) | [Emails](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=9-2) | Ready, reminder, received, second attempt, window closed |
| 5 · Grading view | Instructor | [`grading.html`](../prototype/grading.html) | [Grading view](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=12-2) | As pitched, as built; question selected or none |

## Decisions

Each records what was chosen, what was ruled out, and what it costs. They
exist so a well-meant "fix" doesn't undo a deliberate choice.

### D1 · The quiz lives inside the assignment, not in the LMS quiz tool

- **Chose:** the student uploads the essay inside an AuthorProof panel in the
  assignment, and the quiz appears there seconds later.
- **Ruled out:** the briefed architecture: a fresh quiz per submission in the
  LMS's quiz tool, then an email telling the student to go find it.
- **Why:** mapped and timed against the platform, the briefed flow was six
  steps and about ten minutes, which is exactly the time a student needs to
  reread the essay. Quiz tooling is one-to-many and gets fragile when a class
  submits at once, students turn notifications off, and instructors got two
  separate things to grade.
- **Cost, named up front:** short pieces written directly in the LMS editor
  are left out. How proctoring works alongside the embedded flow is open (Q1).
- **Outcome:** the briefed architecture shipped first as the fastest way to
  reach pilot instructors; the embedded flow became the long-term direction.

### D2 · The result sits in the grading view

- **Chose (pitched):** AuthorProof's results on the left of SpeedGrader, the
  paper in the middle, and the existing grading panel on the right, unchanged.
  Selecting a question marks its passage in the paper.
- **Built instead:** the results panel on its own, with the paper and grade in
  another tab. See the *As built* tab in `grading.html`.
- **Why pitched:** the instructor checks the AI against the paper without
  leaving the grading view (P2), and nothing they already trust moves (P4).
- **Cost of what was built:** two places to read before one grade.

### D3 · Settings explain themselves

Every control says what it changes for the student, so an instructor never
has to guess. The time limit is short on purpose and says so.

### D4 · The closed-window email stays neutral

When the window ends with no quiz, the email reads as information, not a
failure: a neutral notice, an outline button, and a line that the instructor
can reopen it. A missed quiz is for the instructor to follow up (P1).

### D5 · The similarity badge never looks like a pass

The third-party similarity score shows as a neutral badge with no check, so
it can't be read as "cleared". It answers a different question from
AuthorProof, and the panel says so.

## Illustrative values

These are placeholders in the prototype, not product decisions. Confirm
before building:

- Confidence thresholds: High at 80% matched or more, Medium at 50%, else Low (`prototype/js/ui.js`).
- Question count 3 to 5, time limits 5, 10 and 15 minutes (`prototype/js/data.js`).
- The 12-hour window and the reminder two hours before it closes (`prototype/js/emails.js`).
- Upload and generation waits of about one and two seconds (`prototype/js/flow.js`).

## Open questions

| # | Question | Owner | Status |
| --- | --- | --- | --- |
| Q1 | How does proctoring run alongside the embedded flow? Prototype it beside a proctored session before the direction is final. | Design + Engineering | Open |
| Q2 | Should instructors review generated questions before a quiz reaches a student? | Product | Open |
| Q3 | Can the quiz language be chosen, beyond the default of the submission's language? | Product | Open |
| Q4 | What happens to a submission written in the LMS editor, which D1 leaves out? | Product + Design | Open |

## Working agreement

- Questions go in the table above, not in chat, so the answer outlives the thread.
- A change to the prototype comes with a line in the [changelog](../CHANGELOG.md).
- A change to behaviour comes with a new or updated test-plan row.
