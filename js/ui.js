/**
 * ui.js — Shared UI Utilities
 *
 * Provides screen switching, modal management, progress bars,
 * answer feedback overlays, and other UI helpers used by all activity modules.
 */

const UI = (function () {

  // ── Internal helpers ─────────────────────────────────────────

  /** All registered screen IDs for fast lookup */
  const SCREEN_IDS = [
    'screen-home',
    'screen-study',
    'screen-lifecycle',
    'screen-technique-quiz',
    'screen-tactic-mapper',
    'screen-countermeasure',
    'screen-speed-round'
  ];

  // ── Public API ───────────────────────────────────────────────
  return {

    /**
     * Shows the specified screen and hides all others.
     * @param {string} screenId - e.g. 'screen-study'
     */
    showScreen(screenId) {
      SCREEN_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      const target = document.getElementById(screenId);
      if (target) {
        target.classList.add('active');
        // Scroll to top of screen
        target.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    },

    // ── Modal system ──────────────────────────────────────────

    /**
     * Displays the global modal with the given HTML content.
     * @param {string} htmlContent - HTML to render inside the modal box
     */
    showModal(htmlContent) {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      content.innerHTML = htmlContent;
      overlay.classList.remove('hidden');
      // Animate in
      overlay.style.opacity = '0';
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '1';
      });
    },

    /** Hides the global modal. */
    hideModal() {
      const overlay = document.getElementById('modal-overlay');
      overlay.style.opacity = '0';
      setTimeout(() => overlay.classList.add('hidden'), 300);
    },

    // ── Score feedback ─────────────────────────────────────────

    /**
     * Shows a brief feedback overlay (correct / incorrect) over the active quiz area.
     * Automatically disappears after `duration` ms, then calls `callback`.
     *
     * @param {boolean}  isCorrect
     * @param {string}   message    - Short explanation shown to the user
     * @param {Function} callback   - Called after feedback disappears
     * @param {number}   duration   - Milliseconds to show feedback (default 1800)
     */
    showAnswerFeedback(isCorrect, message, callback, duration = 1800) {
      // Remove any existing feedback
      const old = document.getElementById('answer-feedback');
      if (old) old.remove();

      const div = document.createElement('div');
      div.id = 'answer-feedback';
      div.className = `answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
      div.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-label">${isCorrect ? 'CORRECT' : 'INCORRECT'}</div>
        <div class="feedback-msg">${message}</div>
      `;
      document.getElementById('main-content').appendChild(div);

      // Slide in
      requestAnimationFrame(() => div.classList.add('feedback-visible'));

      setTimeout(() => {
        div.classList.remove('feedback-visible');
        setTimeout(() => {
          div.remove();
          if (callback) callback();
        }, 400);
      }, duration);
    },

    // ── Quiz progress bar ──────────────────────────────────────

    /**
     * Renders a progress bar into a container element.
     * @param {string} containerId  - ID of the container element
     * @param {number} current      - 1-based current question number
     * @param {number} total        - Total questions
     * @param {number} score        - Current score
     */
    renderProgressBar(containerId, current, total, score) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const pct = Math.round(((current - 1) / total) * 100);
      container.innerHTML = `
        <div class="progress-bar-wrap">
          <div class="progress-info">
            <span class="progress-q">Question ${current} / ${total}</span>
            <span class="progress-score">Score: <strong>${score}</strong></span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    },

    // ── Results modal ──────────────────────────────────────────

    /**
     * Displays the end-of-activity results modal with XP earned.
     *
     * @param {number}   score      - Final score
     * @param {number}   max        - Maximum possible score
     * @param {string}   activityName
     * @param {Function} onPlayAgain
     * @param {Function} onHome
     */
    showResults(score, max, activityName, onPlayAgain, onHome) {
      const pct = Math.round((score / max) * 100);
      const xpEarned = score * 10;
      const rank = UI._getRank(pct);

      const html = `
        <div class="results-modal">
          <div class="results-rank-badge">${rank.icon}</div>
          <h2 class="results-title">MISSION ${pct >= 60 ? 'COMPLETE' : 'FAILED'}</h2>
          <div class="results-activity">${activityName}</div>

          <div class="results-score-ring">
            <span class="results-pct">${pct}%</span>
            <span class="results-pct-label">accuracy</span>
          </div>

          <div class="results-stats">
            <div class="res-stat">
              <span class="res-stat-val">${score}</span>
              <span class="res-stat-label">Correct</span>
            </div>
            <div class="res-stat">
              <span class="res-stat-val">${max - score}</span>
              <span class="res-stat-label">Wrong</span>
            </div>
            <div class="res-stat">
              <span class="res-stat-val">+${xpEarned}</span>
              <span class="res-stat-label">XP Earned</span>
            </div>
          </div>

          <div class="results-rank">
            <span class="rank-label">OPERATOR RANK:</span>
            <span class="rank-name" style="color:${rank.color}">${rank.name}</span>
          </div>

          <div class="results-actions">
            <button class="btn btn-primary" onclick="(${onPlayAgain.toString()})()">▶ PLAY AGAIN</button>
            <button class="btn btn-secondary" onclick="(${onHome.toString()})()">⌂ HOME</button>
          </div>
        </div>
      `;

      UI.showModal(html);

      // Award XP globally
      App.addScore(xpEarned);
    },

    /**
     * Returns rank info based on percentage score.
     * @private
     */
    _getRank(pct) {
      if (pct === 100) return { name: 'ELITE OPERATOR', icon: '🔴', color: '#ff0000' };
      if (pct >= 90)  return { name: 'SENIOR ANALYST', icon: '🟠', color: '#ff8c00' };
      if (pct >= 80)  return { name: 'THREAT HUNTER',  icon: '🟡', color: '#ffd700' };
      if (pct >= 70)  return { name: 'SOC ANALYST',    icon: '🟢', color: '#32cd32' };
      if (pct >= 60)  return { name: 'BLUE TEAMER',    icon: '🔵', color: '#4169e1' };
      return           { name: 'RECRUIT',          icon: '⚪', color: '#888888' };
    },

    // ── Toast notification ─────────────────────────────────────

    /**
     * Shows a small toast notification at the bottom of the screen.
     * @param {string} message
     * @param {'info'|'success'|'error'} type
     */
    toast(message, type = 'info') {
      const old = document.getElementById('ui-toast');
      if (old) old.remove();

      const toast = document.createElement('div');
      toast.id = 'ui-toast';
      toast.className = `ui-toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add('toast-visible'));
      setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
      }, 2500);
    },

    // ── Difficulty badge ───────────────────────────────────────

    /**
     * Returns an HTML string for a difficulty badge.
     * @param {string} difficulty - 'Beginner' | 'Intermediate' | 'Advanced'
     */
    difficultyBadge(difficulty) {
      const map = {
        'Beginner':    { cls: 'diff-beginner',    label: '● Beginner' },
        'Intermediate':{ cls: 'diff-intermediate', label: '●● Intermediate' },
        'Advanced':    { cls: 'diff-advanced',     label: '●●● Advanced' }
      };
      const d = map[difficulty] || map['Beginner'];
      return `<span class="diff-badge ${d.cls}">${d.label}</span>`;
    },

    // ── Animate element in ─────────────────────────────────────

    /**
     * Adds a CSS class to trigger an entry animation, then removes it.
     * @param {HTMLElement} el
     * @param {string}      className - CSS animation class to apply
     * @param {number}      duration  - Duration before removing class
     */
    animateIn(el, className = 'slide-in', duration = 600) {
      el.classList.add(className);
      setTimeout(() => el.classList.remove(className), duration);
    }

  };

})();
