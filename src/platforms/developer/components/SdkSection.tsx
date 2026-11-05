import { SectionHeading } from './SectionHeading'

const platforms = [
  {
    id: 'android',
    className: 'sdk-android',
    icon: 'android',
    title: 'Android SDK',
    description: '通过 AAR 集成设备连接、录音控制、文件管理与传输能力。',
    details: [
      ['系统版本', 'Android 5.0+（API 21）'],
      ['开发语言', 'Kotlin / Java'],
      ['集成方式', 'AAR'],
    ],
  },
  {
    id: 'ios',
    className: 'sdk-ios',
    icon: 'ios',
    title: 'iOS SDK',
    description: '通过 XCFramework 集成设备连接、状态管理与录音文件传输能力。',
    details: [
      ['系统版本', 'iOS 13.0+'],
      ['开发语言', 'Swift / Objective-C'],
      ['集成方式', 'XCFramework'],
    ],
  },
  {
    id: 'harmony',
    className: 'sdk-harmony',
    icon: 'harmony',
    title: 'HarmonyOS SDK',
    description: '通过 HAR 集成设备连接、状态管理与文件传输能力。',
    details: [
      ['系统版本', 'HarmonyOS 6.0+（API 20）'],
      ['开发语言', 'ArkTS / ETS'],
      ['集成方式', 'HAR'],
    ],
  },
]

function PlatformIcon({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === 'android' && <>
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
        <path d="M10 5.5h4M10 18.5h4" />
        <path d="M4.5 7.5v8M19.5 7.5v8" />
      </>}
      {type === 'ios' && <>
        <rect x="5.5" y="2.5" width="13" height="19" rx="3" />
        <path d="M9.5 5.5h5M8.5 9h7M8.5 12h7M8.5 15h4" />
        <path d="M10.5 18.5h3" />
      </>}
      {type === 'harmony' && <>
        <rect x="2.5" y="5" width="11" height="14" rx="2" />
        <rect x="15.5" y="3" width="6" height="10" rx="1.5" />
        <path d="M6 21h4M17.5 16h2M13.5 10h2" />
        <circle cx="15" cy="10" r="1.5" />
      </>}
    </svg>
  )
}

export function SdkSection() {
  return (
    <section className="home-section sdk-section" id="platform-support">
      <div className="section-wrap">
        <SectionHeading title="支持多平台接入。" description="Android、iOS 与 HarmonyOS 的 SDK 接入基础信息。" />
        <div className="sdk-grid sdk-home-platform-grid-three">
          {platforms.map((platform) => (
            <article className={`sdk-card ${platform.className}`} key={platform.id}>
              <div className="sdk-card-heading">
                <div className="platform-icon"><PlatformIcon type={platform.icon} /></div>
              </div>
              <div className="sdk-card-copy">
                <h3>{platform.title}</h3>
                <p>{platform.description}</p>
              </div>
              <dl className="sdk-platform-facts">
                {platform.details.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
