import { useState } from 'react'

type QuickStartCodeBlockProps = {
  title: string
  language: string
  code: string
}

export function QuickStartCodeBlock({ title, language, code }: QuickStartCodeBlockProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copyCode = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const temporaryInput = document.createElement('textarea')
        temporaryInput.value = code
        temporaryInput.setAttribute('readonly', '')
        temporaryInput.style.position = 'fixed'
        temporaryInput.style.opacity = '0'
        document.body.append(temporaryInput)
        temporaryInput.select()
        const copied = document.execCommand('copy')
        temporaryInput.remove()
        if (!copied) throw new Error('Clipboard copy unavailable')
      }
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
    window.setTimeout(() => setCopyStatus('idle'), 1800)
  }

  return (
    <div className="quick-code-block">
      <div className="quick-code-toolbar"><span>{title}</span><div><span>{language}</span><button type="button" onClick={copyCode}>{copyStatus === 'copied' ? '已复制' : copyStatus === 'failed' ? '复制失败' : '复制代码'}</button></div></div>
      <pre><code>{code}</code></pre>
    </div>
  )
}
