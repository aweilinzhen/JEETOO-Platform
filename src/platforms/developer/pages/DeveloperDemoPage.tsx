import { Link } from 'react-router-dom'
import { demoProject, demoSteps } from '../mock/demo'
import { getRestrictedResourcePath } from '../mock/access'

const demoPreviewImage = `${import.meta.env.BASE_URL}images/demo/testble-app-phones.png`

export function DeveloperDemoPage() {
  return (
    <section className="demo-page">
      <div className="demo-page-wrap">
        <header className="demo-page-heading">
          <h1>Demo 示例</h1>
          <p>通过示例项目了解 JEETOO Android SDK 的应用场景与集成思路。</p>
        </header>

        <section className="demo-project-card">
          <div className="demo-project-main">
            <h2>{demoProject.name}</h2>
            <p>{demoProject.description}</p>
            <div className="demo-project-meta"><span>{demoProject.platform}</span><span>{demoProject.languages}</span><span>SDK {demoProject.sdkVersion}</span></div>
            <div className="demo-project-actions">
              <a className="button button-accent" href={demoProject.installUrl} target="_blank" rel="noreferrer">下载 Android 安装包 <span>↗</span></a>
              <Link className="demo-text-link" to={getRestrictedResourcePath('/developer/api')}>查看 API 文档 <span>↗</span></Link>
            </div>
          </div>
          <div className="demo-preview">
            <img className="demo-preview-image" src={demoPreviewImage} alt="TestBLE 应用的双手机界面展示" />
          </div>
        </section>

        <section className="demo-ios-resource" aria-labelledby="demo-ios-title">
          <div className="demo-ios-resource-copy">
            <h2 id="demo-ios-title">TestBLE · iOS</h2>
            <p>iOS 示例应用基于 JTCardSDK，TestFlight 体验暂未开放。</p>
          </div>
          <div className="demo-ios-resource-action">
            <span>暂未开放</span>
          </div>
        </section>

        <section className="demo-usage-section">
          <div className="demo-section-heading"><h2>使用流程</h2></div>
          <div className="demo-steps-grid">{demoSteps.map((step, index) => <div className="demo-step" key={step.number}><div className="demo-step-marker"><span>{step.number}</span>{index < demoSteps.length - 1 && <i />}</div><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div>
          <div className="demo-usage-links"><Link to="/developer/quick-start">查看快速开始 <span>↗</span></Link></div>
        </section>
      </div>
    </section>
  )
}
