import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAdminApplications } from '../mock/applications'
import '../styles/admin.css'

const links = [
  ['⌂', '管理工作台', '/admin'],
  ['▤', '开发接入申请', '/admin/applications'],
  ['♙', '开发者账号', '/admin/developers'],
]

function getPageTitle(pathname: string) {
  if (/^\/admin\/applications\/[^/]+/.test(pathname)) return '申请详情'
  if (pathname.startsWith('/admin/applications')) return '开发接入申请'
  if (pathname.startsWith('/admin/developers')) return '开发者账号'
  return '管理工作台'
}

export function AdminLayout() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { pathname } = useLocation()
  const applications = useAdminApplications()
  const pendingCount = applications.filter((application) => application.status === 'pending').length
  const title = getPageTitle(pathname)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/admin" className="admin-brand"><span className="admin-brand-mark">J</span><span>JEETOO<small>Tenant Admin</small></span></NavLink>
        <div className="admin-sidebar-label">平台管理</div>
        <nav className="admin-nav" aria-label="租户管理导航">
          {links.map(([icon, label, href]) => <NavLink key={href} to={href} end={href === '/admin'} title={label}>
            <span className="admin-nav-icon">{icon}</span><span className="admin-nav-label">{label}</span>
            {href === '/admin/applications' && pendingCount > 0 && <span className="admin-nav-count">{pendingCount}</span>}
          </NavLink>)}
        </nav>
        <div className="admin-sidebar-bottom"><div className="admin-avatar">JT</div><div className="admin-sidebar-user">平台管理员<small>admin@jeetoo.com</small></div><span className="admin-sidebar-more">•••</span></div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Tenant Admin</span><i>/</i><strong>{title}</strong></div>
          <div className="admin-topbar-actions"><span className="admin-env-tag"><i />演示环境</span>
            <div className="admin-profile-wrap">
              <button className="admin-profile-button" type="button" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}><span className="admin-avatar admin-avatar-small">JT</span><span>平台管理员</span><b>{profileOpen ? '⌃' : '⌄'}</b></button>
              {profileOpen && <div className="admin-profile-menu"><strong>平台管理员</strong><span>admin@jeetoo.com</span><small>租户管理平台演示账号</small></div>}
            </div>
          </div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </section>
    </div>
  )
}
