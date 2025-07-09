<script setup lang="ts">
import { ref, computed } from 'vue'
import Window from './components/Window.vue'
import CursorTrail from './components/CursorTrail.vue'
import StickerButton from './components/StickerButton.vue'
import Quiz from './components/Quiz.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const showQuiz = ref(false)
const showConfirmDialog = ref(false)
const quizRef = ref<InstanceType<typeof Quiz>>()

const handleClose = () => {
  if (showQuiz.value) {
    // Show confirmation dialog if quiz is active
    showConfirmDialog.value = true
  } else {
    // Just log if on landing page
    console.log('Window closed')
  }
}

const handleMinimize = () => {
  console.log('Window minimized')
}

const handleMaximize = () => {
  console.log('Window maximized')
}

const handleStart = () => {
  console.log('Quiz started!')
  // Show quiz immediately when start event is emitted
  showQuiz.value = true
}

const handleConfirmClose = () => {
  // Reset quiz and go back to home
  if (quizRef.value) {
    quizRef.value.resetQuiz()
  }
  showQuiz.value = false
  showConfirmDialog.value = false
}

const handleCancelClose = () => {
  // Just close the dialog
  showConfirmDialog.value = false
}

const handleGoHome = () => {
  // Go back to the landing page
  showQuiz.value = false
}

const handleHover = (dwellMs: number) => {
  console.log(`Button hovered for ${dwellMs}ms`)
}

const windowRef = ref<InstanceType<typeof Window>>()
const windowContainerRef = computed(() => windowRef.value?.windowContentElement)
</script>

<template>
  <!-- Cursor Trail -->
  <CursorTrail />
  
  <!-- Section with background image -->
  <section class="fixed inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background.jpg')">
    <Window
      ref="windowRef"
      @close="handleClose"
      @minimize="handleMinimize"
      @maximize="handleMaximize"
    >
      <Quiz v-if="showQuiz" ref="quizRef" @go-home="handleGoHome" />
      <div v-else class="flex flex-col h-full relative">
        <!-- Hero Title Block centered -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center relative">
            <!-- Paper texture overlay -->
            <div 
              class="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style="background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.08) 3px, rgba(255, 255, 255, 0.08) 6px); background-size: 12px 12px;"
            ></div>
            
            <!-- Single-line headline -->
            <h1 
              class="font-black text-[28px] sm:text-[36px] md:text-[48px] lg:text-[58px] xl:text-[68px] leading-none relative px-4 whitespace-nowrap"
              style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Poppins', sans-serif; font-weight: 900; letter-spacing: -0.02em; color: #3F332B; text-shadow: 4px 4px 0px rgba(255, 244, 236, 0.1);"
            >
              Which <span style="color: #8FAED0;">Hyligotchi</span> are you?
            </h1>
          </div>
        </div>
        
        <!-- Start Button at bottom -->
        <div class="pb-12 flex justify-center">
          <StickerButton 
            @start="handleStart"
            @hover="handleHover"
            :container="windowContainerRef"
          />
        </div>
      </div>
    </Window>
  </section>
  
  <!-- Confirmation Dialog -->
  <ConfirmDialog
    v-model="showConfirmDialog"
    title="Leave Quiz?"
    message="Are you sure you want to go back to the home page? Your quiz progress will be lost."
    confirm-text="Yes, go back"
    cancel-text="Continue quiz"
    @confirm="handleConfirmClose"
    @cancel="handleCancelClose"
  />
</template>
