import React, { useState } from 'react'

type ExportFormat = 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'text/html'

type ExportOptions = {
  format: ExportFormat
  margin: number
  fontFamily: string
  includeCoverPage: boolean
}

type DocumentExporterProps = {
  onExport: (options: ExportOptions) => Promise<void> | void
  exporting?: boolean
  defaultFormat?: ExportFormat
}

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'application/pdf', label: 'PDF' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (.docx)' },
  { value: 'text/html', label: 'HTML' },
]

const FONTS = ['Inter', 'Georgia', 'Times New Roman', 'Helvetica']

export const DocumentExporter: React.FC<DocumentExporterProps> = ({
  onExport,
  exporting = false,
  defaultFormat = 'application/pdf',
}) => {
  const [format, setFormat] = useState<ExportFormat>(defaultFormat)
  const [margin, setMargin] = useState(15)
  const [fontFamily, setFontFamily] = useState('Inter')
  const [includeCoverPage, setIncludeCoverPage] = useState(true)

  const handleExport = async (event: React.FormEvent) => {
    event.preventDefault()
    await onExport({ format, margin, fontFamily, includeCoverPage })
  }

  return (
    <section className="space-y-4" aria-label="Export document">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Export</h2>
        <p className="text-xs text-slate-500">
          Choose the format and presentation options for the generated document.
        </p>
      </header>

      <form className="space-y-3" onSubmit={handleExport}>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Export format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as ExportFormat)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Export format"
          >
            {FORMATS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Margin (mm)
          <input
            type="number"
            min={5}
            max={50}
            step={1}
            value={margin}
            onChange={(event) => setMargin(Number(event.target.value) || 0)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Font family
          <select
            value={fontFamily}
            onChange={(event) => setFontFamily(event.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={includeCoverPage}
            onChange={(event) => setIncludeCoverPage(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Include branded cover page
        </label>

        <button
          type="submit"
          disabled={exporting}
          className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exporting ? 'Preparing export…' : 'Queue export'}
        </button>
      </form>
    </section>
  )
}
