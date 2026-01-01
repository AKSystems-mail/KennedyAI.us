# Gemini Context: KennedyAI.us Portfolio

This document provides context for the AI assistant about the `KennedyAI.us` mono-repository, focusing on the main portfolio website project.

## Project Overview

The primary project in this repository is a personal portfolio website located in the `portfolio-website/` directory. It is built as a modern, single-page application.

The portfolio showcases various projects and skills using a "bento grid" layout, with interactive and dynamic components.

### Core Technologies

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: `react-three-fiber` (for `three.js`) and `@react-three/drei`
- **Animation**: `framer-motion`
- **Backend/Services**: Firebase is integrated for backend features. The configuration is in `src/firebase.ts`.

### Architecture

The application's entry point is `portfolio-website/src/main.tsx`, which renders the main `<App>` component.

The entire UI is structured within a single primary component: `src/components/BentoGrid.tsx`. This component arranges several smaller, specialized components into a grid, including:
- `HeroFamilyTree`: A large, interactive 3D family tree visualization.
- `RoadmapCard`: Displays a project or feature roadmap.
- `AppCard`: Links to live/beta mobile applications.
- `SpotifyCard`: Shows current Spotify listening activity.
- `TechStack`: An interactive visualization of the technology stack.

## Building and Running

All commands should be run from within the `portfolio-website/` directory.

- **To run the development server:**
  ```bash
  npm run dev
  ```

- **To create a production build:**
  ```bash
  npm run build
  ```
  This command first runs `tsc` to check for TypeScript errors and then uses Vite to build the project into the `dist/` directory.

- **To preview the production build locally:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **Linting**: ESLint is configured to maintain code quality. Run the linter with:
  ```bash
  npm run lint
  ```
- **TypeScript**: The project uses a strict TypeScript configuration (`strict: true` in `tsconfig.app.json`). All new code should be strongly typed.
- **Styling**: Utility-first CSS is managed with Tailwind CSS.
- **Component Structure**: The project follows a component-based architecture with reusable components in `src/components/`.
- **File Naming**: The project uses both `.tsx` for React components and `.jsx` for some components. Consistency with `.tsx` is preferred for new components containing JSX.
