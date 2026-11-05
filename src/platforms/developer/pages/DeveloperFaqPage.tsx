import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { faqCategories, faqItems, type FaqBlock, type FaqItem } from '../mock/faqData'

function searchableAnswer(blocks: FaqBlock[]) {
  return blocks.map((block) => {
    if ('text' in block) return block.text
    if ('items' in block) return block.items.join(' ')
    return ''
  }).join(' ')
}

function Highlight({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>
  const lower = text.toLocaleLowerCase()
  const needle = trimmed.toLocaleLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  let matchIndex = lower.indexOf(needle)
  while (matchIndex !== -1) {
    if (matchIndex > cursor) parts.push(text.slice(cursor, matchIndex))
    parts.push(<mark key={`${matchIndex}-${cursor}`}>{text.slice(matchIndex, matchIndex + trimmed.length)}</mark>)
    cursor = matchIndex + trimmed.length
    matchIndex = lower.indexOf(needle, cursor)
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>
}

function AnswerBlock({ block, query }: { block: FaqBlock; query: string }) {
  if (block.type === 'paragraph') return <p><Highlight text={block.text} query={query} /></p>
  if (block.type === 'subheading') return <h4><Highlight text={block.text} query={query} /></h4>
  if (block.type === 'note') return <div className="faq-answer-note"><Highlight text={block.text} query={query} /></div>
  if (block.type === 'contact') return <div className="faq-answer-contact"><span><Highlight text={block.text} query={query} /></span><a href={block.href}>{block.label} ↗</a></div>
  if (block.type === 'ordered') return <ol start={block.start}>{block.items.map((item) => <li key={item}><Highlight text={item} query={query} /></li>)}</ol>
  return <ul>{block.items.map((item) => <li key={item}><Highlight text={item} query={query} /></li>)}</ul>
}

export function DeveloperFaqPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>(faqCategories[0].id)
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({})
  const normalizedQuery = query.trim().toLocaleLowerCase()

  const matchingItems = useMemo(() => faqItems.filter((item) => {
    if (!normalizedQuery) return true
    return `${item.question} ${searchableAnswer(item.answer)}`.toLocaleLowerCase().includes(normalizedQuery)
  }), [activeCategory, normalizedQuery])

  const groupedItems = faqCategories.map((category) => ({
    ...category,
    items: matchingItems.filter((item) => item.category === category.id),
  })).filter((category) => category.items.length > 0)
  const groupKey = groupedItems.map((category) => category.id).join('|')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      const categoryId = visible[0]?.target.getAttribute('data-faq-category')
      if (categoryId) setActiveCategory(categoryId)
    }, { rootMargin: '-110px 0px -65% 0px', threshold: 0 })
    Object.entries(categoryRefs.current).forEach(([categoryId, element]) => {
      if (element) {
        element.dataset.faqCategory = categoryId
        observer.observe(element)
      }
    })
    return () => observer.disconnect()
  }, [groupKey])

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    requestAnimationFrame(() => categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const toggleQuestion = (id: number) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openRelated = (item: FaqItem) => {
    setQuery('')
    setActiveCategory(item.category)
    setExpanded((current) => new Set(current).add(item.id))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      categoryRefs.current[item.category]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById(`faq-question-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }))
  }

  return (
    <section className="developer-faq-page">
      <div className="developer-faq-wrap">
        <header className="developer-faq-heading">
          <div className="developer-faq-eyebrow"><span /> FREQUENTLY ASKED QUESTIONS</div>
          <h1>常见问题</h1>
          <p>查找设备连接、录音使用、充电维护及文件传输相关问题，快速获取解决方案。</p>
        </header>

        <label className="developer-faq-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索问题，例如：无法连接设备、充电异常、录音文件在哪里……"
            aria-label="搜索常见问题"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">×</button>}
        </label>
        {normalizedQuery && <p className="developer-faq-result-count">找到 {matchingItems.length} 个相关问题</p>}

        <div className="developer-faq-layout">
          <nav className="developer-faq-categories" aria-label="常见问题分类">
            {faqCategories.map((category) => {
              const count = faqItems.filter((item) => item.category === category.id).length
              return <button
                key={category.id}
                type="button"
                className={activeCategory === category.id ? 'is-active' : ''}
                aria-current={activeCategory === category.id ? 'true' : undefined}
                onClick={() => scrollToCategory(category.id)}
              >
                <span>{category.title}</span><b>{count}</b>
              </button>
            })}
          </nav>

          <div className="developer-faq-results" aria-live="polite">
            {groupedItems.length > 0 ? groupedItems.map((category) => (
              <section
                className="developer-faq-category-section"
                key={category.id}
                ref={(element) => { categoryRefs.current[category.id] = element }}
                aria-labelledby={`faq-category-${category.id}`}
              >
                <h2 id={`faq-category-${category.id}`}>{category.title}<span>{category.items.length}</span></h2>
                <div className="developer-faq-list">
                  {category.items.map((item) => {
                    const isOpen = expanded.has(item.id)
                    return <article className={`developer-faq-item${isOpen ? ' is-open' : ''}`} key={item.id} id={`faq-question-${item.id}`}>
                      <h3>
                        <button type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${item.id}`} onClick={() => toggleQuestion(item.id)}>
                          <span className="developer-faq-number">{String(item.id).padStart(2, '0')}</span>
                          <span className="developer-faq-question"><Highlight text={item.question} query={query} /></span>
                          <span className="developer-faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                      </h3>
                      <div className={`developer-faq-answer-shell${isOpen ? ' is-open' : ''}`} id={`faq-answer-${item.id}`} aria-hidden={!isOpen}>
                        <div className="developer-faq-answer">
                          {item.answer.map((block, index) => <AnswerBlock block={block} query={query} key={`${item.id}-${index}`} />)}
                          {item.related?.length ? <div className="developer-faq-related"><b>相关问题</b>{item.related.map((relatedId) => {
                            const relatedItem = faqItems.find((candidate) => candidate.id === relatedId)
                            if (!relatedItem) return null
                            return <button type="button" key={relatedId} onClick={() => openRelated(relatedItem)}>{String(relatedId).padStart(2, '0')} {relatedItem.question} ↗</button>
                          })}</div> : null}
                        </div>
                      </div>
                    </article>
                  })}
                </div>
              </section>
            )) : <div className="developer-faq-empty">未找到相关问题，试试其他关键词，或联系客服获取帮助。</div>}
          </div>
        </div>

        <aside className="developer-faq-contact">
          <div><h2>还没有找到想要的答案？</h2><p>如果仍然无法解决您的问题，可以联系我们的技术支持团队。</p></div>
          <a href="mailto:developer@jeetoo.com">联系客服 <span>↗</span></a>
        </aside>
      </div>
    </section>
  )
}
