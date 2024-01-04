import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createBoardSlice, type BoardSlice } from './board-slice'
import { createThemeSlice, type ThemeSlice } from './theme-slice'

export type AppStore = BoardSlice & ThemeSlice

const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createBoardSlice(...args),
      ...createThemeSlice(...args),
    }),
    {
      name: 'kanban-app-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,

      // onRehydrateStorage: () => (state) => {
      //   if (state?.theme === 'dark')
      //     document.documentElement.classList.add('dark')
      // },
    },
  ),
)

export default useAppStore
