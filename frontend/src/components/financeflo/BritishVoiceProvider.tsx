import React, { createContext, useContext, ReactNode } from 'react';
import { VOICE_DEFAULTS, getVoiceForContentType } from '@/utils/financeflo/voiceDefaults';
import { logger } from '@/utils/logger';

// British Voice Context
interface BritishVoiceContextType {
  getVoiceSettings: (contentType?: string) => Record<string, unknown>;
  defaultVoice: string;
  isValidVoice: (voice: string) => boolean;
  enforceVoiceStandards: (audioElement: HTMLAudioElement | HTMLVideoElement) => void;
}

const BritishVoiceContext = createContext<BritishVoiceContextType | undefined>(undefined);

// British Voice Provider Component
interface BritishVoiceProviderProps {
  children: ReactNode;
}

export const BritishVoiceProvider: React.FC<BritishVoiceProviderProps> = ({ children }) => {
  const getVoiceSettings = (contentType: string = 'vsl') => {
    const validContentTypes = ['vsl', 'explainer', 'testimonial', 'cta'] as const;
    const type = validContentTypes.includes(contentType as typeof validContentTypes[number]) 
      ? contentType as keyof typeof VOICE_DEFAULTS.contentTypes
      : 'vsl';
    
    return getVoiceForContentType(type);
  };

  const isValidVoice = (voice: string): boolean => {
    // Check for valid female voice - simplified logic
    return voice === 'female_voice';
  };

  const enforceVoiceStandards = (element: HTMLAudioElement | HTMLVideoElement) => {
    // Add data attributes to identify British female voice content
    element.setAttribute('data-voice-type', 'british-female');
    element.setAttribute('data-voice-standard', 'financeflo-approved');
    element.setAttribute('data-accent', 'british-english');
    
    // Add event listeners for quality assurance
    element.addEventListener('loadstart', () => {
      logger.debug('Loading British female voice content', { src: element.src });
    });
    
    element.addEventListener('canplay', () => {
      logger.debug('British female voice content ready', { src: element.src });
    });
  };

  const contextValue: BritishVoiceContextType = {
    getVoiceSettings,
    defaultVoice: VOICE_DEFAULTS.defaultVoice,
    isValidVoice,
    enforceVoiceStandards
  };

  return (
    <BritishVoiceContext.Provider value={contextValue}>
      {children}
    </BritishVoiceContext.Provider>
  );
};

// Custom hook to use British Voice context
export const useBritishVoice = (): BritishVoiceContextType => {
  const context = useContext(BritishVoiceContext);
  if (!context) {
    throw new Error('useBritishVoice must be used within a BritishVoiceProvider');
  }
  return context;
};

// HOC for components that use voice content
export const withBritishVoice = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <BritishVoiceProvider>
      <Component {...props} />
    </BritishVoiceProvider>
  );
};

export default BritishVoiceProvider;

