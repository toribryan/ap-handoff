/*
 * The briefed flow's quiz email in five states. Each reads the instructor's
 * settings from the setup view, so the question count and time limit match.
 */
(function () {
  const { escape: e, icon, loadSettings } = AP.ui;
  const { assignment: A } = AP.data;
  const settings = loadSettings();

  const NOT_A_GRADE = {
    lead: "Why you’re getting this.",
    text: "Your instructor turned on AuthorProof for this assignment. It is not a plagiarism check, and it does not pass or fail you. It confirms you can speak to what you wrote.",
  };
  const quizRow = (s, fresh) => [
    "Quiz",
    `${s.count} ${fresh ? "new questions from the same essay" : "questions about your essay"} · ${s.minutes}-minute limit`,
  ];

  /*
   * tone maps to the Notice component. Closed stays Neutral on purpose: a
   * missed quiz is for the instructor to follow up, not a failure.
   */
  const STATES = [
    {
      id: "ready", label: "Ready",
      when: "Sent about ten minutes after the essay is submitted.",
      subject: "Your comprehension quiz is ready", title: "Your comprehension quiz is ready",
      tone: "info", icon: "clock", notice: "Open it within 12 hours of submitting your essay.",
      rows: (s) => [quizRow(s), ["Open by", "Tomorrow, 11:55 AM"]],
      cta: { label: "Open the quiz in Canvas", note: "In the briefed flow, this is where the student leaves the email and goes to find the quiz in Canvas." },
      body: [{ lead: "What to expect.", text: "A few short questions about what your essay argues and the sources it uses. Your answers go to your instructor beside your essay." }, NOT_A_GRADE],
    },
    {
      id: "reminder", label: "Reminder",
      when: "Sent two hours before the window closes, only if the quiz has not been started.",
      subject: "Reminder: your quiz closes in 2 hours", title: "Two hours left to take your quiz",
      tone: "warning", icon: "clock", notice: "Your quiz closes today at 11:55 AM.",
      rows: (s) => [quizRow(s), ["Closes", "Today, 11:55 AM"]],
      cta: { label: "Open the quiz in Canvas", note: "Same destination as the first email. The reminder only changes the time left." },
      body: [{ lead: "Short on purpose.", text: "No studying needed. The questions are about your own essay, so you only need to remember what you wrote." }, NOT_A_GRADE],
    },
    {
      id: "received", label: "Received",
      when: "Sent as soon as the quiz is submitted.",
      subject: "We received your quiz answers", title: "Your answers are in",
      tone: "success", icon: "check", notice: "Nothing else to do for this assignment.",
      rows: (s) => [["Answered", `${s.count} of ${s.count} questions`], ["Submitted", "Today, 12:07 AM"]],
      cta: null,
      body: [
        { lead: "What happens next.", text: "Your instructor sees your answers beside your essay, along with the passages each question came from." },
        { lead: "Not a grade.", text: "AuthorProof does not pass or fail you. If your instructor has questions, they will talk to you about your essay." },
      ],
    },
    {
      id: "retake", label: "Second attempt",
      when: "Sent when the instructor allows a second attempt, after the first is submitted.",
      subject: "A second attempt is open", title: "You can take the quiz once more",
      tone: "info", icon: "clock", notice: "Your instructor allowed a second attempt. It is optional.",
      rows: (s) => [quizRow(s, true), ["Open by", "Tomorrow, 11:55 AM"]],
      cta: { label: "Start the second attempt", note: "In the briefed flow this opens a new quiz in Canvas. Both attempts appear in the instructor’s report." },
      body: [{ lead: "New questions.", text: "The second attempt asks about different parts of your essay, so it is not a repeat of the first." }, NOT_A_GRADE],
    },
    {
      id: "closed", label: "Window closed",
      when: "Sent once, when the window ends without a submitted quiz.",
      subject: "Your quiz window has closed", title: "Your quiz window has closed",
      tone: "neutral", icon: "x", notice: "The quiz was not taken. Your essay is still submitted.",
      rows: () => [["Closed", "Today, 11:55 AM"], ["Your essay", "Submitted and with your instructor"]],
      cta: { label: "View the assignment in Canvas", note: "The student lands on the assignment. Only the instructor can reopen the quiz.", outline: true },
      body: [{ lead: "What happens now.", text: "Your instructor can see the quiz was not taken and can reopen it. If something got in the way, let them know." }, NOT_A_GRADE],
    },
  ];

  let current = "ready";
  let opened = false;
  const root = document.getElementById("emails");

  function render() {
    const v = STATES.find((s) => s.id === current);
    const details = [["Course", A.course], ["Assignment", A.title], ...v.rows(settings)];
    root.innerHTML = `
      <div class="stack-2">
        <div class="segmented" role="radiogroup" aria-label="Email state" style="flex-wrap:wrap;background:var(--card)">
          ${STATES.map((s) => `<button type="button" role="radio" aria-checked="${s.id === current}" data-state="${s.id}" style="flex:1">${e(s.label)}</button>`).join("")}
        </div>
        <p class="t-small muted" data-testid="when">${e(v.when)}${v.id === "retake" && !settings.retakes ? " Second attempts are off in Setup, so this one would not send." : ""}</p>
      </div>
      <article class="card" style="overflow:hidden" aria-label="Email preview">
        <dl style="display:grid;grid-template-columns:4.5rem minmax(0,1fr);gap:4px 12px;padding:12px 16px;border-bottom:1px solid var(--border)" class="t-small">
          <dt class="muted">From</dt><dd>AuthorProof, for ${e(A.course)}</dd>
          <dt class="muted">To</dt><dd>${e(A.student)}</dd>
          <dt class="muted">Subject</dt><dd class="t-strong" data-testid="subject">${e(v.subject)}</dd>
        </dl>
        <div class="stack" style="max-width:32rem;margin:0 auto;padding:28px 16px;gap:20px">
          <p class="t-strong">AuthorProof</p>
          <div class="stack-2">
            <h2 class="t-heading">${e(v.title)}</h2>
            <p class="notice notice--${v.tone}" data-testid="notice">${icon(v.icon, 16)}<span>${e(v.notice)}</span></p>
          </div>
          <dl class="stack-3">
            ${details.map(([k, val]) => `<div class="detail"><dt>${e(k)}</dt><dd>${e(val)}</dd></div>`).join("")}
          </dl>
          ${v.cta ? `
            <div class="stack-2">
              <button class="btn btn--lg btn--block ${v.cta.outline ? "btn--outline" : "btn--primary"}" type="button" data-action="cta">${e(v.cta.label)}</button>
              ${opened ? `<p class="t-small muted" role="status">${e(v.cta.note)}</p>` : ""}
            </div>` : ""}
          <div class="stack-3 muted" style="padding-top:16px;border-top:1px solid var(--border)">
            ${v.body.map((b) => `<p><span class="t-strong" style="color:var(--foreground)">${e(b.lead)}</span> ${e(b.text)}</p>`).join("")}
          </div>
        </div>
      </article>`;
  }

  root.addEventListener("click", (event) => {
    const state = event.target.closest("[data-state]");
    if (state) { current = state.dataset.state; opened = false; render(); return; }
    if (event.target.closest('[data-action="cta"]')) { opened = true; render(); }
  });

  AP.ui.header("emails.html");
  render();
})();
