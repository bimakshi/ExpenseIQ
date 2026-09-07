export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="text-2xl font-bold tracking-tight text-gray-900">
          Expense<span className="text-indigo-600">IQ</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
            Sign In
          </button>

          <button className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            ✨ Smarter spending starts here
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Take control of your
            <span className="text-indigo-600"> spending.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            ExpenseIQ helps you track expenses, manage budgets, and understand
            where your money goes — all in one simple dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-full bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              Start Tracking →
            </button>

            <button className="rounded-full border border-gray-200 px-7 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50">
              Explore Features
            </button>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Free to use · Simple · Private
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 shadow-2xl shadow-gray-200/60">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total spending</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    $2,840.50
                  </p>
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                  ↓ 8.2%
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="mt-8 flex h-40 items-end gap-3">
                {[45, 70, 55, 85, 65, 95, 75, 88, 60, 78, 92, 68].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-lg bg-indigo-100"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-xs text-gray-500">Food</p>
                  <p className="mt-1 font-bold text-gray-900">$620</p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-gray-500">Transport</p>
                  <p className="mt-1 font-bold text-gray-900">$340</p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs text-gray-500">Other</p>
                  <p className="mt-1 font-bold text-gray-900">$280</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your finances, made simple.
            </h2>

            <p className="mt-4 text-gray-600">
              Track, plan, and understand your spending without complicated
              spreadsheets.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 text-3xl">💳</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Track Expenses
              </h3>
              <p className="mt-2 leading-7 text-gray-600">
                Easily record and organize your daily expenses by category.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 text-3xl">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Set Budgets
              </h3>
              <p className="mt-2 leading-7 text-gray-600">
                Set monthly limits and know when you are getting close to them.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 text-3xl">📊</div>
              <h3 className="text-xl font-semibold text-gray-900">
                See Insights
              </h3>
              <p className="mt-2 leading-7 text-gray-600">
                Understand your spending habits with clear visual analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}