'use client';

import { useState, useCallback, useRef } from 'react';
import { useVoiceStore } from '@/store/voiceStore';
import { handleMicrophoneError, logError } from './errorHandler';

export type RecognitionState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceManagerConfig {
  language?: string;
  continuousMode?: boolean;
  interimResults?: boolean;
  autoStop?: boolean;
}

export class VoiceManager {
  private recognition: any;
  private state: RecognitionState = 'idle';
  private transcript: string = '';
  private isSupported: boolean;
  private config: Required<VoiceManagerConfig>;

  constructor(config: VoiceManagerConfig = {}) {
    this.config = {
      language: config.language || 'en-US',
      continuousMode: config.continuousMode ?? true,
      interimResults: config.interimResults ?? true,
      autoStop: config.autoStop ?? true,
    };

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    this.isSupported = !!SpeechRecognition;

    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.language = this.config.language;
    this.recognition.continuous = this.config.continuousMode;
    this.recognition.interimResults = this.config.interimResults;

    this.recognition.onerror = (event: any) => {
      const error = new Error(`Speech recognition error: ${event.error}`);
      handleMicrophoneError(error);
      this.state = 'error';
    };

    this.recognition.onend = () => {
      this.state = 'idle';
    };
  }

  public async start(): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Speech Recognition API is not supported in this browser');
    }

    try {
      this.state = 'listening';
      this.transcript = '';
      this.recognition.start();
    } catch (error) {
      handleMicrophoneError(error as Error);
      this.state = 'error';
      throw error;
    }
  }

  public stop(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.state = 'idle';
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.state = 'idle';
      this.transcript = '';
    }
  }

  public getState(): RecognitionState {
    return this.state;
  }

  public getTranscript(): string {
    return this.transcript;
  }

  public setState(state: RecognitionState): void {
    this.state = state;
  }

  public setTranscript(transcript: string): void {
    this.transcript = transcript;
  }
}

/**
 * React hook for voice recognition management
 */
export const useVoiceManager = (config?: VoiceManagerConfig) => {
  const [state, setState] = useState<RecognitionState>('idle');
  const [transcript, setTranscript] = useState('');
  const voiceManagerRef = useRef<VoiceManager | null>(null);
  const store = useVoiceStore();

  const initializeManager = useCallback(() => {
    if (!voiceManagerRef.current) {
      voiceManagerRef.current = new VoiceManager(config);
    }
    return voiceManagerRef.current;
  }, [config]);

  const startListening = useCallback(async () => {
    try {
      const manager = initializeManager();
      setState('listening');
      await manager.start();
      store.setRecordingState(true);
    } catch (error) {
      setState('error');
      logError(error as Error, { context: 'startListening' });
    }
  }, [initializeManager, store]);

  const stopListening = useCallback(() => {
    const manager = voiceManagerRef.current;
    if (manager) {
      manager.stop();
      setState('idle');
      store.setRecordingState(false);
    }
  }, [store]);

  const abortListening = useCallback(() => {
    const manager = voiceManagerRef.current;
    if (manager) {
      manager.abort();
      setState('idle');
      setTranscript('');
      store.setRecordingState(false);
    }
  }, [store]);

  return {
    state,
    transcript,
    startListening,
    stopListening,
    abortListening,
    isSupported: typeof window !== 'undefined' && (!!window.webkitSpeechRecognition || !!window.SpeechRecognition),
  };
};
