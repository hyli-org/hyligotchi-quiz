# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

quiz-hyligotchi is a Vue 3 + TypeScript + Vite project using Tailwind CSS v4 for styling. The project appears to be a quiz application with gamification elements.

## Essential Commands

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production (includes TypeScript type checking)
npm run build

# Preview production build locally
npm run preview
```

## Tech Stack & Architecture

- **Frontend Framework**: Vue 3.5.17 with Composition API (`<script setup>` syntax)
- **Build Tool**: Vite
- **Language**: TypeScript 5.8.3 with strict mode enabled
- **Styling**: Tailwind CSS 4.1.11 (using new Vite plugin approach)
- **Module System**: ES Modules

## Project Structure

```
src/
├── main.ts              # Application entry point
├── App.vue              # Root component
├── components/          # Vue components directory
├── assets/              # Static assets
└── style.css            # Global styles (imports Tailwind)
```

## TypeScript Configuration

The project uses a multi-config TypeScript setup:
- `tsconfig.app.json`: Main application config with strict type checking
- Includes strict mode and all recommended type checking flags
- Configured to handle `.vue` files

## Styling with Tailwind CSS

- Tailwind CSS v4 is configured via the Vite plugin
- Dark mode support is already set up in the HTML
- Global styles are imported in `src/style.css`
- Use Tailwind utility classes for styling components

## Development Guidelines

1. **Component Creation**: Use Vue 3 Composition API with `<script setup lang="ts">` syntax
2. **Type Safety**: Leverage TypeScript's strict mode - always add proper types
3. **Styling**: Use Tailwind utility classes instead of custom CSS when possible
4. **File Organization**: Place new components in `src/components/`

## Testing

No testing framework is currently configured. When adding tests, consider:
- Vitest for unit testing (integrates well with Vite)
- Vue Test Utils for component testing

## Current Implementation

### Core Components

- **App.vue**: Main application component
  - Full-screen section with Mars landscape background (`/public/background.jpg`)
  - Integrates Window component with draggable/resizable functionality
  - Contains hero content with "Which Hyligotchi are you?" title
  - Includes StickerButton component at bottom of window

- **Window.vue**: Windows XP-style floating window
  - Draggable via title bar (desktop only)
  - Resizable from all edges and corners
  - Mars-themed gradient border (#8FAED0 to #D3C1EB)
  - Control buttons: minimize, maximize/restore, close
  - Responsive sizing (fills viewport on mobile)
  - Background color: #FFF5EC (warm off-white)

- **StickerButton.vue**: Vinyl sticker-style interactive button
  - Gradient background matching window theme
  - Peel animation when dragged
  - Click triggers gradient overflow animation:
    1. Gradient expands from button position using clip-path circle
    2. White circle follows to reset the background
  - Accessible with keyboard support
  - Respects prefers-reduced-motion

- **CursorTrail.vue**: Windows XP cursor effects
  - Displays cursor trail with rainbow sparkles
  - Uses actual XP cursor files from `/public/cursors/`
  - Currently active in the application

### Styling

- Uses Tailwind CSS v4 with Vite plugin
- Custom Windows XP cursors defined in `style.css`
- Dark mode ready (class set in HTML)

## Notes

- Default Vue template content has been removed
- No linting or formatting tools are configured yet - consider adding ESLint and Prettier
- No commit hooks or CI/CD pipeline exists yet