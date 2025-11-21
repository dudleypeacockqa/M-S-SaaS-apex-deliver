// Voice configuration defaults for FinanceFlo.ai
// Establishes British female voice as the default for all audio and video content

export const VOICE_DEFAULTS = {
  // Primary voice configuration
  defaultVoice: 'female_voice' as const,
  defaultAccent: 'british' as const,
  defaultLanguage: 'en-GB' as const,
  
  // Voice characteristics
  voiceSettings: {
    tone: 'professional',
    style: 'confident',
    pace: 'moderate',
    clarity: 'high'
  },
  
  // Content-specific voice configurations
  contentTypes: {
    vsl: {
      voice: 'female_voice',
      accent: 'british',
      tone: 'engaging',
      style: 'authoritative'
    },
    explainer: {
      voice: 'female_voice',
      accent: 'british',
      tone: 'educational',
      style: 'clear'
    },
    testimonial: {
      voice: 'female_voice',
      accent: 'british',
      tone: 'authentic',
      style: 'conversational'
    },
    cta: {
      voice: 'female_voice',
      accent: 'british',
      tone: 'motivational',
      style: 'urgent'
    }
  },
  
  // Quality standards
  audioQuality: {
    sampleRate: 24000,
    bitRate: 384,
    format: 'wav',
    channels: 'mono'
  },
  
  // Brand voice guidelines
  brandVoice: {
    personality: 'Professional, confident, trustworthy',
    vocabulary: 'Business-focused, UK terminology',
    pronunciation: 'Clear British English pronunciation',
    emphasis: 'AI+ERP combination, transformation results'
  }
} as const;

// Voice validation function
export const validateVoiceSettings = (settings: Record<string, unknown>) => {
  return {
    voice: settings.voice || VOICE_DEFAULTS.defaultVoice,
    accent: settings.accent || VOICE_DEFAULTS.defaultAccent,
    language: settings.language || VOICE_DEFAULTS.defaultLanguage
  };
};

// Get voice settings for specific content type
export const getVoiceForContentType = (contentType: keyof typeof VOICE_DEFAULTS.contentTypes) => {
  return VOICE_DEFAULTS.contentTypes[contentType] || VOICE_DEFAULTS.contentTypes.vsl;
};

export default VOICE_DEFAULTS;

