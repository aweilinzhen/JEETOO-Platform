import { apiDocs, type ApiDocNode } from './apiDocs'

export type ApiPlatform = 'android' | 'ios' | 'harmony'

export const API_PLATFORM_STORAGE_KEY = 'jeetoo-api-doc-platform'

export const apiPlatforms: Array<{ id: ApiPlatform; label: string; documentationTitle: string; sidebarTitle: string }> = [
  { id: 'android', label: 'Android', documentationTitle: 'Android SDK Documentation', sidebarTitle: 'Android SDK' },
  { id: 'ios', label: 'iOS', documentationTitle: 'iOS SDK Documentation', sidebarTitle: 'iOS SDK' },
  { id: 'harmony', label: '鸿蒙', documentationTitle: 'HarmonyOS SDK Documentation', sidebarTitle: 'HarmonyOS SDK' },
]

const iosDocs: ApiDocNode[] = [
  {
    id: 'ios-1', number: '1', title: 'iOS SDK 概览', level: 1,
    blocks: [{ type: 'paragraph', text: 'iOS SDK 正在整理中，后续将通过更新日志发布。' }],
    children: [
      { id: 'ios-1.1', number: '1.1', title: '平台说明', level: 2, blocks: [{ type: 'paragraph', text: 'JEETOO iOS SDK 文档与接入资源正在筹备中。' }], children: [] },
      { id: 'ios-1.2', number: '1.2', title: '当前状态', level: 2, blocks: [{ type: 'paragraph', text: '筹备中' }], children: [] },
    ],
  },
]

const harmonyDocs: ApiDocNode[] = [
  {
    id: 'harmony-1', number: '1', title: '鸿蒙 SDK 概览', level: 1,
    blocks: [{ type: 'paragraph', text: '鸿蒙 SDK 正在准备中，后续开放信息将通过更新日志发布。' }],
    children: [
      { id: 'harmony-1.1', number: '1.1', title: '平台说明', level: 2, blocks: [{ type: 'paragraph', text: 'JEETOO HarmonyOS SDK 文档与接入资源正在规划中。' }], children: [] },
      { id: 'harmony-1.2', number: '1.2', title: '当前状态', level: 2, blocks: [{ type: 'paragraph', text: '规划中' }], children: [] },
    ],
  },
]

export const apiPlatformDocs: Record<ApiPlatform, ApiDocNode[]> = {
  android: apiDocs,
  ios: iosDocs,
  harmony: harmonyDocs,
}
