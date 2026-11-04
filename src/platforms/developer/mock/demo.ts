export const demoProject = {
  name: 'TestBLE',
  description: '加推录音卡 Android SDK 示例应用。原始 SDK 文档提供已编译安装包入口，并列出与各 SDK 版本对应的 Demo 工程压缩包。',
  platform: 'Android',
  languages: 'Kotlin / Java',
  sdk: 'JEETOO Android SDK v1.0.7',
  version: 'v1.0.7 Demo',
  sdkVersion: 'Android SDK v1.0.7',
  packageName: 'ble-android-sdk-demo-260903.zip',
  installUrl: 'https://www.pgyer.com/JNTB9GuE',
  status: 'TestBLE 示例项目',
}

export const demoFeatures = [
  { id: 'discovery', icon: 'search', title: '蓝牙扫描与连接', description: '文档示例包含广播扫描、Peripheral 连接及按 MAC 地址连接。', detail: '扫描回调为 ScanListener.onScanResult(peripheral)；连接状态通过 BleConnectStateListener.onBleConnectStateChanged 回调。' },
  { id: 'device-info', icon: 'device', title: '设备信息与状态', description: '查询电量、设备信息、SN 码、睡眠时间及设备状态。', detail: '设备信息回调 onDeviceInfo(mac, pid, ver)；v1.0.7 起设备状态包含 mtu 字段。' },
  { id: 'recording', icon: 'record', title: '录音状态与实时同步', description: '接收录音状态，并可通过接口管理实时音频帧同步。', detail: '录音数据同步接口要求一代卡固件 >= 0.2.0；断开蓝牙后同步设置会重置为 false。' },
  { id: 'files', icon: 'files', title: '录音文件管理', description: '获取文件列表、删除文件、清空文件及查询 MARK。', detail: '一代卡使用 getFileList；二代卡可使用 getAudioFileList(offset, limit)。MARK 查询要求一代卡固件 >= 0.2.0。' },
  { id: 'transfer', icon: 'transfer', title: 'BLE / Wi-Fi 文件传输', description: '文档提供 BLE 文件传输、一代卡 Socket 传输及音频帧下载说明。', detail: 'BLE 文件传输与 downloadAudioFrames 同一时刻只能执行一种；音频帧下载还有限定固件与文件版本要求。' },
  { id: 'settings', icon: 'settings', title: '设备配置与 OTA', description: '包含 Wi-Fi、设备时间、U 盘模式及 OTA 固件升级接口说明。', detail: 'Wi-Fi 指定 SSID/Pwd 需固件 >= 0.1.6；二代卡 Wi-Fi HTTP 接口仅支持二代卡。OTA 升级后需等待设备重启并重新连接。' },
] as const

export const demoSteps = [
  { number: '01', title: '获取 SDK 授权', description: '提交开发接入申请并完成审核。' },
  { number: '02', title: '下载 Demo 项目', description: '授权后获取示例项目源码。' },
  { number: '03', title: '使用 Android Studio 打开', description: '在本地开发环境中查看和调试项目。' },
  { number: '04', title: '连接设备进行调试', description: '连接 JEETOO 录音设备开展功能验证。' },
] as const
