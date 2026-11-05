import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QuickStartCodeBlock } from './QuickStartCodeBlock'
import { SectionHeading } from './SectionHeading'

type Platform = 'android' | 'ios' | 'harmony'
type Example = { id: string; title: string; points: string[]; description: string; code?: string; language: string; docSection?: string; notice?: string }

const androidExamples: Example[] = [
  {
    id: 'connection', title: '设备搜索与连接', points: ['蓝牙扫描', '连接 Peripheral', '监听连接状态'],
    description: 'Kotlin 示例取自 Android SDK 文档；扫描与连接回调由 SDK listener 提供。', language: 'Kotlin',
    code: `// 开始扫描\nJTSdkManager.startScanning(this)\n\n// 实现 ScanListener 接口\noverride fun onScanResult(peripheral: Peripheral) {\n    // 获取到匹配的蓝牙设备\n}\n\n// 监听连接状态并连接设备\nJTSdkManager.registerConnectStateListener(this)\nJTSdkManager.connect(peripheral)\n\noverride fun onBleConnectStateChanged(state: JTSdkManager.BleConnectState) {\n    when (state) {\n        JTSdkManager.BleConnectState.Connecting -> { }\n        JTSdkManager.BleConnectState.Connected -> { }\n        else -> { }\n    }\n}`,
  },
  {
    id: 'recording', title: '录音状态', points: ['接收设备录音状态', '读取类型、时长与文件名', '文档未列出远程开始 / 停止方法'],
    description: 'Android 文档说明录音状态回调。为避免把其他平台的接口误当成 Android API，此处仅展示已记录的回调。', language: 'Kotlin',
    code: `override fun onRecordState(\n    rsType: Int,\n    duration: Int,\n    dataSize: Int,\n    fileName: String\n) {\n    // 根据设备上报状态处理录音信息\n}`,
  },
  {
    id: 'files', title: '文件管理', points: ['获取文件列表', '按页获取文件信息', 'BLE 文件下载'],
    description: 'Android 文档中的文件列表和下载调用；具体适用型号、参数及回调以完整 API 文档为准。', language: 'Kotlin',
    code: `// 起始下标从 1 开始，一次最多获取 5 个文件的信息\nJTSdkManager.getFileList(1, 5)\n\noverride fun onFileList(fileList: List<FileInfo>) { }\n\n// position 默认为 0，表示从头开始完整传输\nJTSdkManager.downloadFile(fileName, position)\n\noverride fun onDownloadFile(\n    type: DownloadType,\n    fileSize: Int? = null,\n    blockDataEndPosition: Int? = null,\n    blockData: ByteArray? = null\n) { }`,
  },
]

