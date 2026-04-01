import React from 'react'
import SkeletonCard from './SkeletonCard.jsx'
import QuoteCard from './QuoteCard.jsx'

export default function ProcessingQueue({ images, currentIndex, quotes }) {
  const totalImages = images.length
  const doneImages = images.filter(img => img.status === 'done' || img.status === 'error').length
  const processingImages = images.filter(img => img.status === 'processing')
  const isProcessing = processingImages.length > 0

  const progressPercent = totalImages > 0 ? Math.round((doneImages / totalImages) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {isProcessing
              ? `正在处理 ${doneImages + 1}/${totalImages}...`
              : `已完成 ${doneImages}/${totalImages}`}
          </span>
          <span className="text-sm text-gray-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gray-800 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {isProcessing && (
          <p className="text-xs text-gray-400 mt-2">
            正在识别图片中的文字并提取金句...
          </p>
        )}
      </div>

      {/* Image thumbnails with status */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, idx) => (
          <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={image.preview}
              alt={image.name}
              className="w-full h-full object-cover"
            />
            {image.status === 'processing' && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {image.status === 'done' && (
              <div className="absolute inset-0 bg-green-500 bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-base font-bold">✓</span>
              </div>
            )}
            {image.status === 'error' && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Extracted quotes so far */}
      {quotes.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-3">已提取 {quotes.length} 条金句</p>
          <div className="space-y-3">
            {quotes.map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                readOnly
              />
            ))}
          </div>
        </div>
      )}

      {/* Skeleton cards for currently processing image */}
      {isProcessing && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
    </div>
  )
}
