<template>
  <Teleport to="body">
    <div v-if="isActive && !isMobile" class="windows-container">
      <ImageWindow
        v-for="window in windows"
        :key="window.id"
        :image-src="window.imageSrc"
        :initial-x="window.x"
        :initial-y="window.y"
        :width="window.width"
        :height="window.height"
        :z-index="window.zIndex"
        :title="window.title"
        :color-theme="colorTheme"
        @close="closeWindow(window.id)"
        @focus="focusWindow(window.id)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ImageWindow from './ImageWindow.vue';

type ColorTheme = 'pink' | 'blue' | 'green' | 'yellow';

interface Props {
  colorTheme: ColorTheme;
  isActive: boolean;
}

interface WindowData {
  id: number;
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  title: string;
}

const props = defineProps<Props>();

const windows = ref<WindowData[]>([]);
let windowIdCounter = 0;
let baseZIndex = 100;
let spawnInterval: number | null = null;
let usedPositions: Set<string> = new Set();

// Check if mobile
const isMobile = ref(window.innerWidth <= 768);

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 768;
}

const imageConfigs: Record<ColorTheme, { folder: string; images: string[] }> = {
  pink: { 
    folder: 'pink', 
    images: ['g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg', 'g5.jpg', 'g6.jpg', 'g7.jpg', 'g8.jpg', 'g9.jpg',
             'g23.jpg', 'g24.jpg', 'g25.jpg', 'g26.jpg', 'g27.jpg', 'g28.jpg', 'g29.jpg', 'g30.jpg', 
             'g31.jpg', 'g32.jpg', 'g33.jpg', 'g34.jpg']
  },
  green: { 
    folder: 'green', 
    images: ['s4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.png', 's10.jpg', 's11.jpg', 
             's12.jpg', 's13.jpg', 's14.jpg', 's15.jpg', 's16.jpg', 's17.jpg', 's18.jpg', 's19.jpg',
             's20.jpg', 's21.jpg', 's22.jpg', 's23.jpg', 's24.jpg', 's25.jpg', 's26.jpg', 's27.jpg',
             's28.jpg', 's29.jpg', 's30.jpg', 's31.jpg', 's32.jpg', 's33.jpg', 's34.jpg', 's345.jpg', 's36.jpg']
  },
  yellow: { 
    folder: 'yellow', 
    images: ['b1.jpg', 'b2.jpg', 'b3.jpg', 'b4.jpg', 'b5.jpg', 'b6.jpg', 'b9.jpg', 'b10.jpg',
             'b11.jpg', 'b12.jpg', 'b13.jpg', 'b14.jpg', 'b17.jpg', 'b18.jpg', 'b19.jpg', 'b20.jpg',
             'b21.jpg', 'b22.jpg', 'b25.jpg', 'b26.jpg', 'b27.jpg', 'b28.jpg', 'b29.jpg', 'b30.jpg',
             'b33.jpg', 'b34.png', 'b35.jpg', 'b36.jpg', 'b37.jpg', 'b38.jpg', 'b41.jpg', 'b42.jpg',
             'b43.jpg', 'b44.jpg', 'b45.jpg', 'b46.jpg']
  },
  blue: { 
    folder: 'blue', 
    images: ['r1.jpg', 'r2.jpg', 'r3.png', 'r4.jpg', 'r5.jpg', 'r6.jpg', 'r7.jpg', 'r8.jpg',
             'r9.jpg', 'r10.jpg', 'r11.jpg', 'r12.png', 'r13.jpg', 'r14.jpg', 'r15.jpg', 'r16.jpg',
             'r17.jpg', 'r18.jpg', 'r19.jpg', 'r20.jpg', 'r21.jpg', 'r22.jpg', 'r23.jpg', 'r24.jpg',
             'r25.jpg', 'r26.jpg', 'r27.jpg', 'r28.jpg', 'r29.jpg', 'r30.jpg', 'r31.jpg', 'r32.jpg']
  }
};

function getRandomImage(): string {
  const config = imageConfigs[props.colorTheme];
  if (config.images.length === 0) {
    // Fallback to main color image if no folder images
    return `/${props.colorTheme}.jpg`;
  }
  const randomImage = config.images[Math.floor(Math.random() * config.images.length)];
  return `/${config.folder}/${randomImage}`;
}

