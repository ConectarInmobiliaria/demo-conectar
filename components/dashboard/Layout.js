// components/dashboard/Layout.js
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="bg-light border-end" style={{ width: '240px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5>Dashboard</h5>
        </div>
        <ul className="list-unstyled px-3">
          <li className="mb-2">
            <Link href="/dashboard" className="text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/propiedades" className="text-decoration-none">
              Propiedades
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/categorias" className="text-decoration-none">
              Categorías
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/usuarios" className="text-decoration-none">
              Usuarios
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/dashboard/solicitudes" className="text-decoration-none">
              Solicitudes
            </Link>
          </li>
        </ul>
        <div className="p-3 mt-auto">
          {session && (
            <button
              onClick={() => signOut()}
              className="btn btn-sm btn-outline-danger w-100"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>
      {/* Contenido */}
      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}
