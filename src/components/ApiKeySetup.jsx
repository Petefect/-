import React, { useState } from 'react'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!key.trim()) {
      setError('请输入 API Key')
      return
    }
    if (!key.trim().startsWith('sk-ant-')) {
      setError('API Key 格式不正确，应以 sk-ant- 开头')
      return
    }
    onSave(key.trim())
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-[480px] w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✦</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">金句提取器</h1>
          <p className="text-gray-500 text-sm">从图片中提取有价值的金句和观点</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-medium text-gray-700 mb-1">设置 Anthropic API Key</h2>
          <p className="text-xs text-gray-400 mb-4">
            API Key 仅存储在本地，不会上传至任何服务器。
            <br />
            前往{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Anthropic Console
            </a>{' '}
            获取 Key。
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value)
                setError('')
              }}
              placeholder="sk-ant-..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:border-gray-400 transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 bg-gray-800 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-700 active:bg-gray-900 transition-colors"
            >
              开始使用
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          使用 Claude Vision API 进行图片文字识别
        </p>
      </div>
    </div>
  )
}
