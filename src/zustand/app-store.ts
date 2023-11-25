import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createBoardSlice, type BoardSlice } from './board-slice'
import { createLayoutSlice, type LayoutSlice } from './layout-slice'

const useAppStore = create<BoardSlice & LayoutSlice>()(
  persist(
    (...args) => ({
      ...createBoardSlice(...args),
      ...createLayoutSlice(...args),
    }),
    {
      name: 'kanban-app-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useAppStore
