<template>
  <div
    ref="windowElement"
    class="absolute select-none"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
    }"
  >
    <!-- Gradient Border -->
    <div 
      ref="windowInnerElement"
      class="absolute inset-0 rounded-xl p-1"
      :style="{
        background: 'linear-gradient(90deg, #8FAED0 0%, #D3C1EB 100%)',
      }"
    >
      <!-- Resize Handles -->
      <!-- Corners -->
      <div class="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" @mousedown="startResize('nw', $event)"></div>
      <div class="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" @mousedown="startResize('ne', $event)"></div>
      <div class="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" @mousedown="startResize('sw', $event)"></div>
      <div class="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" @mousedown="startResize('se', $event)"></div>
      
      <!-- Edges -->
      <div class="absolute top-0 left-3 right-3 h-1 cursor-ns-resize z-10" @mousedown="startResize('n', $event)"></div>
      <div class="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize z-10" @mousedown="startResize('s', $event)"></div>
      <div class="absolute left-0 top-3 bottom-3 w-1 cursor-ew-resize z-10" @mousedown="startResize('w', $event)"></div>
      <div class="absolute right-0 top-3 bottom-3 w-1 cursor-ew-resize z-10" @mousedown="startResize('e', $event)"></div>
      
      <!-- Window Container -->
      <div ref="windowContainerElement" class="h-full rounded-xl overflow-hidden bg-white relative">
      <!-- Title Bar -->
      <div
        ref="titleBar"
        class="h-11 relative flex items-center justify-between px-4"
        :class="{ 'cursor-move': !isMobile() }"
        :style="{
          background: 'linear-gradient(90deg, #8FAED0 0%, #D3C1EB 100%)',
        }"
        @mousedown="startDrag"
      >
        <!-- Paper texture overlay -->
        <div class="absolute inset-0 opacity-30 pointer-events-none" :style="textureStyle"></div>
        
        <!-- Left side: Icon and Title -->
        <div class="flex items-center gap-2 relative z-10">
          <!-- 16x16 Pixel Planet Icon -->
          <div class="w-4 h-4 grid grid-cols-4 gap-0">
            <div class="bg-transparent"></div>
            <div style="background-color: #F6DFA0"></div>
            <div style="background-color: #F6DFA0"></div>
            <div class="bg-transparent"></div>
            <div style="background-color: #F6DFA0"></div>
            <div style="background-color: #B8D8C1"></div>
            <div style="background-color: #B8D8C1"></div>
            <div style="background-color: #F6DFA0"></div>
            <div style="background-color: #F6DFA0"></div>
            <div style="background-color: #B8D8C1"></div>
            <div style="background-color: #B8D8C1"></div>
            <div style="background-color: #F6DFA0"></div>
            <div class="bg-transparent"></div>
            <div style="background-color: #F6DFA0"></div>
            <div style="background-color: #F6DFA0"></div>
            <div class="bg-transparent"></div>
          </div>
          
          <!-- Title -->
          <span class="text-sm font-semibold" style="color: #4B3A32; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">{{ title }}</span>
        </div>
        
        <!-- Window Controls -->
        <div class="flex items-center gap-3 relative z-10">
          <!-- Minimize Button -->
          <button
            class="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 hover:brightness-95 active:scale-95"
            style="background-color: #B8D8C1; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);"
            @click.stop="$emit('minimize')"
          >
            <svg width="16" height="4" viewBox="0 0 16 4" fill="white">
              <rect width="16" height="4" rx="2"/>
            </svg>
          </button>
          
          <!-- Maximize/Restore Button -->
          <button
            class="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 hover:brightness-95 active:scale-95"
            style="background-color: #F6DFA0; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);"
            @click.stop="handleMaximize"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="white" stroke-width="3" fill="none"/>
            </svg>
          </button>
          
          <!-- Close Button -->
          <button
            class="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 hover:brightness-95 active:scale-95"
            style="background-color: #EC8167; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);"
            @click.stop="$emit('close')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M3 3L13 13M13 3L3 13" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Window Content Area -->
      <div 
        ref="windowContentElement"
        class="relative h-[calc(100%-2.75rem)] overflow-auto"
        style="background-color: #FFF5EC;"
      >
        <!-- Paper texture overlay -->
        <div class="absolute inset-0 opacity-[0.05] pointer-events-none" :style="textureStyle"></div>
        
        
        <!-- Content -->
        <div class="relative h-full">
          <slot></slot>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

