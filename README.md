# AuthorProof · design handoff

AuthorProof asks a student about the paper they turned in. It builds a short
quiz from their own writing, and the result appears beside the submission,
where instructors already grade.

This repo is the design-dev handoff for it, in the form I used on the
project: a **coded prototype** that shows exactly what to build, and the
**documentation** that explains it. Engineering reads the screens, states and
behaviour here, in the medium they build in, with a
[Figma file](https://www.figma.com/design/CX6Lxfl52NCGfI3CvvGoHO) that mirrors
the prototype under the same token and component names.

It is not the product. The prototype is a reference: sample data, no backend,
nothing to deploy.

> **NDA.** The original files are under NDA. Everything here is recreated
> with sample data: no screen, string or file is Proctorio's or Canvas's. The
> decisions are the ones made on the product.

**Prototype:** https://toribryan.github.io/ap-handoff/

## Start here

1. Read [`docs/01-handoff.md`](docs/01-handoff.md): the problem, the
   principles that don't bend, every surface and its states, and the decisions
   with what they cost.
2. Open the [prototype](https://toribryan.github.io/ap-handoff/), or
   [`prototype/index.html`](prototype/index.html) straight from disk. Every screen and state in the docs can be reached from there.
3. Use [`docs/02-style-guide.md`](docs/02-style-guide.md) for tokens,
   components and copy, and [`docs/03-test-plan.md`](docs/03-test-plan.md) to
   check a build against the intended behaviour.

## What's here

```
docs/
  01-handoff.md       What and why: principles, surfaces and states, decisions, open questions
  02-style-guide.md   How it looks: tokens, components, copy that ships as written
  03-test-plan.md     How to know it's right: one row per behaviour, for QA and review
prototype/            The visual and behavioural reference
  index.html          Overview
  flow.html           Setup, the student's upload-to-quiz flow, the result
  emails.html         The briefed flow's quiz email, five states
  grading.html        The reviewing side, as pitched and as built
  css/tokens.css      Every color, space, radius and type value, by name
  css/components.css  Each component and its variants
  js/                 Sample data and the interactions
CHANGELOG.md          What changed in the handoff, and when
```

## How this handoff works

- **The prototype is the spec.** If a doc and the prototype disagree, the
  prototype wins and the doc gets corrected.
- **Three short docs, each with one job.** They point at the prototype
  instead of restating it.
- **Tokens and components have names.** Use `--card`, not a hex; use the
  Badge's `--neutral` variant, not a new gray. The style guide maps each name
  to its use.
- **Behaviour is written as test-plan rows.** Each row has an ID, so review
  comments and bug reports can say "SF-04" instead of describing a screen.
- **Changes leave a trail.** Every change to the handoff gets a line in the
  [changelog](CHANGELOG.md).
