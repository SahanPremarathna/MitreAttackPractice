/**
 * activities/lifecycle.js — Lifecycle Challenge
 *
 * The user is shown all 14 MITRE ATT&CK tactics in shuffled order.
 * They must click them in the correct kill chain order (1 → 14).
 * As they click, each card is numbered.  Submitting reveals
 * which cards are in the correct position (green) or wrong (red).
 *
 * Scoring: +10 XP per correct position, perfect = +20 XP bonus.
 */

const LifecycleActivity = (function () {

  // ── Private state ──────────────────────────────────────────────
  let shuffledTactics = [];   // The 14 tactics in the shuffled display order
  let clickOrder = [];        // tacticIds in the order the user clicked them
  let submitted = false;      // Whether the user has submitted their answer
  let flashTimers = {};       // Map tacticId → timeout handle, so we can cancel mid-flash

  // ── Private helpers ────────────────────────────────────────────

  /**
   * Briefly flashes a card green (correct position) or red (wrong position).
   * The card already has .lc-selected at the time this is called.
   * A CSS animation overrides the selected colours then fades back.
   *
   * @param {string}  tacticId
   * @param {boolean} isCorrect - true → green flash, false → red flash
   */
  function flashCard(tacticId, isCorrect) {
    const card = document.getElementById(`lc-card-${tacticId}`);
    if (!card) return;

    // Cancel any in-progress flash so we can restart cleanly
    if (flashTimers[tacticId]) {
      clearTimeout(flashTimers[tacticId]);
      card.classList.remove('lc-flash-correct', 'lc-flash-wrong');
      // Force reflow so the browser treats the next classList.add as a fresh animation
      void card.offsetWidth;
    }

    const cls = isCorrect ? 'lc-flash-correct' : 'lc-flash-wrong';
    card.classList.add(cls);

    // Remove the animation class after it finishes so the card returns to normal selected state
    flashTimers[tacticId] = setTimeout(() => {
      card.classList.remove(cls);
      delete flashTimers[tacticId];
    }, 850);
  }

  /** Clears all pending flash timeouts (used on reset / new game). */
  function clearAllFlashTimers() {
    Object.keys(flashTimers).forEach(id => clearTimeout(flashTimers[id]));
    flashTimers = {};
  }

  /** Renders the intro / instruction screen. */
  function renderIntro() {
    const container = document.getElementById('lifecycle-content');
    container.innerHTML = `
      <div class="activity-intro">
        <div class="intro-icon">🔢</div>
        <h2 class="intro-title">LIFECYCLE CHALLENGE</h2>
        <p class="intro-desc">
          The MITRE ATT&CK Framework describes the 14 tactics an adversary
          follows in a typical attack — from initial reconnaissance all the
          way through to final impact. Do you know the correct order?
        </p>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">1</span>
            <span>Click tactics <strong>in the order they appear</strong> in the kill chain (1 → 14)</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">2</span>
            <span>Selected cards show their click order number</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">3</span>
            <span><strong>Green flash</strong> = correct position so far, <strong>red flash</strong> = wrong position</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">4</span>
            <span>Use <strong>UNDO LAST</strong> to remove your most recent selection</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">5</span>
            <span>Click <strong>CHECK ORDER</strong> once all 14 are placed</span>
          </div>
        </div>
        <div class="intro-scoring">
          <span class="scoring-item">✓ Correct position = +10 XP</span>
          <span class="scoring-item">⭐ All correct = +20 XP bonus</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="LifecycleActivity.startGame()">
          START CHALLENGE
        </button>
      </div>
    `;
  }

  /** Renders the main game board with shuffled tactic cards. */
  function renderBoard() {
    const container = document.getElementById('lifecycle-content');

    container.innerHTML = `
      <!-- Status bar -->
      <div class="lifecycle-status">
        <span class="lifecycle-selected">
          Selected: <strong id="lc-selected-count">0</strong> / 14
        </span>
        <div class="lifecycle-actions">
          <button class="btn btn-secondary btn-sm" onclick="LifecycleActivity.resetBoard()">↺ RESET</button>
          <button class="btn-undo" id="lc-undo-btn"
                  onclick="LifecycleActivity.undoLast()" disabled>
            ⎌ UNDO LAST
          </button>
          <button class="btn btn-primary btn-sm" id="lc-check-btn"
                  onclick="LifecycleActivity.checkOrder()" disabled>
            CHECK ORDER
          </button>
        </div>
      </div>

      <!-- Instruction reminder -->
      <p class="lifecycle-hint">
        Click tactics in the order they appear in the MITRE ATT&CK kill chain (Tactic 1 first → Tactic 14 last)
      </p>

      <!-- Tactic cards grid -->
      <div class="lifecycle-grid" id="lifecycle-grid">
        ${shuffledTactics.map(tactic => `
          <div class="lc-card" id="lc-card-${tactic.id}"
               data-tactic-id="${tactic.id}"
               onclick="LifecycleActivity.toggleCard('${tactic.id}')">
            <div class="lc-card-number" id="lc-num-${tactic.id}">?</div>
            <div class="lc-card-icon">${tactic.icon}</div>
            <div class="lc-card-name">${tactic.name}</div>
            <div class="lc-card-hint">${tactic.shortDesc}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /** Updates the visual state of all cards based on clickOrder array. */
  function updateCardStates() {
    shuffledTactics.forEach(tactic => {
      const card = document.getElementById(`lc-card-${tactic.id}`);
      const numEl = document.getElementById(`lc-num-${tactic.id}`);
      if (!card || !numEl) return;

      const pos = clickOrder.indexOf(tactic.id);  // -1 if not yet clicked
      if (pos === -1) {
        // Not selected — clear all selection classes
        card.classList.remove('lc-selected', 'lc-placed-correct');
        numEl.textContent = '?';
      } else {
        // Selected — show the 1-based click position
        card.classList.add('lc-selected');
        numEl.textContent = pos + 1;

        // Keep the card green if it is currently sitting at its correct lifecycle position
        const isCorrectPos = tactic.order === (pos + 1);
        card.classList.toggle('lc-placed-correct', isCorrectPos);
      }
    });

    // Update counter and enable/disable buttons
    const countEl = document.getElementById('lc-selected-count');
    if (countEl) countEl.textContent = clickOrder.length;

    const checkBtn = document.getElementById('lc-check-btn');
    if (checkBtn) checkBtn.disabled = clickOrder.length < 14;

    const undoBtn = document.getElementById('lc-undo-btn');
    if (undoBtn) undoBtn.disabled = clickOrder.length === 0;
  }

  /** Reveals correct/incorrect positions after submission. */
  function revealResults() {
    let correctCount = 0;

    shuffledTactics.forEach(tactic => {
      const card = document.getElementById(`lc-card-${tactic.id}`);
      const numEl = document.getElementById(`lc-num-${tactic.id}`);
      if (!card) return;

      const userPos = clickOrder.indexOf(tactic.id) + 1;  // 1-based
      const correctPos = tactic.order;

      if (userPos === correctPos) {
        card.classList.add('lc-correct');
        correctCount++;
      } else {
        card.classList.add('lc-wrong');
        // Show what the correct position was
        numEl.innerHTML = `
          <span class="lc-user-pos">${userPos}</span>
          <span class="lc-correct-pos">→${correctPos}</span>
        `;
      }

      // Disable further clicking after reveal
      card.style.pointerEvents = 'none';
    });

    return correctCount;
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /**
     * Entry point — show the intro screen.
     * Called by App.startActivity('lifecycle').
     */
    start() {
      submitted = false;
      clickOrder = [];
      UI.showScreen('screen-lifecycle');
      renderIntro();
    },

    /** Starts the actual game after the intro. */
    startGame() {
      clearAllFlashTimers();
      submitted = false;
      clickOrder = [];
      shuffledTactics = shuffleArray([...MITRE_DATA.tactics]);
      renderBoard();
    },

    /**
     * Handles a card click.
     * Unselected card → select it (push to end, flash green/red based on position correctness).
     * Already-selected card → deselect it (remove from wherever it sits in the order).
     * @param {string} tacticId
     */
    toggleCard(tacticId) {
      if (submitted) return;

      const pos = clickOrder.indexOf(tacticId);
      if (pos === -1) {
        // Add to the end and assign it position clickOrder.length + 1
        clickOrder.push(tacticId);

        // Flash green if the user placed this tactic at its correct lifecycle position,
        // red otherwise. e.g. clicking "Reconnaissance" as the 1st card is correct.
        const tactic = MITRE_DATA.tactics.find(t => t.id === tacticId);
        const isCorrectPosition = tactic && tactic.order === clickOrder.length;
        flashCard(tacticId, isCorrectPosition);
      } else {
        // Already selected — clicking it again deselects it (removes from the order)
        clickOrder.splice(pos, 1);
      }

      updateCardStates();
    },

    /** Resets the board back to all-unselected. */
    resetBoard() {
      clearAllFlashTimers();
      // Strip any lingering flash classes from all cards
      shuffledTactics.forEach(t => {
        const card = document.getElementById(`lc-card-${t.id}`);
        if (card) card.classList.remove('lc-flash-correct', 'lc-flash-wrong');
      });
      clickOrder = [];
      submitted = false;
      updateCardStates();
    },

    /**
     * Removes the most recently selected card from clickOrder.
     * The card snaps back to unselected state instantly with no flash.
     */
    undoLast() {
      if (submitted || clickOrder.length === 0) return;

      const removedId = clickOrder.pop();

      // Cancel any flash that might still be animating on the removed card
      if (flashTimers[removedId]) {
        clearTimeout(flashTimers[removedId]);
        delete flashTimers[removedId];
      }
      const card = document.getElementById(`lc-card-${removedId}`);
      if (card) card.classList.remove('lc-flash-correct', 'lc-flash-wrong');

      updateCardStates();
    },

    /** Checks the submitted order and shows results. */
    checkOrder() {
      if (clickOrder.length < 14) return;
      submitted = true;

      const correctCount = revealResults();
      const isPerfect = correctCount === 14;
      const baseXP = correctCount * 10;
      const bonusXP = isPerfect ? 20 : 0;
      const totalXP = baseXP + bonusXP;

      // Show results modal after a brief reveal pause
      setTimeout(() => {
        UI.showModal(`
          <div class="results-modal">
            <div class="results-rank-badge">${isPerfect ? '🔴' : correctCount >= 10 ? '🟡' : '⚪'}</div>
            <h2 class="results-title">LIFECYCLE ${isPerfect ? 'MASTERED' : 'RESULTS'}</h2>

            <div class="results-score-ring">
              <span class="results-pct">${correctCount}/14</span>
              <span class="results-pct-label">correct</span>
            </div>

            <div class="results-stats">
              <div class="res-stat">
                <span class="res-stat-val">${correctCount}</span>
                <span class="res-stat-label">Correct</span>
              </div>
              <div class="res-stat">
                <span class="res-stat-val">${14 - correctCount}</span>
                <span class="res-stat-label">Wrong</span>
              </div>
              <div class="res-stat">
                <span class="res-stat-val">+${totalXP}</span>
                <span class="res-stat-label">XP Earned${bonusXP > 0 ? ' ⭐' : ''}</span>
              </div>
            </div>

            ${isPerfect ? '<div class="perfect-badge">PERFECT ORDER! Elite operator status.</div>' : ''}

            <div class="results-tip">
              <strong>Lifecycle order:</strong>
              Recon → Resource Dev → Initial Access → Execution → Persistence →
              Privilege Escalation → Defense Evasion → Credential Access → Discovery →
              Lateral Movement → Collection → C2 → Exfiltration → Impact
            </div>

            <div class="results-actions">
              <button class="btn btn-primary" onclick="UI.hideModal(); LifecycleActivity.startGame()">
                ▶ TRY AGAIN
              </button>
              <button class="btn btn-secondary" onclick="UI.hideModal(); App.goHome()">
                ⌂ HOME
              </button>
            </div>
          </div>
        `);

        App.addScore(totalXP);
      }, 1000);
    }

  };

})();
