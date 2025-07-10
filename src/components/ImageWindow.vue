<template>
  <div 
    class="fixed bg-[#FFF5EC] border-2 rounded-t-lg rounded-b shadow-lg flex flex-col overflow-hidden cursor-default transition-shadow"
    :class="[
      borderColorClass,
      shadowColorClass,
      hoverShadowColorClass
    ]"
    :style="windowStyle"
    @mousedown="handleMouseDown"
  >
    <div 
      class="bg-gradient-to-b px-1.5 py-1 flex items-center justify-between cursor-move select-none border-b"
      :class="[headerGradientClass, borderBottomColorClass]"
      @mousedown.stop="startDrag"
    >
      <span class="text-white text-sm font-semibold ml-1 drop-shadow-sm">{{ title }}</span>
      <div class="flex gap-0.5">
        <button @click="$emit('close')" class="w-5 h-5 border-0 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-sm flex items-center justify-center cursor-pointer text-xs font-bold transition-all shadow-sm hover:from-red-500 hover:to-red-700 hover:scale-105 active:scale-95 active:shadow-inner" aria-label="Close">
          <span class="-mt-px">✕</span>
        </button>
      </div>
    </div>
    <div class="flex-1 p-2 flex items-center justify-center bg-white m-1 rounded shadow-inner">
      <img :src="imageSrc" :alt="title" class="w-full h-full object-cover rounded select-none pointer-events-none" draggable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

type ColorTheme = 'pink' | 'blue' | 'green' | 'yellow';

interface Props {
  imageSrc: string;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  title?: string;
  colorTheme?: ColorTheme;
}

const props = withDefaults(defineProps<Props>(), {
  initialX: 100,
  initialY: 100,
  width: 300,
  height: 350,
  zIndex: 100,
  title: 'hyligotchi.jpg',
  colorTheme: 'pink'
});

const emit = defineEmits<{
  close: [];
  focus: [];
}>();

const x = ref(props.initialX);
const y = ref(props.initialY);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);

const windowStyle = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
  zIndex: props.zIndex,
  animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}));

const colorClasses = {
  pink: {
    border: 'border-pink-500',
    shadow: 'shadow-pink-500/20',
    hoverShadow: 'hover:shadow-pink-500/30',
    headerGradient: 'from-pink-300 to-pink-500',
    borderBottom: 'border-pink-500/30'
  },
  blue: {
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/20',
    hoverShadow: 'hover:shadow-blue-500/30',
    headerGradient: 'from-blue-300 to-blue-500',
    borderBottom: 'border-blue-500/30'
  },
  green: {
    border: 'border-green-500',
    shadow: 'shadow-green-500/20',
    hoverShadow: 'hover:shadow-green-500/30',
    headerGradient: 'from-green-300 to-green-500',
    borderBottom: 'border-green-500/30'
  },
  yellow: {
    border: 'border-yellow-500',
    shadow: 'shadow-yellow-500/20',
    hoverShadow: 'hover:shadow-yellow-500/30',
    headerGradient: 'from-yellow-300 to-yellow-500',
    borderBottom: 'border-yellow-500/30'
  }
};

const borderColorClass = computed(() => colorClasses[props.colorTheme].border);
const shadowColorClass = computed(() => colorClasses[props.colorTheme].shadow);
const hoverShadowColorClass = computed(() => colorClasses[props.colorTheme].hoverShadow);
const headerGradientClass = computed(() => colorClasses[props.colorTheme].headerGradient);
const borderBottomColorClass = computed(() => colorClasses[props.colorTheme].borderBottom);

function handleMouseDown() {
  emit('focus');
}

function startDrag(e: MouseEvent) {
  if (window.innerWidth <= 768) return;
  
  isDragging.value = true;
  dragStartX.value = e.clientX - x.value;
  dragStartY.value = e.clientY - y.value;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  
  e.preventDefault();
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return;
  
  x.value = e.clientX - dragStartX.value;
  y.value = e.clientY - dragStartY.value;
  
  // Keep window in viewport
  x.value = Math.max(0, Math.min(window.innerWidth - props.width, x.value));
  y.value = Math.max(0, Math.min(window.innerHeight - props.height, y.value));
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

onUnmounted(() => {
  if (isDragging.value) {
    stopDrag();
  }
});
</script>

<style scoped>
@keyframes popIn {
  0% {
    transform: scale(0.8) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .cursor-move {
    cursor: default;
  }
}
</style>