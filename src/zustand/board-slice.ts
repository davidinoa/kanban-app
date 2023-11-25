import { type StateCreator } from 'zustand'

export type BoardSlice = {
  currentBoardId?: number
  setCurrentBoardId: (id: number) => void
}

export const createBoardSlice: StateCreator<BoardSlice, [], [], BoardSlice> = (
  set,
) => ({
  currentBoardId: undefined,
  setCurrentBoardId: (currentBoardId) => set({ currentBoardId }),
})
