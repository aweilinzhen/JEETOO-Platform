import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { QuickStartCodeBlock } from '../components/QuickStartCodeBlock'
import { type ApiDocNode, type MarkdownBlock } from '../mock/apiDocs'
import { API_PLATFORM_STORAGE_KEY, API_SELECTION_STORAGE_KEY, apiPlatforms, apiProducts, apiProductDocs, type ApiPlatform, type ApiProduct } from '../mock/apiPlatformDocs'
import { useMockAuthState } from '../mock/access'

type ApiSelection = { product: ApiProduct; platform: ApiPlatform; section: string }
type ApiDocumentView = 'api' | 'quick-start'

const API_DOCUMENT_VIEW_STORAGE_KEY = 'jeetoo-api-doc-view'
const quickStartOutline = [
  ['quickstart-intro', 'SDK 介绍'],
  ['quickstart-environment', '准备开发环境'],
  ['quickstart-sdk', '获取 SDK'],
  ['quickstart-integration', '集成 SDK'],
  ['quickstart-connect', '首次连接设备'],
  ['quickstart-complete', '完成接入'],
] as const

function isProduct(value: string | null): value is ApiProduct {
  return value === 'recorder-card' || value === 'smart-badge' || value === 'pin'
}

function isPlatform(value: string | null): value is ApiPlatform {
  return value === 'android' || value === 'ios' || value === 'harmony'
}

function readSavedSelection(): Partial<ApiSelection> {
  if (typeof window === 'undefined') return {}
  try {
    const saved = JSON.parse(window.localStorage.getItem(API_SELECTION_STORAGE_KEY) ?? 'null') as Partial<ApiSelection> | null
    const legacyPlatform = window.localStorage.getItem(API_PLATFORM_STORAGE_KEY)
    const savedPlatform = saved?.platform ?? legacyPlatform
    return {
      ...(isProduct(saved?.product ?? null) ? { product: saved!.product } : {}),
      ...(isPlatform(savedPlatform) ? { platform: savedPlatform } : {}),
      ...(typeof saved?.section === 'string' ? { section: saved.section } : {}),
    }
  } catch {
    return {}
  }
}

function initialSelection(params: URLSearchParams): ApiSelection {
  const saved = readSavedSelection()
  const product = isProduct(params.get('product')) ? params.get('product') as ApiProduct : saved.product ?? 'recorder-card'
  const platform = isPlatform(params.get('platform')) ? params.get('platform') as ApiPlatform : saved.platform ?? 'android'
  const availableDocs = apiProductDocs[product][platform]
  const requestedSection = params.get('section') ?? saved.section
  const section = requestedSection && findNode(availableDocs, requestedSection) ? requestedSection : availableDocs[0]?.id ?? ''
  return { product, platform, section }
}

function readDocumentView(params: URLSearchParams): ApiDocumentView {
  return params.get('doc') === 'quick-start' ? 'quick-start' : 'api'
}

function inlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|<br\s*\/?\s*>|\\([\\.\-_+()])/gi
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    if (match[1]) nodes.push(<strong key={key++}>{inlineMarkdown(match[1])}</strong>)
    else if (match[2]) nodes.push(<em key={key++}>{inlineMarkdown(match[2])}</em>)
    else if (match[3]) nodes.push(<code key={key++}>{match[3]}</code>)
    else if (match[4] && match[5]) nodes.push(<a key={key++} href={match[5]} target="_blank" rel="noreferrer">{inlineMarkdown(match[4])}</a>)
    else if (match[0].toLowerCase().startsWith('<br')) nodes.push(<br key={key++} />)
    else if (match[6]) nodes.push(match[6])
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function renderTableCell(value: string) {
  const htmlBreaks = value.split(/<br\s*\/?\s*>/i)
  return htmlBreaks.flatMap((part, index) => index ? [<br key={`br-${index}`} />, ...inlineMarkdown(part)] : inlineMarkdown(part))
}

