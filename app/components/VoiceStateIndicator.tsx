'use client';

import { RecognitionState } from '@/lib/voiceManager';

interface VoiceStateIndicatorProps {
  state: RecognitionState;
  transcript?: string;
}

const stateConfig = {
  idle: {
    label: 'Ready',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    icon: '⭕',
  },
  listening: {
    label: 'Listening',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    icon: '🎙️',
    pulse: true,
  },
  processing: {
    label: 'Processing',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    icon: '⚙️',
    pulse: true,
  },
  speaking: {
    label: 'Speaking',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    icon: '🔊',
    pulse: true,
  },
  error: {
    label: 'Error',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    icon: '⚠️',
  },
};

export const VoiceStateIndicator = ({
  state,
  transcript,
}: VoiceStateIndicatorProps) => {
  const config = stateConfig[state];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full ${config.color} ${
            config.pulse ? 'animate-pulse' : ''
          }`}
        />
        <span className={`text-sm font-semibold ${config.textColor}`}>
          {config.icon} {config.label}
        </span>
      </div>

      {transcript && state === 'listening' && (
        <div className="text-sm text-gray-600 italic max-w-xs text-center">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceStateIndicator;
