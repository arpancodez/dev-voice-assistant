import { create } from 'zustand'
import { AssistantState, AssistantActions, Command } from '@/types'

type AssistantStore = AssistantState & AssistantActions

const initialState: AssistantState = {
  isListening: false,
  isProcessing: false,
  currentTranscript: '',
  currentResponse: null,
  error: null,
  commandHistory: [],
  userId: null,
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  ...initialState,

  setListening: (isListening) => set({ isListening }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setTranscript: (currentTranscript) => set({ currentTranscript }),

  setResponse: (currentResponse) => set({ currentResponse }),

  setError: (error) => set({ error }),

  addToHistory: (command) =>
    set((state) => ({
      commandHistory: [command, ...state.commandHistory],
    })),

  setHistory: (commandHistory) => set({ commandHistory }),

  setUserId: (userId) => set({ userId }),

  reset: () => set(initialState),
}))