const SPACE = /\s+/g;
const LEADING_CAPITAL = /^\p{Lu}/u;

/**
 * Normalises only differences that do not change the grammatical notion being
 * assessed. Accents, apostrophes, agreement and conjugation are deliberately
 * left intact.
 */
export function normalizeQuizAnswer(value, { ignoreInitialCapital = true } = {}) {
  const compact = String(value ?? '').trim().replace(SPACE, ' ');
  if (!ignoreInitialCapital || !LEADING_CAPITAL.test(compact)) return compact;
  return compact[0].toLocaleLowerCase('fr-FR') + compact.slice(1);
}

const result = (status, question, answer, extra = {}) => ({
  status,
  answer,
  expectedAnswer: question.modelAnswer || question.acceptedAnswers?.[0] || '',
  explanation: question.explanation || question.rule || '',
  rule: question.rule || '',
  hasOtherValidAnswers: Boolean(question.hasOtherValidAnswers || question.flexible),
  ...extra,
});

/**
 * Deterministic correction for MINI-QUIZ questions.
 *
 * A question may provide acceptedAnswers for short answers and an optional
 * validateAnswer function for a grammar-specific check. Open questions that
 * cannot be decided safely are returned as "review", never as a wrong answer.
 */
export function correctQuizAnswer(question, rawAnswer) {
  const answer = normalizeQuizAnswer(rawAnswer, question.normalization);
  if (!answer) return result('incorrect', question, answer, {
    incorrectElement: 'Aucune réponse n’a été saisie.',
    correction: question.modelAnswer || question.acceptedAnswers?.[0] || '',
  });

  const accepted = (question.acceptedAnswers || []).map((item) => normalizeQuizAnswer(item, question.normalization));
  if (accepted.includes(answer)) return result('correct', question, answer);

  if (typeof question.validateAnswer === 'function') {
    const validation = question.validateAnswer(answer);
    if (validation?.status === 'correct') return result('correct', question, answer, validation);
    if (validation?.status === 'review') return result('review', question, answer, validation);
    if (validation?.status === 'incorrect') return result('incorrect', question, answer, validation);
  }

  // An open formulation can be grammatically valid without matching the model.
  if (question.flexible) return result('review', question, answer, {
    incorrectElement: 'La formulation nécessite une vérification grammaticale.',
  });

  return result('incorrect', question, answer, {
    incorrectElement: `« ${rawAnswer} » ne correspond pas à la forme attendue.`,
    correction: question.modelAnswer || question.acceptedAnswers?.[0] || '',
  });
}

export const isCorrectQuizResult = (value) => value?.status === 'correct';
