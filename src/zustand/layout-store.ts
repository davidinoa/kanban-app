import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type LayoutState = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isSidebarOpen: boolean) => void
}

const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    }),
    {
      name: 'kanban-app-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useLayoutStore
