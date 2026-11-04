import { useSyncExternalStore } from 'react'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationRecord = {
  id: string
  companyName: string
  applicantName: string
  email: string
  phone: string
  projectName: string
  userScale: string
  scenario: string
  projectIntro: string
  submittedAt: string
  status: ReviewStatus
  rejectionReason?: string
  accountStatus?: '待激活' | '正常' | '停用'
}

const STORAGE_KEY = 'jeetoo-admin-applications'
const seed: ApplicationRecord[] = [
  { id: 'JT-2026-1048', companyName: '深圳知行科技有限公司', applicantName: '林若宁', email: 'lin.ruoning@zhixing.ai', phone: '138 0000 2148', projectName: '知行会议助手', userScale: '101-1000', scenario: '企业内部应用', projectIntro: '计划将 JEETOO 录音设备接入企业会议助手，支持会议录音、文件同步与会后内容整理。', submittedAt: '2026-11-04 10:26', status: 'pending' },
  { id: 'JT-2026-1047', companyName: '杭州云栈软件有限公司', applicantName: '周以安', email: 'zhou.yian@cloudstack.cn', phone: '137 0000 1086', projectName: 'CloudStack AI Notes', userScale: '1001-10000', scenario: 'SaaS 软件集成', projectIntro: '为现有 SaaS 协作产品增加 AI 录音硬件连接及录音文件管理能力。', submittedAt: '2026-11-04 09:12', status: 'pending' },
  { id: 'JT-2026-1045', companyName: '成都声域智能有限公司', applicantName: '陈嘉禾', email: 'jiahe.chen@soundfield.cn', phone: '186 0000 7315', projectName: '声域录音工作台', userScale: '101-1000', scenario: 'AI 录音应用开发', projectIntro: '开发面向企业访谈场景的录音应用，接入设备控制、录音列表和 Wi-Fi 传输功能。', submittedAt: '2026-11-03 16:40', status: 'approved', accountStatus: '待激活' },
  { id: 'JT-2026-1044', companyName: '北京方格数字科技有限公司', applicantName: '许知远', email: 'xuzhiyuan@gridtech.com', phone: '139 0000 4812', projectName: '方格现场记录', userScale: '1-100', scenario: '硬件设备集成', projectIntro: '将录音卡集成至现场服务工作流，为服务人员提供便携录音与文件同步能力。', submittedAt: '2026-11-03 14:08', status: 'rejected', rejectionReason: '请补充项目的设备使用场景及预计接入规模。' },
  { id: 'JT-2026-1042', companyName: '上海墨白网络科技有限公司', applicantName: '顾清和', email: 'qinghe.gu@mobai.tech', phone: '135 0000 6950', projectName: '墨白灵感笔记', userScale: '1001-10000', scenario: 'SaaS 软件集成', projectIntro: '在团队知识管理产品中增加录音设备接入和音频文件管理能力。', submittedAt: '2026-11-02 11:35', status: 'approved', accountStatus: '正常' },
  { id: 'JT-2026-1039', companyName: '广州拾音文化传媒有限公司', applicantName: '唐乐之', email: 'tang.lezhi@shiyin.media', phone: '136 0000 3321', projectName: '拾音创作助手', userScale: '101-1000', scenario: '其他', projectIntro: '为内容创作者提供录音素材归档和工作流管理工具。', submittedAt: '2026-11-01 17:22', status: 'approved', accountStatus: '正常' },
  { id: 'JT-2026-1036', companyName: '南京远见信息技术有限公司', applicantName: '宋亦航', email: 'song.yihang@visionit.cn', phone: '188 0000 9043', projectName: '远见访谈纪要', userScale: '1-100', scenario: '企业内部应用', projectIntro: '为内部访谈和调研团队提供录音采集与文件归档能力。', submittedAt: '2026-10-31 13:50', status: 'pending' },
]

function readSaved(): ApplicationRecord[] {
  if (typeof window === 'undefined') return seed
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as ApplicationRecord[] | null
    return Array.isArray(saved) ? saved : seed
  } catch {
    return seed
  }
}

let records = readSaved()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function useAdminApplications() {
  return useSyncExternalStore(subscribe, () => records, () => seed)
}

export function getAdminApplications() {
  return records
}

export function reviewApplication(id: string, status: Exclude<ReviewStatus, 'pending'>, rejectionReason?: string) {
  records = records.map((application) => application.id === id
    ? { ...application, status, rejectionReason: status === 'rejected' ? rejectionReason?.trim() : undefined }
    : application)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // Keep the in-memory mock usable if browser storage is unavailable.
  }
  notify()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    records = readSaved()
    notify()
  })
}
