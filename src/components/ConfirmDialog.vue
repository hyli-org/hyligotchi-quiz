<template>
  <Teleport to="body">
    <div v-if="modelValue" class="dialog-overlay" @click="handleCancel">
      <div class="dialog-container" @click.stop>
        <!-- Windows-style title bar -->
        <div class="dialog-titlebar">
          <!-- Paper texture overlay -->
          <div class="absolute inset-0 opacity-30 pointer-events-none" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.1) 3px, rgba(255, 255, 255, 0.1) 6px), repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.05) 3px, rgba(255, 255, 255, 0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255, 255, 255, 0.03) 3px, rgba(255, 255, 255, 0.03) 6px); background-size: 20px 20px, 12px 12px, 12px 12px;"></div>
          
          <!-- Left side: Title -->
          <div class="flex items-center gap-2 relative z-10">
            <span class="text-sm font-semibold dialog-titlebar-text">{{ title }}</span>
          </div>
          
          <!-- Window Controls -->
          <div class="flex items-center relative z-10">
            <!-- Close Button -->
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 hover:brightness-95 active:scale-95"
              style="background-color: #EC8167; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);"
              @click="handleCancel"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M3 3L13 13M13 3L3 13" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="dialog-content">
          <div class="dialog-body">
            <p class="dialog-message">{{ message }}</p>
          </div>
          <div class="dialog-footer">
            <button @click="handleCancel" class="dialog-button cancel">
              {{ cancelText }}
            </button>
            <button @click="handleConfirm" class="dialog-button confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (props.modelValue && e.key === 'Escape') {
    handleCancel()
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-container {
  background-color: #FFF5EC;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  animation: slideIn 200ms ease-out;
  overflow: hidden;
  position: relative;
}

.dialog-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 4px;
  background: linear-gradient(135deg, #8FAED0 0%, #D3C1EB 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

@keyframes slideIn {
  from {
    transform: scale(0.95) translateY(-10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.dialog-titlebar {
  background: linear-gradient(90deg, #8FAED0 0%, #D3C1EB 100%);
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.75rem;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.dialog-titlebar-text {
  color: #4B3A32;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}


.dialog-content {
  display: flex;
  flex-direction: column;
  background-color: #FFF5EC;
  position: relative;
}

.dialog-body {
  padding: 2rem 1.5rem;
}

.dialog-message {
  color: #3F332B;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

.dialog-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.dialog-button {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.dialog-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dialog-button.cancel {
  background-color: transparent;
  border: 1px solid #e5e7eb;
  color: #3F332B;
}

.dialog-button.cancel:hover {
  background-color: #f9fafb;
}

.dialog-button.confirm {
  background: linear-gradient(135deg, #8FAED0 0%, #C6B3E6 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-button.confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(143, 174, 208, 0.3);
}

@media (max-width: 640px) {
  .dialog-container {
    width: 95%;
  }
}
</style>