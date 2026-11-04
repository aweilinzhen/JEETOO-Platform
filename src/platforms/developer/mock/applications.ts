export type MockApplicationStatus = 'pending' | 'approved' | 'rejected'

export type ApplicationFormData = {
  contactName: string
  phone: string
  company: string
  email: string
  projectName: string
  scale: string
  purpose: string
  description: string
}

export type MockApplicationRecord = ApplicationFormData & {
  id: string
  status: MockApplicationStatus
  updatedAt: string
  submittedAt?: string
  rejectionReason?: string
}

const STORAGE_KEY = 'jeetoo.developer.mockApplications.v1'

export function readMockApplications(): MockApplicationRecord[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is MockApplicationRecord =>
      typeof item === 'object' && item !== null &&
      typeof (item as MockApplicationRecord).email === 'string' &&
      typeof (item as MockApplicationRecord).id === 'string' &&
      ['pending', 'approved', 'rejected'].includes((item as MockApplicationRecord).status),
    )
  } catch {
    return []
  }
}

export function saveMockApplications(records: MockApplicationRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function readLatestMockApplication(status?: MockApplicationStatus) {
  const records = readMockApplications().filter((record) => !status || record.status === status)
  return records.sort((a, b) => {
    const dateA = Date.parse(a.submittedAt ?? a.updatedAt) || 0
    const dateB = Date.parse(b.submittedAt ?? b.updatedAt) || 0
    return dateB - dateA
  })[0] ?? null
}

export function updateMockApplicationStatus(id: string, status: MockApplicationStatus, rejectionReason = '') {
  const records = readMockApplications()
  const index = records.findIndex((record) => record.id === id)
  if (index < 0) return null
  const record: MockApplicationRecord = {
    ...records[index],
    status,
    updatedAt: new Date().toISOString(),
    rejectionReason: status === 'rejected' ? rejectionReason : undefined,
  }
  records[index] = record
  saveMockApplications(records)
  return record
}

export function createMockApplicationId() {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `JTA-${new Date().getFullYear()}-${suffix}`
}
