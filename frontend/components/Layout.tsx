import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

const NAV_LINKS = [
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/create', label: 'Create quiz' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  return (
    <div className="shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/quizzes" className="brand">
            <span className="brand-mark" aria-hidden="true">
              ?
            </span>
            Quiz Builder
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={active ? 'nav-link active' : 'nav-link'}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
    </div>
  );
}
