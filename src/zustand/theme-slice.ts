import { type StateCreator } from 'zustand'
import { type AppStore } from './app-store'

type Theme = 'light' | 'dark'

export type ThemeSlice = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const createThemeSlice: StateCreator<AppStore, [], [], ThemeSlice> = (
  set,
) => ({
  theme: 'light',
  setTheme: (theme) => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    set({ theme })
  },
})
