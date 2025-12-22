// Type definitions for Dev Voice Assistant

export interface User {
  id: string
  email?: string | null
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Command {
  id: string
  userId: string
  transcript: string
  context?: string | null
  response: string
  commandType: string
  metadata?: string | null
  createdAt: Date
}

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface AnalysisResult {
  response: string
  commandId: string
  tokensUsed?: number
}

export type CommandType =
  | 'github_pr'
  | 'error_log'
  | 'commit_msg'
  | 'code_review'
  | 'api_docs'
  | 'default'

export interface AssistantState {
  isListening: boolean
  isProcessing: boolean
  currentTranscript: string
  currentResponse: string | null
  error: string | null
  commandHistory: Command[]
  userId: string | null
}

export interface AssistantActions {
  setListening: (isListening: boolean) => void
  setProcessing: (isProcessing: boolean) => void
  setTranscript: (transcript: string) => void
  setResponse: (response: string | null) => void
  setError: (error: string | null) => void
  addToHistory: (command: Command) => void
  setHistory: (history: Command[]) => void
  setUserId: (userId: string) => void
  reset: () => void
}