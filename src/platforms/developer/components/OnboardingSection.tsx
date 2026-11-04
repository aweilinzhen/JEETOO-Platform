import { Link } from 'react-router-dom'

const steps = [
  { number: '01', title: '获取 SDK', description: '提交开发接入申请，审核通过后获取 SDK。' },
  { number: '02', title: '集成 SDK', description: '参照集成指南，将设备能力接入你的应用。' },
  { number: '03', title: '连接设备并调试', description: '连接 JEETOO 设备，开始调试应用功能。' },
]

export function OnboardingSection() {
  return (
    <section className="onboarding-section">
      <div className="section-wrap onboarding-wrap">
        <div><div className="section-eyebrow">GET STARTED</div><h2>三步，开启你的<br /><span>设备接入之旅。</span></h2><p>清晰的流程指引，让开发从第一步就简单起来。</p><Link className="button button-accent" to="/developer/quick-start">查看快速开始 <span>↗</span></Link></div>
        <div className="steps-list">
          {steps.map((step, index) => <div className="step-row" key={step.number}><div className="step-marker"><span>{step.number}</span>{index < steps.length - 1 && <i />}</div><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}
        </div>
      </div>
    </section>
  )
}
