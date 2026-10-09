import Link from "next/link";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const barHeights = [45, 70, 55, 85, 65, 95, 75, 88, 60, 78, 92, 68];

const features = [
  { title: "Track expenses", description: "Record everyday spending and keep it organized by category." },
  { title: "Set monthly budgets", description: "Choose a limit for the month and see how much you have left." },
  { title: "Understand your habits", description: "Use simple category and monthly views to spot where money goes." },
];

export default function Home() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav" aria-label="Main navigation">
          <Link href="/" className="landing-brand">Expense<span>IQ</span></Link>
          <div className="landing-nav-actions">
            <Link href="/login" className="landing-signin">Sign in</Link>
            <Link href="/register" className="landing-nav-cta">Get started</Link>
          </div>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">A simpler way to stay on top of spending</p>
          <h1>Take control of your <span>spending.</span></h1>
          <p className="landing-intro">ExpenseIQ helps you track expenses, manage budgets, and understand where your money goes — all in one simple dashboard.</p>
          <div className="landing-hero-actions">
            <Link href="/register" className="landing-primary-link">Start tracking <span aria-hidden="true">→</span></Link>
            <Link href="#features" className="landing-secondary-link">Explore features</Link>
          </div>
          <p className="landing-note">Free to use <span>·</span> Simple <span>·</span> Private</p>
        </div>

        <div className="landing-preview" aria-label="ExpenseIQ dashboard preview">
          <div className="landing-dashboard">
            <div className="landing-dashboard-top"><strong>Expense<span>IQ</span></strong><span>September 2026</span></div>
            <div className="landing-dashboard-body">
              <div className="landing-preview-heading"><div><span className="landing-preview-label">MONTHLY OVERVIEW</span><h2>Your spending</h2></div><span className="landing-period">This month⌄</span></div>
              <div className="landing-total-row"><div><span className="landing-preview-label">Total spending</span><strong>Rs. 284,050</strong></div><span className="landing-change">↓ 8.2% <small>vs last month</small></span></div>
              <div className="landing-chart-wrap">
                <div className="landing-chart-labels"><span>Rs. 100k</span><span>Rs. 50k</span><span>Rs. 0</span></div>
                <div className="landing-bars" role="img" aria-label="Monthly spending chart from January to December">
                  {barHeights.map((height, index) => <div className="landing-bar-column" key={months[index]}><span className={index === 8 ? "landing-bar landing-bar-current" : "landing-bar"} style={{ height: `${height}%` }} /><span>{months[index]}</span></div>)}
                </div>
              </div>
              <div className="landing-categories">
                <div className="landing-category-head"><h3>Top categories</h3><span>This month</span></div>
                <div className="landing-category-row"><span className="landing-category-name"><i className="category-teal" />Food &amp; dining</span><strong>Rs. 62,000</strong><span className="landing-category-track"><i style={{ width: "78%" }} /></span></div>
                <div className="landing-category-row"><span className="landing-category-name"><i className="category-blue" />Transport</span><strong>Rs. 34,000</strong><span className="landing-category-track"><i style={{ width: "48%" }} /></span></div>
                <div className="landing-category-row"><span className="landing-category-name"><i className="category-sand" />Home &amp; bills</span><strong>Rs. 28,000</strong><span className="landing-category-track"><i style={{ width: "37%" }} /></span></div>
              </div>
            </div>
          </div>
          <p className="landing-preview-caption">A clear picture of where your money goes.</p>
        </div>
      </section>

      <section id="features" className="landing-features">
        <div className="landing-section-heading"><p className="landing-eyebrow">Everything you need</p><h2>Your finances, made simple.</h2><p>Track, plan, and understand your spending without complicated spreadsheets.</p></div>
        <div className="landing-feature-list">{features.map((feature, index) => <article className="landing-feature" key={feature.title}><span className="landing-feature-number">0{index + 1}</span><div><h3>{feature.title}</h3><p>{feature.description}</p></div></article>)}</div>
      </section>

      <section className="landing-bottom-cta"><div><h2>Ready to track your spending?</h2><p>Create a free account and start managing your expenses today.</p></div><Link href="/register" className="landing-primary-link">Get started <span aria-hidden="true">→</span></Link></section>

      <footer className="landing-footer"><Link href="/" className="landing-brand">Expense<span>IQ</span></Link><p>© {new Date().getFullYear()} ExpenseIQ. Built for personal use.</p></footer>
    </main>
  );
}
