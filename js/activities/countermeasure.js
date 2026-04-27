/**
 * activities/countermeasure.js — Defense Builder
 *
 * The user is shown a technique and must select the correct
 * mitigation/countermeasure from 4 options. Tests defensive knowledge.
 * 10 questions per round, +10 XP per correct answer.
 */

const CountermeasureActivity = (function () {

  // ── Private state ──────────────────────────────────────────────
  const TOTAL_QUESTIONS = 10;

  let questions = [];
  let currentQ  = 0;
  let score     = 0;
  let answered  = false;

  // ── Private helpers ────────────────────────────────────────────

  /**
   * Generates question objects.
   * Each question: { tech, tacticName, correctMit, wrongMits[3] }
   * Only techniques with at least 1 mitigation are used.
   */
  function generateQuestions() {
    const allTechs = getAllTechniques().filter(t => t.mitigations && t.mitigations.length > 0);
    const allMits  = getAllMitigations();
    const result   = [];

    const techPool = shuffleArray([...allTechs]);

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const tech = techPool[i % techPool.length];
      // Pick one of this technique's mitigations as the correct answer
      const correctMit = tech.mitigations[
        Math.floor(Math.random() * tech.mitigations.length)
      ];

      // 3 wrong mitigations from other techniques
      const wrongPool = allMits.filter(
        m => m.techniqueId !== tech.id && m.id !== correctMit.id
      );
      const wrongMits = getRandomSubset(wrongPool, 3);

      result.push({ tech, tacticName: tech.tacticName, correctMit, wrongMits });
    }
    return result;
  }

  /** Renders the intro screen. */
  function renderIntro() {
    const container = document.getElementById('countermeasure-content');
    container.innerHTML = `
      <div class="activity-intro">
        <div class="intro-icon">🛡️</div>
        <h2 class="intro-title">DEFENSE BUILDER</h2>
        <p class="intro-desc">
          An attack technique will be shown. Your mission: identify the correct
          mitigation or countermeasure that defenders should implement to counter
          this technique. Think like a blue teamer!
        </p>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">1</span>
            <span>Read the technique name and description carefully</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">2</span>
            <span>Select the countermeasure that best defends against this technique</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">3</span>
            <span>Wrong answers are real mitigations — but for different techniques</span>
          </div>
        </div>
        <div class="intro-scoring">
          <span class="scoring-item">✓ Correct answer = +10 XP</span>
          <span class="scoring-item">🛡️ ${TOTAL_QUESTIONS} questions per round</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="CountermeasureActivity.startGame()">
          BUILD DEFENSES
        </button>
      </div>
    `;
  }

  /** Renders the current question. */
  function renderQuestion() {
    const container = document.getElementById('countermeasure-content');
    const q = questions[currentQ];
    answered = false;

    const choices = shuffleArray([q.correctMit, ...q.wrongMits]);

    container.innerHTML = `
      <div id="quiz-progress-cm"></div>

      <div class="quiz-card slide-in">

        <!-- Attack technique context -->
        <div class="attack-context">
          <div class="attack-context-label">⚠️ ATTACK TECHNIQUE</div>
          <div class="attack-tactic-tag">${q.tacticName}</div>
          <div class="attack-tech-header">
            <span class="attack-tech-id">${q.tech.id}</span>
            ${UI.difficultyBadge(q.tech.difficulty)}
          </div>
          <h3 class="attack-tech-name">${q.tech.name}</h3>
          <p class="attack-tech-desc">${q.tech.description}</p>
        </div>

        <p class="quiz-question-text">
          Which <strong>mitigation / countermeasure</strong> best defends against this technique?
        </p>

        <!-- 4 mitigation choices -->
        <div class="quiz-choices defense-choices" id="quiz-choices-cm">
          ${choices.map((mit, idx) => `
            <button class="choice-btn defense-choice"
                    id="cm-choice-${idx}"
                    onclick="CountermeasureActivity.selectAnswer('${mit.id}_${idx}', '${q.correctMit.id}', ${idx}, '${mit.id}')">
              <span class="choice-letter">${['A','B','C','D'][idx]}</span>
              <div class="choice-content">
                <strong class="choice-tech-name">${mit.name}</strong>
                <span class="choice-tech-id">${mit.id}</span>
                <p class="choice-mit-desc">${mit.description}</p>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    UI.renderProgressBar('quiz-progress-cm', currentQ + 1, TOTAL_QUESTIONS, score);
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /** Entry point. */
    start() {
      UI.showScreen('screen-countermeasure');
      renderIntro();
    },

    /** Generates questions and shows first one. */
    startGame() {
      questions = generateQuestions();
      currentQ  = 0;
      score     = 0;
      renderQuestion();
    },

    /**
     * Handles the user selecting a mitigation.
     * @param {string} uniqueId    - Unique key to match the chosen button
     * @param {string} correctMitId - ID of the correct mitigation
     * @param {number} btnIndex     - Button index for visual feedback
     * @param {string} selectedMitId - The actual mitigation ID selected
     */
    selectAnswer(uniqueId, correctMitId, btnIndex, selectedMitId) {
      if (answered) return;
      answered = true;

      const isCorrect = selectedMitId === correctMitId;
      if (isCorrect) score++;

      // Highlight all buttons
      const buttons = document.querySelectorAll('#quiz-choices-cm .choice-btn');
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        // Extract the last argument (mitId) from onclick
        const match = btn.getAttribute('onclick').match(/'([^']+)'\s*\)$/);
        const mid = match ? match[1] : null;
        if (mid === correctMitId) {
          btn.classList.add('choice-correct');
        } else if (i === btnIndex && !isCorrect) {
          btn.classList.add('choice-wrong');
        }
      });

      const q = questions[currentQ];
      const feedbackMsg = isCorrect
        ? `"${q.correctMit.name}" is the right defense — ${q.correctMit.description.split('.')[0]}.`
        : `The correct defense is "${q.correctMit.name}" (${q.correctMit.id}).`;

      UI.showAnswerFeedback(isCorrect, feedbackMsg, () => {
        currentQ++;
        if (currentQ < TOTAL_QUESTIONS) {
          renderQuestion();
        } else {
          UI.showResults(
            score,
            TOTAL_QUESTIONS,
            'Defense Builder',
            () => { UI.hideModal(); CountermeasureActivity.startGame(); },
            () => { UI.hideModal(); App.goHome(); }
          );
        }
      });
    }

  };

})();
