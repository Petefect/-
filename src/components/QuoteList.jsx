import React from 'react'
import QuoteCard from './QuoteCard.jsx'

export default function QuoteList({ quotes, onUpdate, onDelete, onToggleSelected }) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-3xl mb-2">🔍</div>
        <p className="text-sm">暂无金句</p>
      </div>
    )
  }

  const selectedCount = quotes.filter(q => q.selected !== false).length

  return (
    <div className="space-y-3">
      {selectedCount < quotes.length && (
        <p className="text-xs text-gray-400 text-center">
          已选择 {selectedCount}/{quotes.length} 条
        </p>
      )}
      {quotes.map(quote => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleSelected={onToggleSelected}
        />
      ))}
    </div>
  )
}
