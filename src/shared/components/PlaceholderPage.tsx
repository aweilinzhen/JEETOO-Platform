type PlaceholderPageProps = {
  title: string
  platform: 'developer' | 'admin'
  pageId: string
}

export function PlaceholderPage({ title, platform, pageId }: PlaceholderPageProps) {
  return (
    <section className={platform === 'admin' ? 'placeholder admin-placeholder' : 'placeholder developer-placeholder'}>
      {platform === 'admin' ? <><div className="page-heading"><div><div className="page-kicker">JEETOO CONSOLE / {pageId.toUpperCase()}</div><h1>{title}</h1><p>管理和维护加推开放平台的{title}信息。</p></div><button className="button button-accent">＋ 新建</button></div><div className="admin-empty-panel"><div className="empty-icon">{pageId === 'admin-home' ? '▦' : '◇'}</div><h2>{title}页面已就绪</h2><p>这里将展示{title}相关的数据、筛选条件与操作。</p><span className="module-tag">页面模块 · {pageId}</span></div></> : <><div className="eyebrow"><span /> DEVELOPER PORTAL</div><h1>{title}</h1><p>此页面已加入开发者平台导航，内容将在后续阶段逐步完善。</p><div className="coming-soon"><span>—</span> 页面准备中</div><div className="module-tag">页面模块 · {pageId}</div></>}
    </section>
  )
}
