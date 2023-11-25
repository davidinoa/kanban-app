import { type StateCreator } from 'zustand'
import { type BoardSlice } from './board-slice'

export type LayoutSlice = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isSidebarOpen: boolean) => void
}

export const createLayoutSlice: StateCreator<
  LayoutSlice & BoardSlice,
  [],
  [],
  LayoutSlice
> = (set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
})
