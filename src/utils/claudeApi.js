export async function extractQuotesFromImage(imageBase64, mimeType, apiKey, apiBaseUrl = '/anthropic-api') {
  const response = await fetch(`${apiBaseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: '请识别这张图片中的所有文字，然后从中挑选出值得记录的金句或有价值的观点（1-3条）。只输出 JSON 格式：{"quotes": [{"text": "金句内容", "tags": ["标签1", "标签2"]}]}。标签根据内容自动生成，如\u201c成长\u201d、\u201c效率\u201d、\u201c人际\u201d等。',
          },
        ],
      }],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API 调用失败')
  }

  const data = await response.json()
  const text = data.content[0].text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('响应格式无效')
  return JSON.parse(jsonMatch[0])
}
