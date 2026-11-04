import { useState } from 'react'
import { persistMockAuthState, useMockAuthState } from '../mock/access'

const loginOptions = [
  { value: 'logged_out', label: '未登录' },
  { value: 'logged_in_authorized', label: '已登录并授权' },
] as const

type SimulationOption = (typeof loginOptions)[number]['value']

export function PrototypeAuthPanel() {
  const [open, setOpen] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const { loginStatus } = useMockAuthState()
  const currentOption: SimulationOption = loginStatus === 'logged_in' ? 'logged_in_authorized' : 'logged_out'
  const currentLabel = currentOption === 'logged_in_authorized' ? '已登录 · 已授权' : '未登录'

  const applyStatus = (value: SimulationOption) => {
    const saved = persistMockAuthState(value === 'logged_in_authorized'
      ? { loginStatus: 'logged_in', accessStatus: 'authorized' }
      : { loginStatus: 'logged_out', accessStatus: 'not-applied' })
    setSaveError(!saved)
  }

  return <div className="prototype-auth-widget">
    {open && <section className="prototype-auth-panel" aria-label="原型调试面板">
      <header><h2>原型调试</h2><button type="button" aria-label="收起原型调试面板" onClick={() => setOpen(false)}>×</button></header>
      <div className="prototype-auth-current"><span>当前模拟状态</span><b>{currentLabel}</b></div>
      <fieldset><legend>登录状态</legend><div className="prototype-auth-radio-list">
        {loginOptions.map(({ value, label }) => <label className={`prototype-auth-radio${currentOption === value ? ' is-selected' : ''}`} key={value}>
          <input type="radio" name="prototype-login-status" value={value} checked={currentOption === value} onChange={() => applyStatus(value)} />
          <span>{label}</span>
        </label>)}
      </div></fieldset>
      {saveError && <p className="prototype-auth-save-error" role="alert">保存失败，请重试。</p>}
    </section>}
    <button className={`prototype-auth-launcher${open ? ' is-open' : ''}`} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="prototype-auth-launcher-dot" />原型调试</button>
  </div>
}
