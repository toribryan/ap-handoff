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

## Feature breakdown

One entry per feature: the user journey through it, the business logic it
has to follow, how to reach it in the prototype, and every file that
describes it. Build from this; the
decisions below explain why it is this way.

### F1 · Setup

**User journey** · Instructor

1. Opens the assignment in the assignment editor.
2. Turns on AuthorProof and chooses the number of questions, the time limit and whether a second attempt is allowed.
3. Saves. From then on, every student who submits gets a quiz on their own essay.

**Business logic**

- AuthorProof is turned on per assignment, by the instructor.
- Number of questions: 3 to 5, default 5. Each question is generated from the student's own essay.
- Time limit: 5, 10 or 15 minutes, default 10. It starts when the quiz appears, not when the essay is uploaded.
- Second attempt: off by default. When on, a retake draws new questions from the same essay.
- Changing any setting starts the quiz over: an attempt in progress is discarded and the result returns to the sample.

**Navigate the prototype**

1. Open [`flow.html`](../prototype/flow.html) and choose **1 · Setup**.
2. Change the count or the time limit; the summary line under the settings updates as you go.
3. Choose **Save and view as the student** to see the quiz those settings produce.

**Related files**

- Prototype: [`prototype/flow.html`](../prototype/flow.html), [`prototype/js/flow.js`](../prototype/js/flow.js) (`renderSetup`), limits and defaults in [`prototype/js/data.js`](../prototype/js/data.js)
- Figma: [Student flow · 01 Setup](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2)
- Test plan: [SF-02, SF-03, RS-03](03-test-plan.md)

### F2 · Submit and quiz

**User journey** · Student

1. Opens the assignment and uploads the essay.
2. Sees the quiz appear on the same page, seconds later.
3. Answers within the time limit and submits.
4. Reads that the result is not a grade, and retakes if the instructor allowed it.

**Business logic**

- The quiz appears on the assignment page seconds after upload. There is no notification and no second place to go.
- The quiz has as many questions as the setup asks for, each from a passage of the submitted essay.
- The time limit counts down from the setup's value while the quiz is open.
- Submit stays disabled until at least one question is answered. Unanswered questions are submitted as "No answer".
- The confirmation says the result is not a grade. A retake is offered only when the setup allows one.

**Navigate the prototype**

1. Open [`flow.html`](../prototype/flow.html) on **2 · Student** and choose **Upload**.
2. Watch the two waits: uploading, then writing the questions.
3. Answer one or more questions and choose **Submit quiz**.

**Related files**

- Prototype: [`prototype/js/flow.js`](../prototype/js/flow.js) (`startUpload`, `renderStudent`), questions in [`prototype/js/data.js`](../prototype/js/data.js)
- Figma: [Student flow · 02 to 05](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2)
- Test plan: [SF-01, SF-04 to SF-06](03-test-plan.md)

### F3 · Result

**User journey** · Instructor

1. Opens the submission to grade it, as they already do.
2. Reads the result beside the essay: how much matched, and the confidence.
3. Checks any question against the passage it came from.
4. Decides what to do with it, including talking to the student.

**Business logic**

- The result sits beside the submission, where the instructor grades.
- "Matched the essay" counts answers that agree with the essay.
- Confidence is a word: High at 80% matched or more, Medium at 50% or more, otherwise Low. *(Placeholder thresholds; see Illustrative values.)*
- Every question shows the passage it came from, the question, the student's answer and the assessment, side by side.
- Nothing reads as pass or fail. Badges say "Matches the essay" or "Does not match", with an icon.

**Navigate the prototype**

1. Take the quiz in F2, then choose **View as the instructor**; or open **3 · Result** to see the sample attempt.
2. Answer some questions wrong to see "Does not match" and the confidence change.

**Related files**

- Prototype: [`prototype/js/flow.js`](../prototype/js/flow.js) (`renderResult`), the confidence rule in [`prototype/js/ui.js`](../prototype/js/ui.js)
- Figma: [Student flow · 06 Result](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=6-2)
- Test plan: [RS-01 to RS-03](03-test-plan.md)

### F4 · Emails *(briefed flow)*

**User journey** · Student, in the briefed flow

1. Submits the essay.
2. Gets the ready email about ten minutes later, and leaves it to find the quiz in Canvas.
3. Gets a reminder if the quiz is not started, then a receipt, or a notice that the window closed.

**Business logic**

- Ready: sent about ten minutes after the essay is submitted.
- Reminder: two hours before the window closes, only if the quiz has not been started.
- Received: as soon as the quiz is submitted. Nothing left to click.
- Second attempt: only when the setup allows retakes.
- Window closed: once, when the window ends with no quiz. Neutral, never a failure.
- Question count and time limit come from the setup. The 12-hour window is a placeholder.

**Navigate the prototype**

1. Optionally change the setup in F1 first.
2. Open [`emails.html`](../prototype/emails.html) and pick a state above the email.

**Related files**

- Prototype: [`prototype/emails.html`](../prototype/emails.html), [`prototype/js/emails.js`](../prototype/js/emails.js)
- Figma: [Emails](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=9-2)
- Test plan: [EM-01 to EM-05](03-test-plan.md)

### F5 · Grading view

**User journey** · Instructor

1. Opens SpeedGrader on a submission.
2. Reads AuthorProof's results on the left before grading.
3. Selects a question to see its passage marked in the paper.
4. Grades and comments on the right, without leaving the view.

**Business logic**

- As pitched: AuthorProof's results, the paper and the existing grading panel in one view.
- Selecting a question marks its passage in the paper and scrolls to it; on a phone the page scrolls to it. Selecting it again clears the mark.
- The similarity score shows as a neutral badge, never as a pass.
- As built: the results panel alone, with the passage opened inside it.

**Navigate the prototype**

1. Open [`grading.html`](../prototype/grading.html) on **As pitched** and select **Question 4**.
2. Switch to **As built** and select a question to see the passage inline.

**Related files**

- Prototype: [`prototype/grading.html`](../prototype/grading.html), [`prototype/js/grading.js`](../prototype/js/grading.js), the essay in [`prototype/js/data.js`](../prototype/js/data.js)
- Figma: [Grading view](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=12-2)
- Test plan: [GV-01 to GV-05](03-test-plan.md)

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