interface WindowPosition {
  x: number
  y: number
}

interface WindowSize {
  width: number
  height: number
}

interface Props {
  title?: string
  initialPosition?: WindowPosition
  initialSize?: WindowSize
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Hyligotchi',
  initialPosition: () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    
    if (vw < 768) {
      return { x: 16, y: 16 }
    } else {
      // Get the actual window size based on screen size
      let width, height;
      if (vw <= 1440) {
        width = Math.min(800, vw - 200);
        height = Math.min(600, vh - 150);
      } else if (vw <= 1920) {
        width = Math.min(1000, vw - 150);
        height = Math.min(650, vh - 120);
      } else {
        width = Math.min(1100, vw - 100);
        height = Math.min(700, vh - 100);
      }
      return { x: (vw - width) / 2, y: (vh - height) / 2 }
    }
  },
  initialSize: () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    
    // Mobile
    if (vw < 768) {
      return { width: vw - 32, height: vh - 32 }
    } 
    // Small laptop (like 13" MacBook)
    else if (vw <= 1440) {
      return { 
        width: Math.min(800, vw - 200), 
        height: Math.min(600, vh - 150) 
      }
    }
    // Medium screens (15-16" laptops)
    else if (vw <= 1920) {
      return { 
        width: Math.min(1000, vw - 150), 
        height: Math.min(650, vh - 120) 
      }
    }
    // Large screens (desktop monitors)
    else {
      return { 
        width: Math.min(1100, vw - 100), 
        height: Math.min(700, vh - 100) 
      }
    }
  }
})

// Check if mobile
const isMobile = () => window.innerWidth < 768

// Calculate responsive dimensions
const getResponsiveDimensions = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  
  if (isMobile()) {
    // On mobile, fill viewport with padding
    return {
      width: vw - 32, // 16px padding on each side
      height: vh - 32,
      x: 16,
      y: 16
    }
  } else {
    // On desktop, use size based on screen size
    let width, height;
    if (vw <= 1440) {
      // Small laptop (like 13" MacBook)
      width = Math.min(800, vw - 200);
      height = Math.min(600, vh - 150);
    } else if (vw <= 1920) {
      // Medium screens (15-16" laptops)
      width = Math.min(1000, vw - 150);
      height = Math.min(650, vh - 120);
    } else {
      // Large screens (desktop monitors)
      width = Math.min(1100, vw - 100);
      height = Math.min(700, vh - 100);
    }
    return {
      width,
      height,
      x: (vw - width) / 2,
      y: (vh - height) / 2
    }
  }
}

const emit = defineEmits<{
  minimize: []
  maximize: []
  close: []
}>()

// Store default dimensions
const defaultDimensions = getResponsiveDimensions()

const windowElement = ref<HTMLDivElement>()
const windowInnerElement = ref<HTMLDivElement>()
const windowContainerElement = ref<HTMLDivElement>()
const windowContentElement = ref<HTMLDivElement>()
const titleBar = ref<HTMLDivElement>()

const position = reactive<WindowPosition>({
  x: props.initialPosition.x,
  y: props.initialPosition.y
})

const size = reactive<WindowSize>({
  width: props.initialSize.width,
  height: props.initialSize.height
})

// Paper texture style
const textureStyle = computed(() => ({
  backgroundImage: `
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      rgba(255, 255, 255, 0.08) 3px,
      rgba(255, 255, 255, 0.08) 6px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(139, 90, 43, 0.03) 3px,
      rgba(139, 90, 43, 0.03) 6px
    )
  `,
  backgroundSize: '20px 20px, 12px 12px, 12px 12px'
}))


let isDragging = false
let dragOffset = { x: 0, y: 0 }
let isResizing = false
let resizeDirection = ''
let resizeStart = { x: 0, y: 0, width: 0, height: 0, mouseX: 0, mouseY: 0 }

const startDrag = (event: MouseEvent) => {
  // Disable dragging on mobile
  if (isMobile()) return
  
  isDragging = true
  dragOffset = {
    x: event.clientX - position.x,
    y: event.clientY - position.y
  }
  
  // Add transition class for smooth movement
  if (windowElement.value) {
    windowElement.value.style.transition = 'none'
  }
  
  event.preventDefault()
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging) return
  
  // Calculate new position
  const newX = event.clientX - dragOffset.x
  const newY = event.clientY - dragOffset.y
  
  // Keep window within viewport bounds
  const maxX = window.innerWidth - size.width
  const maxY = window.innerHeight - size.height
  
  position.x = Math.max(0, Math.min(newX, maxX))
  position.y = Math.max(0, Math.min(newY, maxY))
}

