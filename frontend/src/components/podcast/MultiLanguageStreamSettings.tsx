import React from 'react';


interface MultiLanguageStreamSettingsProps {
  availableLanguages: string[];
  selectedLanguages: string[];
  autoTranslate: boolean;
  subtitlesEnabled: boolean;
  onLanguagesChange: (languages: string[]) => void;
  onToggleAutoTranslate: (enabled: boolean) => void;
  onToggleSubtitles: (enabled: boolean) => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  zh: 'Chinese',
  hi: 'Hindi',
};

const toLabel = (code: string) => LANGUAGE_LABELS[code.toLowerCase()] ?? code.toUpperCase();

export function MultiLanguageStreamSettings({
  availableLanguages,
  selectedLanguages,
  autoTranslate,
  subtitlesEnabled,
  onLanguagesChange,
  onToggleAutoTranslate,
  onToggleSubtitles,
}: MultiLanguageStreamSettingsProps) {
  const currentLanguage = selectedLanguages[0] ?? availableLanguages[0] ?? 'en';

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguagesChange([event.target.value]);
  };

  const handleAutoTranslateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAutoTranslate(event.target.checked);
  };

  const handleSubtitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleSubtitles(event.target.checked);
  };

  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-indigo-900">Multi-language streaming</h2>
          <p className="mt-1 text-sm text-indigo-700">
            Provide a localized broadcast experience with automatic translation and subtitles.
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">Enterprise</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="stream-language" className="block text-sm font-medium text-indigo-900">
            Stream language
          </label>
          <select
            id="stream-language"
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="mt-1 w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm text-indigo-900"
          >
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {toLabel(language)}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-indigo-600">
            Enterprise teams can stream with up to 12 simultaneous language tracks.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={handleAutoTranslateChange}
              className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-indigo-900">Auto-translate chat and captions</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={subtitlesEnabled}
              onChange={handleSubtitleChange}
              className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-indigo-900">Generate live subtitles</span>
          </label>
        </div>
      </div>
    </section>
  );
}

