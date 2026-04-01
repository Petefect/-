import React, { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import ImageUpload from './components/ImageUpload.jsx'
import ProcessingQueue from './components/ProcessingQueue.jsx'
import QuoteList from './components/QuoteList.jsx'
import CopyButton from './components/CopyButton.jsx'
import { useApiKey } from './hooks/useApiKey.js'
import { useQuoteExtractor } from './hooks/useQuoteExtractor.js'

export default function App() {
  const { apiKey, saveApiKey, clearApiKey } = useApiKey()
  const {
    images,
    quotes,
    processing,
    currentIndex,
    addImages,
    startProcessing,
    updateQuote,
    deleteQuote,
    toggleQuoteSelected,
    clearAll,
  } = useQuoteExtractor(apiKey)

  const [view, setView] = useState('upload') // 'upload' | 'processing' | 'results'

  if (!apiKey) {
    return <ApiKeySetup onSave={saveApiKey} />
  }

  const handleImagesSelected = (newImages) => {
    addImages(newImages)
    setView('upload')
  }

  const handleStartProcessing = async () => {
    setView('processing')
    await startProcessing()
    setView('results')
  }

  const handleClearAll = () => {
    clearAll()
    setView('upload')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">✦</span>
            <h1 className="text-lg font-semibold text-gray-800">金句提取器</h1>
          </div>
          <button
            onClick={() => clearApiKey()}
            className="text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100"
          >
            设置
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-4 pb-24">
          {view === 'upload' && (
            <ImageUpload
              images={images}
              onImagesSelected={handleImagesSelected}
              onStartProcessing={handleStartProcessing}
              onClear={handleClearAll}
            />
          )}

          {view === 'processing' && (
            <ProcessingQueue
              images={images}
              currentIndex={currentIndex}
              quotes={quotes}
            />
          )}

          {view === 'results' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  共提取 <span className="font-semibold text-gray-800">{quotes.length}</span> 条金句
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100"
                >
                  重新开始
                </button>
              </div>
              <QuoteList
                quotes={quotes}
                onUpdate={updateQuote}
                onDelete={deleteQuote}
                onToggleSelected={toggleQuoteSelected}
              />
            </>
          )}
        </main>

        {/* Fixed bottom copy button - only in results */}
        {view === 'results' && quotes.length > 0 && (
          <CopyButton quotes={quotes} />
        )}
      </div>
    </div>
  )
}
