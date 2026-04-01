import React, { useRef } from 'react'

export default function ImageUpload({ images, onImagesSelected, onStartProcessing, onClear }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onImagesSelected(files)
    }
    // Reset input so same files can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      onImagesSelected(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const pendingImages = images.filter(img => img.status === 'pending')

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-300 hover:bg-white transition-colors"
      >
        <div className="text-3xl mb-2">📷</div>
        <p className="text-gray-600 text-sm font-medium">点击选择图片</p>
        <p className="text-gray-400 text-xs mt-1">支持多张图片批量处理</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Image thumbnails */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">已选择 {images.length} 张</span>
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              清空
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {/* Status overlay */}
                {image.status === 'done' && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-40 flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                )}
                {image.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center">
                    <span className="text-white text-sm">✗</span>
                  </div>
                )}
              </div>
            ))}
            {/* Add more button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:bg-white transition-colors"
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        </div>
      )}

      {/* Start button */}
      {pendingImages.length > 0 && (
        <button
          onClick={onStartProcessing}
          className="w-full bg-gray-800 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-700 active:bg-gray-900 transition-colors"
        >
          开始提取 ({pendingImages.length} 张)
        </button>
      )}
    </div>
  )
}
