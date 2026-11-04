import { useMemo, useState } from 'react'
import { AdminEmpty, AdminPageHeader } from '../components/AdminUi'
import { useAdminApplications } from '../mock/applications'

const accountStatuses = ['全部状态', '待激活', '正常', '停用']

export function AdminDevelopersPage() {
  const applications = useAdminApplications()
  const developers = applications.filter((application) => application.status === 'approved')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部状态')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const filtered = useMemo(() => developers.filter((developer) => {
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || `${developer.companyName} ${developer.applicantName} ${developer.email}`.toLocaleLowerCase().includes(query)
    const accountStatus = developer.accountStatus ?? '待激活'
    return matchesSearch && (statusFilter === '全部状态' || statusFilter === accountStatus)
  }), [developers, search, statusFilter])
  const selected = developers.find((developer) => developer.id === selectedId)

  return <div className="admin-page">
    <AdminPageHeader eyebrow="DEVELOPER ACCOUNTS" title="开发者账号" description="已通过开发接入申请的企业联系人将关联为开发者账号。" />
    <section className="admin-panel admin-list-panel">
      <div className="admin-list-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索企业、开发者或邮箱" aria-label="搜索开发者账号" /></label><label className="admin-filter"><span>账号状态</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{accountStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><span className="admin-result-count">{filtered.length} 个账号</span></div>
      {filtered.length ? <div className="admin-table-wrap"><table className="admin-table admin-developers-table"><thead><tr><th>企业名称</th><th>开发者姓名</th><th>工作邮箱</th><th>账号状态</th><th>SDK 授权状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody>{filtered.map((developer) => <tr key={developer.id}><td><b>{developer.companyName}</b><small>{developer.projectName}</small></td><td>{developer.applicantName}</td><td>{developer.email}</td><td><span className={`admin-account-status admin-account-${developer.accountStatus ?? '待激活'}`}><i />{developer.accountStatus ?? '待激活'}</span></td><td><span className="admin-access-status"><i />已授权</span></td><td>{developer.submittedAt}</td><td><button className="admin-table-link" type="button" onClick={() => setSelectedId(developer.id)}>账号信息</button></td></tr>)}</tbody></table></div> : <AdminEmpty title="没有匹配的开发者账号" description="账号由已通过的开发接入申请生成。" />}
    </section>
    {selected && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null) }}><section className="admin-modal admin-account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
      <div className="admin-modal-heading"><div><h2 id="account-title">开发者账号信息</h2><p>{selected.companyName}</p></div><button type="button" aria-label="关闭账号信息" onClick={() => setSelectedId(null)}>×</button></div>
      <dl className="admin-account-details"><div><dt>开发者姓名</dt><dd>{selected.applicantName}</dd></div><div><dt>工作邮箱</dt><dd>{selected.email}</dd></div><div><dt>账号状态</dt><dd>{selected.accountStatus ?? '待激活'}</dd></div><div><dt>SDK 授权</dt><dd>已授权</dd></div><div><dt>关联项目</dt><dd>{selected.projectName}</dd></div><div><dt>创建时间</dt><dd>{selected.submittedAt}</dd></div></dl>
      <button className="admin-button admin-button-dark admin-modal-close" type="button" onClick={() => setSelectedId(null)}>关闭</button>
    </section></div>}
  </div>
}
