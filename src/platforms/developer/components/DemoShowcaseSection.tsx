import { Link } from 'react-router-dom'
import { SectionHeading } from './SectionHeading'

export function DemoShowcaseSection() {
  return <section className="home-section demo-showcase-section" id="demo-showcase">
    <div className="section-wrap">
      <SectionHeading title="通过 Demo，直观体验 SDK 集成效果。" description="了解 JEETOO Device SDK 在设备连接、录音控制、文件管理与数据传输中的实际应用。" />
      <div className="home-demo-panel">
        <div className="home-demo-project">
          <h3>Device SDK Demo</h3>
          <p>通过示例应用，直观了解设备接入流程与核心功能的交互体验。</p>
          <div className="home-demo-actions">
            <Link className="button button-accent" to="/developer/demo">查看 Demo 详情 <span>↗</span></Link>
          </div>
        </div>
        <div className="home-demo-visual" role="img" aria-label="JEETOO Device SDK Demo 静态界面示意，非真实运行截图">
          <div className="home-demo-app">
            <header><span className="home-demo-app-mark">J</span><div><b>JEETOO DEVICE</b><small>设备管理</small></div><i>•••</i></header>
            <div className="home-demo-device-card">
              <div className="home-demo-device-icon" aria-hidden="true"><span /><span /></div>
              <div><small>当前设备</small><b>JEETOO AI 录音卡</b><span><i /> 已连接</span></div>
              <strong>›</strong>
            </div>
            <div className="home-demo-record-card">
              <div><small>录音控制</small><span>设备已就绪</span></div>
              <button type="button" tabIndex={-1} aria-label="录音控制示意按钮"><i />开始录音</button>
            </div>
            <div className="home-demo-file-row"><span>最近录音</span><b>查看文件 <i>↗</i></b></div>
            <div className="home-demo-file"><span className="home-demo-file-icon">♫</span><div><b>会议录音</b><small>音频文件 · 设备存储</small></div><i>•••</i></div>
            <div className="home-demo-app-nav"><span className="is-active"><i>⌂</i>设备</span><span><i>◷</i>录音</span><span><i>▤</i>文件</span><span><i>⚙</i>我的</span></div>
          </div>
          <div className="home-demo-visual-caption">静态界面示意 · 非真实运行截图</div>
        </div>
      </div>
    </div>
  </section>
}
