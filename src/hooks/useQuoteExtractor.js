import { useState, useRef } from 'react'
import { extractQuotesFromImage } from '../utils/claudeApi.js'

export function useQuoteExtractor(apiKey, apiBaseUrl = '/anthropic-api') {
  const [images, setImages] = useState([])
  const [quotes, setQuotes] = useState([])
  const [processing, setProcessing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const idCounter = useRef(0)

  const generateId = () => {
    idCounter.current += 1
    return `id_${Date.now()}_${idCounter.current}`
  }

  const addImages = (newFiles) => {
    const newImages = newFiles.map(file => ({
      id: generateId(),
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      status: 'pending', // pending | processing | done | error
      error: null,
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const startProcessing = async () => {
    setProcessing(true)
    const currentImages = images.filter(img => img.status === 'pending')

    for (let i = 0; i < currentImages.length; i++) {
      const image = currentImages[i]
      setCurrentIndex(i)

      // Update status to processing
      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, status: 'processing' } : img
      ))

      try {
        const base64 = await fileToBase64(image.file)
        const mimeType = image.file.type || 'image/jpeg'
        const result = await extractQuotesFromImage(base64, mimeType, apiKey, apiBaseUrl)

        // Add quotes with unique IDs
        const newQuotes = (result.quotes || []).map(q => ({
          id: generateId(),
          text: q.text,
          tags: q.tags || [],
          selected: true,
          imageId: image.id,
          imageName: image.name,
        }))

        setQuotes(prev => [...prev, ...newQuotes])

        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, status: 'done' } : img
        ))
      } catch (err) {
        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, status: 'error', error: err.message } : img
        ))
      }
    }

    setProcessing(false)
    setCurrentIndex(-1)
  }

  const updateQuote = (id, updates) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuote = (id) => {
    setQuotes(prev => prev.filter(q => q.id !== id))
  }

  const toggleQuoteSelected = (id) => {
    setQuotes(prev => prev.map(q =>
      q.id === id ? { ...q, selected: q.selected === false ? true : false } : q
    ))
  }

  const clearAll = () => {
    // Revoke object URLs to avoid memory leaks
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
    setQuotes([])
    setProcessing(false)
    setCurrentIndex(-1)
  }

  return {
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
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
