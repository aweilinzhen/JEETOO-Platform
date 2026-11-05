import { createHashRouter, Navigate } from 'react-router-dom'
import { DeveloperLayout } from '../platforms/developer/layouts/DeveloperLayout'
import { AdminLayout } from '../platforms/admin/layouts/AdminLayout'
import { AdminApplicationsPage } from '../platforms/admin/pages/AdminApplicationsPage'
import { AdminApplicationDetailPage } from '../platforms/admin/pages/AdminApplicationDetailPage'
import { AdminDevelopersPage } from '../platforms/admin/pages/AdminDevelopersPage'
import { PlaceholderPage } from '../shared/components/PlaceholderPage'
import { DeveloperHomePage } from '../platforms/developer/pages/DeveloperHomePage'
import { DeveloperLoginPage } from '../platforms/developer/pages/DeveloperLoginPage'
import { DeveloperApplyPage } from '../platforms/developer/pages/DeveloperApplyPage'
import { DeveloperApplicationStatusPage } from '../platforms/developer/pages/DeveloperApplicationStatusPage'
import { DeveloperSdkPage } from '../platforms/developer/pages/DeveloperSdkPage'
import { ApiReferencePage } from '../platforms/developer/pages/ApiReferencePage'
import { DeveloperDemoPage } from '../platforms/developer/pages/DeveloperDemoPage'
import { DeveloperChangelogPage } from '../platforms/developer/pages/DeveloperChangelogPage'
import { DeviceGuideOverviewPage, DeviceGuideProductPage } from '../platforms/developer/pages/DeviceGuidePage'
import { DeveloperFaqPage } from '../platforms/developer/pages/DeveloperFaqPage'

const developerPages = [
  ['首页', '/developer', 'developer-home'],
  ['登录', '/developer/login', 'developer-login'],
  ['开发接入申请', '/developer/apply', 'developer-apply'],
  ['申请状态', '/developer/application-status', 'application-status'],
  ['账号激活', '/developer/activate', 'activate'],
  ['快速开始', '/developer/quick-start', 'quick-start'],
  ['设备指南', '/developer/device-guide', 'device-guide'],
  ['SDK 下载', '/developer/sdk', 'sdk'],
  ['API 文档', '/developer/api', 'api'],
  ['Demo 示例', '/developer/demo', 'demo'],
  ['常见问题', '/developer/faq', 'faq'],
  ['更新日志', '/developer/changelog', 'changelog'],
] as const

export const router = createHashRouter([
  { path: '/', element: <Navigate to="/developer" replace /> },
  {
    path: '/developer',
    element: <DeveloperLayout />,
    children: [
      ...developerPages.map(([title, path, id]) => ({
      index: path === '/developer',
      path: path === '/developer' ? undefined : path.replace('/developer/', ''),
      element: id === 'developer-home'
        ? <DeveloperHomePage />
        : id === 'developer-login'
          ? <DeveloperLoginPage />
        : id === 'developer-apply'
          ? <DeveloperApplyPage />
        : id === 'application-status'
          ? <DeveloperApplicationStatusPage />
        : id === 'sdk'
          ? <DeveloperSdkPage />
        : id === 'quick-start'
          ? <Navigate to="/developer/api?doc=quick-start" replace />
        : id === 'device-guide'
          ? <DeviceGuideOverviewPage />
        : id === 'api'
          ? <ApiReferencePage />
        : id === 'demo'
          ? <DeveloperDemoPage />
        : id === 'faq'
          ? <DeveloperFaqPage />
        : id === 'changelog'
          ? <DeveloperChangelogPage />
        : <PlaceholderPage title={title} platform="developer" pageId={id} />,
      })),
      { path: 'device-guide/five-mic', element: <DeviceGuideProductPage productId="five-mic" /> },
      { path: 'device-guide/three-mic-flash', element: <DeviceGuideProductPage productId="three-mic-flash" /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/applications" replace /> },
      { path: 'applications', element: <AdminApplicationsPage /> },
      { path: 'applications/:applicationId', element: <AdminApplicationDetailPage /> },
      { path: 'developers', element: <AdminDevelopersPage /> },
      { path: '*', element: <Navigate to="/admin/applications" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/developer" replace /> },
])
