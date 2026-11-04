import { useState } from 'react'
import { Link } from 'react-router-dom'
import { demoFeatures, demoProject, demoSteps } from '../mock/demo'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'

const restrictedEntry = {
  'not-applied': { label: '申请开发接入', href: '/developer/apply' },
  pending: { label: '查看申请状态', href: '/developer/application-status' },
  rejected: { label: '重新申请', href: '/developer/apply' },
} as const

function DemoFeatureIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    search: 'M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4ZM16 16l4.3 4.3',
    device: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM10 17h4',
    record: 'M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 10v1a6 6 0 0 0 12 0v-1M12 17v4M9 21h6',
    files: 'M5 4h10l4 4v12H5zM15 4v5h4M8 13h8M8 16h8',
    transfer: 'M4 8h13M14 5l3 3-3 3M20 16H7M10 13l-3 3 3 3',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM19 13.5a7.5 7.5 0 0 0 0-3l2-1.5-2-3.5-2.3 1a8 8 0 0 0-2.6-1.5L13.8 2h-4l-.4 3a8 8 0 0 0-2.6 1.5l-2.3-1-2 3.5 2 1.5a7.5 7.5 0 0 0 0 3l-2 1.5 2 3.5 2.3-1a8 8 0 0 0 2.6 1.5l.4 3h4l.4-3a8 8 0 0 0 2.6-1.5l2.3 1 2-3.5z',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

export function DeveloperDemoPage() {
  const { loginStatus, accessStatus } = useMockAuthState()
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [downloadNotice, setDownloadNotice] = useState('')
  const authorized = loginStatus === 'logged_in' && accessStatus === 'authorized'
  const accessEntry = loginStatus === 'logged_out'
    ? { label: '登录获取源码', href: '/developer/login' }
    : accessStatus === 'authorized' ? null : restrictedEntry[accessStatus]

  return (
    <section className="demo-page">
      <div className="demo-page-wrap">
        <header className="demo-page-heading">
          <div className="apply-eyebrow"><span /> DEVELOPER DEMO</div>
          <h1>Demo 示例</h1>
          <p>通过示例项目了解 JEETOO Android SDK 的应用场景与集成思路。</p>
        </header>

        <section className="demo-project-card">
          <div className="demo-project-main">
            <div className="demo-project-kicker">FEATURED PROJECT <span>·</span> {demoProject.status}</div>
            <h2>{demoProject.name}</h2>
            <p>{demoProject.description}</p>
            <div className="demo-project-facts">
              <div><span>平台</span><b>{demoProject.platform}</b></div>
              <div><span>开发语言</span><b>{demoProject.languages}</b></div>
              <div><span>SDK</span><b>{demoProject.sdk}</b></div>
              <div><span>Demo 工程包</span><b>{demoProject.packageName}</b></div>
            </div>
            <div className="demo-project-actions">
              {accessEntry
                ? <Link className="button button-accent" to={accessEntry.href}>{accessEntry.label}<span>↗</span></Link>
                : <button className="button button-accent" type="button" onClick={() => setDownloadNotice('原始文档列出了 Demo 工程包文件名，但未提供源码下载地址。')}>获取示例源码 <span>↓</span></button>}
              <a className="demo-text-link" href={demoProject.installUrl} target="_blank" rel="noreferrer">下载已编译安装包 <span>↗</span></a>
              <Link className="demo-text-link" to={getRestrictedResourcePath('/developer/api')}>查看 API 文档 <span>→</span></Link>
              <Link className="demo-text-link" to="/developer/quick-start">查看快速开始 <span>→</span></Link>
            </div>
            {downloadNotice && <div className="demo-download-notice" role="status">{downloadNotice}</div>}
            {!authorized && <div className="demo-auth-note"><span>i</span> Demo 源码仅向已获得开发者授权的账号开放。</div>}
          </div>
          <div className="demo-preview-placeholder" aria-label="TestBLE 应用截图占位，暂无真实应用截图">
            <div className="preview-placeholder-icon"><span /><span /><span /></div>
            <b>界面截图待补充</b>
            <span>暂无真实应用截图</span>
            <small>JEETOO ANDROID DEMO</small>
          </div>
        </section>

        <section className="demo-feature-section">
          <div className="demo-section-heading"><div><div className="apply-eyebrow"><span /> TESTBLE CAPABILITIES</div><h2>功能说明</h2><p>根据 SDK 文档中提供的 TestBLE 使用示例与接口章节整理。</p></div><span className="demo-feature-count">06 FEATURES</span></div>
          <div className="demo-feature-grid">
            {demoFeatures.map((feature, index) => {
              const expanded = expandedFeature === feature.id
              return <article className={`demo-feature-card${expanded ? ' is-expanded' : ''}`} key={feature.id}>
                <button type="button" aria-expanded={expanded} onClick={() => setExpandedFeature(expanded ? null : feature.id)}>
                  <span className="demo-feature-top"><span className="demo-feature-icon"><DemoFeatureIcon name={feature.icon} /></span><span className="demo-feature-index">0{index + 1}</span></span>
                  <b>{feature.title}</b><span className="demo-feature-description">{feature.description}</span><span className="demo-feature-toggle">{expanded ? '收起说明 −' : '查看详情 +'}</span>
                </button>
                {expanded && <p className="demo-feature-detail">{feature.detail}</p>}
              </article>
            })}
          </div>
        </section>

        <section className="demo-usage-section">
          <div className="demo-section-heading"><div><div className="apply-eyebrow"><span /> HOW TO USE</div><h2>使用流程</h2><p>从准备开发环境到连接设备，逐步了解示例项目。</p></div></div>
          <div className="demo-steps-grid">{demoSteps.map((step, index) => <div className="demo-step" key={step.number}><div className="demo-step-marker"><span>{step.number}</span>{index < demoSteps.length - 1 && <i />}</div><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div>
          <div className="demo-usage-links"><Link to="/developer/quick-start">查看快速开始 <span>↗</span></Link><Link to="/developer/api">查看 API 文档 <span>↗</span></Link></div>
        </section>

          <div className="demo-page-note">原始文档提供了已编译安装包入口及 v1.0.7 Demo 工程包文件名；未提供工程源码下载地址，页面不模拟源码下载成功。</div>
      </div>
    </section>
  )
}
