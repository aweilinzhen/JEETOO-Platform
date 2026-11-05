import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from './SectionHeading'

const values = [
  ['沟通留痕', '记录真实沟通内容，为后续回听、核对和复盘提供依据。', 'record'],
  ['资料可追溯', '保留录音资料，方便企业后续查找和管理。', 'archive'],
  ['业务可延展', '将录音设备能力融入企业自有应用，拓展业务应用方式。', 'extend'],
]

const workflow = [
  ['01', '下载 SDK', '查看 Android SDK 获取方式与版本记录。', '↓'],
  ['02', '配置环境', '按文档设置 Android 环境、依赖与必要权限。', '⌘'],
  ['03', '集成 SDK', '将 AAR 接入项目并完成初始化配置。', '⌁'],
  ['04', '连接设备', '按扫描、连接文档接入 JEETOO 设备。', '◉'],
  ['05', '调用 API', '根据设备型号与固件要求调用已提供接口。', '✓'],
  ['06', '完成集成', '参考 TestBLE 验证接入流程与设备交互。', '▱'],
]

const scenes = [
  ['01', '保险展业', '客户沟通记录 · 业务沟通留存'],
  ['02', '企业会议', '会议内容记录 · 工作沟通留存'],
  ['03', '销售管理', '客户拜访记录 · 销售沟通记录'],
  ['04', '采访访谈', '采访内容记录 · 访谈资料留存'],
]

const questions = [
  ['产品问题', 'JEETOO AI 录音卡是什么？', 'JEETOO AI 录音卡是面向录音场景的硬件产品。开发者可通过当前开放的 Android SDK 接入文档列出的设备连接、信息读取和录音文件管理等能力。'],
  ['设备使用', '如何获取录音文件？', 'Android SDK 文档提供录音文件列表、文件管理及传输相关接口。具体适用范围和固件要求请查看对应 API 章节。'],
  ['开发接入', '如何下载 SDK？', '在开发者平台提交接入申请并按页面提示完成授权后，可前往 SDK 下载页面查看获取方式。'],
  ['开发接入', '目前支持哪些开发平台？', '当前 AI 录音卡 Android SDK 已开放，iOS SDK 正在筹备中。'],
  ['开发接入', '如何查看 API 文档？', '登录开发者账号后可查看当前产品的完整 API 文档。'],
  ['企业合作', '如何申请开发者权限？', '通过申请接入页面提交企业与项目资料。'],
  ['企业合作', '如何联系加推？', '请通过加推官网联系页面提交咨询。'],
]

