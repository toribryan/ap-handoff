/*
 * The instructor's setup, the student's upload-to-quiz flow, and the result
 * the instructor reads. One state object; each view renders from it.
 */
(function () {
  const { escape: e, icon, confidence, formatTime, loadSettings, saveSettings, tabs } = AP.ui;
  const { assignment: A, questions: Q, limits } = AP.data;

  const state = {
    settings: loadSettings(),
    /* idle → uploading → generating → quiz → submitted */
    phase: "idle",
    answers: [],
    seconds: 0,
    /* The submitted attempt, or null to show the sample. */
    attempt: null,
  };
  let timer = null;

  const $ = (sel) => document.querySelector(sel);
  const questions = () => Q.slice(0, state.settings.count);

  // ---------- Setup ----------
  function renderSetup() {
    const s = state.settings;
    $("#panel-setup").innerHTML = `
      <div class="stack-1">
        <p class="t-small muted">${e(A.course)}</p>
        <h2 class="t-heading">${e(A.title)}</h2>
      </div>
      <section class="card" aria-labelledby="setup-title">
        <p id="setup-title" class="t-label muted" style="padding:10px 16px;border-bottom:1px solid var(--border)">AuthorProof for this assignment</p>
        <div class="setting">
          <div class="setting__text">
            <p class="t-strong" id="count-label">Number of questions</p>
            <p class="t-small muted">Each one is generated from the student’s own essay, so no two students get the same quiz.</p>
          </div>
          <div class="row" role="group" aria-labelledby="count-label">
            <button class="btn btn--outline btn--icon" type="button" data-action="fewer" aria-label="Fewer questions" ${s.count <= limits.minCount ? "disabled" : ""}>${icon("minus", 14)}</button>
            <output class="t-strong" aria-live="polite" style="min-width:2ch;text-align:center" data-testid="count">${s.count}</output>
            <button class="btn btn--outline btn--icon" type="button" data-action="more" aria-label="More questions" ${s.count >= limits.maxCount ? "disabled" : ""}>${icon("plus", 14)}</button>
          </div>
        </div>
        <div class="setting">
          <div class="setting__text">
            <p class="t-strong" id="time-label">Time limit</p>
            <p class="t-small muted">Short on purpose. The quiz starts right after upload, before there is time to reread the essay.</p>
          </div>
          <div class="segmented" role="radiogroup" aria-labelledby="time-label">
            ${limits.minutes
              .map(
                (m) =>
                  `<button type="button" role="radio" aria-checked="${s.minutes === m}" data-minutes="${m}">${m} min</button>`
              )
              .join("")}
          </div>
        </div>
        <div class="setting">
          <div class="setting__text">
            <p class="t-strong">Allow a second attempt</p>
            <p class="t-small muted">Lets a student take the quiz once more after submitting.</p>
          </div>
          <label class="row t-small muted"><input type="checkbox" data-action="retakes" ${s.retakes ? "checked" : ""}/> ${s.retakes ? "On" : "Off"}</label>
        </div>
      </section>
      <div class="row-between">
        <p class="t-small muted" data-testid="summary">Students get ${s.count} questions and ${s.minutes} minutes, ${s.retakes ? "with one retake" : "with no retake"}.</p>
        <button class="btn btn--primary" type="button" data-action="to-student">Save and view as the student</button>
      </div>`;
  }

  function changeSettings(next) {
    state.settings = { ...state.settings, ...next };
    saveSettings(state.settings);
    // A new setup is a new quiz: the student starts over and the result goes back to the sample.
    resetStudent();
    state.attempt = null;
    renderSetup();
    renderStudent();
    renderResult();
  }

  // ---------- Student ----------
  function resetStudent() {
    clearInterval(timer);
    state.phase = "idle";
    state.answers = [];
    state.seconds = 0;
  }

  function startUpload() {
    resetStudent();
    state.answers = questions().map(() => null);
    state.phase = "uploading";
    renderStudent();
    // The waits stand in for the upload and for generating the quiz. Seconds, on purpose.
    setTimeout(() => {
      state.phase = "generating";
      renderStudent();
      setTimeout(() => {
        state.phase = "quiz";
        renderStudent();
        timer = setInterval(() => {
          state.seconds = Math.min(state.settings.minutes * 60, state.seconds + 1);
          const left = $("[data-testid=time-left]");
          if (left) left.textContent = formatTime(state.settings.minutes * 60 - state.seconds) + " left";
        }, 1000);
      }, 1800);
    }, 900);
  }

  function renderStudent() {
    const s = state.settings;
    const head = `
      <div class="stack-1">
        <p class="t-small muted">${e(A.course)}</p>
        <h2 class="t-heading">${e(A.title)}</h2>
        <p class="muted measure">${e(A.brief)}</p>
      </div>`;
    let body = "";
    if (state.phase === "idle") {
      body = `
        <div class="card stack-3" style="align-items:center;text-align:center;padding:32px 16px;border-style:dashed">
          <span class="muted">${icon("upload", 20)}</span>
          <p class="muted measure" style="max-width:40ch">Submit your essay here. A short quiz about what you wrote follows on this page.</p>
          <button class="btn btn--primary" type="button" data-action="upload">Upload ${e(A.file)}</button>
        </div>`;
    } else if (state.phase === "uploading" || state.phase === "generating") {
      body = `
        <div class="card card--pad row" role="status">
          <span class="muted">${icon("loader", 16, 'class="spin"')}</span>
          <p>${state.phase === "uploading" ? `Uploading ${e(A.file)}` : "Writing your questions from your essay"}</p>
        </div>`;
    } else if (state.phase === "quiz") {
      const answered = state.answers.filter((a) => a !== null).length;
      body = `
        <form class="stack" data-testid="quiz">
          <div class="card row-between" style="padding:10px 16px">
            <p class="row"><span class="muted">${icon("file", 16)}</span>${e(A.file)} received</p>
            <p class="t-small muted"><span data-testid="answered">${answered} of ${questions().length} answered</span> · <span data-testid="time-left">${formatTime(s.minutes * 60 - state.seconds)} left</span></p>
          </div>
          ${questions()
            .map(
              (q, i) => `
            <fieldset class="card card--pad stack-2" style="margin:0">
              <legend class="t-strong" style="float:left;width:100%;padding:0"><span class="muted" style="margin-right:8px">${i + 1}</span>${e(q.question)}</legend>
              ${q.options
                .map(
                  (o, oi) => `
                <label class="option"><input type="radio" name="q${i}" value="${oi}" ${state.answers[i] === oi ? "checked" : ""}/> <span>${e(o)}</span></label>`
                )
                .join("")}
            </fieldset>`
            )
            .join("")}
          <div class="row" style="justify-content:flex-end">
            <button class="btn btn--primary" type="submit" ${answered === 0 ? "disabled" : ""}>Submit quiz</button>
          </div>
        </form>`;
    } else if (state.phase === "submitted") {
      body = `
        <div class="card card--pad stack-3" style="align-items:flex-start">
          <p class="row t-strong">${icon("check", 16)} Essay and quiz submitted</p>
          <p class="muted measure">Your instructor sees the result beside your essay. It is not a grade, and it does not pass or fail you.</p>
          <div class="row">
            <button class="btn btn--primary" type="button" data-action="to-result">View as the instructor</button>
            ${s.retakes ? '<button class="btn btn--outline" type="button" data-action="upload">Retake</button>' : ""}
          </div>
        </div>`;
    }
    $("#panel-student").innerHTML = head + body;
  }

  function submitQuiz() {
    clearInterval(timer);
    state.attempt = { answers: state.answers.map((a) => (a === null ? -1 : a)), seconds: state.seconds };
    state.phase = "submitted";
    renderStudent();
    renderResult();
  }

  // ---------- Result ----------
  function renderResult() {
    const shown = state.attempt || {
      answers: AP.data.sampleAnswers.slice(0, state.settings.count),
      seconds: AP.data.sampleSeconds,
    };
    const qs = Q.slice(0, shown.answers.length);
    const correct = qs.filter((q, i) => q.answer === shown.answers[i]).length;
    const overview = [
      ["Student", A.student],
      ["Matched the essay", `${correct} of ${qs.length}`],
      ["Confidence", confidence(correct, qs.length)],
      ["Time used", formatTime(shown.seconds)],
      ["Quiz started", "Seconds after upload"],
    ];
    $("#panel-result").innerHTML = `
      <div class="row-between" style="align-items:flex-end">
        <div class="stack-1">
          <p class="t-small muted">${e(A.course)} · beside the submission</p>
          <h2 class="t-heading">AuthorProof result</h2>
        </div>
        <p class="t-small muted" data-testid="result-source">${state.attempt ? "Showing the quiz you just took." : "Showing a sample attempt. Take the quiz as the student to see your own."}</p>
      </div>
      <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))">
        <dl class="card" style="padding:0 16px;height:fit-content;grid-column:span 1">
          ${overview
            .map(
              ([k, v], i) => `
            <div class="row-between" style="padding:10px 0;align-items:baseline;${i ? "border-top:1px solid var(--border)" : ""}">
              <dt class="t-small muted">${e(k)}</dt><dd class="t-strong" style="text-align:right" data-testid="overview-${k.toLowerCase().replace(/\s+/g, "-")}">${e(v)}</dd>
            </div>`
            )
            .join("")}
        </dl>
        <ol class="stack-3" style="grid-column:span 2;min-width:0">
          ${qs
            .map((q, i) => {
              const given = shown.answers[i];
              const ok = given === q.answer;
              return `
            <li class="card card--pad stack-3" data-testid="result-question">
              <div class="row-between">
                <p class="t-label muted">Question ${i + 1}</p>
                <span class="badge ${ok ? "badge--success" : "badge--warning"}">${icon(ok ? "check" : "x", 12)}${ok ? "Matches the essay" : "Does not match"}</span>
              </div>
              <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))">
                <div class="stack-1"><p class="t-small muted">From the essay</p><blockquote class="passage">${e(q.excerpt)}</blockquote></div>
                <div class="stack-1"><p class="t-small muted">Question generated from it</p><p>${e(q.question)}</p></div>
              </div>
              <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));padding-top:12px;border-top:1px solid var(--border)">
                <div class="stack-1"><p class="t-small muted">Student answered</p><p>${given >= 0 ? e(q.options[given]) : "No answer"}</p></div>
                <div class="stack-1"><p class="t-small muted">Assessment</p><p>${e(ok ? q.matches : q.differs)}</p></div>
              </div>
            </li>`;
            })
            .join("")}
        </ol>
      </div>`;
  }

  // ---------- Wiring ----------
  AP.ui.header("flow.html");
  const tabControl = tabs(document.querySelector('[role="tablist"]'));
  renderSetup();
  renderStudent();
  renderResult();

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action],[data-minutes]");
    if (!el) return;
    const s = state.settings;
    if (el.dataset.minutes) return changeSettings({ minutes: Number(el.dataset.minutes) });
    switch (el.dataset.action) {
      case "fewer": return changeSettings({ count: Math.max(limits.minCount, s.count - 1) });
      case "more": return changeSettings({ count: Math.min(limits.maxCount, s.count + 1) });
      case "to-student": return tabControl.select("student");
      case "to-result": return tabControl.select("result");
      case "upload": return startUpload();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches('[data-action="retakes"]')) return changeSettings({ retakes: event.target.checked });
    const m = event.target.name?.match(/^q(\d+)$/);
    if (m) {
      state.answers[Number(m[1])] = Number(event.target.value);
      const answered = state.answers.filter((a) => a !== null).length;
      $("[data-testid=answered]").textContent = `${answered} of ${questions().length} answered`;
      $('[data-testid=quiz] [type=submit]').disabled = answered === 0;
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-testid=quiz]")) {
      event.preventDefault();
      submitQuiz();
    }
  });
})();
