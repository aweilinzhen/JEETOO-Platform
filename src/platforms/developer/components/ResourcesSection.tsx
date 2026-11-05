import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'
import { SectionHeading } from './SectionHeading'

const resources = [
  { number: '01', title: '快速开始', description: '了解开发流程与接入准备', href: '/developer/quick-start', public: true, label: '公开浏览' },
  { number: '02', title: 'SDK 下载', description: '查看 Android SDK 与其他平台状态', href: '/developer/sdk', public: false, label: '授权访问' },
  { number: '03', title: 'API 参考文档', description: '查阅接口说明与参数定义', href: '/developer/api', public: false, label: '授权访问' },
  { number: '04', title: 'Demo 示例', description: '查看示例项目与集成代码', href: '/developer/demo', public: false, label: '授权访问' },
  { number: '05', title: '设备指南', description: '查看 AI 录音卡产品与设备基础信息', href: '/developer/device-guide', public: true, label: '产品指南' },
]

export function ResourcesSection() {
  useMockAuthState()
  return (
    <section className="home-section resources-section" id="resources">
      <div className="section-wrap">
        <SectionHeading title="你需要的开发资源" description="从接入指南到完整示例，帮助你更快完成开发。" />
        <div className="resource-list">
          {resources.map((resource) => <Link className="resource-row" key={resource.number} to={resource.public ? resource.href : getRestrictedResourcePath(resource.href)}>
            <span className="resource-number">{resource.number}</span><span className="resource-main"><b>{resource.title}</b><small>{resource.description}</small></span>
            <span className={`resource-access${resource.public ? ' is-public' : ''}`}>{resource.public ? <span className="public-dot" /> : <span className="lock-icon">⌑</span>}{resource.label}</span><span className="resource-arrow">↗</span>
          </Link>)}
        </div>
        <div className="resource-footnote">公开内容可直接浏览，SDK 集成文档与 Demo 源码需完成开发者授权。</div>
      </div>
    </section>
  )
}
