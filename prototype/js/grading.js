/*
 * The reviewing side. As pitched: results, paper and grading panel in one
 * view, where selecting a question marks and scrolls to its passage. As
 * built: the results panel alone, with each passage opened inline.
 */
(function () {
  const { escape: e, icon, confidence, tabs } = AP.ui;
  const { assignment: A, questions: Q, sampleAnswers: ANS, essay, similarity } = AP.data;
  const MATCHED = Q.filter((q, i) => q.answer === ANS[i]).length;

  let selected = 0;

  const bar = (title) => `
    <div class="row-between" style="padding:8px 16px;border-bottom:1px solid var(--border);background:var(--card)">
      <div class="stack-1" style="gap:0;min-width:0">
        <p class="t-small muted">${e(A.course)} · ${e(A.title)}</p>
        <p class="t-strong">${e(title)}</p>
      </div>
      <div class="row" style="gap:6px">
        <button class="btn btn--outline btn--icon" type="button" aria-label="Previous student" disabled>${icon("left", 14)}</button>
        <span class="t-small muted">${e(A.student)} · 3 of 24</span>
        <button class="btn btn--outline btn--icon" type="button" aria-label="Next student" disabled>${icon("right", 14)}</button>
      </div>
    </div>`;

  function panel(inline) {
    return `
      <div class="stack-3" style="padding:16px;border-bottom:1px solid var(--border)">
        <p class="t-strong">AuthorProof</p>
        <dl style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${[["Matched", `${MATCHED} of ${Q.length}`], ["Confidence", confidence(MATCHED, Q.length)], ["Time", "4m 22s"]]
            .map(([k, v]) => `<div class="stat"><dt class="t-small muted">${k}</dt><dd class="t-strong">${v}</dd></div>`).join("")}
        </dl>
        <p class="t-small muted">${inline ? "Select a question to read the passage it came from." : "Select a question to find its passage in the paper."}</p>
      </div>
      <ol>
        ${Q.map((q, i) => {
          const ok = q.answer === ANS[i];
          const on = selected === i;
          return `<li>
            <button class="qrow" type="button" aria-pressed="${on}" data-question="${i}" style="${i === 0 ? "border-top:0" : ""}">
              <span class="row-between"><span class="t-small muted">Question ${i + 1}</span>
                <span class="badge ${ok ? "badge--success" : "badge--warning"}">${icon(ok ? "check" : "x", 12)}${ok ? "Matches" : "Does not match"}</span></span>
              <span>${e(q.question)}</span>
              ${on ? `<span class="stack-1 t-small">
                <span><span class="muted">Answered: </span>${e(q.options[ANS[i]])}</span>
                <span><span class="muted">Assessment: </span>${e(ok ? q.matches : q.differs)}</span>
                ${inline ? `<span class="passage muted" data-testid="inline-passage">“${e(q.excerpt)}”</span>` : ""}
              </span>` : ""}
            </button></li>`;
        }).join("")}
      </ol>`;
  }

  function paper() {
    const excerpt = selected === null ? null : Q[selected].excerpt;
    return essay.map((p) => {
      const at = excerpt ? p.indexOf(excerpt) : -1;
      if (at < 0) return `<p>${e(p)}</p>`;
      return `<p>${e(p.slice(0, at))}<mark class="passage-mark" data-testid="mark">${e(excerpt)}</mark>${e(p.slice(at + excerpt.length))}</p>`;
    }).join("");
  }

  const grading = `
    <div class="stack" style="padding:16px">
      <div class="stack-2">
        <p class="t-label muted">Similarity</p>
        <div class="row-between card" style="padding:8px 12px;border-radius:var(--radius-md)">
          <div class="stack-1" style="gap:0"><span class="t-strong">Turnitin</span><span class="t-small muted">${similarity.band} similarity</span></div>
          <span class="badge badge--neutral">${similarity.score}%</span>
        </div>
        <p class="t-small muted">Is it original? AuthorProof, on the left, answers the other question: did they write it?</p>
      </div>
      <div class="stack-1">
        <label class="t-label muted" for="grade">Grade</label>
        <div class="row" style="gap:8px"><input id="grade" inputmode="numeric" value="88" style="width:80px;height:32px;padding:0 8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--background)"/><span class="muted">out of 100</span></div>
      </div>
      <div class="stack-1">
        <label class="t-label muted" for="comment">Comment</label>
        <textarea id="comment" rows="3" style="resize:none;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--background)">Strong walk-through of your own readings. Let’s talk about question 4 in office hours.</textarea>
      </div>
      <div class="row"><button class="btn btn--primary" type="button" data-action="save">Submit grade</button><p class="t-small muted" role="status" data-testid="saved"></p></div>
    </div>`;

  const motion = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  function render(scroll = true) {
    document.getElementById("panel-pitched").innerHTML = `
      ${bar("SpeedGrader")}
      <div class="grader" style="display:grid;grid-template-columns:minmax(0,1fr)">
        <div class="grader__left" style="background:var(--card);overflow:auto">${panel(false)}</div>
        <div class="grader__paper" data-testid="paper" style="overflow:auto;overscroll-behavior:contain;padding:16px">
          <article class="card stack-3" style="max-width:36rem;margin:0 auto;padding:24px 20px">
            <header class="stack-1"><p class="t-small muted">${e(A.student)} · ${e(A.file)}</p><h3 class="t-title">Shade as infrastructure</h3></header>
            ${paper()}
          </article>
        </div>
        <div class="grader__right" style="background:var(--card);overflow:auto">${grading}</div>
      </div>`;
    document.getElementById("panel-built").innerHTML = `
      ${bar("AuthorProof results")}
      <div class="grader grader--built" style="display:grid;grid-template-columns:minmax(0,1fr)">
        <div class="grader__left" style="background:var(--card);overflow:auto">${panel(true)}</div>
        <div class="row" style="justify-content:center;padding:32px;text-align:center"><p class="muted" style="max-width:20rem">The paper and the grade live in SpeedGrader, in another tab. The instructor reads the results here, then goes there to grade.</p></div>
      </div>`;
    const mark = document.querySelector("#panel-pitched [data-testid=mark]");
    const scroller = document.querySelector("#panel-pitched [data-testid=paper]");
    if (scroll && mark && scroller && !scroller.closest("[hidden]")) {
      // Stacked on a small screen, the paper sits below the panel: bring the
      // passage itself into view, which scrolls the page and the paper.
      if (matchMedia("(max-width: 1023px)").matches) {
        mark.scrollIntoView({ block: "center", behavior: motion() });
        return;
      }
      const top = mark.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - scroller.clientHeight / 3;
      scroller.scrollTo({ top: Math.max(0, top), behavior: motion() });
    }
  }

  // Three columns from 1024px; stacked below. Kept here so the layout lives with the view.
  const style = document.createElement("style");
  style.textContent = `
    @media (min-width: 1024px) {
      .grader { grid-template-columns: 17.5rem minmax(0,1fr) 14rem !important; height: 34rem; }
      .grader--built { grid-template-columns: 22rem minmax(0,1fr) !important; }
      .grader__left { border-right: 1px solid var(--border); }
      .grader__right { border-left: 1px solid var(--border); }
    }
    @media (max-width: 1023px) {
      .grader__left, .grader__paper { max-height: 28rem; border-bottom: 1px solid var(--border); }
    }`;
  document.head.appendChild(style);

  document.addEventListener("click", (event) => {
    const q = event.target.closest("[data-question]");
    if (q) {
      const i = Number(q.dataset.question);
      selected = selected === i ? null : i;
      const focused = q.closest('[role="tabpanel"]').id;
      render();
      // Keep focus on the question without undoing the scroll to its passage.
      document.querySelector(`#${focused} [data-question="${i}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (event.target.closest('[data-action="save"]')) document.querySelector("[data-testid=saved]").textContent = "Saved for this sample.";
  });

  AP.ui.header("grading.html");
  tabs(document.querySelector('[role="tablist"]'), () => render(false));
  // The first question starts selected; on load, leave the page where it is.
  render(false);
})();