function getSpawnPositions() {
  const margin = 30; // Reduced margin for smaller screens
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Calculate main window dimensions based on screen size
  let mainWindowWidth, mainWindowHeight;
  
  if (windowWidth <= 1440) {
    // Small laptop (like 13" MacBook)
    mainWindowWidth = Math.min(800, windowWidth - 200);
    mainWindowHeight = Math.min(600, windowHeight - 150);
  } else if (windowWidth <= 1920) {
    // Medium screens (15-16" laptops)
    mainWindowWidth = Math.min(1000, windowWidth - 150);
    mainWindowHeight = Math.min(650, windowHeight - 120);
  } else {
    // Large screens (desktop monitors)
    mainWindowWidth = Math.min(1100, windowWidth - 100);
    mainWindowHeight = Math.min(700, windowHeight - 100);
  }
  
  const mainWindowX = (windowWidth - mainWindowWidth) / 2;
  const mainWindowY = (windowHeight - mainWindowHeight) / 2;
  
  const positions: Array<{x: number, y: number, zone: string}> = [];
  
  // Top-left positions
  const leftSpace = mainWindowX - margin;
  const minSpace = 200; // Minimum space needed for a small window
  
  if (leftSpace >= minSpace) {
    positions.push({ x: margin, y: margin, zone: 'top-left' });
    if (leftSpace >= minSpace + 100) {
      positions.push({ x: margin + Math.min(150, leftSpace - minSpace - 50), y: margin + 50, zone: 'top-left' });
    }
  }
  
  // Top-right positions
  const topRightX = mainWindowX + mainWindowWidth + 30;
  const rightSpace = windowWidth - topRightX - margin;
  
  if (rightSpace >= minSpace) {
    positions.push({ x: topRightX, y: margin, zone: 'top-right' });
    if (rightSpace >= minSpace + 100) {
      positions.push({ x: topRightX + Math.min(150, rightSpace - minSpace - 50), y: margin + 50, zone: 'top-right' });
    }
  }
  
  // Bottom positions
  const bottomY = mainWindowY + mainWindowHeight + 30;
  const bottomSpace = windowHeight - bottomY - margin;
  
  if (bottomSpace >= minSpace && leftSpace >= minSpace) {
    positions.push({ x: margin, y: bottomY, zone: 'bottom-left' });
  }
  
  if (bottomSpace >= minSpace && rightSpace >= minSpace) {
    positions.push({ x: topRightX, y: bottomY, zone: 'bottom-right' });
  }
  
  // Left side positions
  if (leftSpace >= minSpace) {
    const leftMidY = mainWindowY + mainWindowHeight / 3;
    positions.push({ x: margin, y: leftMidY, zone: 'left' });
  }
  
  // Right side positions
  if (rightSpace >= minSpace) {
    const rightMidY = mainWindowY + mainWindowHeight / 3;
    positions.push({ x: topRightX, y: rightMidY, zone: 'right' });
  }
  
  // Top center positions
  const topSpace = mainWindowY - margin;
  if (topSpace >= minSpace) {
    const topCenterX = mainWindowX + mainWindowWidth / 3;
    positions.push({ x: topCenterX, y: margin, zone: 'top' });
    if (mainWindowWidth > 400) {
      positions.push({ x: topCenterX + mainWindowWidth / 3, y: margin, zone: 'top' });
    }
  }
  
  // Bottom center positions
  if (bottomSpace >= minSpace) {
    const bottomCenterX = mainWindowX + mainWindowWidth / 3;
    positions.push({ x: bottomCenterX, y: bottomY, zone: 'bottom' });
    if (mainWindowWidth > 400) {
      positions.push({ x: bottomCenterX + mainWindowWidth / 3, y: bottomY, zone: 'bottom' });
    }
  }
  
  // If we don't have enough positions, add some fallback positions
  if (positions.length < 10) {
    // Add positions closer to the window
    if (leftSpace >= 150) {
      positions.push({ x: mainWindowX - 150, y: mainWindowY + 100, zone: 'left-close' });
    }
    if (rightSpace >= 150) {
      positions.push({ x: mainWindowX + mainWindowWidth + 20, y: mainWindowY + 100, zone: 'right-close' });
    }
    if (topSpace >= 150) {
      positions.push({ x: mainWindowX + 100, y: mainWindowY - 150, zone: 'top-close' });
    }
    if (bottomSpace >= 150) {
      positions.push({ x: mainWindowX + 100, y: mainWindowY + mainWindowHeight + 20, zone: 'bottom-close' });
    }
  }
  
  return positions;
}

