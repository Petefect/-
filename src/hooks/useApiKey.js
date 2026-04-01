import { useState } from 'react'

const STORAGE_KEY = 'quote_extractor_api_key'

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || ''
  })

  const saveApiKey = (key) => {
    const trimmed = key.trim()
    localStorage.setItem(STORAGE_KEY, trimmed)
    setApiKey(trimmed)
  }

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
  }

  return { apiKey, saveApiKey, clearApiKey }
}
