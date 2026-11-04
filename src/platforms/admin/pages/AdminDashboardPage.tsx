import { Link } from 'react-router-dom'
import { AdminEmpty, AdminPageHeader, AdminStatCard, StatusBadge } from '../components/AdminUi'
import { useAdminApplications } from '../mock/applications'

export function AdminDashboardPage() {
  const applications = useAdminApplications()
  const pending = applications.filter((item) => item.status === 'pending')
  const approved = applications.filter((item) => item.status === 'approved')
  const rejected = applications.filter((item) => item.status === 'rejected')
  const recent = [...applications].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5)

  return <div className="admin-page">
    <AdminPageHeader eyebrow="OVERVIEW" title="管理工作台" description="查看开发接入申请与开发者账号概况。" action={<Link className="admin-button admin-button-dark" to="/admin/applications">审核申请 <span>→</span></Link>} />
    <div className="admin-stat-grid">
      <AdminStatCard label="待审核申请" value={pending.length} hint="需要处理" icon="◷" />
      <AdminStatCard label="已通过申请" value={approved.length} hint="已开放接入" icon="✓" />
      <AdminStatCard label="已驳回申请" value={rejected.length} hint="审核未通过" icon="×" />
      <AdminStatCard label="开发者账号" value={approved.length} hint="来自已通过申请" icon="♙" />
    </div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>最近申请</h2><p>近期提交的开发接入申请</p></div><Link to="/admin/applications">查看全部 <span>→</span></Link></div>
        {recent.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>企业名称</th><th>申请人</th><th>申请时间</th><th>审核状态</th><th /></tr></thead><tbody>{recent.map((application) => <tr key={application.id}><td><b>{application.companyName}</b><small>{application.projectName}</small></td><td>{application.applicantName}</td><td>{application.submittedAt}</td><td><StatusBadge status={application.status} /></td><td><Link className="admin-table-link" to={`/admin/applications/${application.id}`}>详情</Link></td></tr>)}</tbody></table></div> : <AdminEmpty title="暂无申请记录" />}
      </section>
      <section className="admin-panel admin-pending-panel">
        <div className="admin-panel-heading"><div><h2>待处理申请</h2><p>按提交时间排列</p></div><span className="admin-count-chip">{pending.length}</span></div>
        {pending.length ? <div className="admin-pending-list">{pending.slice(0, 4).map((application) => <Link className="admin-pending-item" to={`/admin/applications/${application.id}`} key={application.id}><span className="admin-pending-mark">{application.companyName.slice(0, 1)}</span><span className="admin-pending-copy"><b>{application.companyName}</b><small>{application.applicantName} · {application.submittedAt}</small></span><span className="admin-chevron">→</span></Link>)}</div> : <AdminEmpty title="当前没有待审核申请" />}
        <Link className="admin-button admin-button-outline admin-full-button" to="/admin/applications?status=pending">进入申请审核 <span>→</span></Link>
      </section>
    </div>
  </div>
}
