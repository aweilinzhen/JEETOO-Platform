import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestrictedResourcePath, useMockAuthState } from '../mock/access'
import { QuickStartCodeBlock } from '../components/QuickStartCodeBlock'

const sections = [
  ['overview', '概述'],
  ['requirements', '环境要求'],
  ['get-sdk', '获取 SDK'],
  ['integration', '集成 SDK'],
  ['permissions', '权限配置'],
  ['connect-device', '连接设备'],
  ['next-steps', '下一步'],
] as const

const integrationExample = `// 将 jtcard-sdk-x.x.x-release.aar 复制到项目的 app/libs 目录
flatDir {
    dirs("app/libs")
}

implementation(files("libs/jtcard-sdk-x.x.x-release.aar")) // 替换为对应版本号`

const permissionExample = `<!-- AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />
    <uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />
    <!-- 不使用 Wi-Fi 热点传输文件时，可不添加以下权限 -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" android:usesPermissionFlags="neverForLocation" />
    <application />
</manifest>`

const dynamicPermissionsExample = `// 应用内动态申请蓝牙相关权限
Manifest.permission.BLUETOOTH_SCAN
Manifest.permission.BLUETOOTH_ADVERTISE
Manifest.permission.BLUETOOTH_CONNECT`

const initializationExample = `import com.jiatui.jtcardsdk.JTSdkManager

// 初始化 SDK
JTSdkManager.initialize(context)`

const scanExample = `// 开始扫描
JTSdkManager.startScanning(this)

// 实现 ScanListener 接口
override fun onScanResult(peripheral: Peripheral) {
    // 获取到匹配的蓝牙设备
}`

const connectionExample = `// 关闭蓝牙连接时发起配对（默认为 true）
JTSdkManager.isConnectPair = false

// 监听连接状态
JTSdkManager.registerConnectStateListener(this)

// 连接扫描得到的 Peripheral
JTSdkManager.connect(peripheral)
// 或连接系统原生 API 获取的 BluetoothDevice
JTSdkManager.connectBleWithMac(bluetoothDevice.address)

override fun onBleConnectStateChanged(state: JTSdkManager.BleConnectState) {
    when (state) {
        JTSdkManager.BleConnectState.Connecting -> { }
        JTSdkManager.BleConnectState.Connected -> {
            // 连接成功后可查询电量、设备信息或传输文件
        }
        else -> { }
    }
}`

