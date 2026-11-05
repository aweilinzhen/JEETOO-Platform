const customerLogos = [
  { name: '得到', file: 'brand-wall/dedao-logo.png' },
  { name: '电信', file: 'brand-wall/dianxin-logo.png' },
  { name: '金蝶', file: 'brand-wall/kingdee-logo.png' },
  { name: '聆海', file: 'brand-wall/linghai-logo.png' },
]

export function CustomerCaseSection() {
  const logoBase = `${import.meta.env.BASE_URL}images/customer-logos/`

  return (
    <section className="home-section customer-case-section" aria-labelledby="customer-case-title">
      <div className="section-wrap customer-case-wrap">
        <header className="customer-case-heading">
          <h2 id="customer-case-title">真实接入，值得信赖</h2>
          <p>得到、电信、金蝶、聆海已使用 JEETOO AI 录音卡，并基于 JEETOO SDK 将设备能力集成至各自的应用。</p>
        </header>

        <div className="customer-case-logos" aria-label="客户品牌">
          {customerLogos.map((customer) => (
            <div className="customer-case-logo" key={customer.name}>
              <img src={`${logoBase}${customer.file}`} alt={customer.name} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
