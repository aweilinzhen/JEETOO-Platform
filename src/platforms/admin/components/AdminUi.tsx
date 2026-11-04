import type { ReactNode } from 'react'
import type { ReviewStatus } from '../mock/applications'

const statusLabels: Record<ReviewStatus, string> = { pending: '待审核', approved: '已通过', rejected: '已驳回' }

export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="admin-page-heading"><div>{eyebrow && <div className="admin-eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="admin-heading-action">{action}</div>}</div>
}

export function AdminStatCard({ label, value, hint, icon }: { label: string; value: number | string; hint?: string; icon: string }) {
  return <article className="admin-stat-card"><div className="admin-stat-top"><span>{label}</span><i>{icon}</i></div><div className="admin-stat-value">{value}</div>{hint && <div className="admin-stat-hint">{hint}</div>}</article>
}

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return <span className={`admin-status admin-status-${status}`}><i />{statusLabels[status]}</span>
}

export function AdminEmpty({ title, description }: { title: string; description?: string }) {
  return <div className="admin-empty-state"><span>—</span><b>{title}</b>{description && <p>{description}</p>}</div>
}

export function formatAdminStatus(status: ReviewStatus) {
  return statusLabels[status]
}
