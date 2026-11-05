import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'
import { QuickStartCodeBlock } from '../components/QuickStartCodeBlock'

type ProductId = 'recorder-card' | 'smart-badge' | 'pin'
type PlatformId = 'android' | 'ios' | 'harmonyos'

const products: { id: ProductId; label: string; available: boolean }[] = [
  { id: 'recorder-card', label: 'AI 录音卡', available: true },
  { id: 'smart-badge', label: '智能工卡', available: false },
  { id: 'pin', label: 'PIN', available: false },
]
const platforms: { id: PlatformId; label: string }[] = [
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'harmonyos', label: 'HarmonyOS' },
]
const sections = [
  ['overview', '接入概览'],
  ['select-product', '选择产品'],
  ['select-platform', '选择开发平台'],
  ['prerequisites', '准备开发环境'],
  ['integration', 'SDK 集成'],
  ['next-steps', '下一步'],
] as const
const integrationSteps = [
  ['step-dependency', '5.1 添加 SDK 依赖'],
  ['step-permissions', '5.2 配置必要权限'],
  ['step-initialize', '5.3 初始化 SDK'],
  ['step-connect', '5.4 搜索和连接蓝牙设备'],
  ['step-device-info', '5.5 获取设备信息'],
  ['step-basic', '5.6 调用设备基础功能'],
  ['step-files', '5.7 录音文件管理及传输'],
] as const

const integrationExample = `// 将 jtcard-sdk-x.x.x-release.aar 复制到项目的 app/libs 目录
flatDir {
    dirs("app/libs")
}

implementation(files("libs/jtcard-sdk-x.x.x-release.aar")) // 替换为对应版本号`
const permissionExample = `<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />
<uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />

<!-- 使用 Wi-Fi 热点传输文件时需要；不使用时可不添加 -->
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" android:usesPermissionFlags="neverForLocation" />`
const initializationExample = `import com.jiatui.jtcardsdk.JTSdkManager

// 初始化 SDK
JTSdkManager.initialize(context)`
const scanExample = `// 开始扫描
JTSdkManager.startScanning(this)

// 实现 ScanListener 接口
override fun onScanResult(peripheral: Peripheral) {
    // 获取到匹配的蓝牙设备
}`
const connectionExample = `// 监听连接状态
JTSdkManager.registerConnectStateListener(this)

// 连接扫描得到的 Peripheral
JTSdkManager.connect(peripheral)
// 或连接系统原生 API 获取的 BluetoothDevice
JTSdkManager.connectBleWithMac(bluetoothDevice.address)

override fun onBleConnectStateChanged(state: JTSdkManager.BleConnectState) {
    when (state) {
        JTSdkManager.BleConnectState.Connecting -> { }
        JTSdkManager.BleConnectState.Connected -> { }
        else -> { }
    }
}`
const deviceInfoExample = `JTSdkManager.getDeviceInfo()

// 监听结果
override fun onDeviceInfo(mac: String, pid: String, ver: String) {}`
const basicFeaturesExample = `JTSdkManager.getElectricityLevel()

// 监听结果
override fun onElectricityLevel(level: Int) {}`
const filesExample = `// 获取指定 startIndex 到 endIndex 的文件信息,一次最多获取 5 个文件的信息
// 起始下标从 1 开始
JTSdkManager.getFileList(1, 5)

// 监听同步结果
override fun onFileList(fileList: List<FileInfo>)

// 根据指定 文件名称 删除文件
JTSdkManager.deleteFile(fileName)

// 监听删除结果
override fun onDeleteFileResult(isSuccess: Boolean) {}`

const apiLink = (section: string) => `/developer/api?product=recorder-card&platform=android&section=${encodeURIComponent(section)}`

