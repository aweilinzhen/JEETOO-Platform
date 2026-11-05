import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'

type SdkPlatform = {
  id: 'android' | 'ios' | 'harmony'
  name: string
  version: string
  updatedAt: string
  system: string
  format: string
  language: string
  description: string
}

const platforms: SdkPlatform[] = [
  {
    id: 'android', name: 'Android SDK', version: 'v1.0.7', updatedAt: '2026-09-03',
    system: 'Android 5.0+（API 21）', format: 'AAR', language: 'Kotlin / Java',
    description: '加推录音卡 Android SDK，通过 AAR 集成设备连接、录音控制、文件管理与传输能力。',
  },
  {
    id: 'ios', name: 'iOS SDK', version: 'v1.0.7', updatedAt: '2026-09-03',
    system: 'iOS 13.0+', format: 'XCFramework', language: 'Swift / Objective-C',
    description: '通过 JTCardSDK XCFramework 集成设备连接、状态管理与录音文件传输能力。',
  },
  {
    id: 'harmony', name: 'HarmonyOS SDK', version: '1.0.10', updatedAt: '未注明',
    system: 'HarmonyOS 6.0.0（API 20）', format: 'HAR', language: 'ArkTS / ETS',
    description: '通过 HAR 集成设备连接、状态管理与文件传输能力。',
  },
]

function PlatformGlyph({ platform }: { platform: SdkPlatform['id'] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {platform === 'android' && <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10 5.5h4M10 18.5h4M4.5 7.5v8M19.5 7.5v8" /></>}
      {platform === 'ios' && <><rect x="5.5" y="2.5" width="13" height="19" rx="3" /><path d="M9.5 5.5h5M8.5 9h7M8.5 12h7M8.5 15h4M10.5 18.5h3" /></>}
      {platform === 'harmony' && <><rect x="2.5" y="5" width="11" height="14" rx="2" /><rect x="15.5" y="3" width="6" height="10" rx="1.5" /><path d="M6 21h4M17.5 16h2M13.5 10h2" /><circle cx="15" cy="10" r="1.5" /></>}
    </svg>
  )
}

export function DeveloperSdkPage() {
  const { loginStatus, accessStatus } = useMockAuthState()
  const [downloadNotice, setDownloadNotice] = useState<{ platform: string; message: string } | null>(null)
  const gatedPath = loginStatus === 'logged_out'
    ? '/developer/login'
    : accessStatus === 'authorized' ? null : getRestrictedResourcePath('/developer/sdk')

  const handleDownload = (platform: string) => {
    setDownloadNotice({ platform, message: `${platform} SDK 安装包尚未配置到当前项目，暂无法下载。` })
  }

  return (
    <section className="sdk-download-page">
      <div className="sdk-download-wrap">
        <header className="sdk-download-heading">
          <div className="apply-eyebrow"><span /> DEVELOPER RESOURCES</div>
          <h1>SDK 下载</h1>
          <p>获取 JEETOO SDK，快速集成 AI 录音设备能力。</p>
        </header>

        <div className="sdk-download-grid sdk-download-grid-three">
          {platforms.map((platform) => (
            <article className="sdk-download-card sdk-download-card-unified" key={platform.id}>
              <div className="sdk-download-card-top">
                <div className="platform-icon"><PlatformGlyph platform={platform.id} /></div>
              </div>

              <div className="sdk-download-copy">
                <h2>{platform.name}</h2>
                <p>{platform.description}</p>
              </div>

              <dl className="sdk-release-grid sdk-release-grid-unified">
                <div><dt>最新版本</dt><dd>{platform.version}</dd></div>
                <div><dt>更新日期</dt><dd>{platform.updatedAt}</dd></div>
                <div><dt>系统要求</dt><dd>{platform.system}</dd></div>
                <div><dt>文件格式</dt><dd>{platform.format}</dd></div>
                <div><dt>开发语言</dt><dd>{platform.language}</dd></div>
              </dl>

              <div className="sdk-download-actions sdk-download-actions-unified">
                {gatedPath
                  ? <Link className="button button-accent sdk-download-button" to={gatedPath}>下载 SDK <span>↓</span></Link>
                  : <button className="button button-accent sdk-download-button" type="button" onClick={() => handleDownload(platform.name)}>下载 SDK <span>↓</span></button>}
              </div>
              {downloadNotice?.platform === platform.name && <div className="sdk-download-notice" role="status">{downloadNotice.message}</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
