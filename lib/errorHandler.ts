/**
 * Error Handler Utility
 * Centralized error handling for voice assistant
 */

export enum ErrorType {
  MICROPHONE = 'MICROPHONE_ERROR',
  SPEECH_RECOGNITION = 'SPEECH_RECOGNITION_ERROR',
  API_ERROR = 'API_ERROR',
  LLM_ERROR = 'LLM_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  statusCode?: number;
  isRetryable: boolean;
}

export class VoiceAssistantError extends Error implements AppError {
  type: ErrorType;
  details?: unknown;
  statusCode?: number;
  isRetryable: boolean;

  constructor(
    type: ErrorType,
    message: string,
    details?: unknown,
    statusCode?: number,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'VoiceAssistantError';
    this.type = type;
    this.details = details;
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }
}

/**
 * Handle microphone errors with fallback suggestions
 */
export function handleMicrophoneError(error: Error): AppError {
  if (error.name === 'NotAllowedError') {
    return {
      type: ErrorType.MICROPHONE,
      message: 'Microphone access denied. Please check browser permissions.',
      details: error,
      isRetryable: true
    };
  }

  if (error.name === 'NotFoundError') {
    return {
      type: ErrorType.MICROPHONE,
      message: 'No microphone device found. Please check your hardware.',
      details: error,
      isRetryable: false
    };
  }

  return {
    type: ErrorType.MICROPHONE,
    message: 'Microphone error occurred. Please try again.',
    details: error,
    isRetryable: true
  };
}

/**
 * Handle API/Network errors with retry logic
 */
export function handleApiError(response: Response): AppError {
  const statusCode = response.status;

  // Rate limiting
  if (statusCode === 429) {
    return {
      type: ErrorType.API_ERROR,
      message: 'Rate limited. Please wait before trying again.',
      statusCode,
      isRetryable: true
    };
  }

  // Client errors
  if (statusCode === 400) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Invalid request. Please check your input.',
      statusCode,
      isRetryable: false
    };
  }

  if (statusCode === 401) {
    return {
      type: ErrorType.API_ERROR,
      message: 'API authentication failed. Please check your API key.',
      statusCode,
      isRetryable: false
    };
  }

  // Server errors
  if (statusCode >= 500) {
    return {
      type: ErrorType.API_ERROR,
      message: 'Server error. Please try again later.',
      statusCode,
      isRetryable: true
    };
  }

  return {
    type: ErrorType.NETWORK_ERROR,
    message: 'Network request failed. Please check your connection.',
    statusCode,
    isRetryable: true
  };
}

/**
 * Handle LLM/OpenAI specific errors
 */
export function handleLlmError(error: unknown): AppError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid api key')) {
      return {
        type: ErrorType.LLM_ERROR,
        message: 'OpenAI API key is invalid. Please check your configuration.',
        details: error,
        isRetryable: false
      };
    }

    if (message.includes('rate limit')) {
      return {
        type: ErrorType.LLM_ERROR,
        message: 'OpenAI API rate limit exceeded. Please wait.',
        details: error,
        isRetryable: true
      };
    }

    if (message.includes('timeout')) {
      return {
        type: ErrorType.LLM_ERROR,
        message: 'OpenAI request timeout. Please try again.',
        details: error,
        isRetryable: true
      };
    }
  }

  return {
    type: ErrorType.LLM_ERROR,
    message: 'LLM processing failed. Please try again.',
    details: error,
    isRetryable: true
  };
}

/**
 * Format error for user display
 */
export function formatErrorMessage(error: AppError): string {
  return `${error.message}${error.isRetryable ? ' Try again.' : ''}`;
}

/**
 * Log error for debugging
 */
export function logError(error: AppError, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  
  console.error(
    `[${timestamp}${contextStr}] ${error.type}: ${error.message}`,
    error.details
  );
}

/**
 * Get retry delay in ms (with exponential backoff)
 */
export function getRetryDelay(attemptCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const delay = baseDelay * Math.pow(2, attemptCount);
  return Math.min(delay, maxDelay);
}
