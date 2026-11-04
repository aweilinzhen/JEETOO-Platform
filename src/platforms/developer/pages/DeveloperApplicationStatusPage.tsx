import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  readLatestMockApplication,
  updateMockApplicationStatus,
  type MockApplicationRecord,
  type MockApplicationStatus,
} from '../mock/applications'
import { setMockAccessStatus, useMockAuthState } from '../mock/access'

const statusLabels: Record<MockApplicationStatus, string> = {
  pending: '审核中',
  approved: '审核通过',
  rejected: '审核未通过',
}
const defaultRejectionReason = '当前申请暂未通过审核。请补充项目应用场景与预期接入规模后重新提交。'

function formatDate(value: string | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function DeveloperApplicationStatusPage() {
  const { loginStatus, accessStatus } = useMockAuthState()
  const [application, setApplication] = useState<MockApplicationRecord | null>(() => readLatestMockApplication())
  const [mockReason, setMockReason] = useState(() => readLatestMockApplication()?.rejectionReason ?? defaultRejectionReason)
  const [mockMessage, setMockMessage] = useState('')

  const changeStatus = (status: MockApplicationStatus) => {
    if (!application) {
      setMockAccessStatus(status === 'approved' ? 'authorized' : status)
      setMockMessage(`演示状态已切换为「${statusLabels[status]}」，未创建申请记录。`)
      return
    }
    try {
      const updated = updateMockApplicationStatus(
        application.id,
        status,
        status === 'rejected' ? (mockReason.trim() || defaultRejectionReason) : '',
      )
      if (updated) {
        setMockAccessStatus(status === 'approved' ? 'authorized' : status)
        setApplication(updated)
        setMockReason(updated.rejectionReason ?? defaultRejectionReason)
        setMockMessage(`演示状态已切换为「${statusLabels[status]}」，并已保存到本地。`)
      }
    } catch {
      setMockMessage('无法保存演示状态，请检查浏览器本地存储设置。')
    }
  }

  const saveRejectionReason = () => {
    if (!application || application.status !== 'rejected') return
    try {
      const updated = updateMockApplicationStatus(application.id, 'rejected', mockReason.trim() || defaultRejectionReason)
      if (updated) {
        setApplication(updated)
        setMockReason(updated.rejectionReason ?? defaultRejectionReason)
        setMockMessage('拒绝原因已保存。')
      }
    } catch {
      setMockMessage('无法保存拒绝原因，请检查浏览器本地存储设置。')
    }
  }

  const displayApplication = accessStatus === 'not-applied'
    ? null
    : application
      ? { ...application, status: accessStatus === 'authorized' ? 'approved' as const : accessStatus }
      : {
          contactName: '演示联系人', phone: '—', company: '前端演示企业', email: 'developer@example.com', projectName: 'SDK 接入演示', scale: '', purpose: '演示数据', description: '',
          id: 'DEMO-APPLICATION', status: accessStatus === 'authorized' ? 'approved' as const : accessStatus, submittedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        }

  return (
    <section className="application-status-page">
      <div className="application-status-wrap">
        <header className="application-status-heading">
          <div className="apply-eyebrow"><span /> DEVELOPER APPLICATION</div>
          <h1>申请状态</h1>
          <p>查看你的开发接入申请进度</p>
        </header>

        {loginStatus === 'logged_out' ? <div className="status-empty-card">
          <span className="status-empty-icon">⌑</span>
          <h2>请先登录</h2>
          <p>登录后查看当前账号的开发接入申请进度。</p>
          <Link className="button button-accent" to="/developer/login">前往登录 <span>↗</span></Link>
        </div> : !displayApplication ? <div className="status-empty-card">
          <span className="status-empty-icon">—</span>
          <h2>暂未找到申请记录</h2>
          <p>提交开发接入申请后，可以在这里查看申请进度和审核结果。</p>
          <Link className="button button-accent" to="/developer/apply">申请开发接入 <span>↗</span></Link>
        </div> : <>
          <section className={`status-summary status-${displayApplication.status}`}>
            <div className="status-summary-main">
              <div className="status-symbol">{displayApplication.status === 'approved' ? '✓' : displayApplication.status === 'rejected' ? '!' : <span className="status-pulse" />}</div>
              <div className="status-copy"><div className="status-eyebrow">APPLICATION STATUS</div><h2>{statusLabels[displayApplication.status]}</h2>
                <p>{displayApplication.status === 'pending' ? '你的申请已提交，我们正在审核。' : displayApplication.status === 'approved' ? '恭喜，你的开发接入申请已通过。' : '很遗憾，你的开发接入申请暂未通过。'}</p>
              </div>
              <span className="status-pill">{statusLabels[displayApplication.status]}</span>
            </div>
            <div className="status-progress" aria-label={`申请进度：${statusLabels[displayApplication.status]}`}>
              <div className="progress-step is-complete"><span>✓</span><b>申请已提交</b></div><i className="progress-line is-complete" />
              <div className={`progress-step ${displayApplication.status === 'pending' ? 'is-current' : 'is-complete'}`}><span>{displayApplication.status === 'pending' ? '02' : '✓'}</span><b>人工审核</b></div><i className={`progress-line ${displayApplication.status !== 'pending' ? 'is-complete' : ''}`} />
              <div className={`progress-step ${displayApplication.status !== 'pending' ? 'is-current' : ''}`}><span>{displayApplication.status !== 'pending' ? '✓' : '03'}</span><b>审核结果</b></div>
            </div>
            {displayApplication.status === 'pending' && <div className="status-guidance"><span>i</span> 审核通过后将开放 SDK、API 文档和 Demo 等开发资源。</div>}
            {displayApplication.status === 'rejected' && <div className="rejection-reason"><span>审核意见</span><p>{displayApplication.rejectionReason || '暂无详细原因，请联系技术支持了解。'}</p></div>}
            {displayApplication.status === 'approved' && <Link className="button button-accent status-primary-action" to="/developer/activate">激活开发者账号 <span>↗</span></Link>}
            {displayApplication.status === 'rejected' && <Link className="button button-accent status-primary-action" to="/developer/apply">重新提交申请 <span>↗</span></Link>}
          </section>

          <section className="application-info-card">
            <div className="info-card-heading"><div><div className="apply-form-kicker">APPLICATION DETAILS</div><h2>申请信息</h2></div><span className="application-id"><small>申请编号</small><b>{displayApplication.id}</b></span></div>
            <div className="application-info-grid">
              <div><span>企业名称</span><b>{displayApplication.company || '—'}</b></div>
              <div><span>联系人</span><b>{displayApplication.contactName || '—'}</b></div>
              <div><span>工作邮箱</span><b>{displayApplication.email || '—'}</b></div>
              <div><span>项目名称</span><b>{displayApplication.projectName || '—'}</b></div>
              <div><span>提交时间</span><b>{formatDate(displayApplication.submittedAt ?? displayApplication.updatedAt)}</b></div>
              <div><span>接入用途</span><b>{displayApplication.purpose || '—'}</b></div>
            </div>
          </section>

          <details className="mock-status-tools">
            <summary>演示工具：切换申请审核状态</summary>
            <div className="mock-status-controls">
              <label>Mock 状态<select value={displayApplication.status} onChange={(event) => changeStatus(event.target.value as MockApplicationStatus)}><option value="pending">审核中</option><option value="approved">审核通过</option><option value="rejected">审核未通过</option></select></label>
              {displayApplication.status === 'rejected' && <label className="mock-reason-field">模拟拒绝原因<textarea value={mockReason} maxLength={300} onChange={(event) => setMockReason(event.target.value)} /></label>}
              {displayApplication.status === 'rejected' && <button type="button" className="mock-save-button" onClick={saveRejectionReason}>保存拒绝原因</button>}
              {mockMessage && <p role="status">{mockMessage}</p>}
            </div>
          </details>
        </>}
      </div>
    </section>
  )
}
