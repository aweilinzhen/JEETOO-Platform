import { SectionHeading } from './SectionHeading'

const capabilities = [
  { title: '录音控制', description: '控制录音开始与停止，获取录音状态，监听设备事件。', icon: 'record' },
  { title: '文件管理与传输', description: '管理设备录音文件，支持 BLE 与 Wi-Fi 下载及传输进度监听。', icon: 'transfer' },
  { title: 'OTA 固件升级', description: '通过 SDK 升级设备固件，实时获取升级进度与结果。', icon: 'ota' },
  { title: '设备信息与状态', description: '获取设备 SN、固件版本、电量、存储容量等信息。', icon: 'device' },
]

function CapabilityIcon({ name }: { name: string }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'record' && <><circle cx="24" cy="24" r="16" opacity=".5" /><circle cx="24" cy="24" r="5" fill="currentColor" stroke="none" /><path d="M24 5v5M43 24h-5M24 43v-5M5 24h5" /></>}
    {name === 'transfer' && <><path d="M5 16h28M27 10l7 6-7 6M43 32H15M21 26l-7 6 7 6" /><circle cx="8" cy="16" r="2" fill="currentColor" /><circle cx="40" cy="32" r="2" fill="currentColor" /></>}
    {name === 'ota' && <><path d="M24 7v20M17 20l7 7 7-7M11 32v7h26v-7" /><path d="M10 12a19 19 0 0 1 28 0" opacity=".45" /></>}
    {name === 'device' && <><rect x="12" y="6" width="24" height="36" rx="5" /><path d="M18 14h12M18 20h12M18 29h5M18 35h12" /><circle cx="29" cy="29" r="2" fill="currentColor" /></>}
  </svg>
}

function ConnectionGraphic() {
  return <svg className="sdk-connection-graphic" viewBox="0 0 540 300" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="204" y="63" width="132" height="174" rx="18" opacity=".86" />
      <rect x="213" y="72" width="114" height="156" rx="12" opacity=".32" />
      <path d="M223 99h94M223 205h94" opacity=".24" />
      <circle cx="270" cy="119" r="19" opacity=".55" />
      <path d="M262 119h16M270 111v16" opacity=".85" />
      <path d="M155 140c12-18 28-28 47-31M155 160c12 18 28 28 47 31M385 109c19 3 35 13 47 31M385 191c19-3 35-13 47-31" opacity=".66" />
      <path d="M135 123c17-25 40-39 67-43M135 177c17 25 40 39 67 43M405 80c27 4 50 18 67 43M405 220c27-4 50-18 67-43" opacity=".3" />
      <path d="M102 150h49M389 150h49" strokeDasharray="3 7" opacity=".42" />
      <circle cx="102" cy="150" r="4" fill="currentColor" /><circle cx="438" cy="150" r="4" fill="currentColor" />
      <path d="M250 250h40M259 258h22" opacity=".33" />
    </g>
    <circle cx="270" cy="119" r="3" fill="var(--dev-brand)" />
    <circle cx="438" cy="150" r="3" fill="var(--dev-brand)" />
  </svg>
}

export function CapabilitySection() {
  return <section className="home-section capability-section" id="capabilities">
    <div className="section-wrap">
      <SectionHeading title="一套 SDK，开放录音设备的核心能力。" description="通过 JEETOO Device SDK，轻松实现设备连接、录音控制、文件传输、状态查询与固件升级。" />
      <div className="sdk-capabilities-layout">
        <article className="sdk-capability-main">
          <div className="sdk-capability-main-visual"><ConnectionGraphic /></div>
          <div className="sdk-capability-main-copy"><h3>设备连接</h3><p>扫描并连接录音设备，获取设备信息，实时监听连接状态。</p></div>
        </article>
        <div className="sdk-capability-small-grid">
          {capabilities.map((item) => <article className="sdk-capability-small" key={item.title}>
            <div className="sdk-capability-small-top"><span className="sdk-capability-small-icon"><CapabilityIcon name={item.icon} /></span></div>
            <h3>{item.title}</h3><p>{item.description}</p>
          </article>)}
        </div>
      </div>
    </div>
  </section>
}