const harmonyExamples: Example[] = [
  {
    id: 'connection', title: '设备搜索与连接', points: ['startScan(context, callback)', 'connect(uuid, callbacks)', '读取连接后的电量'],
    description: '以下 ArkTS 片段来自 HarmonyOS SDK 1.0.10 接入资料，展示扫描回调、连接回调和电量查询。', language: 'ArkTS',
    code: `import { common } from '@kit.AbilityKit';\nimport { JiatuiBleDevice, JiatuiScanResult, JtcardPlugin } from '@jtcard/plugin';\n\nfunction searchAndConnect(context: common.Context): void {\n  JtcardPlugin.startScan(context, (result: JiatuiScanResult) => {\n    if (result.error) {\n      console.error(\`搜索失败：\${result.error}\`);\n      return;\n    }\n\n    const device = result.devices[0];\n    if (!device) return;\n\n    JtcardPlugin.connect(device.uuid, {\n      onStateChange: (connectedDevice: JiatuiBleDevice, state: string) => {\n        console.info(\`连接状态：\${connectedDevice.uuid} \${state}\`);\n      },\n      onConnected: async (connectedDevice: JiatuiBleDevice) => {\n        console.info(\`已连接：\${connectedDevice.name || connectedDevice.uuid}\`);\n        const battery = await JtcardPlugin.getBattery();\n        console.info(\`电量：\${battery}%\`);\n      },\n      onError: (connectedDevice: JiatuiBleDevice, error: string) => {\n        console.error(\`连接失败：\${connectedDevice.uuid} \${error}\`);\n      }\n    });\n  });\n}`,
  },
  {
    id: 'recording', title: '录音控制', points: ['startMeet()', 'stopMeet()', 'getMeet() 查询状态'],
    description: 'HarmonyOS SDK 接入资料提供开始、停止及查询录音状态的方法；监听设备主动上报可使用 setMeetStatusCallback()。', language: 'ArkTS',
    code: `try {\n  const success = await JtcardPlugin.startMeet();\n  this.addMessage(\`启动录音\${success ? '成功' : '失败'}\`);\n} catch (error) {\n  this.addMessage(\`启动录音失败：\${error}\`);\n}\n\nconst meeting = await JtcardPlugin.getMeet();\nthis.addMessage(\`录音状态：\${meeting ? '录音中' : '未录音'}\`);`,
  },
  {
    id: 'files', title: '文件管理', points: ['getFile()', 'getFilePage(page, pageSize)', '文件名用于下载与删除'],
    description: 'HarmonyOS SDK 的 getFile() 不接收参数；分页接口返回 files 与 fileTotal，兼容说明见 API 文档。', language: 'ArkTS',
    code: `try {\n  const files = await JtcardPlugin.getFile();\n  this.recordFiles = files;\n  this.addMessage(\`获取到 \${files.length} 个文件\`);\n} catch (error) {\n  this.addMessage(\`获取文件列表失败：\${error}\`);\n}\n\nconst page = await JtcardPlugin.getFilePage(1, 20);\nconst filesOnPage = page.files;\nconst fileTotal = page.fileTotal;`,
  },
  {
    id: 'transfer', title: 'Wi-Fi 文件传输', points: ['downloadFileByWifi(options)', '进度与步骤回调', '可取消 Wi-Fi 下载'],
    description: 'HarmonyOS SDK 文档提供 Wi-Fi 下载选项和进度回调；SSID、密码及文件对象由应用按实际设备提供。', language: 'ArkTS',
    code: `const result = await JtcardPlugin.downloadFileByWifi({\n  context,\n  file,\n  ssid,\n  password,\n  onProgress: (progress: JiatuiDownloadProgress) => {\n    this.updateDownloadProgress(progress.fileName, progress.downloaded, progress.total, '');\n  },\n  onStep: (step: JiatuiDownloadStep) => {\n    this.addMessage(\`\${step.type}：\${step.message}\`);\n  }\n});`,
  },
  {
    id: 'ota', title: 'OTA 固件升级',
    points: ['startOtaUpgrade(url, callbacks)', '进度范围：0～1', 'cancelOtaUpgrade()'],
    description: '通过 SDK 发起设备固件升级，实时获取升级进度、状态及结果，并支持取消升级。', language: 'ArkTS', docSection: '9',
    code: `import { JtcardPlugin } from '@jtcard/plugin';\n\nconst firmwareUrl = 'https://example.com/firmware.bin';\n\nawait JtcardPlugin.startOtaUpgrade(firmwareUrl, {\n  onStart: () => {\n    console.info('OTA 升级开始');\n  },\n  onProgress: (progress: number) => {\n    console.info(\`升级进度：\${Math.floor(progress * 100)}%\`);\n  },\n  onSuccess: () => {\n    console.info('OTA 升级成功');\n  },\n  onFailed: (failType, message) => {\n    console.error(\`升级失败：\${failType} \${message}\`);\n  },\n  onStep: (step) => {\n    console.info(\`\${step.type}: \${step.message}\`);\n  }\n});\n\n// 用户确认取消时调用：JtcardPlugin.cancelOtaUpgrade();`,
  },
]

const androidOtaExample: Example = {
  id: 'ota', title: 'OTA 固件升级',
  points: ['OTA 服务状态与回调', '固件配置与升级流程', '升级后等待设备重启并重新连接'],
  description: 'Android SDK 文档列出 OTA Listener、服务控制、固件配置和升级接口。文档中的调用片段标注为 Swift，当前不展示未经核实的 Kotlin 示例。',
  language: 'Kotlin', docSection: '6',
  notice: '请查看 Android OTA API 章节，确认设备型号、固件与完整调用要求。',
}

