import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deviceGuideProducts, type DeviceGuideId, type DeviceGuideSection } from '../mock/deviceGuides'

const products = Object.values(deviceGuideProducts)

export function DeviceGuideOverviewPage() {
  return <section className="device-guide-page device-guide-overview">
    <div className="device-guide-overview-wrap">
      <header className="device-guide-overview-header">
        <div className="apply-eyebrow"><span /> JEETOO DEVICE GUIDE</div>
        <h1>设备指南</h1>
        <p>选择设备型号，查看对应的按键操作、指示灯状态与设备维护说明。</p>
      </header>
      <div className="device-guide-product-grid">
        {products.map((product, index) => <Link className="device-guide-product-card" key={product.id} to={`/developer/device-guide/${product.id}`}>
          <div className={`device-guide-product-image device-guide-product-image-${product.id}`}>
            <img src={product.image} alt={product.imageAlt} />
            <span>0{index + 1} / HARDWARE GUIDE</span>
          </div>
          <div className="device-guide-product-copy">
            <div className="device-guide-product-kicker">{product.shortName}</div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </div>
        </Link>)}
      </div>
    </div>
  </section>
}

export function DeviceGuideProductPage({ productId }: { productId: DeviceGuideId }) {
  const product = deviceGuideProducts[productId]
  const [active, setActive] = useState(product.sections[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionIds = useMemo(() => product.sections.map((section) => section.id), [product])

  useEffect(() => {
    setActive(product.sections[0].id)
    setMenuOpen(false)
  }, [product])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-15% 0px -70% 0px' })
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [sectionIds])

  const jumpTo = (id: string) => {
    setActive(id)
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <section className="device-guide-page">
    <div className="device-guide-layout">
      <aside className="device-guide-sidebar">
        <button className="device-guide-menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>指南目录 <span>{menuOpen ? '−' : '+'}</span></button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label={`${product.name}目录`}>
          <div className="toc-title">{product.shortName}</div>
          {product.sections.map((section) => <button type="button" key={section.id} className={active === section.id ? 'is-active' : ''} onClick={() => jumpTo(section.id)}><span>{section.number}</span>{section.title}</button>)}
        </nav>
      </aside>
      <main className="device-guide-content">
        <header className="device-guide-header">
          <div className="apply-eyebrow"><span /> JEETOO DEVICE GUIDE / {product.id === 'five-mic' ? 'FIVE MIC' : 'THREE MIC · FLASH'} </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="device-guide-header-links"><Link to="/developer/device-guide">全部设备型号</Link><Link to={product.id === 'five-mic' ? '/developer/device-guide/three-mic-flash' : '/developer/device-guide/five-mic'}>切换设备指南</Link></div>
        </header>
        {product.sections.map((section) => <GuideSection key={section.id} section={section} />)}
        <p className="device-guide-source-note">内容依据《{product.manualName}》整理。</p>
      </main>
      <aside className="device-guide-outline"><div className="toc-title">本页目录</div>{product.sections.map((section) => <button type="button" key={section.id} className={active === section.id ? 'is-active' : ''} onClick={() => jumpTo(section.id)}>{section.number} {section.title}</button>)}</aside>
    </div>
  </section>
}

function GuideSection({ section }: { section: DeviceGuideSection }) {
  return <section id={section.id} className="device-guide-detail-section">
    <span className="device-guide-number">{section.number}</span>
    <div className="device-guide-detail-body">
      <h2>{section.title}</h2>
      {section.intro && <p className="device-guide-detail-intro">{section.intro}</p>}
      {section.rows && <dl className="device-guide-facts">{section.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>}
      {section.notes && <ul className="device-guide-notes">{section.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
    </div>
  </section>
}