export function ValueSection() {
  return <section className="home-section home-value-section" id="value">
    <div className="section-wrap">
      <SectionHeading title="不止是录音，更是企业智能应用的入口。" description="让现场沟通得到留存，让录音资料融入企业业务流程。" />
      <div className="home-value-grid">{values.map(([title, description, icon]) => <article key={title}><div className="home-value-card-top"><ValueIcon name={icon} /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  </section>
}

export function WorkflowSection() {
  return <section className="home-section home-workflow-section" id="sdk-guide">
    <div className="section-wrap">
      <SectionHeading title="按步骤完成 SDK 接入。" description="下载 SDK → 配置环境 → 集成 SDK → 连接设备 → 调用 API → 完成集成。" />
      <div className="workflow-track">{workflow.map(([number, title, description, icon], index) => <div className="workflow-node" key={number}><div className="workflow-node-top"><span>{number}</span><b aria-hidden="true">{icon}</b></div><strong>{title}</strong><small>{description}</small>{index < workflow.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>
    </div>
  </section>
}

function ValueIcon({ name }: { name: string }) {
  return <svg className="home-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'record' && <><circle cx="12" cy="12" r="8.25" /><path d="M12 8v8M9.5 10v4M14.5 10v4" /></>}
    {name === 'archive' && <><path d="M4 7.5h16v12H4zM3 4.5h18v3H3zM9 11h6" /><path d="M8 15h8" /></>}
    {name === 'extend' && <><path d="M5 19 19 5M8 5h11v11" /><path d="M5 10v9h9" /></>}
  </svg>
}

export function ApplicationSection() {
  return <section className="home-section home-application-section" id="applications">
    <div className="section-wrap">
      <SectionHeading title="让 AI 录音融入更多业务场景。" description="保险展业、企业会议、销售管理与采访访谈等沟通密集型工作的应用方向。" />
      <div className="application-grid">{scenes.map(([scene, title, description]) => <article className="application-card" key={scene}><div className="application-visual"><SceneArtwork scene={scene} /><small>应用示意</small></div><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
    </div>
  </section>
}

export function CustomerSection() {
  return <section className="home-section home-customer-section" id="customers">
    <div className="section-wrap">
      <SectionHeading title="值得企业客户信赖。" description="JEETOO AI 录音卡已在多家企业客户中实际使用。" />
      <div className="customer-wall" aria-label="JEETOO AI 录音卡企业客户"><span>得到</span><span>电信</span><span>金蝶</span><span>领海</span></div>
    </div>
  </section>
}

export function FaqSection() {
  const [openCategory, setOpenCategory] = useState('产品问题')
  return <section className="home-section home-faq-section" id="faq">
    <div className="section-wrap">
      <SectionHeading title="常见问题。" description="了解产品能力、设备文件管理和开发接入方式。" />
      <div className="faq-groups">{['产品问题', '设备使用', '开发接入', '企业合作'].map((category) => <section className="faq-group" key={category}><button type="button" aria-expanded={openCategory === category} onClick={() => setOpenCategory((current) => current === category ? '' : category)}><span>{category}</span><b>{openCategory === category ? '−' : '+'}</b></button>{openCategory === category && <div className="faq-answers">{questions.filter(([group]) => group === category).map(([, question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p>{question.includes('API') && <Link to="/developer/api">查看 API 文档 ↗</Link>}{question.includes('SDK') && <Link to="/developer/sdk">前往 SDK 下载 ↗</Link>}{question.includes('申请') && <Link to="/developer/apply">申请开发接入 ↗</Link>}{question.includes('联系') && <a href="https://www.jiatui.com/#forms">前往加推官网联系 ↗</a>}</details>)}</div>}</section>)}</div>
    </div>
  </section>
}

function SceneArtwork({ scene }: { scene: string }) {
  const stroke = '#d7d1c8'
  const accent = '#e34a35'
  return <svg className={`application-art application-art-${scene}`} viewBox="0 0 420 220" role="img" aria-label="商业应用场景原创矢量插画">
    <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 192H396" stroke="#484440" />
      {scene === '01' && <>
        <rect x="50" y="48" width="106" height="116" rx="3" /><path d="M69 73h65M69 89h50M69 105h58M69 137h38" />
        <circle cx="268" cy="77" r="26" /><path d="M223 166v-17c0-26 19-44 45-44s45 18 45 44v17M252 134h31" />
        <rect x="315" y="119" width="50" height="41" rx="3" /><path d="M326 132h28M326 143h18" />
      </>}
      {scene === '02' && <>
        <path d="M71 145h278l-28 27H99zM113 172v20M306 172v20" />
        <circle cx="143" cy="66" r="20" /><circle cx="210" cy="53" r="22" /><circle cx="277" cy="66" r="20" />
        <path d="M111 123v-9c0-18 13-31 32-31s32 13 32 31v9M173 119v-12c0-20 15-34 37-34s37 14 37 34v12M245 123v-9c0-18 13-31 32-31s32 13 32 31v9" />
        <rect x="190" y="140" width="40" height="8" rx="2" />
      </>}
      {scene === '03' && <>
        <rect x="51" y="58" width="106" height="111" rx="3" /><path d="M68 83h70M68 99h48M68 137l20-19 16 12 22-27" />
        <circle cx="247" cy="71" r="22" /><path d="M207 160v-20c0-24 17-41 40-41s40 17 40 41v20M221 119l26 18 26-18" />
        <rect x="301" y="117" width="59" height="48" rx="4" /><path d="M316 117v-10h29v10M318 135h25" />
      </>}
      {scene === '04' && <>
        <circle cx="132" cy="72" r="22" /><path d="M94 160v-21c0-23 16-40 38-40s38 17 38 40v21M104 119l28 19 28-19" />
        <circle cx="288" cy="72" r="22" /><path d="M250 160v-21c0-23 16-40 38-40s38 17 38 40v21M260 119l28 19 28-19" />
        <path d="M191 112v-16c0-7 5-12 12-12s12 5 12 12v16M203 112v29M186 141h34" />
      </>}
    </g>
    <g fill={accent}><circle cx={scene === '01' ? '268' : scene === '02' ? '210' : scene === '03' ? '247' : '203'} cy={scene === '02' ? '53' : '72'} r="4" /></g>
  </svg>
}

export function HomeCtaSection() {
  return <section className="home-cta-section" id="contact">
    <div className="home-cta-inner"><div><h2>开始使用 JEETOO Device SDK。</h2><p>将已开放的设备能力接入你的产品与业务场景。</p></div><div className="home-cta-actions"><Link className="button button-accent" to="/developer/apply">申请接入 <span>↗</span></Link><Link className="button home-contact-button" to="/developer/api">查看文档 <span>↗</span></Link></div></div>
  </section>
}

