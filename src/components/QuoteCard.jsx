import React, { useState } from 'react'

export default function QuoteCard({ quote, onUpdate, onDelete, onToggleSelected, readOnly = false }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(quote.text)
  const [editTags, setEditTags] = useState(quote.tags.join(', '))
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    const updatedTags = editTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    onUpdate(quote.id, {
      text: editText.trim(),
      tags: updatedTags,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setEditText(quote.text)
    setEditTags(quote.tags.join(', '))
    setEditing(false)
  }

  const handleAddTag = () => {
    const tag = newTag.trim()
    if (tag && !quote.tags.includes(tag)) {
      onUpdate(quote.id, { tags: [...quote.tags, tag] })
      setEditTags([...quote.tags, tag].join(', '))
    }
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = quote.tags.filter(t => t !== tagToRemove)
    onUpdate(quote.id, { tags: updatedTags })
    setEditTags(updatedTags.join(', '))
  }

  const isDeselected = quote.selected === false

  if (readOnly) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-800 text-sm leading-relaxed">「{quote.text}」</p>
        {quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {quote.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm transition-opacity ${isDeselected ? 'opacity-40' : ''}`}>
      {editing ? (
        /* Edit mode */
        <div className="space-y-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 resize-none focus:border-gray-400 transition-colors"
            rows={4}
            autoFocus
          />
          <div>
            <label className="text-xs text-gray-400 mb-1 block">标签（用逗号分隔）</label>
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:border-gray-400 transition-colors"
              placeholder="成长, 效率, 人际"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-800 text-white rounded-xl py-2 text-sm font-medium hover:bg-gray-700 active:bg-gray-900 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        /* View mode */
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {/* Checkbox */}
              <button
                onClick={() => onToggleSelected(quote.id)}
                className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  isDeselected
                    ? 'border-gray-300 bg-white'
                    : 'border-gray-800 bg-gray-800'
                }`}
              >
                {!isDeselected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Quote text */}
              <p
                onClick={() => setEditing(true)}
                className="text-gray-800 text-sm leading-relaxed cursor-pointer flex-1"
              >
                「{quote.text}」
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="编辑"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                  <path d="M11.5 2.5l2 2L5 13l-2.5.5.5-2.5L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => onDelete(quote.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Tags */}
          {quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 ml-6">
              {quote.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source info */}
          {quote.imageName && (
            <p className="text-xs text-gray-300 mt-2 ml-6 truncate">
              来源: {quote.imageName}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
