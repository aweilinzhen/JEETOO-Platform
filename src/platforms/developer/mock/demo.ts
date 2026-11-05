export const demoProject = {
  name: 'TestBLE',
  description: '基于 JEETOO Android SDK 的示例应用，展示录音设备接入与基础操作。',
  platform: 'Android',
  languages: 'Kotlin / Java',
  sdk: 'JEETOO Android SDK v1.0.7',
  version: 'v1.0.7 Demo',
  sdkVersion: 'v1.0.7',
  packageName: 'ble-android-sdk-demo-260903.zip',
  installUrl: 'https://www.pgyer.com/JNTB9GuE',
  status: 'TestBLE 示例项目',
}

export const demoSteps = [
  { number: '01', title: '获取 SDK 授权', description: '提交申请并完成审核。' },
  { number: '02', title: '下载 Demo 项目', description: '可获取已编译安装包；源码暂未提供。' },
  { number: '03', title: '使用 Android Studio 打开', description: '项目源码暂未开放。' },
  { number: '04', title: '连接设备进行调试', description: '连接录音设备，验证接入效果。' },
] as const
