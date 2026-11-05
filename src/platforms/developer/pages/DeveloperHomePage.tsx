import { Link } from 'react-router-dom'
import { DeviceVisual } from '../components/DeviceVisual'
import { CapabilitySection } from '../components/CapabilitySection'
import { SdkSection } from '../components/SdkSection'
import { HomeCtaSection } from '../components/HomeStorySections'
import { ApiShowcaseSection } from '../components/ApiShowcaseSection'
import { CustomerCaseSection } from '../components/CustomerCaseSection'
import { DemoShowcaseSection } from '../components/DemoShowcaseSection'

export function DeveloperHomePage() {
  return (
    <div className="developer-home">
      <section className="home-hero">
        <div className="hero-wrap">
          <div className="hero-content">
            <div className="hero-eyebrow"><span /> JEETOO DEVICE SDK</div>
            <h1>让 AI 录音设备<br /><em>快速接入你的应用。</em></h1>
            <p>通过标准化 SDK，完成设备连接、录音控制、文件管理、BLE / Wi-Fi 传输及设备管理，帮助开发者更快构建录音相关应用。</p>
            <div className="hero-actions"><Link className="button button-accent" to="/developer/api">查看 API 文档 <span>↗</span></Link><Link className="hero-doc-link" to="/developer/sdk">获取 SDK <span>→</span></Link></div>
            <div className="hero-platform-chips" aria-label="SDK 平台状态"><span>Android SDK</span><span>HarmonyOS SDK</span><span>iOS SDK 文档已开放</span></div>
          </div>
          <DeviceVisual />
        </div>
      </section>
      <CapabilitySection />
      <SdkSection />
      <DemoShowcaseSection />
      <ApiShowcaseSection />
      <CustomerCaseSection />
      <HomeCtaSection />
    </div>
  )
}
