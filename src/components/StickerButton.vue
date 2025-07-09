<template>
  <div class="relative inline-block">
    <!-- Gradient overflow animation (rendered in container) -->
    <Teleport :to="container" v-if="container && isAnimating">
      <div
        class="absolute pointer-events-none"
        :style="overflowStyle"
      >
        <div 
          class="absolute inset-0"
          style="background: linear-gradient(135deg, #8FAED0 0%, #C6B3E6 100%);"
        />
      </div>
    </Teleport>
    
    <!-- White overflow animation (rendered in container) -->
    <Teleport :to="container" v-if="container && isAnimating && animationPhase >= 4">
      <div
        class="absolute pointer-events-none"
        :style="whiteOverflowStyle"
      >
        <div 
          class="absolute inset-0"
          style="background: #FFF5EC;"
        />
      </div>
    </Teleport>
    
    <button
      ref="buttonRef"
      class="relative touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
      :class="{ 'transition-none': prefersReducedMotion }"
      :style="buttonStyle"
      role="button"
      :aria-label="label"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchmove="handleTouchMove"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
    >
    <!-- Paper texture overlay -->
    <div 
      class="absolute inset-0 rounded-[24px] pointer-events-none opacity-[0.08]"
      style="background-image: url('data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 600 600&quot;%3E%3Cfilter id=&quot;a&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;.95&quot; numOctaves=&quot;2&quot; stitchTiles=&quot;stitch&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23a)&quot;/%3E%3C/svg%3E'); background-size: 100px;"
    />
    
    <!-- Gloss overlay -->
    <div 
      class="absolute inset-0 rounded-[24px] pointer-events-none"
      style="background: radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);"
    />
    
    <!-- Peel mask (shows when dragging) -->
    <div 
      v-if="isDragging && dragDistance > 20"
      class="absolute bottom-0 left-0 w-full h-full pointer-events-none"
      :style="peelMaskStyle"
    />
    
    <!-- Button text -->
    <span 
      class="relative z-10 font-bold text-[24px] text-white"
      style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Poppins', sans-serif; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
    >
      {{ label }}
    </span>
  </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  label?: string
  onStart?: () => void
  container?: HTMLElement | null
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Start Quiz'
})

const emit = defineEmits<{
  start: []
  hover: [dwell: number]
}>()

// State
const buttonRef = ref<HTMLButtonElement>()
const isHovered = ref(false)
const isPressed = ref(false)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragCurrentY = ref(0)
const hoverStartTime = ref(0)
const prefersReducedMotion = ref(false)
const isAnimating = ref(false)
const animationPhase = ref(0)
const buttonBounds = ref<DOMRect | null>(null)

// Computed
const dragDistance = computed(() => Math.abs(dragStartY.value - dragCurrentY.value))
const isLifted = computed(() => isHovered.value || isPressed.value || isDragging.value)

const buttonStyle = computed(() => {
  let transform = 'rotate(-2deg)'
  let scale = 1
  let translateY = 0
  
  if (prefersReducedMotion.value) {
    // Simplified motion
    if (isPressed.value) {
      scale = 0.98
    } else if (isHovered.value) {
      translateY = -2
    }
  } else {
    // Full motion
    if (isDragging.value && dragDistance.value > 20) {
      // Follow drag with spring
      translateY = (dragCurrentY.value - dragStartY.value) * 0.8
      transform = `rotate(${-2 + dragDistance.value * 0.05}deg)`
    } else if (isPressed.value) {
      translateY = -1
      scale = 0.98
      transform = 'rotate(-1deg)'
    } else if (isHovered.value) {
      translateY = -4
      transform = 'rotate(0deg)'
    }
  }
  
  const gradient = isPressed.value 
    ? 'linear-gradient(135deg, #7A93BD 0%, #B49FD6 100%)' // 15% darker
    : 'linear-gradient(135deg, #8FAED0 0%, #C6B3E6 100%)'
  
  return {
    width: '280px',
    height: '80px',
    borderRadius: '24px',
    background: gradient,
    border: '2px solid rgba(255, 255, 255, 0.9)',
    transform: `${transform} translateY(${translateY}px) scale(${scale})`,
    boxShadow: `4px 4px 0px rgba(255, 244, 236, ${isLifted.value ? 1 : 0.7})`,
    transition: prefersReducedMotion.value 
      ? 'all 150ms ease-out'
      : 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer'
  }
})

const peelMaskStyle = computed(() => {
  const peelAmount = Math.min(dragDistance.value / 100, 0.3)
  return {
    background: `linear-gradient(135deg, transparent ${100 - peelAmount * 100}%, #FBECE0 100%)`,
    clipPath: `polygon(0 ${100 - peelAmount * 50}%, 100% 100%, 0 100%)`
  }
})