function getDistributedPosition() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // For smaller screens, use 10 fixed positions
  if (windowWidth <= 1440) {
    const fixedPositions = [
      { x: 50, y: 50 },                                    // Position 1: Top-left corner
      { x: windowWidth - 250, y: 50 },                    // Position 2: Top-right corner
      { x: 50, y: windowHeight - 270 },                   // Position 3: Bottom-left corner
      { x: windowWidth - 250, y: windowHeight - 270 },    // Position 4: Bottom-right corner
      { x: windowWidth / 2 - 100, y: 30 },                // Position 5: Top-center
      { x: 50, y: windowHeight / 2 - 110 },               // Position 6: Left-middle
      { x: windowWidth - 250, y: windowHeight / 2 - 110 },// Position 7: Right-middle
      { x: windowWidth / 2 - 100, y: windowHeight - 270 },// Position 8: Bottom-center
      { x: 200, y: 100 },                                  // Position 9: Top-left inner
      { x: windowWidth - 400, y: 100 }                    // Position 10: Top-right inner
    ];
    
    const currentIndex = windows.value.length;
    if (currentIndex < fixedPositions.length) {
      return fixedPositions[currentIndex];
    }
  }
  
  // For larger screens, use the original logic
  const allPositions = getSpawnPositions();
  
  if (allPositions.length === 0) {
    return { x: 50, y: 50 };
  }
  
  // Distribute windows evenly across zones
  const targetCount = 10;
  
  if (windows.value.length < targetCount) {
    // Group positions by zone
    const zoneGroups: Record<string, Array<{x: number, y: number, zone: string}>> = {};
    allPositions.forEach(pos => {
      if (!zoneGroups[pos.zone]) {
        zoneGroups[pos.zone] = [];
      }
      zoneGroups[pos.zone].push(pos);
    });
    
    // Get zones in order for even distribution
    const zones = Object.keys(zoneGroups);
    const zoneIndex = windows.value.length % zones.length;
    const selectedZone = zones[zoneIndex];
    const zonePositions = zoneGroups[selectedZone];
    
    // Pick first available position in this zone
    const availableInZone = zonePositions.filter(
      pos => !usedPositions.has(`${pos.x},${pos.y}`)
    );
    
    if (availableInZone.length > 0) {
      const position = availableInZone[0];
      usedPositions.add(`${position.x},${position.y}`);
      
      // Add small random offset
      return {
        x: position.x + Math.floor(Math.random() * 30 - 15),
        y: position.y + Math.floor(Math.random() * 30 - 15)
      };
    }
  }
  
  // After target count, use random positions
  const availablePositions = allPositions.filter(
    pos => !usedPositions.has(`${pos.x},${pos.y}`)
  );
  
  if (availablePositions.length === 0) {
    // Reset and use all positions again
    usedPositions.clear();
    return getDistributedPosition();
  }
  
  // Pick a random position from available ones
  const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  usedPositions.add(`${position.x},${position.y}`);
  
  // Add some small random offset
  return {
    x: position.x + Math.floor(Math.random() * 30 - 15),
    y: position.y + Math.floor(Math.random() * 30 - 15)
  };
}

function getRandomSize() {
  const vw = window.innerWidth;
  
  // Adjust sizes based on screen size
  let sizes;
  if (vw <= 1440) {
    // Even smaller sizes for small MacBook screens
    sizes = [
      { width: 180, height: 200 },
      { width: 200, height: 220 },
      { width: 170, height: 200 }
    ];
  } else if (vw <= 1920) {
    // Medium sizes
    sizes = [
      { width: 250, height: 300 },
      { width: 300, height: 350 },
      { width: 280, height: 320 }
    ];
  } else {
    // Original sizes for large screens
    sizes = [
      { width: 250, height: 300 },
      { width: 300, height: 350 },
      { width: 350, height: 400 },
      { width: 280, height: 320 }
    ];
  }
  
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function spawnWindow() {
  const position = getDistributedPosition();
  const size = getRandomSize();
  
  const newWindow: WindowData = {
    id: windowIdCounter++,
    imageSrc: getRandomImage(),
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    zIndex: baseZIndex++,
    title: `hyligotchi_${windowIdCounter}.jpg`
  };
  
  windows.value.push(newWindow);
}

function closeWindow(id: number) {
  windows.value = windows.value.filter(w => w.id !== id);
  // If all windows are closed, reset positions
  if (windows.value.length === 0) {
    usedPositions.clear();
  }
}

function focusWindow(id: number) {
  const window = windows.value.find(w => w.id === id);
  if (window) {
    window.zIndex = baseZIndex++;
  }
}

function startSpawning() {
  // Don't spawn on mobile
  if (isMobile.value) return;
  
  // Spawn 10 windows for all desktop sizes
  const windowCount = 10;
  
  for (let i = 0; i < windowCount; i++) {
    setTimeout(() => spawnWindow(), i * 150); // Stagger by 150ms
  }
  
  // No additional spawning
}

function stopSpawning() {
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  if (props.isActive) {
    startSpawning();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  stopSpawning();
});

// Watch for activation changes
import { watch } from 'vue';
watch(() => props.isActive, (newValue) => {
  if (newValue) {
    startSpawning();
  } else {
    stopSpawning();
    windows.value = [];
    usedPositions.clear();
  }
});
</script>

<style scoped>
.windows-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.windows-container > * {
  pointer-events: auto;
}
</style>
