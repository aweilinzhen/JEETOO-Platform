import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMockAuthState } from '../mock/access'
import { PrototypeAuthPanel } from '../components/PrototypeAuthPanel'
import jiatuiLogo from '../assets/jiatui-logo.png'
import '../styles/developer.css'

const links = [
  ['首页', '/developer'],
  ['设备指南', '/developer/device-guide'],
  ['API 文档', '/developer/api'],
  ['SDK 下载', '/developer/sdk'],
  ['Demo 示例', '/developer/demo'],
  ['常见问题', '/developer/faq'],
  ['更新日志', '/developer/changelog'],
]

export function DeveloperLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useMockAuthState()
  const isLoginPage = pathname === '/developer/login'

  return (
    <div className="developer-shell">
      <header className="developer-header">
        <NavLink to="/developer" className="developer-brand has-platform-label" aria-label="加推官网首页">
          <span className="developer-brand-logo"><img src={jiatuiLogo} alt="Jiatui 加推" /></span>
          <i className="developer-platform-divider" aria-hidden="true" /><span className="developer-platform-label">DEVELOPER PLATFORM</span>
        </NavLink>
        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? '收起导航菜单' : '展开导航菜单'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
        <nav className={`developer-nav${menuOpen ? ' is-open' : ''}`} aria-label="开发者导航">
          {links.map(([label, href]) => <NavLink key={href} to={href} end={href === '/developer'} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label="语言选择（当前为中文）">
            <span className="is-active" aria-current="true">中文</span><i aria-hidden="true">|</i><span aria-disabled="true">EN</span>
          </div>
          {!isLoginPage && <NavLink className="header-login-link" to="/developer/login">登录</NavLink>}
          <NavLink className="button button-accent" to="/developer/apply">申请接入 <span>↗</span></NavLink>
        </div>
      </header>
      <main className="developer-main"><Outlet /></main>
      <footer className="developer-footer">
        <NavLink to="/developer" className="footer-brand" aria-label="加推官网首页"><img src={jiatuiLogo} alt="Jiatui 加推" /></NavLink>
        <div className="footer-meta">
          <span>加推科技 · 深圳</span>
          <span>让声音成为 AI 的入口</span>
          <span>© 2026</span>
          <span>粤ICP备17160950号</span>
        </div>
      </footer>
      <PrototypeAuthPanel />
    </div>
  )
}
