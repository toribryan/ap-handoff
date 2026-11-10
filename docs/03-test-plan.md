# 03 · Test plan

How to know a build is right, written as behaviour. Each row can be checked
against the prototype, which shows the intended result, and has an ID so a
review comment or bug report can name it ("fails GV-01 on a phone").

Check every row on a desktop and on a phone, except where noted.

## Student flow · `flow.html`

| ID | Given | When | Then |
| --- | --- | --- | --- |
| SF-01 | The student is on the assignment | They upload the essay | A status shows the upload and generation, and the quiz appears **on the same page** within seconds (D1) |
| SF-02 | Setup asks for 4 questions | The student uploads | The quiz has 4 questions |
| SF-03 | Setup | The instructor changes the count | It stays between 3 and 5, and the buttons at each end are disabled |
| SF-04 | The quiz is open | No question is answered | Submit is disabled; answering one enables it and updates "N of M answered" |
| SF-05 | Retakes are off | The student submits | The confirmation says it is not a grade (P1), and there is no retake |
| SF-06 | Retakes are on | The student submits | A Retake button is offered |

## Result · `flow.html` → Result

| ID | Given | When | Then |
| --- | --- | --- | --- |
| RS-01 | The student answered 1 of 5 | The instructor opens the result | It shows that attempt: 1 of 5 matched, confidence Low, and "No answer" for the other four |
| RS-02 | Any result | The instructor reads a question | It sits beside the passage it came from (P2) and the badge reads as words (P3) |
| RS-03 | A quiz was taken | The instructor changes the setup | The result goes back to the sample, because a new setup is a new quiz |

## Emails · `emails.html`

| ID | Given | When | Then |
| --- | --- | --- | --- |
| EM-01 | Any state | It is selected | It has its own subject and says when it is sent |
| EM-02 | Setup asked for 4 questions and 15 minutes | The emails are read | They say "4 questions … 15-minute limit" |
| EM-03 | Retakes are off | The second-attempt email is selected | It says it would not send |
| EM-04 | The window closed with no quiz | The email is read | The notice is neutral and the button is an outline (D4) |
| EM-05 | The quiz was received | The email is read | There is nothing left to click |

## Grading view · `grading.html`

| ID | Given | When | Then |
| --- | --- | --- | --- |
| GV-01 | As pitched | The instructor selects question 4 | Its passage is marked in the paper and scrolled into view; on a phone, the page scrolls to it |
| GV-02 | A question is open | It is selected again | The mark clears |
| GV-03 | As pitched | The similarity badge is shown | It is neutral, never a pass (D5) |
| GV-04 | As built | A question is open | Its passage opens inside the panel, and there is no paper |
| GV-05 | As pitched, desktop | The instructor scrolls the paper | The page does not scroll *(desktop only: on a phone the panels stack)* |

## Accessibility and layout

| ID | Check |
| --- | --- |
| A11Y-01 | View tabs work from the keyboard: arrows move and select, End jumps to the last, and only the selected view shows |
| NFR-01 | No page scrolls sideways at 360px wide |

## Also check

- Contrast in both themes with a checker, including badges and notices.
- VoiceOver: the quiz reads each question as a group with its options; badges read their words.
- `prefers-reduced-motion`: the spinner and the scroll to a passage don't animate.
