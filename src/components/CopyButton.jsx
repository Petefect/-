import React, { useState } from 'react'
import { toFlomoFormat } from '../utils/flomoFormat.js'

export default function CopyButton({ quotes }) {
  const [copied, setCopied] = useState(false)

  const selectedQuotes = quotes.filter(q => q.selected !== false)
  const selectedCount = selectedQuotes.length

  const handleCopy = async () => {
    if (selectedCount === 0) return

    const text = toFlomoFormat(quotes)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center px-4 pb-6 pt-3 bg-gradient-to-t from-gray-50 to-transparent">
      <div className="w-full max-w-[480px]">
        <button
          onClick={handleCopy}
          disabled={selectedCount === 0}
          className={`w-full rounded-2xl py-4 text-sm font-medium shadow-lg transition-all ${
            copied
              ? 'bg-green-600 text-white'
              : selectedCount === 0
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 active:scale-[0.98]'
          }`}
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              已复制到剪贴板
            </span>
          ) : (
            `一键复制全部${selectedCount > 0 ? ` (${selectedCount} 条)` : ''}`
          )}
        </button>
      </div>
    </div>
  )
}
