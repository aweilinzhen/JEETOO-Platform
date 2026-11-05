import { apiDocs, parseApiMarkdown, type ApiDocNode } from './apiDocs'
import { harmonyDocs } from './harmonyDocs'
import iosSource from './iosSdkApi.md?raw'

export type ApiPlatform = 'android' | 'ios' | 'harmony'
export type ApiProduct = 'recorder-card' | 'smart-badge' | 'pin'

export const API_SELECTION_STORAGE_KEY = 'jeetoo-api-doc-selection'
export const API_PLATFORM_STORAGE_KEY = 'jeetoo-api-doc-platform'

export const apiProducts: Array<{ id: ApiProduct; label: string }> = [
  { id: 'recorder-card', label: 'AI 录音卡' },
  { id: 'smart-badge', label: '智能工卡' },
  { id: 'pin', label: 'PIN' },
]

export const apiPlatforms: Array<{ id: ApiPlatform; label: string; documentationTitle: string; sidebarTitle: string }> = [
  { id: 'android', label: 'Android', documentationTitle: 'Android SDK Documentation', sidebarTitle: 'Android SDK' },
  { id: 'ios', label: 'iOS', documentationTitle: 'iOS SDK Documentation', sidebarTitle: 'iOS SDK' },
  { id: 'harmony', label: 'HarmonyOS', documentationTitle: 'HarmonyOS SDK Documentation', sidebarTitle: 'HarmonyOS SDK' },
]

function mockProductDocs(productName: string, platformName: string, platformStatus: string): ApiDocNode[] {
  return [
    {
      id: '1', number: '1', title: '1. SDK 使用说明', level: 1,
      blocks: [{ type: 'paragraph', text: `${productName} ${platformName} 文档当前为独立 Mock 占位内容，不代表已确认的 SDK 接口能力。` }],
      children: [
        { id: '1.1', number: '1.1', title: '1.1 平台说明', level: 2, blocks: [{ type: 'paragraph', text: `${productName} 的 ${platformName} 接入说明待补充。` }], children: [] },
        { id: '1.2', number: '1.2', title: '1.2 当前状态', level: 2, blocks: [{ type: 'paragraph', text: platformStatus }], children: [] },
      ],
    },
    {
      id: '2', number: '2', title: '2. 初始化 SDK', level: 1,
      blocks: [{ type: 'paragraph', text: '本章节为目录占位，SDK 初始化内容待产品技术资料确认后补充。' }], children: [],
    },
    {
      id: '3', number: '3', title: '3. 设备操作', level: 1,
      blocks: [{ type: 'paragraph', text: '本章节为目录占位，设备操作内容待产品技术资料确认后补充。' }], children: [],
    },
  ]
}

const recorderCardDocs = {
  android: apiDocs,
  ios: parseApiMarkdown(iosSource),
  harmony: harmonyDocs,
} satisfies Record<ApiPlatform, ApiDocNode[]>

const smartBadgeDocs = {
  android: mockProductDocs('智能工卡', 'Android', 'Mock 占位：平台内容待补充。'),
  ios: mockProductDocs('智能工卡', 'iOS', 'Mock 占位：平台内容待补充。'),
  harmony: mockProductDocs('智能工卡', 'HarmonyOS', 'Mock 占位：平台内容待补充。'),
} satisfies Record<ApiPlatform, ApiDocNode[]>

const pinDocs = {
  android: mockProductDocs('PIN', 'Android', 'Mock 占位：平台内容待补充。'),
  ios: mockProductDocs('PIN', 'iOS', 'Mock 占位：平台内容待补充。'),
  harmony: mockProductDocs('PIN', 'HarmonyOS', 'Mock 占位：平台内容待补充。'),
} satisfies Record<ApiPlatform, ApiDocNode[]>

export const apiProductDocs: Record<ApiProduct, Record<ApiPlatform, ApiDocNode[]>> = {
  'recorder-card': recorderCardDocs,
  'smart-badge': smartBadgeDocs,
  pin: pinDocs,
}
