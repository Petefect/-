import { useState } from 'react'

const STORAGE_KEY = 'proxy_settings'

const defaultSettings = {
  connectionMode: 'default', // 'default' | 'direct' | 'custom'
  proxyUrl: '',
  localPort: '7890',
  routingMode: 'global', // 'global' | 'bypass'
  safeMode: true,
}

export function useProxySettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const saveSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  }

  const getApiBaseUrl = () => {
    if (settings.connectionMode === 'direct') return 'https://api.anthropic.com'
    if (settings.connectionMode === 'custom' && settings.proxyUrl) {
      return settings.proxyUrl.replace(/\/$/, '')
    }
    return '/anthropic-api'
  }

  return { settings, saveSettings, getApiBaseUrl }
}