function renderBlock(block: MarkdownBlock, index: number) {
  if (block.type === 'code') {
    const language = block.language || 'text'
    return <QuickStartCodeBlock key={index} title={language.toUpperCase()} language={language} code={block.value} />
  }
  if (block.type === 'table') {
    const [header, ...rows] = block.rows
    return <div className="api-raw-table-wrap" key={index}><table className="api-raw-table"><thead><tr>{header.map((cell, cellIndex) => <th key={cellIndex}>{renderTableCell(cell)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{header.map((_, cellIndex) => <td key={cellIndex}>{renderTableCell(row[cellIndex] ?? '')}</td>)}</tr>)}</tbody></table></div>
  }
  if (block.type === 'list') {
    const List = block.ordered ? 'ol' : 'ul'
    return <List className="api-raw-list" key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkdown(item)}</li>)}</List>
  }
  return <p className="api-raw-paragraph" key={index}>{inlineMarkdown(block.text)}</p>
}

function findNode(nodes: ApiDocNode[], id: string): ApiDocNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findNode(node.children, id)
    if (child) return child
  }
  return undefined
}

function findPath(nodes: ApiDocNode[], id: string): ApiDocNode[] {
  for (const node of nodes) {
    if (node.id === id) return [node]
    const childPath = findPath(node.children, id)
    if (childPath.length) return [node, ...childPath]
  }
  return []
}

function nodeText(node: ApiDocNode): string {
  return [node.title, ...node.blocks.map((block) => block.type === 'paragraph' ? block.text : block.type === 'table' ? block.rows.flat().join(' ') : block.type === 'list' ? block.items.join(' ') : block.value), ...node.children.map(nodeText)].join(' ').toLocaleLowerCase()
}

function collectOutline(node: ApiDocNode): ApiDocNode[] {
  return [node, ...node.children.flatMap(collectOutline)]
}

function renderNodeContent(node: ApiDocNode, depth = 0): ReactNode {
  return <Fragment key={node.id}>
    {node.blocks.map(renderBlock)}
    {node.children.map((child) => <section className="api-raw-subsection" id={`api-section-${child.id}`} key={child.id}>
      <div className={`doc-section-title api-raw-title api-raw-title-${Math.min(depth + 2, 3)}`}><span>{child.number}</span><h2>{child.title}</h2></div>
      {renderNodeContent(child, depth + 1)}
    </section>)}
  </Fragment>
}

