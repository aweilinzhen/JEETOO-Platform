import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { setMockAccessStatus } from '../mock/access'
import {
  createMockApplicationId,
  readLatestMockApplication,
  readMockApplications,
  saveMockApplications,
  type ApplicationFormData,
  type MockApplicationRecord,
} from '../mock/applications'

const emptyForm: ApplicationFormData = {
  contactName: '', phone: '', company: '', email: '', projectName: '', scale: '', purpose: '', description: '',
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const demoVerificationCode = '123456'

export function DeveloperApplyPage() {
  const [form, setForm] = useState<ApplicationFormData>(() => {
    const rejected = readLatestMockApplication('rejected')
    if (!rejected) return emptyForm
    const { contactName, phone, company, email, projectName, scale, purpose, description } = rejected
    return { contactName, phone, company, email, projectName, scale, purpose, description }
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [codeSent, setCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(null)
  const [submittedId, setSubmittedId] = useState('')

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const updateField = (field: keyof ApplicationFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'email') {
      setEmailVerified(false)
      setVerificationCode('')
      setCodeSent(false)
      setSecondsLeft(0)
      setMessage(null)
    }
  }

  const sendCode = () => {
    const email = form.email.trim().toLowerCase()
    if (!emailPattern.test(email)) {
      setMessage({ type: 'error', text: '请先填写格式正确的工作邮箱，再获取验证码。' })
      return
    }
    setCodeSent(true)
    setEmailVerified(false)
    setVerificationCode('')
    setSecondsLeft(60)
    setMessage({ type: 'info', text: '演示验证码已生成：123456。此页面不会发送真实邮件。' })
  }

  const verifyCode = (value: string) => {
    setVerificationCode(value)
    if (value.length < 6 || !codeSent) {
      setEmailVerified(false)
      return
    }
    if (value === demoVerificationCode) {
      setEmailVerified(true)
      setMessage({ type: 'success', text: '工作邮箱已验证。' })
    } else {
      setEmailVerified(false)
      setMessage({ type: 'error', text: '验证码错误，请输入演示验证码 123456。' })
    }
  }

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedId('')

    const requiredFields: Array<[keyof ApplicationFormData, string]> = [
      ['contactName', '请填写联系人姓名。'],
      ['phone', '请填写联系电话。'],
      ['company', '请填写企业名称。'],
      ['email', '请填写工作邮箱。'],
      ['projectName', '请填写项目名称。'],
      ['purpose', '请选择接入用途。'],
      ['description', '请填写项目介绍。'],
    ]
    const missing = requiredFields.find(([field]) => !form[field].trim())
    if (missing) {
      setMessage({ type: 'error', text: missing[1] })
      return
    }
    const email = form.email.trim().toLowerCase()
    if (!emailPattern.test(email)) {
      setMessage({ type: 'error', text: '工作邮箱格式不正确，请检查后重试。' })
      return
    }
    if (!emailVerified) {
      setMessage({ type: 'error', text: '请先完成工作邮箱验证，再提交申请。' })
      return
    }
    if (form.description.length > 500) {
      setMessage({ type: 'error', text: '项目介绍不能超过 500 字。' })
      return
    }

    const records = readMockApplications()
    const existingIndex = records.findIndex((record) => record.email.toLowerCase() === email)
    const existing = existingIndex >= 0 ? records[existingIndex] : null
    if (existing?.status === 'pending') {
      setMessage({ type: 'info', text: `该邮箱已有申请正在审核（${existing.id}），请勿重复提交。` })
      return
    }
    if (existing?.status === 'approved') {
      setMessage({ type: 'success', text: '该邮箱已获得开发者权限，请前往登录。' })
      return
    }

    const record: MockApplicationRecord = {
      ...form,
      email,
      id: existing?.id ?? createMockApplicationId(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    if (existingIndex >= 0) records[existingIndex] = record
    else records.push(record)
    try {
      saveMockApplications(records)
      setMockAccessStatus('pending')
      setSubmittedId(record.id)
      setMessage({ type: 'success', text: existing?.status === 'rejected' ? '资料已更新并重新提交，等待人工审核。' : '申请提交成功，等待人工审核。' })
    } catch {
      setMessage({ type: 'error', text: '浏览器暂时无法保存演示申请，请检查本地存储设置后重试。' })
    }
  }

  return (
    <section className="apply-page">
      <div className="apply-layout">
        <aside className="apply-intro">
          <h1>申请开发接入</h1>
          <p className="apply-description">申请 JEETOO AI 录音卡 SDK 接入权限。</p>
          <div className="apply-support"><a href="mailto:developer@jeetoo.com">联系技术支持 <b>↗</b></a></div>
        </aside>

        <div className="apply-form-panel">
          {submittedId ? <div className="apply-success-state">
            <div className="apply-success-icon">✓</div>
            <div className="apply-form-kicker">APPLICATION SUBMITTED</div>
            <h2>申请已提交</h2>
            <p>{message?.text}</p>
            <div className="application-number"><span>申请编号</span><b>{submittedId}</b></div>
            <div className="review-note"><i /> 工作人员将尽快审核你的申请，请留意后续通知。</div>
            <Link className="button button-accent apply-submit" to="/developer/application-status">查看申请状态 <span>↗</span></Link>
          </div> : <>
            <div className="apply-form-heading"><h2>企业及项目信息</h2></div>
            <form className="apply-form" onSubmit={submitApplication} noValidate>
              <div className="apply-fields-grid">
                <label className="apply-field"><span>联系人姓名 <i>*</i></span><input autoComplete="name" value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} placeholder="请输入联系人姓名" /></label>
                <label className="apply-field"><span>联系电话 <i>*</i></span><input autoComplete="tel" type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="请输入联系电话" /></label>
                <label className="apply-field"><span>企业名称 <i>*</i></span><input autoComplete="organization" value={form.company} onChange={(event) => updateField('company', event.target.value)} placeholder="请输入企业名称" /></label>
                <label className="apply-field"><span>工作邮箱 <i>*</i></span><input autoComplete="email" type="email" inputMode="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="name@company.com" /></label>
                <label className="apply-field apply-code-field"><span>邮箱验证码 <i>*</i></span><div className="apply-code-row"><input inputMode="numeric" maxLength={6} value={verificationCode} onChange={(event) => verifyCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="输入 6 位验证码" /><button type="button" onClick={sendCode} disabled={secondsLeft > 0}>{secondsLeft > 0 ? `${secondsLeft}s 后重新获取` : '获取验证码'}</button></div>{emailVerified && <small className="email-verified"><b>✓</b> 邮箱已验证</small>}</label>
                <label className="apply-field"><span>项目名称 <i>*</i></span><input value={form.projectName} onChange={(event) => updateField('projectName', event.target.value)} placeholder="请输入项目名称" /></label>
                <label className="apply-field"><span>预计接入规模 <small>选填</small></span><select className={form.scale ? 'has-value' : ''} value={form.scale} onChange={(event) => updateField('scale', event.target.value)}><option value="">请选择预计规模</option><option>1-100</option><option>101-1000</option><option>1001-10000</option><option>10000以上</option></select></label>
                <label className="apply-field"><span>接入用途 <i>*</i></span><select className={form.purpose ? 'has-value' : ''} value={form.purpose} onChange={(event) => updateField('purpose', event.target.value)}><option value="">请选择接入用途</option><option>企业内部应用</option><option>SaaS 软件集成</option><option>AI 录音应用开发</option><option>硬件设备集成</option><option>其他</option></select></label>
                <label className="apply-field apply-description-field"><span>项目介绍 <i>*</i></span><textarea maxLength={500} value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="请简要介绍项目背景、目标用户及计划集成的功能" /><small className="character-count">{form.description.length}/500</small></label>
              </div>
              <div className="apply-demo-note"><span>i</span> 前端演示验证码为 <b>123456</b>，不会发送真实邮件。</div>
              {message && <div className={`apply-message apply-message-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}{message.text.includes('已获得开发者权限') && <> <Link to="/developer/login">前往登录 <b>→</b></Link></>}{message.text.includes('已有申请正在审核') && <> <Link to="/developer/application-status">查看申请状态 <b>→</b></Link></>}</div>}
              <button className="button button-accent apply-submit" type="submit">提交申请 <span>↗</span></button>
            </form>
          </>}
        </div>
      </div>
    </section>
  )
}