export function QuickStartPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [product, setProduct] = useState<ProductId>(() => readStored('jeetoo-quickstart-product', 'recorder-card'))
  const [platform, setPlatform] = useState<PlatformId>(() => readStored('jeetoo-quickstart-platform', 'android'))
  const { loginStatus, accessStatus } = useMockAuthState()
  const authorized = loginStatus === 'logged_in' && accessStatus === 'authorized'
  const productAvailable = products.find((item) => item.id === product)?.available === true
  const contentAvailable = productAvailable && platform === 'android'
  const gatedPath = getRestrictedResourcePath('/developer/sdk')
  const gateLabel = loginStatus === 'logged_out' ? '登录查看' : accessStatus === 'pending' ? '查看申请状态' : accessStatus === 'rejected' ? '重新申请' : '申请开发接入'
  const gateDescription = loginStatus === 'logged_out'
    ? '登录后查看完整的 SDK 集成代码、权限配置与设备操作示例。'
    : accessStatus === 'pending'
      ? '你的接入申请正在审核中，审核通过后即可查看完整集成内容。'
      : accessStatus === 'rejected'
        ? '当前申请暂未通过审核，更新资料后重新申请即可继续获取完整文档。'
        : '完整集成代码、详细权限配置与设备操作示例面向已获授权的开发者开放。'

  useEffect(() => {
    window.localStorage.setItem('jeetoo-quickstart-product', product)
  }, [product])
  useEffect(() => {
    window.localStorage.setItem('jeetoo-quickstart-platform', platform)
  }, [platform])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 })
    document.querySelectorAll<HTMLElement>('.quick-start-content [id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [product, platform])

  const jumpTo = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="quick-start-page">
      <div className="quick-start-layout quick-start-layout-enhanced">
        <aside className="quick-start-sidebar">
          <button className="quick-start-menu-toggle" type="button" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            <span>快速开始目录</span><b>{mobileMenuOpen ? '−' : '+'}</b>
          </button>
          <nav className={`quick-start-toc${mobileMenuOpen ? ' is-open' : ''}`} aria-label="快速开始目录">
            <div className="toc-title">QUICKSTART</div>
            {sections.map(([id, label]) => <a className={activeSection === id || (id === 'integration' && activeSection.startsWith('step-')) ? 'is-active' : ''} key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); jumpTo(id) }}>{label}</a>)}
            <div className="quick-start-sidebar-note">AI 录音卡 · Android</div>
          </nav>
        </aside>

        <main className="quick-start-content">
          <header className="quick-start-header" id="overview">
            <div className="apply-eyebrow"><span /> JEETOO DEVELOPER DOCUMENTATION</div>
            <div className="quick-start-title-row"><div><h1>快速开始</h1><p>欢迎使用 JEETOO Developer Platform。</p></div><span className="platform-chip">QUICKSTART</span></div>
            <p className="quick-start-intro">JEETOO 提供硬件设备 SDK 和 API 接口，帮助开发者将 JEETOO 智能硬件集成到自己的应用中。</p>
            <div className="quick-start-overview-steps">
              <div><span>01</span><b>选择产品及开发平台</b></div><div><span>02</span><b>下载并集成 SDK</b></div><div><span>03</span><b>连接设备并调用功能</b></div>
            </div>
          </header>

          <section className="doc-section quick-start-choice-section" id="select-product">
            <div className="doc-section-title"><span>01</span><h2>选择产品 <small>SELECT PRODUCT</small></h2></div>
            <div className="quick-start-selector" role="group" aria-label="选择产品">
              {products.map((item) => <button type="button" key={item.id} className={product === item.id ? 'is-selected' : ''} aria-pressed={product === item.id} onClick={() => setProduct(item.id)}>{item.label}{!item.available && <small>筹备中</small>}</button>)}
            </div>
            <p className="quick-start-muted">目前仅 AI 录音卡 Android SDK 提供已核实的接入资料。</p>
          </section>

          <section className="doc-section quick-start-choice-section" id="select-platform">
            <div className="doc-section-title"><span>02</span><h2>选择开发平台 <small>SELECT PLATFORM</small></h2></div>
            <div className="quick-start-selector quick-start-platform-selector" role="group" aria-label="选择开发平台">
              {platforms.map((item) => <button type="button" key={item.id} className={platform === item.id ? 'is-selected' : ''} aria-pressed={platform === item.id} onClick={() => setPlatform(item.id)}>{item.label}{item.id !== 'android' && <small>筹备中</small>}</button>)}
            </div>
            {!contentAvailable && <div className="quick-start-coming-soon"><span>COMING SOON</span><b>{product === 'recorder-card' ? platforms.find((item) => item.id === platform)?.label : products.find((item) => item.id === product)?.label} 接入内容正在筹备中</b><p>当前没有可供展示的已确认 SDK 接入资料，后续进展将通过更新日志发布。</p></div>}
          </section>

          {contentAvailable && <>
            <section className="doc-section" id="prerequisites">
              <div className="doc-section-title"><span>03</span><h2>准备开发环境 <small>PREREQUISITES</small></h2></div>
              <p>开始前请准备 Android 开发环境、测试用 JEETOO AI 录音卡及对应 SDK。原始 SDK 文档未指定 Android Studio、Gradle、Kotlin 或 Java 的最低版本要求。</p>
              <div className="requirements-grid quick-start-prerequisites-grid">
                <div><span>产品</span><b>AI 录音卡</b></div><div><span>SDK 形式</span><b>Android AAR</b></div><div><span>最低系统版本</span><b>Android 5.0（API 21）</b></div><div><span>测试硬件</span><b>JEETOO AI 录音卡</b></div>
              </div>
              <div className="quick-start-resource-links">
                <Link to={getRestrictedResourcePath('/developer/sdk')}>前往 SDK 下载 <span>↗</span></Link>
                <Link to={getRestrictedResourcePath('/developer/demo')}>查看 TestBLE Demo <span>↗</span></Link>
                <span className="is-unavailable">产品使用手册 · 入口待提供</span>
              </div>
            </section>

            <section className="doc-section quick-start-integration-section" id="integration">
              <div className="doc-section-title"><span>04</span><h2>SDK 集成 <small>INTEGRATION</small></h2></div>
              <p>以下步骤根据 AI 录音卡 Android SDK 文档整理。完整代码在登录并获得开发者授权后开放。</p>

              <IntegrationStep id="step-dependency" number="5.1" title="添加 SDK 依赖" summary="将对应版本的 AAR 放入 app/libs，并按原文配置本地依赖。" apiSection="1.1" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <QuickStartCodeBlock title="build.gradle.kts" language="kotlin" code={integrationExample} />
              </IntegrationStep>
              <IntegrationStep id="step-permissions" number="5.2" title="配置必要权限" summary="按 SDK 文档配置蓝牙权限；使用 Wi-Fi 热点传输文件时再添加对应 Wi-Fi 权限。" apiSection="1.2" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <div className="doc-caution">原文说明：蓝牙权限需按 Android 版本配置并在应用中动态申请。Wi-Fi 权限仅在使用 Wi-Fi 热点传输文件时需要。</div>
                <QuickStartCodeBlock title="AndroidManifest.xml" language="xml" code={permissionExample} />
                <QuickStartCodeBlock title="应用内动态申请蓝牙权限" language="kotlin" code={`Manifest.permission.BLUETOOTH_SCAN\nManifest.permission.BLUETOOTH_ADVERTISE\nManifest.permission.BLUETOOTH_CONNECT`} />
              </IntegrationStep>
              <IntegrationStep id="step-initialize" number="5.3" title="初始化 SDK" summary="在开始使用 SDK 前调用初始化方法。" apiSection="2" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <QuickStartCodeBlock title="Kotlin" language="kotlin" code={initializationExample} />
              </IntegrationStep>
              <IntegrationStep id="step-connect" number="5.4" title="搜索和连接蓝牙设备" summary="先扫描蓝牙广播，再通过 Peripheral 或系统 BluetoothDevice 地址建立连接。" apiSection="3.1" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <div className="connection-steps"><span>扫描广播</span><i>→</i><span>获得 Peripheral</span><i>→</i><span>建立连接</span></div>
                <QuickStartCodeBlock title="蓝牙扫描" language="kotlin" code={scanExample} />
                <QuickStartCodeBlock title="蓝牙连接" language="kotlin" code={connectionExample} />
              </IntegrationStep>
              <IntegrationStep id="step-device-info" number="5.5" title="获取设备信息" summary="连接设备后可调用文档中列出的设备信息读取方法，并通过回调获取数据。" apiSection="4.3" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <QuickStartCodeBlock title="Kotlin" language="kotlin" code={deviceInfoExample} />
              </IntegrationStep>
              <IntegrationStep id="step-basic" number="5.6" title="调用设备基础功能" summary="例如读取电量。其他设备能力及固件限制请查看对应 API 章节。" apiSection="4.2" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <QuickStartCodeBlock title="Kotlin" language="kotlin" code={basicFeaturesExample} />
              </IntegrationStep>
              <IntegrationStep id="step-files" number="5.7" title="录音文件管理及传输" summary="SDK 文档包含文件列表、删除及 BLE / Wi-Fi 文件传输章节；不同传输方式和卡片型号请按文档及固件要求选择。" apiSection="4.10" authorized={authorized} gate={<LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}>
                <QuickStartCodeBlock title="文件列表与删除" language="kotlin" code={filesExample} />
                <div className="quick-start-api-links"><Link to={apiLink('4.15')}>BLE 文件传输 API ↗</Link><Link to={apiLink('5.2')}>一代卡 Wi-Fi 文件传输 API ↗</Link><Link to={apiLink('6.1')}>OTA 文档 ↗</Link></div>
              </IntegrationStep>
              <div className="quick-start-compat-note">兼容与固件说明：SDK 文档中包含一代卡、二代卡的适用范围及固件版本限制。调用具体设备能力前，请以 API 文档对应章节的原始说明为准。</div>
            </section>
          </>}

          <section className="doc-section next-steps-section" id="next-steps">
            <div className="doc-section-title"><span>05</span><h2>下一步 <small>NEXT STEPS</small></h2></div>
            <p>继续阅读 API 和 Demo 资料，或查阅硬件操作说明。</p>
            <div className="next-step-links">
              <Link to={getRestrictedResourcePath('/developer/api')}><span><small>API REFERENCE</small><b>查看 API 文档</b></span><i>↗</i></Link>
              <Link to={getRestrictedResourcePath('/developer/demo')}><span><small>DEMO PROJECT</small><b>查看 Demo 示例</b></span><i>↗</i></Link>
              <div className="quick-start-manual-link"><span><small>PRODUCT MANUAL</small><b>产品使用手册</b></span><i>入口待提供</i></div>
            </div>
          </section>
        </main>

        <aside className="quick-start-page-outline" aria-label="本页目录">
          <div className="toc-title">本页目录</div>
          {sections.map(([id, label]) => <button type="button" key={id} className={activeSection === id || (id === 'integration' && activeSection.startsWith('step-')) ? 'is-active' : ''} onClick={() => jumpTo(id)}>{label}</button>)}
          {(activeSection === 'integration' || activeSection.startsWith('step-')) && <div className="quick-start-outline-subitems">{integrationSteps.map(([id, label]) => <button type="button" key={id} className={activeSection === id ? 'is-active' : ''} onClick={() => jumpTo(id)}>{label}</button>)}</div>}
        </aside>
      </div>
    </section>
  )
}

function IntegrationStep({ id, number, title, summary, apiSection, authorized, gate, children }: {
  id: string; number: string; title: string; summary: string; apiSection: string; authorized: boolean; gate: ReactNode; children: ReactNode
}) {
  return <section className="quick-start-integration-step" id={id}>
    <div className="quick-start-step-heading"><span>{number}</span><h3>{title}</h3></div>
    <p>{summary}</p>
    {authorized ? children : gate}
    <Link className="quick-start-api-anchor" to={getRestrictedResourcePath(apiLink(apiSection))}>查看对应 API 文档 <span>↗</span></Link>
  </section>
}

function LockedContent({ description, link, label }: { description: string; link: string; label: string }) {
  return <div className="locked-content-card"><span className="locked-icon">⌑</span><div><b>完整接入内容需要登录并获得开发者授权</b><p>{description}</p></div><Link to={link}>{label}<span>↗</span></Link></div>
}

function readStored<T extends string>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? stored as T : fallback
  } catch {
    return fallback
  }
}
