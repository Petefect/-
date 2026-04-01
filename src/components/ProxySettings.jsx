import React, { useState } from 'react'

const CONNECTION_MODE_LABELS = {
  default: '默认',
  direct: '直连',
  custom: '自定义',
}

const ROUTING_MODE_LABELS = {
  global: '全局模式',
  bypass: '绕过模式',
}

export default function ProxySettings({ settings, onSave, onBack }) {
  const [local, setLocal] = useState(settings)
  const [showConnectionPicker, setShowConnectionPicker] = useState(false)
  const [showRoutingPicker, setShowRoutingPicker] = useState(false)
  const [portError, setPortError] = useState('')

  const update = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }))

  const handlePortChange = (val) => {
    setPortError('')
    update('localPort', val)
  }

  const handleSave = () => {
    const port = parseInt(local.localPort, 10)
    if (local.connectionMode !== 'default' && (isNaN(port) || port < 1 || port > 65535)) {
      setPortError('端口范围：1 - 65535')
      return
    }
    onSave(local)
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 p-1 -ml-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800">连接设置</h1>
        </header>

        <main className="flex-1 px-4 py-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {/* Connection Mode */}
            <button
              className="w-full flex items-center px-4 py-4 gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
              onClick={() => setShowConnectionPicker(true)}
            >
              <span className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">连接模式</p>
                <p className="text-xs text-gray-400 mt-0.5">{CONNECTION_MODE_LABELS[local.connectionMode]}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Custom Proxy URL (shown when mode is 'custom') */}
            {local.connectionMode === 'custom' && (
              <div className="px-4 py-4 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-2">代理地址</p>
                  <input
                    type="url"
                    value={local.proxyUrl}
                    onChange={(e) => update('proxyUrl', e.target.value)}
                    placeholder="https://your-proxy.example.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-gray-400 transition-colors"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Local Port */}
            <div className="px-4 py-4 flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 mb-2">本地端口</p>
                <input
                  type="number"
                  value={local.localPort}
                  onChange={(e) => handlePortChange(e.target.value)}
                  min="1"
                  max="65535"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-gray-400 transition-colors"
                />
                {portError && <p className="text-xs text-red-500 mt-1">{portError}</p>}
              </div>
            </div>

            {/* Routing Mode */}
            <button
              className="w-full flex items-center px-4 py-4 gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
              onClick={() => setShowRoutingPicker(true)}
            >
              <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">路由模式</p>
                <p className="text-xs text-gray-400 mt-0.5">{ROUTING_MODE_LABELS[local.routingMode]}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Safe Mode */}
            <div className="flex items-center px-4 py-4 gap-3">
              <span className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">安全模式</p>
                <p className="text-xs text-gray-400 mt-0.5">使用私密DNS服务</p>
              </div>
              <button
                onClick={() => update('safeMode', !local.safeMode)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  local.safeMode ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    local.safeMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-4 bg-gray-800 text-white rounded-2xl py-3 text-sm font-medium hover:bg-gray-700 active:bg-gray-900 transition-colors"
          >
            保存设置
          </button>
        </main>
      </div>

      {/* Connection Mode Picker */}
      {showConnectionPicker && (
        <Picker
          title="连接模式"
          options={Object.entries(CONNECTION_MODE_LABELS).map(([value, label]) => ({ value, label }))}
          selected={local.connectionMode}
          onSelect={(val) => { update('connectionMode', val); setShowConnectionPicker(false) }}
          onClose={() => setShowConnectionPicker(false)}
        />
      )}

      {/* Routing Mode Picker */}
      {showRoutingPicker && (
        <Picker
          title="路由模式"
          options={Object.entries(ROUTING_MODE_LABELS).map(([value, label]) => ({ value, label }))}
          selected={local.routingMode}
          onSelect={(val) => { update('routingMode', val); setShowRoutingPicker(false) }}
          onClose={() => setShowRoutingPicker(false)}
        />
      )}
    </div>
  )
}

function Picker({ title, options, selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-[480px] bg-white rounded-t-2xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-800">{title}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {options.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="text-sm text-gray-800">{label}</span>
              {selected === value && (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  )
}
