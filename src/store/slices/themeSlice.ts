import { createSlice } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';

export interface ThemeState {
  mode: PaletteMode;
  sidebarOpen: boolean;
  sidebarWidth: number;
  compactMode: boolean;
}

const initialState: ThemeState = {
  mode: 'dark', // Default to dark mode as requested
  sidebarOpen: true,
  sidebarWidth: 280,
  compactMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Store preference in localStorage
      localStorage.setItem('theme-mode', state.mode);
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme-mode', state.mode);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem('sidebar-open', JSON.stringify(state.sidebarOpen));
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
      localStorage.setItem('sidebar-open', JSON.stringify(state.sidebarOpen));
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
      localStorage.setItem('sidebar-width', JSON.stringify(state.sidebarWidth));
    },
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
      localStorage.setItem('compact-mode', JSON.stringify(state.compactMode));
    },
    setCompactMode: (state, action) => {
      state.compactMode = action.payload;
      localStorage.setItem('compact-mode', JSON.stringify(state.compactMode));
    },
    initializeTheme: (state) => {
      // Load preferences from localStorage
      const savedMode = localStorage.getItem('theme-mode') as PaletteMode;
      const savedSidebarOpen = localStorage.getItem('sidebar-open');
      const savedSidebarWidth = localStorage.getItem('sidebar-width');
      const savedCompactMode = localStorage.getItem('compact-mode');

      if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
        state.mode = savedMode;
      }
      if (savedSidebarOpen !== null) {
        state.sidebarOpen = JSON.parse(savedSidebarOpen);
      }
      if (savedSidebarWidth !== null) {
        state.sidebarWidth = JSON.parse(savedSidebarWidth);
      }
      if (savedCompactMode !== null) {
        state.compactMode = JSON.parse(savedCompactMode);
      }
    },
  },
});

export const {
  toggleTheme,
  setThemeMode,
  toggleSidebar,
  setSidebarOpen,
  setSidebarWidth,
  toggleCompactMode,
  setCompactMode,
  initializeTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
