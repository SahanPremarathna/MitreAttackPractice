/**
 * app.js — Main Application Controller
 *
 * Bootstraps the app, renders the home screen, manages global XP score
 * (persisted in localStorage), and routes to activity modules.
 *
 * This module is loaded LAST — all activity modules must be loaded before it.
 */

const App = (function () {

  // ── Activity registry ──────────────────────────────────────────
  // Maps activity keys to their module objects and metadata.
  const ACTIVITIES = [
    {
      key:         'study',
      title:       'Study Mode',
      icon:        '📚',
      desc:        'Learn all 14 tactics and their techniques at your own pace. Browse interactive flashcards with full descriptions and countermeasures.',
      tags:        ['Beginner Friendly', 'All Levels'],
      tagClass:    'tag-beginner',
      module:      () => StudyActivity,
      accentColor: '#00c853'
    },
    {
      key:         'lifecycle',
      title:       'Lifecycle Challenge',
      icon:        '🔢',
      desc:        'Put the 14 MITRE ATT&CK tactics in the correct kill chain order. Can you sequence the full attack lifecycle from Recon to Impact?',
      tags:        ['All Levels', '+10 XP / correct'],
      tagClass:    'tag-intermediate',
      module:      () => LifecycleActivity,
      accentColor: '#ffd700'
    },
    {
      key:         'technique-quiz',
      title:       'Technique Hunter',
      icon:        '🎯',
      desc:        'A tactic is shown — identify which technique belongs to it from 4 choices. Wrong answers come from real techniques in other tactics.',
      tags:        ['Intermediate', '+10 XP / correct'],
      tagClass:    'tag-intermediate',
      module:      () => TechniqueQuizActivity,
      accentColor: '#ff6b35'
    },
    {
      key:         'tactic-mapper',
      title:       'Tactic Mapper',
      icon:        '🧩',
      desc:        'A technique is shown — identify which tactic it belongs to. Think about the adversary\'s goal when they use this technique.',
      tags:        ['Intermediate', '+10 XP / correct'],
      tagClass:    'tag-intermediate',
      module:      () => TacticMapperActivity,
      accentColor: '#9400d3'
    },
    {
      key:         'countermeasure',
      title:       'Defense Builder',
      icon:        '🛡️',
      desc:        'An attack technique is shown — select the correct mitigation. Think like a blue teamer and build your defensive knowledge.',
      tags:        ['Advanced', '+10 XP / correct'],
      tagClass:    'tag-advanced',
      module:      () => CountermeasureActivity,
      accentColor: '#4169e1'
    },
    {
      key:         'speed-round',
      title:       'Speed Round',
      icon:        '⚡',
      desc:        '30 seconds. Rapid-fire True/False questions on all ATT&CK knowledge. How many can you answer correctly before time runs out?',
      tags:        ['All Levels', '+5 XP / correct'],
      tagClass:    'tag-speed',
      module:      () => SpeedRoundActivity,
      accentColor: '#ff0000'
    }
  ];

  // ── Private state ──────────────────────────────────────────────
  const STORAGE_KEY = 'mitre_trainer_score';
  let totalScore = 0;

  // ── Private helpers ────────────────────────────────────────────

  /** Loads persisted score from localStorage. */
  function loadScore() {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    totalScore = isNaN(saved) ? 0 : saved;
    updateScoreDisplay();
  }

  /** Saves score to localStorage. */
  function saveScore() {
    localStorage.setItem(STORAGE_KEY, String(totalScore));
  }

  /** Updates the XP display in the header. */
  function updateScoreDisplay() {
    const el = document.getElementById('total-score');
    if (el) el.textContent = totalScore.toLocaleString();
  }

  /** Renders the activity cards on the home screen. */
  function renderActivityGrid() {
    const grid = document.getElementById('activities-grid');
    if (!grid) return;

    grid.innerHTML = ACTIVITIES.map(act => `
      <div class="activity-card" onclick="App.startActivity('${act.key}')"
           style="--accent: ${act.accentColor}">
        <div class="act-card-icon">${act.icon}</div>
        <div class="act-card-body">
          <h3 class="act-card-title">${act.title}</h3>
          <p class="act-card-desc">${act.desc}</p>
          <div class="act-card-tags">
            ${act.tags.map(t => `<span class="act-tag ${act.tagClass}">${t}</span>`).join('')}
          </div>
        </div>
        <div class="act-card-arrow">→</div>
      </div>
    `).join('');
  }

  /** Renders the operator progress stats on the home screen. */
  function renderProgressGrid() {
    const grid = document.getElementById('progress-grid');
    if (!grid) return;

    const rank = getOperatorRank(totalScore);

    grid.innerHTML = `
      <div class="progress-stat">
        <span class="prog-val">${totalScore.toLocaleString()}</span>
        <span class="prog-label">Total XP</span>
      </div>
      <div class="progress-stat">
        <span class="prog-val" style="color: ${rank.color}">${rank.name}</span>
        <span class="prog-label">Operator Rank</span>
      </div>
      <div class="progress-stat">
        <span class="prog-val">${MITRE_DATA.tactics.length}</span>
        <span class="prog-label">Tactics to Master</span>
      </div>
      <div class="progress-stat">
        <span class="prog-val">${getAllTechniques().length}</span>
        <span class="prog-label">Techniques in Database</span>
      </div>
    `;
  }

  /**
   * Returns rank info based on total XP.
   * @param {number} xp
   */
  function getOperatorRank(xp) {
    if (xp >= 2000) return { name: 'ELITE OPERATOR',   color: '#ff0000' };
    if (xp >= 1000) return { name: 'SENIOR ANALYST',   color: '#ff8c00' };
    if (xp >= 500)  return { name: 'THREAT HUNTER',    color: '#ffd700' };
    if (xp >= 200)  return { name: 'SOC ANALYST',      color: '#32cd32' };
    if (xp >= 50)   return { name: 'BLUE TEAMER',      color: '#4169e1' };
    return               { name: 'RECRUIT',         color: '#888888' };
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /**
     * Bootstraps the entire application.
     * Called on DOMContentLoaded.
     */
    init() {
      loadScore();
      renderActivityGrid();
      renderProgressGrid();

      // Home button in header
      document.getElementById('btn-home')?.addEventListener('click', () => App.goHome());
      document.getElementById('logo-home-btn')?.addEventListener('click', () => App.goHome());

      // Close modal on overlay click
      document.getElementById('modal-overlay')?.addEventListener('click', function (e) {
        // Only close if clicking the overlay itself, not the modal box
        if (e.target === this) UI.hideModal();
      });

      UI.showScreen('screen-home');
      console.log('%c[ATT&CK TRAINER] Initialized. Tactics loaded: ' + MITRE_DATA.tactics.length, 'color: #ff0000; font-weight: bold');
    },

    /**
     * Navigates to the home screen and re-renders progress stats.
     */
    goHome() {
      UI.hideModal();
      UI.showScreen('screen-home');
      renderProgressGrid();  // Refresh after XP changes
    },

    /**
     * Launches an activity by key.
     * @param {string} actKey - Activity key (e.g., 'study', 'lifecycle')
     */
    startActivity(actKey) {
      const actDef = ACTIVITIES.find(a => a.key === actKey);
      if (!actDef) {
        console.error('[ATT&CK TRAINER] Unknown activity key:', actKey);
        return;
      }
      // Resolve and call the activity module's start() method
      actDef.module().start();
    },

    /**
     * Adds XP to the global score, persists to localStorage,
     * and updates the header display. Called by activity modules.
     * @param {number} amount
     */
    addScore(amount) {
      if (amount <= 0) return;
      totalScore += amount;
      saveScore();
      updateScoreDisplay();

      // Flash the score display
      const scoreEl = document.getElementById('total-score');
      if (scoreEl) {
        scoreEl.classList.add('score-flash');
        setTimeout(() => scoreEl.classList.remove('score-flash'), 600);
      }
    },

    /**
     * Resets the global score to 0 (for testing / reset button).
     */
    resetScore() {
      totalScore = 0;
      saveScore();
      updateScoreDisplay();
      renderProgressGrid();
      UI.toast('Score reset to 0', 'info');
    }

  };

})();


// ── Bootstrap ──────────────────────────────────────────────────────
// Initialize the app after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => App.init());