export function QuickStartPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<(typeof sections)[number][0]>('overview')
  const { loginStatus, accessStatus } = useMockAuthState()
  const authorized = loginStatus === 'logged_in' && accessStatus === 'authorized'
  const gatedPath = getRestrictedResourcePath('/developer/sdk')
  const gateLabel = loginStatus === 'logged_out' ? '登录查看' : accessStatus === 'pending' ? '查看申请状态' : accessStatus === 'rejected' ? '重新申请' : '申请开发接入'
  const gateDescription = loginStatus === 'logged_out'
    ? '登录后查看完整的 SDK 集成代码、权限配置与设备操作示例。'
    : accessStatus === 'pending'
      ? '你的接入申请正在审核中，审核通过后即可查看完整集成内容。'
      : accessStatus === 'rejected'
        ? '当前申请暂未通过审核，更新资料后重新申请即可继续获取完整文档。'
        : '完整集成代码、详细权限配置与设备操作示例面向已获授权的开发者开放。'
  return (
    <section className="quick-start-page">
      <div className="quick-start-layout">
        <aside className="quick-start-sidebar">
          <button className="quick-start-menu-toggle" type="button" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            <span>文档目录</span><b>{mobileMenuOpen ? '−' : '+'}</b>
          </button>
          <nav className={`quick-start-toc${mobileMenuOpen ? ' is-open' : ''}`} aria-label="快速开始文档目录">
            <div className="toc-title">快速开始</div>
            {sections.map(([id, label]) => <a className={activeSection === id ? 'is-active' : ''} key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); setActiveSection(id); setMobileMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{label}</a>)}
          </nav>
        </aside>

        <div className="quick-start-content">
          <header className="quick-start-header" id="overview">
            <div className="apply-eyebrow"><span /> DEVELOPER DOCUMENTATION</div>
            <div className="quick-start-title-row"><div><h1>快速开始</h1><p>了解 JEETOO Android SDK 的接入流程与开发准备。</p></div><span className="platform-chip">ANDROID SDK</span></div>
          </header>

          <section className="doc-section overview-section">
            <div className="doc-section-title"><span>01</span><h2>概述</h2></div>
            <p>加推录音卡 Android SDK 用于调用加推录音卡相关功能。SDK 提供 AAR 与使用该库的 Demo（TestBLE）。</p>
            <div className="overview-capabilities"><span>设备连接</span><span>录音管理</span><span>文件传输</span><span>设备配置</span></div>
          </section>

          <section className="doc-section" id="requirements">
            <div className="doc-section-title"><span>02</span><h2>环境要求</h2></div>
            <p>SDK 最低支持 Android 5.0（API 21）。原始 SDK 文档未指定 Android Studio 或 Kotlin / Java 的最低版本。</p>
            <div className="requirements-grid">
              <div><span>SDK 形式</span><b>Android AAR</b></div>
              <div><span>示例项目</span><b>TestBLE</b></div>
              <div><span>开发工具</span><b>原文未指定</b></div>
              <div><span>最低支持版本</span><b>Android 5.0（API 21）</b></div>
            </div>
          </section>

          <section className="doc-section get-sdk-section" id="get-sdk">
            <div className="doc-section-title"><span>03</span><h2>获取 SDK</h2></div>
            <p>前往 SDK 下载页面查看 Android SDK 版本信息与获取方式。SDK 文件需完成开发者授权后开放。</p>
            <Link className="button button-accent quick-start-cta" to="/developer/sdk">前往 SDK 下载 <span>↗</span></Link>
          </section>

          <section className="doc-section" id="integration">
            <div className="doc-section-title"><span>04</span><h2>集成 SDK</h2></div>
            <p>将对应版本的 jtcard-sdk AAR 放入 app/libs，并在 Gradle 中添加 flatDir 与文件依赖。</p>
            {authorized ? <QuickStartCodeBlock title="build.gradle.kts" language="kotlin" code={integrationExample} /> : <LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}
          </section>

          <section className="doc-section" id="permissions">
            <div className="doc-section-title"><span>05</span><h2>权限配置</h2></div>
            <p>SDK 使用蓝牙与 Wi-Fi 相关系统功能。Wi-Fi 权限仅在使用 Wi-Fi 热点传输文件时需要；蓝牙权限还需在应用内动态申请。</p>
            <div className="doc-caution">兼容说明：原始文档记录，部分鸿蒙 4.2 机型在系统定位服务关闭时无法扫描蓝牙设备，建议提示用户开启定位服务。</div>
            {authorized ? <><QuickStartCodeBlock title="AndroidManifest.xml" language="xml" code={permissionExample} /><QuickStartCodeBlock title="应用内动态申请权限" language="kotlin" code={dynamicPermissionsExample} /></> : <LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}
          </section>

          <section className="doc-section" id="connect-device">
            <div className="doc-section-title"><span>06</span><h2>连接设备</h2></div>
            <p>初始化 SDK 后扫描蓝牙广播，并通过扫描到的 Peripheral 或系统 BluetoothDevice 地址连接。</p>
            <div className="connection-steps"><span>初始化 SDK</span><i>→</i><span>扫描广播</span><i>→</i><span>连接设备</span><i>→</i><span>执行设备操作</span></div>
            {authorized ? <><QuickStartCodeBlock title="初始化 SDK" language="kotlin" code={initializationExample} /><QuickStartCodeBlock title="蓝牙扫描" language="kotlin" code={scanExample} /><QuickStartCodeBlock title="蓝牙连接" language="kotlin" code={connectionExample} /></> : <LockedContent description={gateDescription} link={gatedPath} label={gateLabel} />}
          </section>

          <section className="doc-section next-steps-section" id="next-steps">
            <div className="doc-section-title"><span>07</span><h2>下一步</h2></div>
            <p>继续浏览 API 能力与示例项目，了解更多集成细节。</p>
            <div className="next-step-links">
              <Link to={getRestrictedResourcePath('/developer/api')}><span><small>API REFERENCE</small><b>查看 API 文档</b></span><i>↗</i></Link>
              <Link to={getRestrictedResourcePath('/developer/demo')}><span><small>DEMO PROJECT</small><b>查看 Demo 示例</b></span><i>↗</i></Link>
            </div>
          </section>
          <div className="quick-start-endnote">卡片类型与固件限制：三麦 + EMMC / TF 为一代卡，五麦 + EMMC 为二代卡。原文未特别限制时，一代卡方法通常也适用于二代卡；具体接口及固件要求请参阅 API 文档。</div>
        </div>
      </div>
    </section>
  )
}

function LockedContent({ description, link, label }: { description: string; link: string; label: string }) {
  return <div className="locked-content-card"><span className="locked-icon">⌑</span><div><b>完整接入内容需要登录并获得开发者授权</b><p>{description}</p></div><Link to={link}>{label}<span>↗</span></Link></div>
}

