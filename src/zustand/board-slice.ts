import { type StateCreator } from 'zustand'
import { type RouterOutputs } from '~/trpc/shared'
import { type AppStore } from './app-store'

type Board = RouterOutputs['boards']['getById']

export type BoardSlice = {
  currentBoard?: Board
  viewingTaskId?: string | number
  setCurrentBoard: (currentBoard?: Board) => void
  setViewingTaskId: (viewingTaskId?: string | number) => void
}

export const createBoardSlice: StateCreator<AppStore, [], [], BoardSlice> = (
  set,
) => ({
  currentBoard: undefined,
  viewingTaskId: undefined,
  setCurrentBoard: (currentBoard) => set({ currentBoard }),
  setViewingTaskId: (viewingTaskId) => set({ viewingTaskId }),
})