const stopDrag = () => {
  if (isDragging && windowElement.value) {
    windowElement.value.style.transition = 'all 150ms ease-out'
  }
  isDragging = false
}

const startResize = (direction: string, event: MouseEvent) => {
  // Disable resizing on mobile
  if (isMobile()) return
  
  isResizing = true
  resizeDirection = direction
  resizeStart = {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    mouseX: event.clientX,
    mouseY: event.clientY
  }
  
  event.preventDefault()
  event.stopPropagation()
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing) return
  
  const deltaX = event.clientX - resizeStart.mouseX
  const deltaY = event.clientY - resizeStart.mouseY
  
  // Minimum window size
  const minWidth = 300
  const minHeight = 200
  
  switch (resizeDirection) {
    case 'se': // Bottom-right
      size.width = Math.max(minWidth, resizeStart.width + deltaX)
      size.height = Math.max(minHeight, resizeStart.height + deltaY)
      break
    case 'sw': // Bottom-left
      const newWidthSW = Math.max(minWidth, resizeStart.width - deltaX)
      if (newWidthSW > minWidth) {
        position.x = resizeStart.x + deltaX
        size.width = newWidthSW
      }
      size.height = Math.max(minHeight, resizeStart.height + deltaY)
      break
    case 'ne': // Top-right
      const newHeightNE = Math.max(minHeight, resizeStart.height - deltaY)
      if (newHeightNE > minHeight) {
        position.y = resizeStart.y + deltaY
        size.height = newHeightNE
      }
      size.width = Math.max(minWidth, resizeStart.width + deltaX)
      break
    case 'nw': // Top-left
      const newWidthNW = Math.max(minWidth, resizeStart.width - deltaX)
      const newHeightNW = Math.max(minHeight, resizeStart.height - deltaY)
      if (newWidthNW > minWidth) {
        position.x = resizeStart.x + deltaX
        size.width = newWidthNW
      }
      if (newHeightNW > minHeight) {
        position.y = resizeStart.y + deltaY
        size.height = newHeightNW
      }
      break
    case 'n': // Top
      const newHeightN = Math.max(minHeight, resizeStart.height - deltaY)
      if (newHeightN > minHeight) {
        position.y = resizeStart.y + deltaY
        size.height = newHeightN
      }
      break
    case 's': // Bottom
      size.height = Math.max(minHeight, resizeStart.height + deltaY)
      break
    case 'e': // Right
      size.width = Math.max(minWidth, resizeStart.width + deltaX)
      break
    case 'w': // Left
      const newWidthW = Math.max(minWidth, resizeStart.width - deltaX)
      if (newWidthW > minWidth) {
        position.x = resizeStart.x + deltaX
        size.width = newWidthW
      }
      break
  }
}

const stopResize = () => {
  isResizing = false
  resizeDirection = ''
}

// Handle maximize button click - restore to default size
const handleMaximize = () => {
  // Animate back to default dimensions
  if (windowElement.value) {
    windowElement.value.style.transition = 'all 300ms ease-out'
  }
  
  position.x = defaultDimensions.x
  position.y = defaultDimensions.y
  size.width = defaultDimensions.width
  size.height = defaultDimensions.height
  
  // Re-enable instant transitions after animation
  setTimeout(() => {
    if (windowElement.value) {
      windowElement.value.style.transition = 'none'
    }
  }, 300)
  
  emit('maximize')
}

// Handle browser window resize
const handleWindowResize = () => {
  const dimensions = getResponsiveDimensions()
  position.x = dimensions.x
  position.y = dimensions.y
  size.width = dimensions.width
  size.height = dimensions.height
}

// Expose the window content element for animations (excludes title bar)
defineExpose({
  windowContentElement
})

onMounted(() => {
  document.addEventListener('mousemove', (e) => {
    handleDrag(e)
    handleResize(e)
  })
  document.addEventListener('mouseup', () => {
    stopDrag()
    stopResize()
  })
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', (e) => {
    handleDrag(e)
    handleResize(e)
  })
  document.removeEventListener('mouseup', () => {
    stopDrag()
    stopResize()
  })
  window.removeEventListener('resize', handleWindowResize)
})
</script>
