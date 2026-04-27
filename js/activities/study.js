/**
 * activities/study.js — Study Mode (Flashcards)
 *
 * Lets the user browse all 14 MITRE ATT&CK tactics and their techniques
 * at their own pace. Two views:
 *   1. Tactic overview — flip card showing tactic info front/back
 *   2. Technique drill-down — modal with full technique + mitigations
 *
 * No scoring in study mode; it is pure learning.
 */

const StudyActivity = (function () {

  // ── Private state ─────────────────────────────────────────────
  let currentTacticIndex = 0;  // Which tactic is currently shown (0–13)
  let isFlipped = false;        // Whether the flashcard is showing the back

  // ── Private helpers ───────────────────────────────────────────

  /**
   * Renders the main study view (tactic flashcard + navigation).
   */
  function renderStudy() {
    const container = document.getElementById('study-content');
    const tactics = MITRE_DATA.tactics;
    const tactic = tactics[currentTacticIndex];

    container.innerHTML = `
      <!-- Tactic progress indicator -->
      <div class="study-progress">
        <span class="study-counter">${currentTacticIndex + 1} / ${tactics.length}</span>
        <div class="study-dots">
          ${tactics.map((_, i) => `
            <span class="study-dot ${i === currentTacticIndex ? 'dot-active' : i < currentTacticIndex ? 'dot-done' : ''}"
                  onclick="StudyActivity.jumpTo(${i})" title="${tactics[i].name}"></span>
          `).join('')}
        </div>
      </div>

      <!-- Flashcard — click to flip -->
      <div class="flashcard-container">
        <div class="flashcard ${isFlipped ? 'flipped' : ''}" id="flashcard" onclick="StudyActivity.flipCard()">

          <!-- FRONT: Tactic overview -->
          <div class="flashcard-face flashcard-front">
            <div class="card-order-badge">TACTIC ${tactic.order} / 14</div>
            <div class="card-icon">${tactic.icon}</div>
            <div class="card-id">${tactic.id}</div>
            <h2 class="card-name">${tactic.name}</h2>
            <p class="card-short-desc">${tactic.shortDesc}</p>
            <div class="card-tech-count">
              <span class="tech-count-num">${tactic.techniques.length}</span>
              <span class="tech-count-label">techniques</span>
            </div>
            <div class="card-flip-hint">[ CLICK TO FLIP ]</div>
          </div>

          <!-- BACK: Full description + technique list -->
          <div class="flashcard-face flashcard-back">
            <div class="card-back-header">
              <span class="card-id">${tactic.id}</span>
              <h2 class="card-name">${tactic.name}</h2>
            </div>
            <p class="card-description">${tactic.description}</p>
            <h3 class="card-tech-title">KEY TECHNIQUES</h3>
            <ul class="card-tech-list">
              ${tactic.techniques.map(t => `
                <li class="card-tech-item" onclick="StudyActivity.showTechnique('${tactic.id}', '${t.id}', event)">
                  <span class="tech-item-id">${t.id}</span>
                  <span class="tech-item-name">${t.name}</span>
                  <span class="tech-item-arrow">→</span>
                </li>
              `).join('')}
            </ul>
            <div class="card-flip-hint">[ CLICK CARD TO FLIP BACK ]</div>
          </div>

        </div>
      </div>

      <!-- Navigation controls -->
      <div class="study-nav">
        <button class="btn btn-secondary study-nav-btn" onclick="StudyActivity.prev()"
                ${currentTacticIndex === 0 ? 'disabled' : ''}>
          ← PREV
        </button>

        <div class="study-nav-center">
          <span class="study-tactic-name">${tactic.name}</span>
        </div>

        <button class="btn btn-primary study-nav-btn" onclick="StudyActivity.next()"
                ${currentTacticIndex === tactics.length - 1 ? 'disabled' : ''}>
          NEXT →
        </button>
      </div>

      <!-- Quick-jump tactic grid -->
      <div class="study-tactic-grid">
        <h3 class="section-label">JUMP TO TACTIC</h3>
        <div class="tactic-quick-grid">
          ${tactics.map((t, i) => `
            <button class="tactic-quick-btn ${i === currentTacticIndex ? 'quick-active' : ''}"
                    onclick="StudyActivity.jumpTo(${i})"
                    style="--tactic-color: ${t.color}">
              <span class="quick-num">${t.order}</span>
              <span class="quick-name">${t.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Public API ────────────────────────────────────────────────
  return {

    /**
     * Initializes and starts Study Mode.
     * Called by App.startActivity('study').
     */
    start() {
      currentTacticIndex = 0;
      isFlipped = false;
      UI.showScreen('screen-study');
      renderStudy();
      UI.toast('Study Mode — click a card to flip, click a technique to learn more', 'info');
    },

    /** Navigate to the previous tactic. */
    prev() {
      if (currentTacticIndex > 0) {
        currentTacticIndex--;
        isFlipped = false;
        renderStudy();
      }
    },

    /** Navigate to the next tactic. */
    next() {
      if (currentTacticIndex < MITRE_DATA.tactics.length - 1) {
        currentTacticIndex++;
        isFlipped = false;
        renderStudy();
      }
    },

    /** Jump directly to a tactic by index. */
    jumpTo(index) {
      currentTacticIndex = index;
      isFlipped = false;
      renderStudy();
    },

    /** Toggles the flashcard flip state. */
    flipCard() {
      isFlipped = !isFlipped;
      const card = document.getElementById('flashcard');
      if (card) card.classList.toggle('flipped', isFlipped);
    },

    /**
     * Shows a technique detail modal.
     * Prevents click from propagating to the card flip handler.
     *
     * @param {string} tacticId
     * @param {string} techId
     * @param {Event}  event
     */
    showTechnique(tacticId, techId, event) {
      // Stop the click from also flipping the card
      if (event) event.stopPropagation();

      const tactic = MITRE_DATA.tactics.find(t => t.id === tacticId);
      const tech   = tactic?.techniques.find(t => t.id === techId);
      if (!tech) return;

      const mitigationsHtml = tech.mitigations.map(m => `
        <div class="mitigation-card">
          <div class="mit-header">
            <span class="mit-id">${m.id}</span>
            <strong class="mit-name">${m.name}</strong>
          </div>
          <p class="mit-desc">${m.description}</p>
        </div>
      `).join('');

      UI.showModal(`
        <div class="technique-modal">
          <button class="modal-close-btn" onclick="UI.hideModal()">✕ CLOSE</button>

          <div class="tech-modal-header">
            <span class="tech-modal-id">${tech.id}</span>
            ${UI.difficultyBadge(tech.difficulty)}
          </div>

          <h2 class="tech-modal-name">${tech.name}</h2>
          <div class="tech-modal-tactic">
            Part of: <strong>${tactic.name}</strong> (${tactic.id})
          </div>

          <div class="tech-modal-section">
            <h3 class="modal-section-title">📋 DESCRIPTION</h3>
            <p class="tech-modal-desc">${tech.description}</p>
          </div>

          <div class="tech-modal-section">
            <h3 class="modal-section-title">🛡️ MITIGATIONS</h3>
            ${mitigationsHtml || '<p class="no-data">No mitigations listed for this technique.</p>'}
          </div>
        </div>
      `);
    }

  };

})();
