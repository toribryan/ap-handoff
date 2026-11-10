# 02 · Style guide

What it looks like. Values live in one place each: tokens in
[`prototype/css/tokens.css`](../prototype/css/tokens.css) and components in
[`prototype/css/components.css`](../prototype/css/components.css), with twins
under the same names in the
[Figma file](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO?node-id=4-3)
(Foundations and Components pages). Build with
the names, never the raw values. To see any of them in use, open the
prototype and inspect it.

## Tokens

Colors come in Light and Dark, switched by `prefers-color-scheme` or
`[data-theme]`; Figma's **AuthorProof / Color** collection has the same two
modes. The theme button in the prototype's header flips between them.

| Token | Use |
| --- | --- |
| `--background` | Page |
| `--card` | Cards, panels, the email body |
| `--surface` | The frame a view sits in |
| `--foreground` / `--muted-foreground` | Text, and secondary text |
| `--primary` / `--on-primary` | The one main action on a view |
| `--secondary` | Selected rows, outline buttons |
| `--border` | Every hairline |
| `--info` / `--info-subtle` | Ready and second-attempt notices, the marked passage |
| `--success` / `--success-subtle` | "Matches", received notice |
| `--warning` / `--warning-subtle` | "Does not match", reminder notice |

Spacing is a 4px scale (`--space-1` to `--space-8`); radii are `sm` 6, `md` 8,
`lg` 12, `xl` 16 and `full`.

**Type** is Geist, in seven styles (`--text-*`, and `.t-*` classes):
Display 28, Heading 20, Title 16, Body 14, Body strong 14, Small 12, Label 11
uppercase.

## Components

Each component is one block in `components.css`, and its modifier classes are
its variants.

| Component | Variants | Rule that lives in the component |
| --- | --- | --- |
| Button | `--primary`, `--outline`; `--lg` | One primary per view. |
| Badge | `--success`, `--warning`, `--neutral` | Always words; result badges add a check or a cross. Similarity is always `--neutral` (D5). |
| Notice | `--info`, `--warning`, `--success`, `--neutral` | Words and an icon. The closed-window email uses `--neutral` (D4). |
| Tab | selected, not selected | ARIA tabs: arrow keys, Home and End. |
| Quiz option | unselected, selected | The whole row is the label. |
| Stat tile | | Label above value. |
| Detail row | | Uppercase label above value, for email details. |
| Question row | Matches / Does not match; collapsed / expanded | Expanded shows the answer and the assessment; as built, the passage too. |

## Copy that ships word for word

Changing these is a product decision (P1).

- Student, after submitting: *"Your instructor sees the result beside your essay. It is not a grade, and it does not pass or fail you."*
- Every email: *"It is not a plagiarism check, and it does not pass or fail you. It confirms you can speak to what you wrote."*
- Grading panel: *"Is it original? AuthorProof, on the left, answers the other question: did they write it?"*
- Badges: *"Matches the essay"* and *"Does not match"*, never "Pass", "Fail", "Correct" or "Wrong".

## Layout

- Views sit in a frame (`.shell`): tabs on top, a body, and the NDA footnote.
- The grading view is three columns from 1024px (17.5rem, the paper, 14rem)
  and stacks below that, with each scrolling region capped so the page stays
  reachable.
- No horizontal page scroll at 360px (NFR-01).

## Accessibility

- Text and badges should meet WCAG AA contrast in both themes. Check by hand (see the test plan).
- Every interactive element is a real button, link or input.
- Focus is always visible (`:focus-visible`, 2px `--info`).
- Results never depend on color alone (P3).
- Motion respects `prefers-reduced-motion`.
