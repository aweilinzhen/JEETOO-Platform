import { createHashRouter, Navigate } from 'react-router-dom'
import { DeveloperLayout } from '../platforms/developer/layouts/DeveloperLayout'
import { AdminLayout } from '../platforms/admin/layouts/AdminLayout'
import { AdminDashboardPage } from '../platforms/admin/pages/AdminDashboardPage'
import { AdminApplicationsPage } from '../platforms/admin/pages/AdminApplicationsPage'
import { AdminApplicationDetailPage } from '../platforms/admin/pages/AdminApplicationDetailPage'
import { AdminDevelopersPage } from '../platforms/admin/pages/AdminDevelopersPage'
import { PlaceholderPage } from '../shared/components/PlaceholderPage'
import { DeveloperHomePage } from '../platforms/developer/pages/DeveloperHomePage'
import { DeveloperLoginPage } from '../platforms/developer/pages/DeveloperLoginPage'
import { DeveloperApplyPage } from '../platforms/developer/pages/DeveloperApplyPage'
import { DeveloperApplicationStatusPage } from '../platforms/developer/pages/DeveloperApplicationStatusPage'
import { DeveloperSdkPage } from '../platforms/developer/pages/DeveloperSdkPage'
import { QuickStartPage } from '../platforms/developer/pages/QuickStartPage'
import { ApiReferencePage } from '../platforms/developer/pages/ApiReferencePage'
import { DeveloperDemoPage } from '../platforms/developer/pages/DeveloperDemoPage'
import { DeveloperChangelogPage } from '../platforms/developer/pages/DeveloperChangelogPage'

const developerPages = [
  ['首页', '/developer', 'developer-home'],
  ['登录', '/developer/login', 'developer-login'],
  ['开发接入申请', '/developer/apply', 'developer-apply'],
  ['申请状态', '/developer/application-status', 'application-status'],
  ['账号激活', '/developer/activate', 'activate'],
  ['快速开始', '/developer/quick-start', 'quick-start'],
  ['SDK 下载', '/developer/sdk', 'sdk'],
  ['API 文档', '/developer/api', 'api'],
  ['Demo 示例', '/developer/demo', 'demo'],
  ['更新日志', '/developer/changelog', 'changelog'],
] as const

export const router = createHashRouter([
  { path: '/', element: <Navigate to="/developer" replace /> },
  {
    path: '/developer',
    element: <DeveloperLayout />,
    children: developerPages.map(([title, path, id]) => ({
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
          ? <QuickStartPage />
        : id === 'api'
          ? <ApiReferencePage />
        : id === 'demo'
          ? <DeveloperDemoPage />
        : id === 'changelog'
          ? <DeveloperChangelogPage />
        : <PlaceholderPage title={title} platform="developer" pageId={id} />,
    })),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'applications', element: <AdminApplicationsPage /> },
      { path: 'applications/:applicationId', element: <AdminApplicationDetailPage /> },
      { path: 'developers', element: <AdminDevelopersPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/developer" replace /> },
])
