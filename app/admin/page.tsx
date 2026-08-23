import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Bot,
  Command,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Swords,
  Terminal
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSections } from '@/lib/data'

const icons: Record<
  string,
  typeof Terminal
> = {
  console: Swords,
  discord: Bot,
  ingame: Gamepad2,
  items: Boxes
}

export default async function AdminPage() {
  const supabase =
    await createClient()

  const {
    data: { user }
  } =
    await supabase.auth.getUser()

  const sections =
    await getSections()

  const totalEntries =
    sections.reduce(
      (total, section) =>
        total +
        section.categories.reduce(
          (categoryTotal, category) =>
            categoryTotal +
            category.entries.length,
          0
        ),
      0
    )

  const totalCategories =
    sections.reduce(
      (total, section) =>
        total +
        section.categories.length,
      0
    )

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <div className="dashboard-brand-mark">
              <Command size={18} />
            </div>

            <div>
              <strong>
                DAMANHOUR
              </strong>

              <span>
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="dashboard-nav-label">
            WORKSPACE
          </div>

          <nav className="dashboard-nav">
            <Link
              href="/admin"
              className="dashboard-nav-item active"
            >
              <LayoutDashboard size={17} />
              Overview
            </Link>

            {sections.map(
              section => {
                const Icon =
                  icons[
                    section.slug
                  ] ?? Terminal

                return (
                  <Link
                    key={section.slug}
                    href={`/admin/commands?section=${section.slug}`}
                    className="dashboard-nav-item"
                  >
                    <Icon size={17} />
                    {section.name}
                  </Link>
                )
              }
            )}

            <Link
              href="/admin/settings"
              className="dashboard-nav-item"
            >
              <Settings size={17} />
              Settings
            </Link>
          </nav>

          <div className="dashboard-sidebar-footer">
            <div className="dashboard-security">
              <ShieldCheck size={16} />
              <div>
                <strong>
                  Protected
                </strong>
                <span>
                  Admin session active
                </span>
              </div>
            </div>

            <form
              action="/auth/signout"
              method="post"
            >
              <button className="dashboard-signout">
                <LogOut size={16} />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <div className="dashboard-kicker">
                ADMIN / OVERVIEW
              </div>

              <h1>
                Control center
              </h1>

              <p>
                Welcome back,{' '}
                <strong>
                  {user?.email ??
                    'Administrator'}
                </strong>
              </p>
            </div>

            <div className="dashboard-top-actions">
              <div className="dashboard-live-pill">
                <span />
                Live database
              </div>

              <Link
                href="/"
                className="dashboard-open-site"
              >
                Open helper
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </header>

          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon blue">
                <Command size={18} />
              </div>
              <div>
                <span>
                  Total entries
                </span>
                <strong>
                  {totalEntries}
                </strong>
              </div>
              <small>
                Live catalog
              </small>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon purple">
                <BarChart3 size={18} />
              </div>
              <div>
                <span>
                  Categories
                </span>
                <strong>
                  {totalCategories}
                </strong>
              </div>
              <small>
                Across all sections
              </small>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon green">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span>
                  Access
                </span>
                <strong>
                  Admin
                </strong>
              </div>
              <small>
                Authenticated
              </small>
            </article>
          </section>

          <section className="dashboard-section-head">
            <div>
              <div className="dashboard-kicker">
                CONTENT
              </div>

              <h2>
                Manage your data
              </h2>
            </div>

            <span>
              {sections.length} sections
            </span>
          </section>

          <section className="dashboard-cards">
            {sections.map(
              section => {
                const Icon =
                  icons[
                    section.slug
                  ] ?? Terminal

                const count =
                  section.categories.reduce(
                    (total, category) =>
                      total +
                      category.entries.length,
                    0
                  )

                return (
                  <Link
                    key={section.slug}
                    href={`/admin/commands?section=${section.slug}`}
                    className="dashboard-section-card"
                  >
                    <div className="dashboard-section-card-top">
                      <div className="dashboard-section-icon">
                        <Icon size={19} />
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="dashboard-card-arrow"
                      />
                    </div>

                    <div className="dashboard-section-card-body">
                      <div className="dashboard-section-title">
                        {section.name}
                      </div>

                      <div className="dashboard-section-count">
                        {count}
                      </div>

                      <div className="dashboard-section-meta">
                        {section.categories.length}{' '}
                        categories
                      </div>
                    </div>
                  </Link>
                )
              }
            )}
          </section>

          <section className="dashboard-bottom-grid">
            <div className="dashboard-panel">
              <div className="dashboard-panel-head">
                <div>
                  <div className="dashboard-kicker">
                    QUICK ACTIONS
                  </div>

                  <h3>
                    Keep control close
                  </h3>
                </div>
              </div>

              <div className="dashboard-quick-grid">
                {sections
                  .slice(0, 4)
                  .map(section => (
                    <Link
                      key={section.slug}
                      href={`/admin/commands?section=${section.slug}`}
                      className="dashboard-quick-item"
                    >
                      <span>
                        Open {section.name}
                      </span>
                      <ArrowUpRight
                        size={15}
                      />
                    </Link>
                  ))}
              </div>
            </div>

            <div className="dashboard-panel dashboard-panel-accent">
              <div className="dashboard-panel-head">
                <div>
                  <div className="dashboard-kicker">
                    SYSTEM
                  </div>

                  <h3>
                    Everything is connected
                  </h3>
                </div>

                <ShieldCheck
                  size={20}
                />
              </div>

              <p>
                Your admin session is protected
                by Supabase authentication and
                the content is served from the
                live database.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
