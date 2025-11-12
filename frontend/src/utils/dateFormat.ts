const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}

const DEFAULT_LOCALE = 'en-GB'

export const formatDate = (
  value: Date | string,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
  locale = DEFAULT_LOCALE
) => {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}
