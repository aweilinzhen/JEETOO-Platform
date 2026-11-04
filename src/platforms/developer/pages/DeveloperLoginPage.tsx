import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setMockLoginStatus } from '../mock/access'

type LoginFeedback = { kind: 'error' | 'info' | 'success'; message: string } | null

const mockAccounts = [
  { email: 'developer@jeetoo.com', password: 'Jeetoo123!', activated: true },
  { email: 'inactive@jeetoo.com', password: 'Jeetoo123!', activated: false },
]

export function DeveloperLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<LoginFeedback>(null)
  const [forgotNotice, setForgotNotice] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)
    setForgotNotice(false)

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFeedback({ kind: 'error', message: '请输入有效的工作邮箱地址。' })
      return
    }
    if (!password.trim()) {
      setFeedback({ kind: 'error', message: '请输入登录密码。' })
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      const account = mockAccounts.find((item) => item.email === normalizedEmail && item.password === password)
      setLoading(false)

      if (account && !account.activated) {
        setFeedback({ kind: 'error', message: '该账号尚未激活，请先完成账号激活后再登录。' })
        return
      }
      if (!account) {
        setFeedback({ kind: 'error', message: '邮箱或密码不正确，请检查后重试。' })
        return
      }

      setMockLoginStatus('logged_in')
      setFeedback({ kind: 'success', message: rememberMe ? '登录成功，已记住此设备。' : '登录成功，正在进入开发者平台…' })
      window.setTimeout(() => navigate('/developer'), 850)
    }, 650)
  }

  return (
    <section className="login-page">
      <div className="login-layout">
        <div className="login-card">
          <Link to="/developer" className="login-brand" aria-label="JEETOO Developer 首页">
            <span className="brand-mark">J</span><span>JEETOO <b>Developer</b></span>
          </Link>
          <div className="login-heading">
            <div className="login-eyebrow"><span /> DEVELOPER ACCOUNT</div>
            <h1>欢迎回来</h1>
            <p>登录加推开发者平台</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field-label" htmlFor="developer-email">工作邮箱</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>
              <input id="developer-email" type="email" autoComplete="username" inputMode="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>

            <div className="login-password-label"><label className="login-field-label" htmlFor="developer-password">登录密码</label><button className="forgot-link" type="button" onClick={() => { setFeedback(null); setForgotNotice(true) }}>忘记密码？</button></div>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="11" rx="1.5" /><path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" /></svg>
              <input id="developer-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="请输入密码" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="password-toggle" type="button" aria-label={showPassword ? '隐藏密码' : '显示密码'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? '隐藏' : '显示'}</button>
            </div>

            <label className="remember-option"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /><span className="custom-checkbox" />记住我</label>

            {forgotNotice && <div className="login-feedback feedback-info" role="status">如需重置密码，请联系技术支持。此演示页面不会发送邮件。</div>}
            {feedback && <div className={`login-feedback feedback-${feedback.kind}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.message}</div>}

            <button className="button button-accent login-submit" type="submit" disabled={loading}>
              {loading ? <><span className="loading-spinner" />正在登录…</> : <>登录 <span>↗</span></>}
            </button>
          </form>

          <div className="login-apply">还没有开发者权限？ <Link to="/developer/apply">申请开发接入 <span>→</span></Link></div>
          <div className="login-account-note">使用申请时填写并完成激活的工作邮箱登录</div>
        </div>
        <div className="login-side-note"><span className="side-note-rule" /><span>CONNECT YOUR IDEAS<br />WITH JEETOO</span></div>
      </div>
    </section>
  )
}
