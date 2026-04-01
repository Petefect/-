export function toFlomoFormat(quotes) {
  return quotes
    .filter(q => q.selected !== false)
    .map(q => `「${q.text}」\n\n${q.tags.map(t => '#' + t).join(' ')}`)
    .join('\n\n---\n\n')
}
