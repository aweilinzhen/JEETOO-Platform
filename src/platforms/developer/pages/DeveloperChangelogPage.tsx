import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sdkReleases, type SdkPlatform } from '../mock/changelog'

export function DeveloperChangelogPage() {
  const [platform, setPlatform] = useState<SdkPlatform>('android')
  const [expandedVersion, setExpandedVersion] = useState<string | null>('v1.0.7')
  const releases = sdkReleases.filter((release) => release.platform === platform)

  return (
    <section className="changelog-page">
      <div className="changelog-wrap">
        <header className="changelog-heading">
          <div className="apply-eyebrow"><span /> DEVELOPER RELEASE NOTES</div>
          <div className="changelog-heading-row"><div><h1>更新日志</h1><p>了解 JEETOO SDK 版本变化、功能更新与兼容性信息。</p></div><Link className="button button-accent changelog-download" to="/developer/sdk">前往 SDK 下载 <span>↗</span></Link></div>
        </header>

        <div className="changelog-toolbar">
          <div className="changelog-platform-tabs" role="group" aria-label="按 SDK 平台筛选">
            <button className={platform === 'android' ? 'is-active' : ''} type="button" onClick={() => setPlatform('android')}>Android SDK <span>{sdkReleases.filter((release) => release.platform === 'android').length}</span></button>
            <button className={platform === 'ios' ? 'is-active' : ''} type="button" onClick={() => setPlatform('ios')}>iOS SDK <span>暂未开放</span></button>
          </div>
          <span className="changelog-filter-label">平台筛选</span>
        </div>

        {releases.length === 0 ? <div className="changelog-empty"><span>—</span><h2>暂无版本记录</h2><p>iOS SDK 暂未开放，后续版本信息将在此更新。</p></div> : <div className="release-timeline">
          {releases.map((release, index) => {
            const expanded = expandedVersion === release.version
            return <article className="release-entry" key={`${release.platform}-${release.version}`}>
              <div className="release-rail"><span className="release-dot" />{index < releases.length - 1 && <i />}</div>
              <div className="release-card">
                <div className="release-card-top"><div className="release-ident"><span className="release-platform">{release.sdkName}</span><h2>{release.version}</h2>{index === 0 && <span className="latest-tag">最新版本</span>}</div><button className="release-toggle" type="button" aria-expanded={expanded} onClick={() => setExpandedVersion(expanded ? null : release.version)}>{expanded ? '收起详情 −' : '展开详情 +'}</button></div>
                <div className="release-meta"><span><i className="meta-calendar" />发布于 {release.releaseDate}</span><div>{release.updateTypes.map((type) => <span className="release-type" key={type}>{type}</span>)}</div></div>
                {expanded && <div className="release-details">
                  <div className="release-detail-block"><h3><span className="detail-marker marker-new">＋</span>新增功能</h3><ul>{release.newFeatures.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div className="release-detail-block"><h3><span className="detail-marker marker-improve">↗</span>功能优化</h3><ul>{release.improvements.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div className="release-detail-block"><h3><span className="detail-marker marker-sample">◇</span>Demo 示例</h3><ul>{release.sampleUpdates.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div className="release-detail-block"><h3><span className="detail-marker marker-fix">✓</span>问题修复</h3><p>{release.fixes.length ? release.fixes.join('；') : '暂无问题修复记录。'}</p></div>
                  <div className="release-compatibility"><span>兼容性</span><p>{release.compatibility}</p></div>
                </div>}
              </div>
            </article>
          })}
        </div>}

        <div className="changelog-bottom-cta"><div><span>获取最新 SDK</span><p>在 SDK 下载页面查看版本信息和获取方式。</p></div><Link to="/developer/sdk">前往 SDK 下载 <span>↗</span></Link></div>
        <div className="changelog-disclaimer">更新记录基于当前可用资料整理；未提供的信息会在确认后补充。</div>
      </div>
    </section>
  )
}
