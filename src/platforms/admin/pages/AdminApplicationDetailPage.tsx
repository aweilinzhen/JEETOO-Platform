import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminEmpty, AdminPageHeader, StatusBadge } from '../components/AdminUi'
import { reviewApplication, useAdminApplications } from '../mock/applications'

function DetailField({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={`admin-detail-field${wide ? ' is-wide' : ''}`}><span>{label}</span><div>{children}</div></div>
}

export function AdminApplicationDetailPage() {
  const { applicationId = '' } = useParams()
  const applications = useAdminApplications()
  const application = applications.find((item) => item.id === applicationId)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState(false)

  if (!application) return <div className="admin-page"><AdminPageHeader title="申请详情" /><section className="admin-panel"><AdminEmpty title="未找到这条申请记录" /><Link className="admin-button admin-button-outline" to="/admin/applications">返回申请列表</Link></section></div>

  const submitRejection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reason.trim()) { setReasonError(true); return }
    reviewApplication(application.id, 'rejected', reason)
    setRejectOpen(false)
    setReason('')
    setReasonError(false)
  }
  const approve = () => reviewApplication(application.id, 'approved')

  return <div className="admin-page">
    <AdminPageHeader eyebrow="APPLICATION REVIEW" title="申请详情" description={`${application.companyName} · ${application.id}`} action={<Link className="admin-button admin-button-outline" to="/admin/applications">← 返回申请列表</Link>} />
    <div className="admin-detail-statusbar"><div><span>当前审核状态</span><StatusBadge status={application.status} /></div><span>提交时间：{application.submittedAt}</span></div>
    {application.status === 'rejected' && application.rejectionReason && <div className="admin-review-note"><b>驳回原因</b><span>{application.rejectionReason}</span></div>}
    {application.status === 'approved' && <div className="admin-review-success">申请已通过，开发者账号已纳入账号列表。</div>}
    <section className="admin-panel admin-detail-panel">
      <div className="admin-panel-heading"><div><h2>企业及项目信息</h2><p>申请编号：{application.id}</p></div></div>
      <div className="admin-detail-grid">
        <DetailField label="企业名称">{application.companyName}</DetailField>
        <DetailField label="项目名称">{application.projectName}</DetailField>
        <DetailField label="申请人姓名">{application.applicantName}</DetailField>
        <DetailField label="工作邮箱"><a href={`mailto:${application.email}`}>{application.email}</a></DetailField>
        <DetailField label="联系电话"><a href={`tel:${application.phone.replaceAll(' ', '')}`}>{application.phone}</a></DetailField>
        <DetailField label="预计用户规模">{application.userScale}</DetailField>
        <DetailField label="使用 JEETOO 的场景">{application.scenario}</DetailField>
        <DetailField label="申请提交时间">{application.submittedAt}</DetailField>
        <DetailField label="项目介绍" wide>{application.projectIntro}</DetailField>
      </div>
    </section>
    {application.status === 'pending' && <div className="admin-review-actions"><span>审核操作将保存到本地 Mock 数据。</span><div><button className="admin-button admin-button-outline" type="button" onClick={() => setRejectOpen(true)}>审核驳回</button><button className="admin-button admin-button-dark" type="button" onClick={approve}>审核通过</button></div></div>}
    {rejectOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRejectOpen(false) }}><form className="admin-modal" onSubmit={submitRejection} role="dialog" aria-modal="true" aria-labelledby="reject-title">
      <div className="admin-modal-heading"><div><h2 id="reject-title">驳回申请</h2><p>请填写驳回原因，申请人可在申请状态中查看。</p></div><button type="button" aria-label="关闭弹窗" onClick={() => setRejectOpen(false)}>×</button></div>
      <label className="admin-modal-label">驳回原因<textarea value={reason} onChange={(event) => { setReason(event.target.value); setReasonError(false) }} rows={4} maxLength={500} placeholder="请说明需要补充或调整的内容" autoFocus /></label>
      <div className="admin-modal-meta"><span className={reasonError ? 'has-error' : ''}>{reasonError ? '请填写驳回原因' : '必填'}</span><span>{reason.length}/500</span></div>
      <div className="admin-modal-actions"><button className="admin-button admin-button-outline" type="button" onClick={() => setRejectOpen(false)}>取消</button><button className="admin-button admin-button-dark" type="submit">确认驳回</button></div>
    </form></div>}
  </div>
}
