import { type StateCreator } from 'zustand'
import { type RouterOutputs } from '~/trpc/shared'

type Board = RouterOutputs['boards']['getById']

export type BoardSlice = {
  currentBoard?: Board
  setCurrentBoard: (currentBoard: Board) => void
}

export const createBoardSlice: StateCreator<BoardSlice, [], [], BoardSlice> = (
  set,
) => ({
  currentBoard: undefined,
  setCurrentBoard: (currentBoard) => set({ currentBoard }),
})