const iosExamples: Example[] = [
  {
    id: 'connection', title: '设备搜索与连接', points: ['startScan()', 'connect(to:)', '连接状态回调'],
    description: 'Swift 示例依据 JTCardSDK 文档，展示扫描设备、从扫描回调连接设备及监听连接状态。', language: 'Swift', docSection: '2',
    code: `import JTCardSDK\n\nJTSdkManager.shared.delegate = self\nJTSdkManager.shared.startScan()\n\nfunc jtCardManager(_ manager: JTSdkManager, didDiscover device: JTPeripheral) {\n    JTSdkManager.shared.connect(to: device)\n}\n\nfunc jtCardManager(_ manager: JTSdkManager, didChangeConnectState state: JTBleConnectState, deviceIdentifier: String?) {\n    if state == .connected {\n        JTSdkManager.shared.getElectricityLevel()\n    }\n}`,
  },
  {
    id: 'recording', title: '录音状态', points: ['onRecordState(...)', '录音类型与时长', '原文未列出录音启停方法'],
    description: 'iOS 文档提供设备录音状态回调；未提供可核实的远程录音启停调用代码。', language: 'Swift', docSection: '4.3',
    code: `func onRecordState(\n    rsState: Int,\n    duration: Int,\n    dataSize: Int,\n    fileName: String\n)`,
  },
  {
    id: 'files', title: '文件管理与传输', points: ['getFileList(1, 5)', 'downloadFile(fileName, position)', 'cancelDownloadFile()'],
    description: '一代卡每次最多读取 5 条文件信息；BLE 下载可通过 position 指定断点位置。', language: 'Swift', docSection: '6',
    code: `JTSdkManager.shared.getFileList(1, 5)\n\nJTSdkManager.shared.downloadFile(fileName, position)\n\nfunc onDownloadFile(\n    type: DownloadType,\n    fileSize: NSNumber?,\n    blockDataEndPosition: NSNumber?,\n    blockData: Data?\n)\n\nJTSdkManager.shared.cancelDownloadFile()`,
  },
  {
    id: 'ota', title: 'OTA 固件升级', points: ['openOTAService()', 'setFirmware(firmwareData)', 'startOtaUpgrade()', 'cancelOTA()'],
    description: 'iOS OTA 需先打开 OTA 服务并配置固件数据，再启动升级；成功后等待设备重启并重新连接。', language: 'Swift', docSection: '9',
    code: `JTSdkManager.shared.otaDelegate = self\nJTSdkManager.shared.openOTAService()\nJTSdkManager.shared.setFirmware(firmwareData)\nJTSdkManager.shared.startOtaUpgrade()\n\n// 用户取消当前升级时调用\nJTSdkManager.shared.cancelOTA()`,
  },
]

const examplesByPlatform: Record<Platform, Example[]> = {
  android: [...androidExamples, androidOtaExample],
  ios: iosExamples,
  harmony: harmonyExamples,
}

export function ApiShowcaseSection() {
  const [platform, setPlatform] = useState<Platform>('harmony')
  const examples = examplesByPlatform[platform]
  const [activeId, setActiveId] = useState(examples[0].id)
  const active = examples.find((item) => item.id === activeId) ?? examples[0]
  const selectPlatform = (next: Platform) => {
    setPlatform(next)
    const nextExamples = examplesByPlatform[next]
    setActiveId((current) => nextExamples.some((item) => item.id === current) ? current : nextExamples[0].id)
  }

  return <section className="home-section api-showcase-section" id="api-showcase">
    <div className="section-wrap">
      <SectionHeading title="清晰的 API，完整的设备控制能力。" description="从已核实的 JEETOO SDK 文档中选取代码示例；切换平台查看对应的调用方式。" />
      <div className="api-showcase-platforms" role="tablist" aria-label="SDK 示例平台">
        <button type="button" role="tab" aria-selected={platform === 'android'} className={platform === 'android' ? 'is-active' : ''} onClick={() => selectPlatform('android')}>Android · Kotlin</button>
        <button type="button" role="tab" aria-selected={platform === 'ios'} className={platform === 'ios' ? 'is-active' : ''} onClick={() => selectPlatform('ios')}>iOS · Swift</button>
        <button type="button" role="tab" aria-selected={platform === 'harmony'} className={platform === 'harmony' ? 'is-active' : ''} onClick={() => selectPlatform('harmony')}>HarmonyOS · ArkTS</button>
      </div>
      <div className="api-showcase-layout">
        <div className="api-showcase-nav" role="tablist" aria-label="API 能力分类">
          {examples.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} className={activeId === item.id ? 'is-active' : ''} onClick={() => setActiveId(item.id)}>
            <b>{item.title}</b>
          </button>)}
        </div>
        <div className="api-showcase-detail" role="tabpanel">
          <div className="api-showcase-detail-heading"><h3>{active.title}</h3><p>{active.description}</p></div>
          <ul>{active.points.map((point) => <li key={point}>{point}</li>)}</ul>
          {active.code
            ? <>
              <QuickStartCodeBlock title={active.language} language={active.language.toLowerCase()} code={active.code} />
              {active.id === 'ota' && <p className="api-showcase-code-note">固件 URL 为示例地址，使用时请替换为实际可用的固件下载地址。</p>}
            </>
            : <div className="api-showcase-code-note"><p>{active.notice}</p></div>}
        </div>
      </div>
      <Link className="api-showcase-full-doc" to={`/developer/api?platform=${platform}${active.docSection ? `&section=${active.docSection}` : ''}`}>查看{active.id === 'ota' ? ' OTA 固件升级' : '完整'} API 文档 <span>→</span></Link>
    </div>
  </section>
}
