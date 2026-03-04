# Features Implemented: Settings & Theme Engine

## 1. **Settings Page (`src/pages/Settings.jsx`)**

- Added a dedicated settings screen accessible from the Top Bar.
- **Dark Mode Toggle**: Switches between light/dark modes (persists via context).
- **Notification Toggle**: Toggle for push notifications.
- **Theme Selection**: added 3 distinct themes:
  - **Classic**: The Elegant Dark theme.
  - **Sunset**: Warm gradients (Purple/Orange).
  - **Funky**: Neon/High-Contrast theme.
- **Logout**: Dedicated logout button with session info.

## 2. **Theme Context Engine (`src/context/ThemeContext.jsx`)**

- Created a robust context provider to manage global application state.
- Handles dynamic CSS class application (`theme-classic`, `theme-sunset`, `theme-funky`).
- Manages toggles state.

## 3. **Navigation Updates**

- **Top Bar**: Added a "Settings" gear icon button to the right side.
- **App Shell**: Wiring to pass navigation props down to the Top Bar.
- **App Router**: Added logic to switch to the Settings view overlay.

## 4. **Styling**

- Updated `index.css` with CSS variables for all 3 themes to ensure instant, smooth transitions without page reloads.

## Usage

Click the **Gear Icon** in the top right corner to access the new Settings dashboard.
