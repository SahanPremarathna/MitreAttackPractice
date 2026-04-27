/**
 * activities/technique-quiz.js — Technique Hunter
 *
 * The user is shown a MITRE tactic and must identify which of 4
 * techniques actually belongs to that tactic.
 * 10 questions per round, +10 XP per correct answer.
 */

const TechniqueQuizActivity = (function () {

  // ── Private state ──────────────────────────────────────────────
  const TOTAL_QUESTIONS = 10;

  let questions = [];       // Generated question objects for this round
  let currentQ  = 0;        // 0-based index of current question
  let score     = 0;        // Correct answers this round
  let answered  = false;    // Whether current question has been answered

  // ── Private helpers ────────────────────────────────────────────

  /**
   * Generates TOTAL_QUESTIONS question objects.
   * Each question: { tactic, correctTech, wrongTechs[3] }
   */
  function generateQuestions() {
    const allTechniques = getAllTechniques();
    const questions = [];

    // Use every tactic in random order (repeat cycle if > 14 questions)
    const tacticPool = shuffleArray([...MITRE_DATA.tactics]);

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const tactic = tacticPool[i % tacticPool.length];
      // Pick a random technique from this tactic as the correct answer
      const correctTech = tactic.techniques[
        Math.floor(Math.random() * tactic.techniques.length)
      ];
      // Pick 3 wrong techniques from OTHER tactics
      const otherTechs = allTechniques.filter(
        t => t.tacticId !== tactic.id && t.id !== correctTech.id
      );
      const wrongTechs = getRandomSubset(otherTechs, 3);

      questions.push({ tactic, correctTech, wrongTechs });
    }
    return questions;
  }

  /** Renders the intro screen. */
  function renderIntro() {
    const container = document.getElementById('technique-quiz-content');
    container.innerHTML = `
      <div class="activity-intro">
        <div class="intro-icon">🎯</div>
        <h2 class="intro-title">TECHNIQUE HUNTER</h2>
        <p class="intro-desc">
          A MITRE ATT&CK tactic will be shown. Your mission: identify which
          of the 4 listed techniques actually belongs to that tactic.
          Watch out — wrong answers come from other real tactics!
        </p>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">1</span>
            <span>Read the tactic name and its description carefully</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">2</span>
            <span>Select the technique that belongs to that tactic</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">3</span>
            <span>Feedback is shown after each answer</span>
          </div>
        </div>
        <div class="intro-scoring">
          <span class="scoring-item">✓ Correct answer = +10 XP</span>
          <span class="scoring-item">📋 ${TOTAL_QUESTIONS} questions per round</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="TechniqueQuizActivity.startGame()">
          START HUNT
        </button>
      </div>
    `;
  }

  /** Renders the current question. */
  function renderQuestion() {
    const container = document.getElementById('technique-quiz-content');
    const q = questions[currentQ];
    answered = false;

    // Shuffle choices so correct answer isn't always first
    const choices = shuffleArray([q.correctTech, ...q.wrongTechs]);

    container.innerHTML = `
      <!-- Progress bar -->
      <div id="quiz-progress"></div>

      <!-- Question card -->
      <div class="quiz-card slide-in">
        <div class="quiz-tactic-badge" style="border-color: ${q.tactic.color}">
          <span class="quiz-tactic-icon">${q.tactic.icon}</span>
          <div class="quiz-tactic-info">
            <span class="quiz-tactic-id">${q.tactic.id}</span>
            <span class="quiz-tactic-name">${q.tactic.name}</span>
          </div>
        </div>

        <p class="quiz-question-text">
          Which of the following is a technique used in
          <strong>${q.tactic.name}</strong>?
        </p>

        <div class="quiz-tactic-desc">${q.tactic.description}</div>

        <!-- 4 answer choices -->
        <div class="quiz-choices" id="quiz-choices">
          ${choices.map((tech, idx) => `
            <button class="choice-btn"
                    id="choice-${idx}"
                    onclick="TechniqueQuizActivity.selectAnswer('${tech.id}', '${q.correctTech.id}', ${idx})">
              <span class="choice-letter">${['A','B','C','D'][idx]}</span>
              <div class="choice-content">
                <strong class="choice-tech-name">${tech.name}</strong>
                <span class="choice-tech-id">${tech.id}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    UI.renderProgressBar('quiz-progress', currentQ + 1, TOTAL_QUESTIONS, score);
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    /** Entry point — show intro. */
    start() {
      UI.showScreen('screen-technique-quiz');
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
     * Handles the user selecting an answer.
     * @param {string} selectedId   - ID of the clicked technique
     * @param {string} correctId    - ID of the correct technique
     * @param {number} btnIndex     - Index of the clicked button (0-3) for highlighting
     */
    selectAnswer(selectedId, correctId, btnIndex) {
      if (answered) return;
      answered = true;

      const isCorrect = selectedId === correctId;
      if (isCorrect) score++;

      // Highlight all buttons: correct = green, selected wrong = red
      const choiceButtons = document.querySelectorAll('.choice-btn');
      choiceButtons.forEach((btn, i) => {
        btn.disabled = true;
        const techId = btn.getAttribute('onclick').match(/'(T\d+[\.\d]*)'/)?.[1];
        if (techId === correctId) {
          btn.classList.add('choice-correct');
        } else if (i === btnIndex && !isCorrect) {
          btn.classList.add('choice-wrong');
        }
      });

      // Feedback message
      const q = questions[currentQ];
      const feedbackMsg = isCorrect
        ? `${q.correctTech.name} is indeed used in ${q.tactic.name}.`
        : `The correct technique was: "${q.correctTech.name}" (${q.correctTech.id}).`;

      UI.showAnswerFeedback(isCorrect, feedbackMsg, () => {
        currentQ++;
        if (currentQ < TOTAL_QUESTIONS) {
          renderQuestion();
        } else {
          // Round complete — show results
          UI.showResults(
            score,
            TOTAL_QUESTIONS,
            'Technique Hunter',
            () => { UI.hideModal(); TechniqueQuizActivity.startGame(); },
            () => { UI.hideModal(); App.goHome(); }
          );
        }
      });
    }

  };

})();