const overflowStyle = computed(() => {
  if (!buttonBounds.value || !props.container) return {}
  
  const containerBounds = props.container.getBoundingClientRect()
  const buttonCenterX = buttonBounds.value.left + buttonBounds.value.width / 2
  const buttonCenterY = buttonBounds.value.top + buttonBounds.value.height / 2
  
  // Convert to container-relative coordinates
  const relativeX = buttonCenterX - containerBounds.left
  const relativeY = buttonCenterY - containerBounds.top
  
  // Position and size to cover entire container
  const left = 0
  const top = 0
  const width = containerBounds.width
  const height = containerBounds.height
  
  // Calculate clip-path based on animation phase
  let clipPath = ''
  
  const bx = (relativeX / width) * 100
  const by = (relativeY / height) * 100
  
  if (animationPhase.value === 1) {
    // Start: Small circle at button position
    const r = 3 // Small radius as percentage
    clipPath = `circle(${r}% at ${bx}% ${by}%)`
  } else if (animationPhase.value >= 3) {
    // End: Ellipse that covers everything with offset center
    // Offset the center towards top-right for asymmetric fill
    const offsetX = bx + (100 - bx) * 0.3 // Move center 30% towards right
    const offsetY = by - by * 0.3 // Move center 30% towards top
    
    // Use a large radius to ensure full coverage
    clipPath = `circle(150% at ${offsetX}% ${offsetY}%)`
  }
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    clipPath: clipPath,
    WebkitClipPath: clipPath, // Safari support
    opacity: 1,
    transition: 'clip-path 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    zIndex: 100
  }
})

const whiteOverflowStyle = computed(() => {
  if (!buttonBounds.value || !props.container) return {}
  
  const containerBounds = props.container.getBoundingClientRect()
  const buttonCenterX = buttonBounds.value.left + buttonBounds.value.width / 2
  const buttonCenterY = buttonBounds.value.top + buttonBounds.value.height / 2
  
  // Convert to container-relative coordinates
  const relativeX = buttonCenterX - containerBounds.left
  const relativeY = buttonCenterY - containerBounds.top
  
  // Position and size to cover entire container
  const left = 0
  const top = 0
  const width = containerBounds.width
  const height = containerBounds.height
  
  // Calculate clip-path based on animation phase
  let clipPath = ''
  
  const bx = (relativeX / width) * 100
  const by = (relativeY / height) * 100
  
  if (animationPhase.value === 4) {
    // Start: Small circle at button position
    const r = 3
    clipPath = `circle(${r}% at ${bx}% ${by}%)`
  } else if (animationPhase.value === 5) {
    // End: Large circle that covers everything
    clipPath = `circle(150% at ${bx}% ${by}%)`
  }
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    clipPath: clipPath,
    WebkitClipPath: clipPath,
    opacity: 1,
    transition: 'clip-path 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    zIndex: 101
  }
})

// Methods
const handleMouseEnter = () => {
  isHovered.value = true
  hoverStartTime.value = Date.now()
  
  // Track hover dwell time
  setTimeout(() => {
    if (isHovered.value && Date.now() - hoverStartTime.value >= 500) {
      emit('hover', Date.now() - hoverStartTime.value)
    }
  }, 500)
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (!isPressed.value) {
    isDragging.value = false
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isPressed.value = true
  dragStartY.value = e.clientY
  dragCurrentY.value = e.clientY
  
  // Start animation immediately on click
  if (!isDragging.value && !isAnimating.value) {
    startQuiz('click')
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    dragCurrentY.value = e.clientY
    if (Math.abs(dragCurrentY.value - dragStartY.value) > 5) {
      isDragging.value = true
    }
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    
    if (isDragging.value && dragDistance.value > 20) {
      // Peel completed - animate off and start
      animateOffAndStart()
    }
    
    isPressed.value = false
    isDragging.value = false
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseUp = () => {
  isPressed.value = false
}

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  isPressed.value = true
  dragStartY.value = touch.clientY
  dragCurrentY.value = touch.clientY
  
  // Start animation immediately on touch
  if (!isDragging.value && !isAnimating.value) {
    startQuiz('tap')
  }
}

const handleTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0]
  dragCurrentY.value = touch.clientY
  if (Math.abs(dragCurrentY.value - dragStartY.value) > 5) {
    isDragging.value = true
  }
}

const handleTouchEnd = () => {
  if (isDragging.value && dragDistance.value > 20) {
    animateOffAndStart()
  }
  
  isPressed.value = false
  isDragging.value = false
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    isPressed.value = true
    
    // Start animation immediately on keydown
    if (!isAnimating.value) {
      startQuiz('keyboard')
    }
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    isPressed.value = false
  }
}

const animateOffAndStart = () => {
  if (!buttonRef.value) return
  
  // Animate button flying off
  buttonRef.value.style.transition = 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  buttonRef.value.style.transform = 'translateY(-200px) scale(0.5) rotate(20deg)'
  buttonRef.value.style.opacity = '0'
  
  setTimeout(() => {
    startQuiz('peel')
  }, 300)
}

const startQuiz = (method: string) => {
  // Get button bounds before animation
  if (buttonRef.value) {
    buttonBounds.value = buttonRef.value.getBoundingClientRect()
  }
  
  // Start gradient overflow animation
  isAnimating.value = true
  animationPhase.value = 1 // Start as small blob
  
  // Force browser to render the element at initial state
  requestAnimationFrame(() => {
    // Go directly to full expansion - let CSS handle the entire animation
    animationPhase.value = 3
  })
  
  // Wait for gradient expansion to complete
  setTimeout(() => {
    // Start white ellipse
    animationPhase.value = 4
    
    // Expand white ellipse immediately after render
    requestAnimationFrame(() => {
      animationPhase.value = 5
    })
  }, 850)
  
  // Emit start event when white overlay is fully expanded
  setTimeout(() => {
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'quiz_start_click', { method })
    }
    
    emit('start')
    props.onStart?.()
    
    // Clean up animation after a delay to allow smooth transition
    setTimeout(() => {
      isAnimating.value = false
      animationPhase.value = 0
    }, 500)
  }, 1400)
}

// Check for reduced motion preference
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  
  const handleChange = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }
  
  mediaQuery.addEventListener('change', handleChange)
  
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleChange)
  })
})

// Window declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
</script>