import { useState } from 'react'

const STORAGE_KEY = 'quote_extractor_api_key'

function initApiKey() {
  // 1. Check URL ?token= parameter
  const params = new URLSearchParams(window.location.search)
  const urlToken = params.get('token')
  if (urlToken && urlToken.trim().startsWith('sk-ant-')) {
    const trimmed = urlToken.trim()
    localStorage.setItem(STORAGE_KEY, trimmed)
    // Remove token from URL without triggering a reload
    params.delete('token')
    const newSearch = params.toString()
    const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash
    window.history.replaceState(null, '', newUrl)
    return trimmed
  }

  // 2. Check environment variable (set at build time)
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (envKey && envKey.trim().startsWith('sk-ant-')) {
    return envKey.trim()
  }

  // 3. Fall back to localStorage
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState(initApiKey)

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
