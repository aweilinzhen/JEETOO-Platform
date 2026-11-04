import { Link } from 'react-router-dom'
import { SectionHeading } from './SectionHeading'

const capabilities = [
  { title: '设备连接', description: '快速发现并连接 JEETOO 录音设备', icon: 'link', href: '/developer/quick-start' },
  { title: '设备控制', description: '通过应用控制设备的核心操作', icon: 'control', href: '/developer/api' },
  { title: '录音文件管理', description: '获取、整理与管理录音文件', icon: 'file', href: '/developer/api' },
  { title: 'Wi-Fi 文件传输', description: '高速传输设备中的录音内容', icon: 'wifi', href: '/developer/api' },
  { title: '实时录音', description: '实时获取录音状态与音频流', icon: 'wave', href: '/developer/api' },
  { title: '设备配置管理', description: '灵活设置设备参数与工作模式', icon: 'settings', href: '/developer/api' },
]

function CapabilityIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    link: 'M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20l1.1-1.1',
    control: 'M5 5h14v14H5zM9 9l6 3-6 3z',
    file: 'M6 3h8l4 4v14H6zM14 3v5h5M9 12h6M9 16h6',
    wifi: 'M3 9a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 15a5 5 0 0 1 6 0M12 19h.01',
    wave: 'M3 12h2l2-6 4 12 3-9 2 5h5',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.3v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2H15v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1z',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

export function CapabilitySection() {
  return (
    <section className="home-section capability-section" id="capabilities">
      <div className="section-wrap">
        <SectionHeading eyebrow="SDK-POWERED CAPABILITIES" title="连接设备，释放更多可能" description="通过 JEETOO SDK 向企业开发者开放设备连接、控制、录音、文件传输与配置能力，支撑应用集成与场景开发。" />
        <div className="capability-grid">
          {capabilities.map((item, index) => <Link className="capability-card" to={item.href} key={item.title}>
            <div className="capability-top"><span className="capability-icon"><CapabilityIcon name={item.icon} /></span><span className="capability-index">0{index + 1}</span></div>
            <h3>{item.title}</h3><p>{item.description}</p><span className="card-arrow">↗</span>
          </Link>)}
        </div>
      </div>
    </section>
  )
}
