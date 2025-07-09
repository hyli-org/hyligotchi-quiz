<template>
  <div v-if="state === 'in-progress'" class="quiz-container">
    <div class="quiz-card">
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
          :aria-label="`Question ${currentQuestionIndex + 1} of ${totalQuestions}`"
          role="progressbar"
          :aria-valuenow="currentQuestionIndex + 1"
          :aria-valuemin="1"
          :aria-valuemax="totalQuestions"
        />
      </div>
    </div>

    <div class="quiz-content">
      <div class="question-section">
        <h2 class="question-text">{{ currentQuestion.prompt }}</h2>
      </div>

      <div class="answers-section" role="radiogroup" :aria-labelledby="`question-${currentQuestion.id}`">
        <button
          v-for="answer in currentQuestion.answers"
          :key="answer.id"
          class="answer-card"
          :class="{ selected: answers[currentQuestion.id] === answer.id }"
          @click="selectAnswer(answer.id)"
          role="radio"
          :aria-checked="answers[currentQuestion.id] === answer.id"
        >
          {{ answer.label }}
        </button>
      </div>

      <div class="navigation-section">
        <button
          class="nav-button ghost"
          :disabled="isFirstQuestion"
          @click="previousQuestion"
        >
          Back
        </button>
        <button
          class="nav-button primary"
          :disabled="!canProceed"
          @click="nextQuestion"
        >
          {{ isLastQuestion ? 'Finish' : 'Next' }}
        </button>
      </div>
    </div>
    </div>
  </div>

  <div v-else-if="state === 'completed'" class="completion-container" :data-result="resultHyligotchi?.id">
    <div class="result-content">
      <div class="result-image-container animate-element" style="--animation-order: 1">
        <div class="result-sticker" :style="getResultStickerStyle()">
          <img :src="getResultImage(resultHyligotchi?.id || '')" :alt="resultHyligotchi?.name" class="result-image" />
        </div>
      </div>
      
      <h2 class="result-title animate-element" style="--animation-order: 2">You are a {{ resultHyligotchi?.name }}!</h2>
      <p class="result-description animate-element" style="--animation-order: 3">{{ resultHyligotchi?.description }}</p>

      <button @click="shareToTwitter" class="share-on-x-button animate-element" style="--animation-order: 4">
        Share on X
      </button>

      <div class="action-section animate-element" style="--animation-order: 5">
        <button @click="handlePlayAgain" class="play-again-button">
          Play Again
        </button>
        <button @click="copyLink" class="copy-link-button">
          Copy Link
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useQuiz } from '@/composables/useQuiz';

const emit = defineEmits<{
  goHome: []
}>();

const {
  state,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progress,
  isFirstQuestion,
  isLastQuestion,
  canProceed,
  resultHyligotchi,
  answers,
  startQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  resetQuiz
} = useQuiz();

onMounted(() => {
  // Only start quiz if not already started
  if (state.value === 'idle') {
    startQuiz();
  }
  window.addEventListener('keydown', handleKeyboard);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
});

function handleKeyboard(e: KeyboardEvent) {
  if (state.value !== 'in-progress') return;
  
  if (e.key === 'ArrowLeft' && !isFirstQuestion.value) {
    previousQuestion();
  } else if (e.key === 'ArrowRight' && canProceed.value) {
    nextQuestion();
  } else if ((e.key === 'Enter' || e.key === ' ') && canProceed.value) {
    e.preventDefault();
    nextQuestion();
  }
}

function getResultImage(id: string): string {
  const images: Record<string, string> = {
    'oracle': '/blue.jpg',
    'shapeshifter': '/green.jpg',
    'wind-whisperer': '/yellow.jpg',
    'terraformer': '/pink.jpg'
  };
  return images[id] || '/blue.jpg';
}

function shareToTwitter() {
  const text = `I'm a ${resultHyligotchi.value?.name}! ${resultHyligotchi.value?.description} Which Hyligotchi are you?`;
  const url = window.location.href;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}


function copyLink() {
  navigator.clipboard.writeText(window.location.href);
}

function handlePlayAgain() {
  resetQuiz();
  emit('goHome');
}

function getResultStickerStyle() {
  if (!resultHyligotchi.value) return {};
  
  const baseColor = resultHyligotchi.value.color;
  return {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    boxShadow: `0 20px 40px ${baseColor}40, 0 0 60px ${baseColor}20`
  };
}


defineExpose({
  resetQuiz
});
</script>

<style scoped>
.quiz-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  animation: fadeInScale 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.completion-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: backgroundFadeIn 600ms cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}

/* Dynamic background gradients based on result */
.completion-container[data-result="oracle"] {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #4c1d95 50%, #6366f1 75%, #818cf8 100%);
}

.completion-container[data-result="shapeshifter"] {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 25%, #4ade80 50%, #86efac 75%, #bbf7d0 100%);
}

.completion-container[data-result="wind-whisperer"] {
  background: linear-gradient(135deg, #eab308 0%, #facc15 25%, #fde047 50%, #fef08a 75%, #fef9c3 100%);
}

.completion-container[data-result="terraformer"] {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 25%, #f9a8d4 50%, #fbcfe8 75%, #fce7f3 100%);
}

.completion-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(80px);
  z-index: 0;
}

.completion-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.quiz-card {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  position: relative;
  overflow: visible;
  border-radius: var(--radius-lg);
  filter: drop-shadow(var(--shadow-card));
}

