import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { QuickStartCodeBlock } from '../components/QuickStartCodeBlock'
import { type ApiDocNode, type MarkdownBlock } from '../mock/apiDocs'
import { API_PLATFORM_STORAGE_KEY, apiPlatformDocs, apiPlatforms, type ApiPlatform } from '../mock/apiPlatformDocs'
import { useMockAuthState } from '../mock/access'

function readApiPlatform(): ApiPlatform {
  if (typeof window === 'undefined') return 'android'
  try {
    const saved = window.localStorage.getItem(API_PLATFORM_STORAGE_KEY)
    return saved === 'ios' || saved === 'harmony' ? saved : 'android'
  } catch {
    return 'android'
  }
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
  const [platform, setPlatform] = useState<ApiPlatform>(readApiPlatform)
  const activePlatform = apiPlatforms.find((item) => item.id === platform) ?? apiPlatforms[0]
  const activeDocs = apiPlatformDocs[platform]
  const [selectedId, setSelectedId] = useState(activeDocs[0]?.id ?? '')
  const [search, setSearch] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(true)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})
  const selected = findNode(activeDocs, selectedId) ?? activeDocs[0]
  const selectedPath = selected ? findPath(activeDocs, selected.id) : []
  const authorized = loginStatus === 'logged_in'
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

  const selectPlatform = (nextPlatform: ApiPlatform) => {
    setPlatform(nextPlatform)
    setSelectedId(apiPlatformDocs[nextPlatform][0]?.id ?? '')
    setSearch('')
    setExpandedChapters({})
    try { window.localStorage.setItem(API_PLATFORM_STORAGE_KEY, nextPlatform) } catch { /* keep the current selection in memory */ }
  }

  const selectDoc = (id: string) => {
    setSelectedId(id)
    setCategoriesOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleChapter = (id: string) => setExpandedChapters((previous) => ({ ...previous, [id]: !(previous[id] ?? true) }))
  const isExpanded = (id: string) => expandedChapters[id] ?? true
  const renderDirectoryNode = (node: ApiDocNode, depth = 0): ReactNode => {
    const directoryChildren = node.id === '1' ? [] : node.children.filter((child) => Boolean(child.number))
    const title = node.title.replace(/^\d+(?:\.\d+)?[、.，]?\s*/, '')
    return <div className={`api-directory-node api-directory-depth-${Math.min(depth, 1)}`} key={node.id}>
      <div className={`api-directory-row${selectedId === node.id ? ' is-selected' : ''}`}>
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
            <button className="api-directory-toggle" type="button" aria-expanded={directoryOpen} onClick={() => setDirectoryOpen((open) => !open)}><span>{activePlatform.sidebarTitle}</span><b>{directoryOpen ? '−' : '+'}</b></button>
            {directoryOpen && <nav className="api-category-list api-hierarchy-list" aria-label={`${activePlatform.sidebarTitle} 章节目录`}>
              {filteredDocs.map((node) => renderDirectoryNode(node))}
              {filteredDocs.length === 0 && <div className="api-search-empty">没有找到匹配的章节</div>}
            </nav>}
          </div>
        </aside>

        <article className="api-doc-content">
          <nav className="api-platform-tabs" aria-label="选择 API 文档平台">
            {apiPlatforms.map((item) => <button className={platform === item.id ? 'is-active' : ''} type="button" aria-pressed={platform === item.id} key={item.id} onClick={() => selectPlatform(item.id)}>{item.label}</button>)}
          </nav>
          {!selected ? <div className="api-empty-state"><h2>API 文档暂不可用</h2></div> : <>
            <header className="api-doc-header" id="api-top">
              <div className="apply-eyebrow"><span /> {activePlatform.documentationTitle.toUpperCase()}</div>
              <div className="api-title-row"><div><div className="api-doc-breadcrumb">{selectedPath.slice(0, -1).map((item) => item.title).join(' / ') || activePlatform.sidebarTitle}</div><h1>{selected.title}</h1></div><span className="platform-chip">{activePlatform.label.toUpperCase()}</span></div>
              {platform === 'android'
                ? <div className="api-mock-note"><span>i</span> 以下章节内容直接依据《加推录音卡Android SDK.md》原文展示。</div>
                : <div className="api-platform-status"><b>{platform === 'ios' ? '筹备中' : '规划中'}</b><span>{platform === 'ios' ? 'iOS SDK 正在整理中，后续将通过更新日志发布。' : '鸿蒙 SDK 正在准备中，后续开放信息将通过更新日志发布。'}</span></div>}
            </header>

            {filteredDocs.length === 0
                ? <div className="api-empty-state"><span>⌕</span><h2>没有找到匹配内容</h2><p>请尝试其他章节名称或关键词。</p></div>
                : <><section className="api-raw-content" id={`api-section-${selected.id}`}>
                    {renderNodeContent(selected)}
                  </section>
                  <div className="api-doc-footer-note">章节标题、说明、代码及表格均按原始 Markdown 展示。</div></>}
          </>}
        </article>

        {selected && authorized && <aside className="api-page-outline"><div className="api-outline-title">本页目录</div>{collectOutline(selected).map((node) => <a className={`api-outline-level-${node.level}`} key={node.id} href={`#api-section-${node.id}`} onClick={(event) => { event.preventDefault(); document.getElementById(`api-section-${node.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{node.title}</a>)}</aside>}
      </div>}
    </section>
  )
}
