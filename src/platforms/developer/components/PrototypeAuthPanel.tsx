import { useEffect, useState } from 'react'
import {
  persistMockAccessStatus,
  useMockAuthState,
  type DeveloperAccessStatus,
} from '../mock/access'

const accessOptions: Array<[DeveloperAccessStatus, string]> = [
  ['not-applied', '未申请'],
  ['pending', '审核中'],
  ['rejected', '审核未通过'],
  ['authorized', '已授权'],
]

export function PrototypeAuthPanel() {
  const [open, setOpen] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const { accessStatus } = useMockAuthState()
  const [pendingAccessStatus, setPendingAccessStatus] = useState(accessStatus)
  useEffect(() => setPendingAccessStatus(accessStatus), [accessStatus])
  if (!import.meta.env.DEV) return null

  const applyAccessStatus = () => {
    if (pendingAccessStatus === accessStatus) return
    if (!persistMockAccessStatus(pendingAccessStatus)) {
      setSaveError(true)
      return
    }
    window.location.reload()
  }
  return <div className="prototype-auth-widget">
    {open && <section className="prototype-auth-panel" aria-label="原型调试面板">
      <header><h2>原型调试</h2><button type="button" aria-label="收起原型调试面板" onClick={() => setOpen(false)}>×</button></header>
      <div className="prototype-auth-current"><span>当前生效状态</span><b>{accessOptions.find(([value]) => value === accessStatus)?.[1]}</b></div>
      <fieldset><legend>SDK 授权状态</legend><div className="prototype-auth-radio-list">
        {accessOptions.map(([value, label]) => <label className={`prototype-auth-radio${pendingAccessStatus === value ? ' is-selected' : ''}`} key={value}>
          <input type="radio" name="prototype-access-status" value={value} checked={pendingAccessStatus === value} onChange={() => { setPendingAccessStatus(value); setSaveError(false) }} />
          <span>{label}</span>
        </label>)}
      </div></fieldset>
      <button className="prototype-auth-confirm" type="button" disabled={pendingAccessStatus === accessStatus} onClick={applyAccessStatus}>确定</button>
      {saveError && <p className="prototype-auth-save-error" role="alert">保存失败，请重试。</p>}
    </section>}
    <button className={`prototype-auth-launcher${open ? ' is-open' : ''}`} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="prototype-auth-launcher-dot" />原型调试</button>
  </div>
}
