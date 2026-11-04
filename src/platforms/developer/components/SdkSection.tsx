import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'
import { SectionHeading } from './SectionHeading'

export function SdkSection() {
  const { loginStatus, accessStatus } = useMockAuthState()
  const accessPath = getRestrictedResourcePath('/developer/sdk')
  const authorized = loginStatus === 'logged_in' && accessStatus === 'authorized'
  const gatedLabel = loginStatus === 'logged_out' ? '登录后查看' : authorized ? '下载 SDK' : accessStatus === 'pending' ? '查看申请状态' : accessStatus === 'rejected' ? '重新申请' : '申请开发接入'
  const statusLabel = {
    'not-applied': loginStatus === 'logged_out' ? '需登录' : '需申请授权',
    pending: '申请审核中',
    rejected: '申请未通过',
    authorized: '已开放下载',
  }[accessStatus]
  return (
    <section className="home-section sdk-section" id="sdk">
      <div className="section-wrap">
        <SectionHeading eyebrow="SDK DOWNLOAD" title="从 SDK 开始，快速集成" description="获取官方开发工具包，将 JEETOO 设备能力集成到你的应用。" />
        <div className="sdk-grid">
          <article className="sdk-card sdk-android">
            <div className="sdk-card-heading"><div className="platform-icon android-icon">A</div><span className={`availability availability-${accessStatus}`}><i /> {statusLabel}</span></div>
            <div className="sdk-card-copy"><div className="sdk-kicker">ANDROID SDK</div><h3>Android SDK</h3><p>适用于 Android 应用的设备连接与录音管理工具包。</p></div>
            <div className="sdk-meta"><span>PACKAGE FORMAT</span><b>AAR</b><span>VERSION</span><b>v1.0.7</b></div>
            <Link className="button button-accent sdk-action" to={accessPath}>{gatedLabel}<span>↗</span></Link>
          </article>
          <article className="sdk-card sdk-ios">
            <div className="sdk-card-heading"><div className="platform-icon ios-icon">●</div><span className="coming-pill">COMING SOON</span></div>
            <div className="sdk-card-copy"><div className="sdk-kicker">APPLE SDK</div><h3>iOS SDK</h3><p>iOS 平台支持正在准备中，敬请关注后续更新。</p></div>
            <div className="ios-placeholder"><span>iOS</span><span>SDK</span></div>
            <div className="sdk-card-foot">即将开放 <span>—</span></div>
          </article>
        </div>
        {!authorized && <p className="sdk-access-note"><span>i</span> SDK 文件仅向已登录且已获授权的开发者开放。</p>}
      </div>
    </section>
  )
}
