import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'

const sdkRelease = {
  version: 'v1.0.7',
  updatedAt: '2026-09-03',
  platform: 'Android',
  format: 'AAR',
}

const accessAction = {
  'not-applied': { label: '申请开发接入', href: '/developer/apply' },
  pending: { label: '审核中', href: '/developer/application-status' },
  rejected: { label: '重新申请', href: '/developer/apply' },
} as const

export function DeveloperSdkPage() {
  const { loginStatus, accessStatus } = useMockAuthState()
  const [downloadNotice, setDownloadNotice] = useState('')
  const isAuthorized = loginStatus === 'logged_in' && accessStatus === 'authorized'
  const gatedAction = loginStatus === 'logged_out'
    ? { label: '登录后查看', href: '/developer/login' }
    : accessStatus === 'authorized' ? null : accessAction[accessStatus]
  const statusLabel = {
    'not-applied': loginStatus === 'logged_out' ? '需登录' : '需申请授权',
    pending: '审核中',
    rejected: '申请未通过',
    authorized: '已开放下载',
  }[accessStatus]

  return (
    <section className="sdk-download-page">
      <div className="sdk-download-wrap">
        <header className="sdk-download-heading">
          <div className="apply-eyebrow"><span /> DEVELOPER RESOURCES</div>
          <h1>SDK 下载</h1>
          <p>获取 JEETOO SDK，快速集成 AI 录音设备能力。</p>
        </header>

        <div className="sdk-download-grid">
          <article className="sdk-download-card sdk-download-android">
            <div className="sdk-download-card-top"><div className="platform-icon android-icon">A</div><span className={`availability availability-${accessStatus}`}><i />{statusLabel}</span></div>
            <div className="sdk-download-copy"><div className="sdk-kicker">ANDROID SDK</div><h2>Android SDK</h2><p>加推录音卡 Android SDK，用于调用加推录音卡相关功能。SDK 提供 AAR 与示例应用 TestBLE。</p></div>

            <div className="sdk-release-grid">
              <div><span>最新版本</span><b>{sdkRelease.version}</b></div>
              <div><span>更新日期</span><b>{sdkRelease.updatedAt}</b></div>
              <div><span>文件格式</span><b>{sdkRelease.format}</b></div>
              <div><span>支持平台</span><b>{sdkRelease.platform}</b></div>
            </div>

            <div className="sdk-download-actions">
              {gatedAction
                ? <Link className="button button-accent sdk-download-button" to={gatedAction.href}>{gatedAction.label}<span>↗</span></Link>
                : <button className="button button-accent sdk-download-button" type="button" onClick={() => setDownloadNotice('演示模式，暂未配置 SDK 下载文件。')}>下载 SDK <span>↓</span></button>}
              <Link className="sdk-integration-link" to={getRestrictedResourcePath('/developer/quick-start')}>查看集成文档 <span>→</span></Link>
            </div>
            {downloadNotice && <div className="sdk-download-notice" role="status">{downloadNotice}</div>}
            {!isAuthorized && <div className="sdk-authorization-note"><span>i</span> SDK 文件仅向已获得开发者授权的账号开放。</div>}
          </article>

          <article className="sdk-download-card sdk-download-ios">
            <div className="sdk-download-card-top"><div className="platform-icon ios-icon">●</div><span className="coming-pill">COMING SOON</span></div>
            <div className="sdk-download-copy"><div className="sdk-kicker">APPLE SDK</div><h2>iOS SDK</h2><p>iOS 平台 SDK 正在准备中，开放时间将通过更新日志同步发布。</p></div>
            <div className="ios-coming-visual" aria-hidden="true"><span>iOS</span><i /><span>SDK</span></div>
            <div className="ios-download-state"><b>暂未开放下载</b><span>COMING SOON</span></div>
          </article>
        </div>
        <div className="sdk-download-footer-note">版本记录：v1.0.0、v1.0.1、v1.0.2、v1.0.3、v1.0.4、v1.0.5、v1.0.6-Beta、v1.0.7。最新记录为 v1.0.7（2026-09-03）；未提供 AAR 下载地址。</div>
      </div>
    </section>
  )
}
