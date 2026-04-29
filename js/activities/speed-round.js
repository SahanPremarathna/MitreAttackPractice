/**
 * activities/speed-round.js — Speed Round
 *
 * 30-second rapid-fire True / False quiz.
 * A statement is shown: "The technique [X] is used in [Tactic Y]."
 * The user answers TRUE or FALSE as fast as possible.
 * Score is based on correct answers within the time limit.
 * +5 XP per correct answer, -1 XP per wrong answer (min 0).
 */

const SpeedRoundActivity = (function () {

  // ── Private state ──────────────────────────────────────────────
  const ROUND_SECONDS = 30;  // Duration of the speed round

  let allTechs    = [];      // Flat array of all techniques
  let timer       = null;    // setInterval reference
  let timeLeft    = ROUND_SECONDS;
  let score       = 0;       // Correct answers
  let wrong       = 0;       // Wrong answers
  let total       = 0;       // Total questions answered
  let running     = false;   // Is the round active?
  let xpEarned    = 0;       // XP accumulated this round

  // ── Private helpers ────────────────────────────────────────────

  /**
   * Generates a single True/False statement.
   * 50% chance of a true statement, 50% false.
   * @returns {{ statement: string, isTrue: boolean, hint: string }}
   */
  function generateStatement() {
    const useTrue = Math.random() < 0.5;

    if (useTrue) {
      // Pick a real technique-tactic pairing
      const tech = allTechs[Math.floor(Math.random() * allTechs.length)];
      return {
        statement: `"${tech.name}" (${tech.id}) is a technique used in the <strong>${tech.tacticName}</strong> tactic.`,
        isTrue: true,
        hint: `TRUE — ${tech.name} belongs to ${tech.tacticName}.`
      };
    } else {
      // Pick a technique and a DIFFERENT random tactic for a false statement
      const tech   = allTechs[Math.floor(Math.random() * allTechs.length)];
      const tactics = MITRE_DATA.tactics.filter(t => t.id !== tech.tacticId);
      const wrongTactic = tactics[Math.floor(Math.random() * tactics.length)];
      return {
        statement: `"${tech.name}" (${tech.id}) is a technique used in the <strong>${wrongTactic.name}</strong> tactic.`,
        isTrue: false,
        hint: `FALSE — ${tech.name} belongs to ${tech.tacticName}, NOT ${wrongTactic.name}.`
      };
    }
  }

  /** Updates the timer display bar and text. */
  function updateTimer() {
    const timerBar = document.getElementById('sr-timer-bar');
    const timerText = document.getElementById('sr-timer-text');
    if (!timerBar || !timerText) return;

    const pct = (timeLeft / ROUND_SECONDS) * 100;
    timerBar.style.width = pct + '%';

    // Color changes as time runs out
    if (timeLeft <= 10) {
      timerBar.style.background = '#ff0000';
      timerBar.classList.add('timer-pulse');
    } else if (timeLeft <= 20) {
      timerBar.style.background = '#ff8c00';
    } else {
      timerBar.style.background = 'var(--yellow-primary)';
    }

    timerText.textContent = timeLeft + 's';
  }

  /** Loads a new statement into the display without re-rendering the whole screen. */
  function loadNextStatement() {
    const q = generateStatement();
    const stmtEl  = document.getElementById('sr-statement');
    const hintEl  = document.getElementById('sr-hint');

    if (!stmtEl) return;

    // Store the answer on the element for the button handlers
    stmtEl.dataset.isTrue = String(q.isTrue);
    stmtEl.dataset.hint   = q.hint;
    stmtEl.innerHTML = q.statement;

    // Reset hint and button states
    if (hintEl) hintEl.textContent = '';

    const trueBtn  = document.getElementById('sr-btn-true');
    const falseBtn = document.getElementById('sr-btn-false');
    if (trueBtn)  { trueBtn.className  = 'sr-answer-btn sr-true-btn';  trueBtn.disabled  = false; }
    if (falseBtn) { falseBtn.className = 'sr-answer-btn sr-false-btn'; falseBtn.disabled = false; }
  }

  /** Updates the live score/stats display. */
  function updateStats() {
    const scoreEl = document.getElementById('sr-score');
    const xpEl    = document.getElementById('sr-xp');
    const totalEl = document.getElementById('sr-total');
    if (scoreEl)  scoreEl.textContent = score;
    if (xpEl)     xpEl.textContent    = '+' + xpEarned;
    if (totalEl)  totalEl.textContent = total;
  }

  /** Called when the 30-second timer expires. */
  function endRound() {
    running = false;
    clearInterval(timer);
    timer = null;

    // Disable answer buttons
    const trueBtn  = document.getElementById('sr-btn-true');
    const falseBtn = document.getElementById('sr-btn-false');
    if (trueBtn)  trueBtn.disabled  = true;
    if (falseBtn) falseBtn.disabled = true;

    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const rank = xpEarned >= 100 ? '🔴 ELITE' : xpEarned >= 60 ? '🟡 SKILLED' : xpEarned >= 30 ? '🔵 ANALYST' : '⚪ RECRUIT';

    App.addScore(xpEarned);

    setTimeout(() => {
      UI.showModal(`
        <div class="results-modal">
          <div class="results-rank-badge">${xpEarned >= 80 ? '🔴' : xpEarned >= 50 ? '🟡' : '⚪'}</div>
          <h2 class="results-title">SPEED ROUND OVER</h2>

          <div class="results-score-ring">
            <span class="results-pct">${accuracy}%</span>
            <span class="results-pct-label">accuracy</span>
          </div>

          <div class="results-stats">
            <div class="res-stat">
              <span class="res-stat-val">${score}</span>
              <span class="res-stat-label">Correct</span>
            </div>
            <div class="res-stat">
              <span class="res-stat-val">${wrong}</span>
              <span class="res-stat-label">Wrong</span>
            </div>
            <div class="res-stat">
              <span class="res-stat-val">${total}</span>
              <span class="res-stat-label">Answered</span>
            </div>
          </div>

          <div class="results-rank">
            <span class="rank-label">RANK:</span>
            <span class="rank-name">${rank}</span>
          </div>

          <div class="results-stats" style="margin-top: 12px">
            <div class="res-stat">
              <span class="res-stat-val">+${xpEarned}</span>
              <span class="res-stat-label">XP Earned</span>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn btn-primary" onclick="UI.hideModal(); SpeedRoundActivity.startRound()">
              ▶ PLAY AGAIN
            </button>
            <button class="btn btn-secondary" onclick="UI.hideModal(); App.goHome()">
              ⌂ HOME
            </button>
          </div>
        </div>
      `);
    }, 500);
  }

  /** Renders the intro screen. */
  function renderIntro() {
    const container = document.getElementById('speed-round-content');
    container.innerHTML = `
      <div class="activity-intro">
        <div class="intro-icon">⚡</div>
        <h2 class="intro-title">SPEED ROUND</h2>
        <p class="intro-desc">
          30 seconds. Rapid-fire True or False questions on MITRE ATT&CK.
          A statement appears — is the technique correctly matched to its tactic?
          Answer as fast as you can. Every correct answer earns XP!
        </p>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">⏱</span>
            <span><strong>30 seconds</strong> on the clock</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">✓</span>
            <span>Correct answer = <strong>+5 XP</strong></span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">✗</span>
            <span>Wrong answer = <strong>-1 XP</strong> (min 0)</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">⚡</span>
            <span>No time limit per question — just the global 30s timer</span>
          </div>
        </div>
        <button class="btn btn-primary btn-large" onclick="SpeedRoundActivity.startRound()">
          ▶ START ROUND
        </button>
      </div>
    `;
  }

  /** Renders the main game UI (timer + statement + buttons). */
  function renderGameUI() {
    const container = document.getElementById('speed-round-content');
    container.innerHTML = `
      <!-- Timer bar -->
      <div class="sr-timer-section">
        <div class="sr-timer-label">
          <span>TIME</span>
          <span id="sr-timer-text">${ROUND_SECONDS}s</span>
        </div>
        <div class="sr-timer-track">
          <div class="sr-timer-bar" id="sr-timer-bar"></div>
        </div>
      </div>

      <!-- Live stats -->
      <div class="sr-live-stats">
        <div class="sr-stat-item">
          <span class="sr-stat-val" id="sr-score">0</span>
          <span class="sr-stat-label">Correct</span>
        </div>
        <div class="sr-stat-item">
          <span class="sr-stat-val" id="sr-total">0</span>
          <span class="sr-stat-label">Answered</span>
        </div>
        <div class="sr-stat-item xp-counter">
          <span class="sr-stat-val" id="sr-xp">+0</span>
          <span class="sr-stat-label">XP</span>
        </div>
      </div>

      <!-- Statement card -->
      <div class="sr-statement-card">
        <div class="sr-statement-label">TRUE or FALSE?</div>
        <div class="sr-statement" id="sr-statement">Loading...</div>
        <div class="sr-hint" id="sr-hint"></div>
      </div>

      <!-- Answer buttons -->
      <div class="sr-answer-row">
        <button class="sr-answer-btn sr-true-btn" id="sr-btn-true"
                onclick="SpeedRoundActivity.answer(true)">
          ✓ TRUE
        </button>
        <button class="sr-answer-btn sr-false-btn" id="sr-btn-false"
                onclick="SpeedRoundActivity.answer(false)">
          ✗ FALSE
        </button>
      </div>
    `;
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /** Entry point — show intro screen. */
    start() {
      if (timer) { clearInterval(timer); timer = null; }
      running = false;
      UI.showScreen('screen-speed-round');
      renderIntro();
    },

    /** Starts the actual timed round. */
    startRound() {
      allTechs = getAllTechniques();
      score    = 0;
      wrong    = 0;
      total    = 0;
      xpEarned = 0;
      timeLeft = ROUND_SECONDS;
      running  = true;

      renderGameUI();
      loadNextStatement();
      updateTimer();
      updateStats();

      // Start countdown
      timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          endRound();
        }
      }, 1000);
    },

    /**
     * Handles the user pressing TRUE or FALSE.
     * @param {boolean} userAnswer - true if user pressed TRUE, false for FALSE
     */
    answer(userAnswer) {
      if (!running) return;

      const stmtEl   = document.getElementById('sr-statement');
      const hintEl   = document.getElementById('sr-hint');
      const trueBtn  = document.getElementById('sr-btn-true');
      const falseBtn = document.getElementById('sr-btn-false');

      if (!stmtEl) return;

      const isTrue   = stmtEl.dataset.isTrue === 'true';
      const hint     = stmtEl.dataset.hint;
      const isCorrect = (userAnswer === isTrue);

      total++;

      if (isCorrect) {
        score++;
        xpEarned += 5;
        if (hintEl) { hintEl.className = 'sr-hint hint-correct'; hintEl.textContent = '✓ ' + hint; }
        if (trueBtn  &&  userAnswer) trueBtn.classList.add('btn-flash-correct');
        if (falseBtn && !userAnswer) falseBtn.classList.add('btn-flash-correct');
      } else {
        wrong++;
        xpEarned = Math.max(0, xpEarned - 1);
        if (hintEl) { hintEl.className = 'sr-hint hint-wrong'; hintEl.textContent = '✗ ' + hint; }
        if (userAnswer && trueBtn)   trueBtn.classList.add('btn-flash-wrong');
        if (!userAnswer && falseBtn) falseBtn.classList.add('btn-flash-wrong');
      }

      updateStats();

      // Briefly disable buttons, then load next statement
      if (trueBtn)  trueBtn.disabled  = true;
      if (falseBtn) falseBtn.disabled = true;

      setTimeout(() => {
        if (running) loadNextStatement();
      }, 700);
    }

  };

})();
