/**
 * activities/tactic-mapper.js — Tactic Mapper
 *
 * The user is shown a technique name + description and must identify
 * which of 4 tactics it belongs to. Tests deeper knowledge of
 * technique-to-tactic relationships.
 * 10 questions per round, +10 XP per correct answer.
 */

const TacticMapperActivity = (function () {

  // ── Private state ──────────────────────────────────────────────
  const TOTAL_QUESTIONS = 10;

  let questions = [];
  let currentQ  = 0;
  let score     = 0;
  let answered  = false;

  // ── Private helpers ────────────────────────────────────────────

  /**
   * Generates question objects.
   * Each question: { technique (with tacticName/tacticId), correctTactic, wrongTactics[3] }
   */
  function generateQuestions() {
    const allTechs   = getAllTechniques();
    const allTactics = MITRE_DATA.tactics;
    const result     = [];

    const techPool = shuffleArray([...allTechs]);

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const tech = techPool[i % techPool.length];
      const correctTactic = allTactics.find(t => t.id === tech.tacticId);

      // 3 wrong tactics (different from correct)
      const wrongTactics = getRandomSubset(
        allTactics.filter(t => t.id !== correctTactic.id),
        3
      );

      result.push({ tech, correctTactic, wrongTactics });
    }
    return result;
  }

  /** Renders the intro screen. */
  function renderIntro() {
    const container = document.getElementById('tactic-mapper-content');
    container.innerHTML = `
      <div class="activity-intro">
        <div class="intro-icon">🧩</div>
        <h2 class="intro-title">TACTIC MAPPER</h2>
        <p class="intro-desc">
          You'll be shown a technique name and description. Your mission:
          identify which MITRE ATT&CK tactic it belongs to. This tests your
          understanding of how techniques map to adversary goals.
        </p>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">1</span>
            <span>Read the technique name and description</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">2</span>
            <span>Select the tactic that this technique belongs to</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">3</span>
            <span>Consider the <em>goal</em> the technique achieves for the attacker</span>
          </div>
        </div>
        <div class="intro-scoring">
          <span class="scoring-item">✓ Correct answer = +10 XP</span>
          <span class="scoring-item">📋 ${TOTAL_QUESTIONS} questions per round</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="TacticMapperActivity.startGame()">
          START MAPPING
        </button>
      </div>
    `;
  }

  /** Renders the current question. */
  function renderQuestion() {
    const container = document.getElementById('tactic-mapper-content');
    const q = questions[currentQ];
    answered = false;

    // Shuffle the 4 tactic choices
    const choices = shuffleArray([q.correctTactic, ...q.wrongTactics]);

    container.innerHTML = `
      <!-- Progress bar -->
      <div id="quiz-progress-tm"></div>

      <!-- Question card -->
      <div class="quiz-card slide-in">

        <!-- Technique display -->
        <div class="technique-display">
          <div class="tech-display-header">
            <span class="tech-display-id">${q.tech.id}</span>
            ${UI.difficultyBadge(q.tech.difficulty)}
          </div>
          <h3 class="tech-display-name">${q.tech.name}</h3>
          <p class="tech-display-desc">${q.tech.description}</p>
        </div>

        <p class="quiz-question-text">
          Which <strong>MITRE ATT&CK tactic</strong> does this technique belong to?
        </p>

        <!-- 4 tactic choices -->
        <div class="quiz-choices" id="quiz-choices-tm">
          ${choices.map((tactic, idx) => `
            <button class="choice-btn tactic-choice"
                    id="tc-choice-${idx}"
                    onclick="TacticMapperActivity.selectAnswer('${tactic.id}', '${q.correctTactic.id}', ${idx})"
                    style="--tactic-color: ${tactic.color}">
              <span class="choice-letter">${['A','B','C','D'][idx]}</span>
              <div class="choice-content">
                <div class="tactic-choice-header">
                  <span class="tactic-choice-icon">${tactic.icon}</span>
                  <strong class="choice-tech-name">${tactic.name}</strong>
                </div>
                <span class="choice-tech-id">${tactic.id} · Order ${tactic.order}</span>
                <span class="tactic-choice-hint">${tactic.shortDesc}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    UI.renderProgressBar('quiz-progress-tm', currentQ + 1, TOTAL_QUESTIONS, score);
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /** Entry point. */
    start() {
      UI.showScreen('screen-tactic-mapper');
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
     * Handles the user selecting a tactic answer.
     * @param {string} selectedId  - ID of chosen tactic
     * @param {string} correctId   - ID of correct tactic
     * @param {number} btnIndex    - Button index for highlighting
     */
    selectAnswer(selectedId, correctId, btnIndex) {
      if (answered) return;
      answered = true;

      const isCorrect = selectedId === correctId;
      if (isCorrect) score++;

      // Highlight choices
      const buttons = document.querySelectorAll('#quiz-choices-tm .choice-btn');
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        // Extract tacticId from onclick attribute
        const match = btn.getAttribute('onclick').match(/'(TA\d+)'/);
        const tid = match ? match[1] : null;
        if (tid === correctId) {
          btn.classList.add('choice-correct');
        } else if (i === btnIndex && !isCorrect) {
          btn.classList.add('choice-wrong');
        }
      });

      const q = questions[currentQ];
      const feedbackMsg = isCorrect
        ? `${q.tech.name} belongs to ${q.correctTactic.name} — it achieves ${q.correctTactic.shortDesc.toLowerCase()}.`
        : `${q.tech.name} belongs to: "${q.correctTactic.name}" (${q.correctTactic.id}) — ${q.correctTactic.shortDesc}.`;

      UI.showAnswerFeedback(isCorrect, feedbackMsg, () => {
        currentQ++;
        if (currentQ < TOTAL_QUESTIONS) {
          renderQuestion();
        } else {
          UI.showResults(
            score,
            TOTAL_QUESTIONS,
            'Tactic Mapper',
            () => { UI.hideModal(); TacticMapperActivity.startGame(); },
            () => { UI.hideModal(); App.goHome(); }
          );
        }
      });
    }

  };

})();
