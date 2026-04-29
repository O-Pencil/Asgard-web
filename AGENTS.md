# packages/web/

> P2 | Parent: ../AGENTS.md

## Module Overview

React 19 frontend for Asgard Platform. Provides Agent Marketplace for discovery and Developer Console for credential management. Uses Vite for build, TailwindCSS 4 for styling, and Wired Elements for UI components. Single-page application with simple page state management.

---

## Member List

src/main.jsx: React application entry point, mounts App component to DOM root element

src/App.jsx: Main application component, manages page state (market/console), renders Layout with child page components

src/App.css: Global styles for App component, component-specific styling rules

src/index.css: TailwindCSS import and global CSS reset, base styles for entire application

src/components/Layout.jsx: Layout wrapper component, provides sticky header navigation, page toggle buttons, balance display, user avatar

src/pages/AgentMarket.jsx: Agent Marketplace page, displays agent cards with name, description, capabilities, pricing, enable/disable buttons

src/pages/Console.jsx: Developer Console page, provides API Key management (create, list, delete), usage statistics display, integration guides

src/assets/react.svg: React logo asset file, used for branding or placeholders

---

Rule: Members complete, one item per line, parent links valid, precise terms first