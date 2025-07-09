<template>
  <div class="pointer-events-none fixed inset-0 z-[9999]">
    <div
      v-for="cursor in cursors"
      :key="cursor.id"
      class="absolute transition-all"
      :style="{
        left: `${cursor.x}px`,
        top: `${cursor.y}px`,
        transform: `scale(${cursor.scale}) rotate(${cursor.rotation}deg)`,
        opacity: cursor.opacity,
        filter: `hue-rotate(${cursor.hue}deg) brightness(${cursor.brightness})`,
        transitionDuration: `${cursor.duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }"
    >
      <!-- Windows XP Cursor Clone -->
      <img 
        :src="cursor.type === 'hand' ? '/cursors/hand.cur' : '/cursors/cursor.cur'" 
        alt=""
        style="image-rendering: pixelated; width: 32px; height: 32px;"
      />
    </div>
    
    <!-- Rainbow sparkles -->
    <div
      v-for="sparkle in sparkles"
      :key="sparkle.id"
      class="absolute w-2 h-2 rounded-full"
      :style="{
        left: `${sparkle.x}px`,
        top: `${sparkle.y}px`,
        backgroundColor: sparkle.color,
        boxShadow: `0 0 ${sparkle.glow}px ${sparkle.color}`,
        transform: `scale(${sparkle.scale})`,
        opacity: sparkle.opacity,
        transition: 'all 500ms ease-out'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Cursor {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
  rotation: number
  hue: number
  brightness: number
  duration: number
  type: 'normal' | 'hand'
}

interface Sparkle {
  id: number
  x: number
  y: number
  color: string
  scale: number
  opacity: number
  glow: number
}

const cursors = ref<Cursor[]>([])
const sparkles = ref<Sparkle[]>([])
let cursorIdCounter = 0
let sparkleIdCounter = 0
let frameCount = 0

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

const createCursor = (x: number, y: number, isOverButton: boolean) => {
  frameCount++
  
  // Create single cursor at exact position
  const cursor: Cursor = {
    id: cursorIdCounter++,
    x: x,
    y: y,
    scale: 1,
    opacity: 0.8,
    rotation: 0,
    hue: frameCount * 5,
    brightness: 1.2,
    duration: 500,
    type: isOverButton ? 'hand' : 'normal'
  }
  
  cursors.value.push(cursor)
  
  // Animate cursor
  setTimeout(() => {
    const index = cursors.value.findIndex(c => c.id === cursor.id)
    if (index !== -1) {
      cursors.value[index].scale = 1  // Keep same size
      cursors.value[index].opacity = 0
      cursors.value[index].rotation = 360
    }
  }, 50)
  
  // Remove cursor
  setTimeout(() => {
    cursors.value = cursors.value.filter(c => c.id !== cursor.id)
  }, cursor.duration + 100)
  
  // Create sparkles
  if (frameCount % 2 === 0) {
    for (let i = 0; i < 2; i++) {
      const sparkle: Sparkle = {
        id: sparkleIdCounter++,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 1,
        opacity: 0.8,
        glow: 4
      }
      
      sparkles.value.push(sparkle)
      
      // Animate sparkle
      setTimeout(() => {
        const index = sparkles.value.findIndex(s => s.id === sparkle.id)
        if (index !== -1) {
          sparkles.value[index].scale = 0
          sparkles.value[index].opacity = 0
        }
      }, 50)
      
      // Remove sparkle
      setTimeout(() => {
        sparkles.value = sparkles.value.filter(s => s.id !== sparkle.id)
      }, 600)
    }
  }
}

const handleMouseMove = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const isOverButton = target.tagName === 'BUTTON' || 
                      target.tagName === 'A' || 
                      target.getAttribute('role') === 'button' ||
                      target.closest('button') !== null
  
  createCursor(event.clientX, event.clientY, isOverButton)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>