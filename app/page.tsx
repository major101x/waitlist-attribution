import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border)]">
        <div className="layout-container flex h-16 items-center justify-between">
          <div className="font-mono font-bold text-lg tracking-tight">
            waitlist_attribution
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Log in
            </Link>
            <Link href="/login" className="btn-primary">
              Start Tracking
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 border-b border-[var(--color-border)] bg-[var(--bg-secondary)]">
          <div className="layout-container">
            <div className="max-w-2xl">
              <div className="inline-block px-3 py-1 mb-6 text-xs font-mono font-medium rounded-full border border-[var(--color-brand)] text-[var(--color-brand)] bg-[rgba(37,99,235,0.1)]">
                V1.0 PUBLIC BETA
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-6 text-[var(--text-primary)] leading-[1.1]">
                Waitlist attribution for{" "}
                <span className="text-[var(--text-secondary)]">
                  serious founders.
                </span>
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
                Know exactly where every signup came from. Secure,
                database-backed attribution without the analytics bloat.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/login" className="btn-primary px-6 py-3 text-base">
                  Start Tracking for Free
                </Link>
                <Link
                  href="#"
                  className="btn-secondary px-6 py-3 text-base font-mono"
                >
                  Read the Docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal / Code Section */}
        <section className="py-20 border-b border-[var(--color-border)]">
          <div className="layout-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  The Truth, In Your Database.
                </h2>
                <p className="text-[var(--text-secondary)] mb-6 text-lg">
                  Most tools rely on client-side cookies and fuzzy matching. We
                  use secure, server-side functions to lock attribution to the
                  email forever.
                </p>
                <ul className="space-y-4">
                  {[
                    "Postgres-backed storage",
                    "Row Level Security (RLS)",
                    "Source truth locked on insert",
                    "Zero marketing trackers",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[var(--color-brand)] rounded-full" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terminal Visual */}
              <div className="rounded-lg overflow-hidden border border-[var(--color-border)] bg-[#0a0f1a] shadow-2xl">
                <div className="flex items-center px-4 py-2 border-b border-[#1f2937] bg-[#111827]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                    <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  </div>
                  <div className="ml-4 text-xs font-mono text-gray-500">
                    postgres — psql
                  </div>
                </div>
                <div className="p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                  <div className="mb-2">
                    <span className="text-[#10b981]">➜</span>{" "}
                    <span className="text-blue-400">~</span> select * from
                    signups where source = &apos;twitter&apos;;
                  </div>
                  <div className="text-gray-500 mb-4">Searching...</div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-800">
                        <th className="py-2">id</th>
                        <th className="py-2">email</th>
                        <th className="py-2">source</th>
                        <th className="py-2">created_at</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-900/50">
                        <td className="py-2 text-gray-600">83f...</td>
                        <td className="py-2 text-blue-300">alex@stripe.com</td>
                        <td className="py-2">
                          <span className="text-[#1d9bf0]">twitter</span>
                        </td>
                        <td className="py-2 text-gray-500">2m ago</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">29a...</td>
                        <td className="py-2 text-blue-300">sarah@ycomb.com</td>
                        <td className="py-2">
                          <span className="text-[#1d9bf0]">twitter</span>
                        </td>
                        <td className="py-2 text-gray-500">5m ago</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4">
                    <span className="text-gray-500">(2 rows)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 bg-[var(--bg-secondary)]">
          <div className="layout-container">
            <h2 className="text-sm font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-12">
              Infrastructure for
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Indie Founders",
                  desc: "Stop guessing which tweet went viral. See the exact source of every signup.",
                },
                {
                  title: "SaaS Builders",
                  desc: "Validate your MVP before writing a line of code. Collect emails with high fidelity.",
                },
                {
                  title: "Newsletter Writers",
                  desc: "Track subscriber growth from different promotion channels without complex analytics.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)]"
                >
                  <h3 className="text-lg font-bold mb-3">{card.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-[var(--color-border)]">
          <div className="layout-container flex justify-between items-center text-sm text-[var(--text-tertiary)]">
            <div className="font-mono">
              &copy; {new Date().getFullYear()} Waitlist Attribution
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[var(--text-primary)]">
                Twitter
              </a>
              <a href="#" className="hover:text-[var(--text-primary)]">
                GitHub
              </a>
              <a href="#" className="hover:text-[var(--text-primary)]">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
