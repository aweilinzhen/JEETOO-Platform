import { Link } from 'react-router-dom'
import { DeviceVisual } from '../components/DeviceVisual'
import { CapabilitySection } from '../components/CapabilitySection'
import { SdkSection } from '../components/SdkSection'
import { ResourcesSection } from '../components/ResourcesSection'
import { OnboardingSection } from '../components/OnboardingSection'

export function DeveloperHomePage() {
  return (
    <div className="developer-home">
      <section className="home-hero">
        <div className="hero-wrap">
          <div className="hero-content">
            <div className="hero-eyebrow"><span /> JEETOO DEVELOPER PLATFORM</div>
            <h1>让 AI 录音设备<br /><em>快速接入你的应用。</em></h1>
            <p>面向企业开发者，提供 JEETOO 设备 SDK、API 文档、Demo 示例与技术接入资源，帮助你将设备连接、录音管理和文件传输能力集成到自有应用。</p>
            <div className="hero-actions"><Link className="button button-accent" to="/developer/quick-start">快速开始 <span>↗</span></Link><Link className="hero-doc-link" to="/developer/api">查看开发文档 <span>→</span></Link></div>
            <div className="hero-proof"><span className="proof-mark">✓</span> 面向开发者开放 · 官方 SDK 持续更新</div>
          </div>
          <DeviceVisual />
          <div className="hero-bottom-line"><span>BUILD WITH JEETOO</span><span>01 — 06</span></div>
        </div>
      </section>
      <CapabilitySection />
      <SdkSection />
      <ResourcesSection />
      <OnboardingSection />
    </div>
  )
}
