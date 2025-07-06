// components/dashboard/Layout.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItems } from './MenuItems';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="container-fluid p-0">
      {/* Navbar superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link href="/dashboard" className="navbar-brand">
            Dashboard
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dashboardNavbar"
            aria-controls="dashboardNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="dashboardNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {MenuItems.map((item, idx) => {
                const active = pathname === item.href;
                return (
                  <li className="nav-item" key={idx}>
                    <Link
                      href={item.href}
                      className={
                        'nav-link d-flex align-items-center' +
                        (active ? ' active' : '')
                      }
                    >
                      <i className={`${item.icon} me-1`}></i>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container py-4">{children}</main>
    </div>
  );
}