export function ApiReferencePage() {
  const { loginStatus } = useMockAuthState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [initial] = useState(() => initialSelection(searchParams))
  const [documentView, setDocumentView] = useState<ApiDocumentView>(() => readDocumentView(searchParams))
  const [product, setProduct] = useState<ApiProduct>(initial.product)
  const [platform, setPlatform] = useState<ApiPlatform>(initial.platform)
  const activePlatform = apiPlatforms.find((item) => item.id === platform) ?? apiPlatforms[0]
  const productDocs = apiProductDocs[product]
  const activeDocs = productDocs[platform]
  const [selectedId, setSelectedId] = useState(initial.section)
  const [search, setSearch] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [expandedPlatforms, setExpandedPlatforms] = useState<Record<ApiPlatform, boolean>>(() => ({ android: initial.platform === 'android', ios: initial.platform === 'ios', harmony: initial.platform === 'harmony' }))
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})
  const selectedProduct = apiProducts.find((item) => item.id === product) ?? apiProducts[0]
  const selected = findNode(activeDocs, selectedId) ?? activeDocs[0]
  const selectedPath = selected ? findPath(activeDocs, selected.id) : []
  const authorized = loginStatus === 'logged_in'
  const outlineTargetIds = documentView === 'quick-start'
    ? quickStartOutline.map(([id]) => id)
    : selected ? collectOutline(selected).map((node) => `api-section-${node.id}`) : []
  const [activeOutlineId, setActiveOutlineId] = useState(outlineTargetIds[0] ?? '')
  const query = search.trim().toLocaleLowerCase()
  const filteredDocs = useMemo(() => {
    if (!query) return activeDocs
    const filterNode = (node: ApiDocNode): ApiDocNode | null => {
      const children = node.children.map(filterNode).filter((child): child is ApiDocNode => child !== null)
      if (!nodeText(node).includes(query)) return null
      return { ...node, children }
    }
    return activeDocs.map(filterNode).filter((node): node is ApiDocNode => node !== null)
  }, [activeDocs, query])

  const saveSelection = (next: ApiSelection, replace = false, view: ApiDocumentView = 'api') => {
    setSearchParams({ product: next.product, platform: next.platform, section: next.section, ...(view === 'quick-start' ? { doc: 'quick-start' } : {}) }, { replace })
    try {
      window.localStorage.setItem(API_SELECTION_STORAGE_KEY, JSON.stringify(next))
      window.localStorage.setItem(API_PLATFORM_STORAGE_KEY, next.platform)
      window.localStorage.setItem(API_DOCUMENT_VIEW_STORAGE_KEY, view)
    } catch { /* keep the current selection in memory */ }
  }

  useEffect(() => {
    if (!searchParams.has('product') && !searchParams.has('platform') && !searchParams.has('section')) {
      const savedView = readDocumentView(searchParams)
      setDocumentView(savedView)
      saveSelection({ product, platform, section: selectedId }, true, savedView)
    } else {
      const next = initialSelection(searchParams)
      setDocumentView(readDocumentView(searchParams))
      setProduct(next.product)
      setPlatform(next.platform)
      setSelectedId(next.section)
      setExpandedPlatforms({ android: next.platform === 'android', ios: next.platform === 'ios', harmony: next.platform === 'harmony' })
    }
  // URL history entries restore the product, platform and selected section.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!authorized || typeof IntersectionObserver === 'undefined') return
    const targets = outlineTargetIds.map((id) => document.getElementById(id)).filter((target): target is HTMLElement => target !== null)
    if (!targets.length) return
    setActiveOutlineId(targets[0].id)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveOutlineId(visible[0].target.id)
    }, { rootMargin: '-110px 0px -68% 0px', threshold: 0 })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  // Outline entries are derived from the selected API node or quick-start sections.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, documentView, product, platform, selectedId])

  const selectPlatform = (nextPlatform: ApiPlatform) => {
    if (nextPlatform === platform) {
      setExpandedPlatforms((previous) => ({ ...previous, [nextPlatform]: !previous[nextPlatform] }))
      return
    }
    const nextSection = apiProductDocs[product][nextPlatform][0]?.id ?? ''
    setPlatform(nextPlatform)
    setSelectedId(nextSection)
    setDocumentView('api')
    setSearch('')
    setExpandedChapters({})
    setExpandedPlatforms((previous) => ({ ...previous, [nextPlatform]: true }))
    saveSelection({ product, platform: nextPlatform, section: nextSection })
  }

  const selectDoc = (id: string) => {
    setSelectedId(id)
    setDocumentView('api')
    setCategoriesOpen(false)
    saveSelection({ product, platform, section: id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const selectQuickStart = () => {
    setDocumentView('quick-start')
    setCategoriesOpen(false)
    saveSelection({ product, platform, section: selectedId }, false, 'quick-start')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleChapter = (id: string) => setExpandedChapters((previous) => ({ ...previous, [id]: !(previous[id] ?? true) }))
  const isExpanded = (id: string) => expandedChapters[id] ?? true
  const renderDirectoryNode = (node: ApiDocNode, depth = 0): ReactNode => {
    const directoryChildren = node.children.filter((child) => Boolean(child.number))
    const title = node.title.replace(/^\d+(?:\.\d+)?[、.，]?\s*/, '')
    return <div className={`api-directory-node api-directory-depth-${Math.min(depth, 1)}`} key={node.id}>
      <div className={`api-directory-row${documentView === 'api' && selectedId === node.id ? ' is-selected' : ''}`}>
        {depth === 0 && (directoryChildren.length > 0
          ? <button className="api-directory-toggle-slot api-directory-expander" type="button" aria-label={`${isExpanded(node.id) ? '收起' : '展开'}${node.title}`} aria-expanded={isExpanded(node.id)} onClick={() => toggleChapter(node.id)}><span className={isExpanded(node.id) ? 'is-expanded' : ''}>›</span></button>
          : <span className="api-directory-toggle-slot api-directory-spacer" aria-hidden="true" />)}
        <button className="api-directory-select" type="button" onClick={() => selectDoc(node.id)}>
          <span className="api-directory-number">{node.number}</span>
          <span className="api-directory-title">{title}</span>
        </button>
      </div>
      {directoryChildren.length > 0 && isExpanded(node.id) && <div className="api-directory-children">{directoryChildren.map((child) => renderDirectoryNode(child, depth + 1))}</div>}
    </div>
  }

  return (
    <section className="quick-start-page api-reference-page">
      {!authorized ? <main className="api-login-gate">
        <div className="api-login-gate-content">
          <div className="api-login-eyebrow"><span /> JEETOO DEVELOPER DOCUMENTATION</div>
          <span className="api-login-status">LOGIN REQUIRED</span>
          <div className="api-login-lock" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none"><rect x="10" y="21" width="28" height="21" rx="2" /><path d="M16 21v-7a8 8 0 0 1 16 0v7" /><circle cx="24" cy="30" r="2" /><path d="M24 32v4" /></svg>
          </div>
          <h1>登录后查看完整 API 文档</h1>
          <p>登录 JEETOO 开发者账号，即可查看当前产品的完整 API 接口、参数说明及代码示例。</p>
          <Link className="button button-accent api-login-button" to="/developer/login">立即登录 <span>↗</span></Link>
          <div className="api-login-footnote">登录即获得当前产品 API 文档访问权限。</div>
        </div>
      </main> :
      <div className="api-docs-layout">
        <aside className="api-category-sidebar">
          <button className="api-category-toggle" type="button" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((open) => !open)}><span>API 文档目录</span><b>{categoriesOpen ? '−' : '+'}</b></button>
          <div className={`api-category-panel${categoriesOpen ? ' is-open' : ''}`}>
            <label className="api-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索章节" aria-label="搜索 API 章节" /></label>
            <button className={`api-quickstart-entry${documentView === 'quick-start' ? ' is-selected' : ''}`} type="button" aria-current={documentView === 'quick-start' ? 'page' : undefined} onClick={selectQuickStart}><span>↗</span><b>快速开始</b><small>SDK 接入指南</small></button>
            <nav className="api-platform-menu" aria-label={`${selectedProduct.label} 平台文档目录`}>
              {apiPlatforms.map((item) => {
                const isPlatformExpanded = item.id === platform && expandedPlatforms[item.id]
                const platformDocs = apiProductDocs[product][item.id]
                const platformFilteredDocs = item.id === platform ? filteredDocs : platformDocs
                return <section className={`api-platform-menu-section${platform === item.id ? ' is-active' : ''}`} key={item.id}>
                  <button className="api-platform-menu-button" type="button" aria-expanded={isPlatformExpanded} aria-current={platform === item.id ? 'true' : undefined} onClick={() => selectPlatform(item.id)}>
                    <span className={`api-platform-menu-caret${isPlatformExpanded ? ' is-expanded' : ''}`}>›</span>
                    <span>{item.sidebarTitle}</span>
                  </button>
                  {isPlatformExpanded && <div className="api-platform-menu-docs">
                    {platformFilteredDocs.map((node) => renderDirectoryNode(node))}
                    {platformFilteredDocs.length === 0 && <div className="api-search-empty">没有找到匹配的章节</div>}
                  </div>}
                </section>
              })}
            </nav>
          </div>
        </aside>

        <article className="api-doc-content">
          {documentView === 'quick-start' ? <ApiQuickStartDocument product={product} platform={platform} onSelectApi={selectDoc} /> : <>
          {!selected ? <div className="api-empty-state"><h2>API 文档暂不可用</h2></div> : <>
            <header className="api-doc-header" id="api-top">
              <div className="apply-eyebrow"><span /> {activePlatform.documentationTitle.toUpperCase()}</div>
              <div className="api-title-row"><div><div className="api-doc-breadcrumb">{selectedPath.slice(0, -1).map((item) => item.title).join(' / ') || activePlatform.sidebarTitle}</div><h1>{selected.title}</h1></div><span className="platform-chip">{activePlatform.label.toUpperCase()}</span></div>
              {product === 'recorder-card' && platform === 'android'
                ? <div className="api-mock-note"><span>i</span> 以下章节内容直接依据《加推录音卡Android SDK.md》原文展示。</div>
                : product === 'recorder-card' && platform === 'harmony'
                  ? <div className="api-mock-note"><span>i</span> 以下章节依据 JTCard HarmonyOS SDK 1.0.10 接入资料整理。</div>
                  : product === 'recorder-card' && platform === 'ios'
                    ? <div className="api-mock-note"><span>i</span> 以下章节依据《加推录音卡iOS SDK.md》整理；最新明确列出的正式版本为 v1.0.7。</div>
                    : <div className="api-platform-status"><b>Mock</b><span>{`${selectedProduct.label} 的该平台文档为独立 Mock 占位内容，接口资料待补充。`}</span></div>}
            </header>

            {filteredDocs.length === 0
                ? <div className="api-empty-state"><span>⌕</span><h2>没有找到匹配内容</h2><p>请尝试其他章节名称或关键词。</p></div>
                : <><section className="api-raw-content" id={`api-section-${selected.id}`}>
                    {renderNodeContent(selected)}
                  </section>
                  <div className="api-doc-footer-note">章节标题、说明、代码及表格均按原始 Markdown 展示。</div></>}
          </>}
          </>}
        </article>

        {documentView === 'quick-start'
          ? <aside className="api-page-outline"><div className="api-outline-title">本页目录</div>{quickStartOutline.map(([id, title]) => <a className={activeOutlineId === id ? 'is-active' : ''} key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{title}</a>)}</aside>
          : selected && authorized && <aside className="api-page-outline"><div className="api-outline-title">本页目录</div>{collectOutline(selected).map((node) => <a className={`api-outline-level-${node.level}${activeOutlineId === `api-section-${node.id}` ? ' is-active' : ''}`} key={node.id} href={`#api-section-${node.id}`} onClick={(event) => { event.preventDefault(); document.getElementById(`api-section-${node.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{node.title}</a>)}</aside>}
      </div>}
    </section>
  )
}

function ApiQuickStartDocument({ product, platform, onSelectApi }: { product: ApiProduct; platform: ApiPlatform; onSelectApi: (id: string) => void }) {
  const supported = product === 'recorder-card'
  const isHarmony = platform === 'harmony'
  const isIos = platform === 'ios'
  const references = isHarmony
    ? { setup: '1', permissions: '1.5', initialize: '1.2', scan: '2.1', connect: '2.2', battery: '3.1' }
    : isIos
      ? { setup: '1', permissions: '1.3', initialize: '1.4', scan: '2.1', connect: '2.3', battery: '3.1' }
      : { setup: '1', permissions: '1.2', initialize: '2', scan: '3.1', connect: '3.3', battery: '4.2' }
  const scanConnectCode = isIos
    ? `// SDK 调用片段（非完整可编译文件）
import JTCardSDK

JTSdkManager.shared.delegate = self
JTSdkManager.shared.eventDelegate = self
let _ = JTSdkManager.shared.startScan()

// 扫描结果回调
func jtCardManager(_ manager: JTSdkManager, didDiscover device: JTPeripheral) {
    JTSdkManager.shared.connect(to: device)
}

// 连接状态回调
func jtCardManager(_ manager: JTSdkManager, didChangeConnectState state: JTBleConnectState, deviceIdentifier: String?) {
    if state == .connected {
        JTSdkManager.shared.getElectricityLevel()
    }
}

// 电量结果通过事件代理回调
func onElectricityLevel(level: Int) {
    print("电量：\\(level)")
}`
    : isHarmony
    ? `import { common } from '@kit.AbilityKit';
import { JiatuiBleDevice, JiatuiScanResult, JtcardPlugin } from '@jtcard/plugin';

function searchAndConnect(context: common.Context): void {
  JtcardPlugin.startScan(context, (result: JiatuiScanResult) => {
    if (result.error) {
      console.error(\`搜索失败：\${result.error}\`);
      return;
    }

    const device = result.devices[0];
    if (!device) {
      return;
    }

    JtcardPlugin.connect(device.uuid, {
      onStateChange: (connectedDevice: JiatuiBleDevice, state: string) => {
        console.info(\`连接状态：\${connectedDevice.uuid} \${state}\`);
      },
      onConnected: async (connectedDevice: JiatuiBleDevice) => {
        console.info(\`已连接：\${connectedDevice.name || connectedDevice.uuid}\`);
        const battery = await JtcardPlugin.getBattery();
        console.info(\`电量：\${battery}%\`);
      },
      onError: (connectedDevice: JiatuiBleDevice, error: string) => {
        console.error(\`连接失败：\${connectedDevice.uuid} \${error}\`);
      }
    });
  });
}`
    : `// 按快速开始步骤完成扫描与连接；
// 具体调用及回调实现见 Android SDK API 章节。`
  const integrationCode = `entry/libs/jtcard_plugin-1.0.10.har

// entry/oh-package.json5
{
  "dependencies": {
    "@jtcard/plugin": "file:./libs/jtcard_plugin-1.0.10.har"
  }
}`
  return <>
    <header className="api-doc-header api-quickstart-header" id="api-top">
      <div className="apply-eyebrow"><span /> JEETOO {isHarmony ? 'HARMONYOS' : platform.toUpperCase()} SDK QUICKSTART</div>
      <div className="api-title-row"><div><div className="api-doc-breadcrumb">{apiProducts.find((item) => item.id === product)?.label ?? 'AI 录音卡'} / {apiPlatforms.find((item) => item.id === platform)?.label ?? 'Android'}</div><h1>快速开始</h1></div><span className="platform-chip">{platform === 'harmony' ? 'HARMONYOS' : platform.toUpperCase()}</span></div>
      <p className="api-quickstart-lead">欢迎使用 JEETOO Device SDK。按当前平台准备环境、获取并集成 SDK，然后连接设备完成首次验证。详细参数、权限配置和完整接口示例请查看对应平台 API 章节。</p>
      {!supported && <div className="api-platform-status"><b>资料待补充</b><span>当前产品与平台组合尚无经确认的接入资料。</span></div>}
    </header>

    {supported ? <section className="api-quickstart-content">
      <QuickStartStep id="quickstart-intro" number="01" title="SDK 介绍">
        <p>JEETOO Device SDK 提供设备连接、设备信息读取、录音控制、文件管理、BLE 与 Wi-Fi 文件传输及 OTA 固件升级能力。当前功能以所选平台的正式 SDK 文档为准。</p>
      </QuickStartStep>

      <QuickStartStep id="quickstart-environment" number="02" title="准备开发环境">
        {isHarmony && <><p>HarmonyOS SDK 当前交付版本为 1.0.10，使用 ArkTS / ETS 工程与 HAR 包。资料记录的最低兼容版本为 HarmonyOS 6.0.0（API 20）。</p><div className="api-quickstart-facts"><span><b>SDK</b>1.0.10</span><span><b>依赖格式</b>HAR</span><span><b>代码语言</b>ArkTS / ETS</span><span><b>最低兼容</b>HarmonyOS 6.0.0（API 20）</span></div></>}
        {isIos && <><p>准备 Xcode 工程与 JEETOO AI 录音卡。iOS SDK 文档注明最低支持 iOS 13.0，集成包为 JTCardSDK.xcframework，主要开发语言为 Swift，并提供 Objective-C 兼容说明。</p><div className="api-quickstart-facts"><span><b>最低系统</b>iOS 13.0+</span><span><b>集成包</b>XCFramework</span><span><b>语言</b>Swift / Objective-C</span></div></>}
        {!isHarmony && !isIos && <><p>准备 Android 开发环境、测试用 JEETOO AI 录音卡及 Android SDK。SDK 文档注明最低支持 Android 5.0（API 21）；Android Studio、Gradle、Kotlin / Java 的最低版本未在资料中指定。</p><div className="api-quickstart-facts"><span><b>产品</b>AI 录音卡</span><span><b>依赖格式</b>AAR</span><span><b>最低系统</b>Android 5.0（API 21）</span></div></>}
        <ApiQuickStartReference label="查看平台 SDK 接入说明" section={references.setup} onSelectApi={onSelectApi} />
      </QuickStartStep>

      <QuickStartStep id="quickstart-sdk" number="03" title="获取 SDK">
        <p>{isHarmony ? 'HarmonyOS SDK 1.0.10 以 HAR 交付，包名为 @jtcard/plugin；第三方工程引入 HAR 即可，无需插件源码。' : isIos ? 'SDK 文档列出 JTCardSDK.xcframework，但本项目未配置可验证的二进制下载文件。可通过现有开发接入申请流程联系获取。' : '前往 SDK 下载页查看当前版本及授权获取方式。没有配置实际 AAR 文件时，不会模拟下载成功。'}</p>
        <div className="api-quickstart-links">{isIos ? <Link to="/developer/apply">申请开发接入 <span>↗</span></Link> : <Link to="/developer/sdk">查看 SDK 下载页 <span>↗</span></Link>}<Link to="/developer/demo">查看 Demo 示例 <span>↗</span></Link></div>
      </QuickStartStep>

      <QuickStartStep id="quickstart-integration" number="04" title="集成 SDK">
        {isHarmony
          ? <><p>将 HAR 放入 entry/libs，并在 entry/oh-package.json5 声明本地依赖。权限配置、签名和 bundleName 说明见 API 文档。</p><QuickStartCodeBlock title="HAR DEPENDENCY" language="json5" code={integrationCode} /><div className="api-quickstart-reference-row"><ApiQuickStartReference label="module.json5 权限配置" section={references.permissions} onSelectApi={onSelectApi} /></div></>
          : isIos
            ? <><p>将 JTCardSDK.xcframework 添加到 Xcode 工程，在 Frameworks, Libraries, and Embedded Content 中设置为 Embed &amp; Sign。以下为 Xcode 操作说明，不是 shell 命令。</p><QuickStartCodeBlock title="XCODE · FRAMEWORKS, LIBRARIES, AND EMBEDDED CONTENT" language="text" code={'Add JTCardSDK.xcframework to the Xcode project\nEmbed & Sign'} /><p>在 Info.plist 中配置蓝牙用途说明。只有使用一代卡 Wi-Fi Socket 快传时，才需要本地网络说明；Hotspot Configuration Capability 仅用于应用需要配置或连接设备热点的场景。</p><div className="api-quickstart-reference-row"><ApiQuickStartReference label="SDK 权限配置" section={references.permissions} onSelectApi={onSelectApi} /><ApiQuickStartReference label="SDK 使用入口" section={references.initialize} onSelectApi={onSelectApi} /></div></>
          : <><p>按 SDK 使用说明将 AAR 配置为应用依赖，并在调用 SDK 前申请所需的蓝牙与 Wi-Fi 系统权限。完整依赖配置、权限清单和初始化代码保留在详细 API 文档中。</p><div className="api-quickstart-reference-row"><ApiQuickStartReference label="AAR 集成说明" section="1.1" onSelectApi={onSelectApi} /><ApiQuickStartReference label="权限配置" section={references.permissions} onSelectApi={onSelectApi} /><ApiQuickStartReference label="初始化 SDK" section={references.initialize} onSelectApi={onSelectApi} /></div></>}
      </QuickStartStep>

      <QuickStartStep id="quickstart-connect" number="05" title="首次连接设备">
        <p>{isHarmony ? '按照 SDK 最小调用流程先搜索设备，再使用扫描结果 uuid 连接；连接成功后查询设备电量。以下为接入资料中的真实 ArkTS 示例。' : isIos ? '先设置 Delegate 与 EventDelegate，再扫描设备；扫描回调拿到 JTPeripheral 后发起连接。连接状态回调确认已连接后，调用电量接口完成验证。代码为按原文签名整理的调用片段，需要放入已实现相应 Delegate 的类型中。' : '先执行蓝牙扫描，再使用扫描结果连接设备。接口签名及回调细节请查看 Android SDK API 章节。'}</p>
        {(isHarmony || isIos) && <QuickStartCodeBlock title={isIos ? 'SWIFT · API FRAGMENTS' : 'CODE EXAMPLE'} language={isIos ? 'swift' : 'ArkTS'} code={scanConnectCode} />}
        <div className="api-quickstart-reference-row"><ApiQuickStartReference label="扫描设备" section={references.scan} onSelectApi={onSelectApi} /><ApiQuickStartReference label="连接设备" section={references.connect} onSelectApi={onSelectApi} /></div>
      </QuickStartStep>

      <QuickStartStep id="quickstart-complete" number="06" title="完成接入">
        <p>{isHarmony ? '连接回调触发后调用 getBattery() 验证设备响应；确认连接和电量读取成功，即完成最小接入验证。' : isIos ? '连接成功后调用 getElectricityLevel()，并在 onElectricityLevel(level:) 回调中确认设备电量，即完成首次接入验证。' : '连接成功后按 API 文档读取设备电量或设备信息，确认收到对应结果回调，即完成首次接入验证。'}</p>
        <div className="api-quickstart-links"><Link to="/developer/api">API 参考 <span>↗</span></Link><Link to="/developer/demo">Demo 示例 <span>↗</span></Link><Link to="/developer/device-guide">设备指南 <span>↗</span></Link></div>
        <div className="api-quickstart-reference-row"><ApiQuickStartReference label="查看电量接口" section={references.battery} onSelectApi={onSelectApi} /></div>
      </QuickStartStep>
    </section> : <div className="api-platform-status api-quickstart-unavailable"><b>当前选择暂无快速开始资料</b><span>只有 AI 录音卡 Android 和 HarmonyOS SDK 具备已核实的接入流程，请选择对应平台查看。</span></div>}
  </>
}

function QuickStartStep({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section className="api-quickstart-step" id={id}>
    <div className="doc-section-title api-raw-title api-raw-title-1"><span>{number}</span><h2>{title}</h2></div>
    <div className="api-quickstart-step-body">{children}</div>
  </section>
}

function ApiQuickStartReference({ label, section, onSelectApi }: { label: string; section: string; onSelectApi: (id: string) => void }) {
  return <button className="api-quickstart-reference" type="button" onClick={() => onSelectApi(section)}>{label}<span>→</span></button>
}
