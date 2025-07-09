import { ref, computed } from 'vue';
import type { QuizState, HyligotchiId, QuizResult } from '@/types/quiz';
import { questions, hyligotchis } from '@/data/quiz-data';

export function useQuiz() {
  const state = ref<QuizState>('idle');
  const currentQuestionIndex = ref(0);
  const answers = ref<Record<string, string>>({});
  const scores = ref<Record<HyligotchiId, number>>({
    oracle: 0,
    shapeshifter: 0,
    'wind-whisperer': 0,
    terraformer: 0
  });

  const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
  const totalQuestions = computed(() => questions.length);
  const progress = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
  const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);
  const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1);
  const canProceed = computed(() => !!answers.value[currentQuestion.value?.id]);

  const result = computed<QuizResult | null>(() => {
    if (state.value !== 'completed') return null;
    
    let maxScore = -1;
    let winningArchetype: HyligotchiId = 'oracle';
    
    Object.entries(scores.value).forEach(([archetype, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningArchetype = archetype as HyligotchiId;
      }
    });
    
    return {
      archetype: winningArchetype,
      score: maxScore
    };
  });

  const resultHyligotchi = computed(() => {
    if (!result.value) return null;
    return hyligotchis[result.value.archetype];
  });

  function startQuiz() {
    state.value = 'in-progress';
    currentQuestionIndex.value = 0;
    answers.value = {};
    scores.value = {
      oracle: 0,
      shapeshifter: 0,
      'wind-whisperer': 0,
      terraformer: 0
    };
  }

  function selectAnswer(answerId: string) {
    if (!currentQuestion.value) return;
    answers.value[currentQuestion.value.id] = answerId;
  }

  function nextQuestion() {
    if (!canProceed.value) return;
    
    const question = currentQuestion.value;
    const selectedAnswerId = answers.value[question.id];
    const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
    
    if (selectedAnswer) {
      Object.entries(selectedAnswer.points).forEach(([archetype, points]) => {
        scores.value[archetype as HyligotchiId] += points;
      });
    }
    
    if (isLastQuestion.value) {
      state.value = 'completed';
    } else {
      currentQuestionIndex.value++;
    }
  }

  function previousQuestion() {
    if (isFirstQuestion.value) return;
    
    const prevQuestion = questions[currentQuestionIndex.value - 1];
    const selectedAnswerId = answers.value[prevQuestion.id];
    const selectedAnswer = prevQuestion.answers.find(a => a.id === selectedAnswerId);
    
    if (selectedAnswer) {
      Object.entries(selectedAnswer.points).forEach(([archetype, points]) => {
        scores.value[archetype as HyligotchiId] -= points;
      });
    }
    
    currentQuestionIndex.value--;
  }

  function resetQuiz() {
    state.value = 'idle';
    currentQuestionIndex.value = 0;
    answers.value = {};
    scores.value = {
      oracle: 0,
      shapeshifter: 0,
      'wind-whisperer': 0,
      terraformer: 0
    };
  }

  return {
    state,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isFirstQuestion,
    isLastQuestion,
    canProceed,
    result,
    resultHyligotchi,
    answers,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz
  };
}