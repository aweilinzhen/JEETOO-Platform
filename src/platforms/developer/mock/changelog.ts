export type SdkPlatform = 'android' | 'ios'

export type SdkRelease = {
  platform: SdkPlatform
  sdkName: string
  version: string
  releaseDate: string
  updateTypes: string[]
  newFeatures: string[]
  improvements: string[]
  fixes: string[]
  compatibility: string
  sampleUpdates: string[]
}

// Android release history transcribed from 加推录音卡Android SDK.md.
export const sdkReleases: SdkRelease[] = [
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.7', releaseDate: '2026-09-03',
    updateTypes: ['设备状态', '蓝牙连接', 'Demo'],
    newFeatures: ['设备状态新增 mtu 字段。'], improvements: ['蓝牙连接操作相关逻辑优化。'], fixes: [],
    compatibility: 'mtu 字段仅 v1.0.7 SDK 支持。',
    sampleUpdates: ['Demo 包含 OpusOggConverter.kt，用于将 Opus 转为 Ogg，并支持添加 MARK 数据。'],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.6-Beta', releaseDate: '2026-07-31',
    updateTypes: ['边录边传', '补帧下载', '二代协议'],
    newFeatures: ['增加边录边传相关功能方法（文档 5.17–5.20）。', '新增一代、二代协议兼容处理逻辑及部分二代功能。'], improvements: [], fixes: [],
    compatibility: '新功能方法需新固件支持；文档未说明的部分功能属于其他产品，不建议直接使用。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.5', releaseDate: '2026-06-15',
    updateTypes: ['Socket', '构建配置', '蓝牙扫描'],
    newFeatures: [], improvements: ['优化 SocketClient：连接 Socket 失败时内部重试，降低部分机型连接热点后 Socket 连接失败的情况。', '2026-06-17：优化编译配置，禁止使用 Default Package，避免与其他库冲突。', '2026-07-03：优化扫描蓝牙设备时频繁获取设备 MAC 的问题。'], fixes: [],
    compatibility: '原文未提供额外兼容性说明。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.4', releaseDate: '2026-05-22',
    updateTypes: ['设备信息', '蓝牙扫描'],
    newFeatures: [], improvements: ['onDeviceInfo 相关字段格式调整为与 iOS 一致。', '同一次扫描中，同一设备每次发现都会触发回调，不再过滤重复设备；应用层可参考 Demo 使用 name 与 address 过滤。'], fixes: [],
    compatibility: '如果应用层未在 onScanResult 对同一设备过滤，需自行过滤。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.3', releaseDate: '2026-05-12',
    updateTypes: ['OTA'], newFeatures: ['添加 OTA 固件升级接口。'], improvements: [], fixes: [],
    compatibility: 'OTA 固件类型及设备要求见 SDK 文档。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.2', releaseDate: '2026-04-23',
    updateTypes: ['target SDK', '边录边传'], newFeatures: ['添加边录边传相关协议方法。'], improvements: ['兼容 targetSDK < 31 的项目。'], fixes: [],
    compatibility: '原文注明该版本未对外发布，请先不要使用边录边传相关方法。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.1', releaseDate: '2026-04-13',
    updateTypes: ['Wi-Fi'], newFeatures: ['打开 Wi-Fi 方法增加 SSID、Pwd 参数。'], improvements: ['去除 Toast。'], fixes: [],
    compatibility: '指定 SSID、Pwd 的方式仅支持 0.1.6 固件版本；此前固件版本先不要使用。', sampleUpdates: [],
  },
  {
    platform: 'android', sdkName: 'Android SDK', version: 'v1.0.0', releaseDate: '2026-01-20',
    updateTypes: ['初版'], newFeatures: ['初版 SDK。'], improvements: [], fixes: [],
    compatibility: 'minSdkVersion: 21。', sampleUpdates: [],
  },
]
