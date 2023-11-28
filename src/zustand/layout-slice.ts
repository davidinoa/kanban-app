import { type StateCreator } from 'zustand'
import { type AppStore } from './app-store'

export type LayoutSlice = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isSidebarOpen: boolean) => void
}

export const createLayoutSlice: StateCreator<AppStore, [], [], LayoutSlice> = (
  set,
) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
})