.quiz-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"%3E%3Cfilter id="a"%3E%3CfeTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23a)"/%3E%3C/svg%3E');
  background-size: 100px;
  opacity: 0.08;
  mix-blend-mode: multiply;
  pointer-events: none;
  border-radius: var(--radius-lg);
}

.quiz-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(0deg, #FFF 0, #FFF 1px, transparent 1px, transparent 40px),
                    repeating-linear-gradient(90deg, #FFF 0, #FFF 1px, transparent 1px, transparent 40px);
  opacity: 0.05;
  pointer-events: none;
  border-radius: var(--radius-lg);
}


@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.progress-bar-container {
  padding: 1rem 1.5rem 0.75rem 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: rgba(234, 248, 255, 0.5);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--accent-blue), var(--accent-mint));
  transition: width 200ms ease-out;
  border-radius: 6px;
}


.quiz-content {
  flex: 1;
  padding: 0 2rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.question-section {
  text-align: center;
  margin-bottom: 40px;
}


.question-text {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  max-width: 55ch;
  margin: 0 auto;
  color: var(--card-fg);
}

.answers-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 2rem;
}

.answer-card {
  width: 100%;
  padding: 1rem 1.25rem;
  text-align: left;
  border-radius: 12px;
  background-color: #FFF5EF;
  transition: all 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 6px rgba(0, 0, 0, 0.06);
  border: none;
  color: var(--card-fg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.answer-card:hover:not(:disabled),
.answer-card:focus-visible {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.answer-card.selected {
  background-color: var(--accent-blue);
  color: white;
  animation: pop 180ms ease-out;
}

@keyframes pop {
  0% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

@keyframes slideOutUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-12px);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.answer-card:focus-visible {
  outline: 2px solid var(--card-fg);
  outline-offset: 2px;
}

.navigation-section {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 200ms;
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.nav-button.ghost {
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--card-fg);
}

.nav-button.ghost:hover:not(:disabled),
.nav-button.ghost:focus-visible {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.nav-button.primary {
  background: linear-gradient(to right, var(--accent-blue), var(--accent-mint));
  color: white;
}

.nav-button.primary:hover:not(:disabled),
.nav-button.primary:focus-visible {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.nav-button:focus-visible {
  outline: 2px solid var(--card-fg);
  outline-offset: 2px;
}

.result-content {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 80px rgba(255, 255, 255, 0.5);
  position: relative;
  text-align: center;
  max-width: 32rem;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.8);
}


.result-image-container {
  margin-bottom: 2rem;
}

.result-sticker {
  width: 16rem;
  height: 16rem;
  border-radius: 9999px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9999px;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--card-fg);
}

.result-description {
  font-size: 1.125rem;
  color: var(--card-fg);
  margin-bottom: 2rem;
  opacity: 0.8;
}

.share-on-x-button {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  color: white;
  transition: all 200ms;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
  min-width: 200px;
}

/* Dynamic button colors based on result */
.completion-container[data-result="oracle"] .share-on-x-button {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
}

.completion-container[data-result="shapeshifter"] .share-on-x-button {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.completion-container[data-result="wind-whisperer"] .share-on-x-button {
  background: linear-gradient(135deg, #eab308 0%, #facc15 100%);
  color: var(--card-fg);
}

.completion-container[data-result="terraformer"] .share-on-x-button {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
}

.share-on-x-button:hover {
  transform: translateY(-2px);
}

.completion-container[data-result="oracle"] .share-on-x-button:hover {
  box-shadow: 0 10px 20px rgba(30, 58, 138, 0.3);
}

.completion-container[data-result="shapeshifter"] .share-on-x-button:hover {
  box-shadow: 0 10px 20px rgba(22, 163, 74, 0.3);
}

.completion-container[data-result="wind-whisperer"] .share-on-x-button:hover {
  box-shadow: 0 10px 20px rgba(234, 179, 8, 0.3);
}

.completion-container[data-result="terraformer"] .share-on-x-button:hover {
  box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3);
}

.action-section {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.play-again-button,
.copy-link-button {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 200ms;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--card-fg);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.play-again-button:hover,
.copy-link-button:hover {
  background-color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 720px) {
  .quiz-container {
    padding: 0.5rem;
  }
  
  .quiz-card {
    min-height: 100%;
    border-radius: 12px;
  }
  
  .quiz-content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .question-section {
    margin-bottom: 2.5rem;
  }
  
  .question-text {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .answers-section {
    gap: 1rem;
  }
  
  .answer-card {
    font-size: 1.125rem;
    padding: 1.5rem 1.75rem;
  }
  
  .nav-button {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  .action-section {
    flex-direction: column;
    width: 100%;
  }
  
  .play-again-button,
  .copy-link-button {
    width: 100%;
  }
  
  .result-sticker {
    width: 12rem;
    height: 12rem;
  }
}

/* Animation for sequential element appearance */
@keyframes backgroundFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes elementSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-element {
  opacity: 0;
  animation: elementSlideIn 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--animation-order) * 100ms + 200ms);
}

@media (prefers-reduced-motion: reduce) {
  .quiz-container,
  .completion-container,
  .answer-card,
  .nav-button,
  .animate-element {
    animation: none;
    transition: none;
    opacity: 1;
  }
  
  .progress-fill {
    transition: none;
  }
  
  
  .answer-card:hover:not(:disabled),
  .nav-button:hover:not(:disabled) {
    transform: none;
  }
}
</style>