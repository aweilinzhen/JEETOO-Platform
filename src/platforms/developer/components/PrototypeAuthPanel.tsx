import { useEffect, useState } from 'react'
import {
  persistMockAuthState,
  useMockAuthState,
  type DeveloperAccessStatus,
  type DeveloperLoginStatus,
} from '../mock/access'

const accessOptions: Array<[DeveloperAccessStatus, string]> = [
  ['not-applied', '未申请'],
  ['pending', '审核中'],
  ['rejected', '审核未通过'],
  ['authorized', '已授权'],
]

const loginOptions: Array<[DeveloperLoginStatus, string]> = [
  ['logged_out', '未登录'],
  ['logged_in', '已登录'],
]

export function PrototypeAuthPanel() {
  const [open, setOpen] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const { loginStatus, accessStatus } = useMockAuthState()
  const [pendingLoginStatus, setPendingLoginStatus] = useState(loginStatus)
  const [pendingAccessStatus, setPendingAccessStatus] = useState(accessStatus)
  useEffect(() => {
    setPendingLoginStatus(loginStatus)
    setPendingAccessStatus(accessStatus)
  }, [loginStatus, accessStatus])

  const applyStatus = () => {
    if (pendingLoginStatus === loginStatus && pendingAccessStatus === accessStatus) return
    if (!persistMockAuthState({ loginStatus: pendingLoginStatus, accessStatus: pendingAccessStatus })) {
      setSaveError(true)
      return
    }
    window.location.reload()
  }

  const resetStatus = () => {
    if (!persistMockAuthState({ loginStatus: 'logged_out', accessStatus: 'not-applied' })) {
      setSaveError(true)
      return
    }
    window.location.reload()
  }

  const hasChanges = pendingLoginStatus !== loginStatus || pendingAccessStatus !== accessStatus

  return <div className="prototype-auth-widget">
    {open && <section className="prototype-auth-panel" aria-label="原型调试面板">
      <header><h2>原型调试</h2><button type="button" aria-label="收起原型调试面板" onClick={() => setOpen(false)}>×</button></header>
      <div className="prototype-auth-current"><span>当前模拟状态</span><b>{loginOptions.find(([value]) => value === loginStatus)?.[1]} · {accessOptions.find(([value]) => value === accessStatus)?.[1]}</b></div>
      <fieldset><legend>登录状态</legend><div className="prototype-auth-radio-list">
        {loginOptions.map(([value, label]) => <label className={`prototype-auth-radio${pendingLoginStatus === value ? ' is-selected' : ''}`} key={value}>
          <input type="radio" name="prototype-login-status" value={value} checked={pendingLoginStatus === value} onChange={() => { setPendingLoginStatus(value); setSaveError(false) }} />
          <span>{label}</span>
        </label>)}
      </div></fieldset>
      <fieldset><legend>SDK 授权状态</legend><div className="prototype-auth-radio-list">
        {accessOptions.map(([value, label]) => <label className={`prototype-auth-radio${pendingAccessStatus === value ? ' is-selected' : ''}`} key={value}>
          <input type="radio" name="prototype-access-status" value={value} checked={pendingAccessStatus === value} onChange={() => { setPendingAccessStatus(value); setSaveError(false) }} />
          <span>{label}</span>
        </label>)}
      </div></fieldset>
      <button className="prototype-auth-confirm" type="button" disabled={!hasChanges} onClick={applyStatus}>确定</button>
      <button className="prototype-auth-reset" type="button" onClick={resetStatus}>重置默认状态</button>
      {saveError && <p className="prototype-auth-save-error" role="alert">保存失败，请重试。</p>}
    </section>}
    <button className={`prototype-auth-launcher${open ? ' is-open' : ''}`} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="prototype-auth-launcher-dot" />原型调试</button>
  </div>
}
