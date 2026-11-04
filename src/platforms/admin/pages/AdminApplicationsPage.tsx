import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminEmpty, AdminPageHeader, AdminStatCard, StatusBadge } from '../components/AdminUi'
import { useAdminApplications, type ReviewStatus } from '../mock/applications'

const statusOptions: Array<[ReviewStatus | 'all', string]> = [['all', '全部状态'], ['pending', '待审核'], ['approved', '已通过'], ['rejected', '已驳回']]

export function AdminApplicationsPage() {
  const applications = useAdminApplications()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const statusFilter = (searchParams.get('status') as ReviewStatus | 'all' | null) ?? 'all'
  const count = (status: ReviewStatus) => applications.filter((item) => item.status === status).length
  const filtered = useMemo(() => applications.filter((item) => {
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || `${item.companyName} ${item.applicantName} ${item.email} ${item.projectName}`.toLocaleLowerCase().includes(query)
    return matchesSearch && (statusFilter === 'all' || item.status === statusFilter)
  }), [applications, search, statusFilter])

  return <div className="admin-page">
    <AdminPageHeader eyebrow="DEVELOPER ACCESS" title="开发接入申请" description="查看企业提交的开发接入申请，并完成审核。" />
    <div className="admin-stat-grid admin-stat-grid-compact">
      <AdminStatCard label="申请总数" value={applications.length} icon="▤" />
      <AdminStatCard label="待审核" value={count('pending')} icon="◷" />
      <AdminStatCard label="已通过" value={count('approved')} icon="✓" />
      <AdminStatCard label="已驳回" value={count('rejected')} icon="×" />
    </div>
    <section className="admin-panel admin-list-panel">
      <div className="admin-list-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索企业、申请人或邮箱" aria-label="搜索申请" /></label><label className="admin-filter"><span>审核状态</span><select value={statusFilter} onChange={(event) => setSearchParams(event.target.value === 'all' ? {} : { status: event.target.value })}>{statusOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><span className="admin-result-count">{filtered.length} 条记录</span></div>
      {filtered.length ? <div className="admin-table-wrap"><table className="admin-table admin-applications-table"><thead><tr><th>企业名称</th><th>申请人</th><th>工作邮箱</th><th>预计用户规模</th><th>使用场景</th><th>申请时间</th><th>审核状态</th><th>操作</th></tr></thead><tbody>{filtered.map((application) => <tr key={application.id}><td><b>{application.companyName}</b><small>{application.projectName}</small></td><td>{application.applicantName}</td><td>{application.email}</td><td>{application.userScale}</td><td>{application.scenario}</td><td>{application.submittedAt}</td><td><StatusBadge status={application.status} /></td><td><Link className="admin-table-link" to={`/admin/applications/${application.id}`}>查看详情</Link></td></tr>)}</tbody></table></div> : <AdminEmpty title="没有匹配的申请" description="调整搜索条件或状态筛选后重试。" />}
    </section>
  </div>
}
