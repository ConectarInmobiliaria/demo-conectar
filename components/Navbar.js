// components/Navbar.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Estado para menú colapsable en móvil
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para dropdown de usuario
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Función para alternar menú en móvil
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  // Cerrar menú (por ej. al hacer clic en un enlace)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Alternar dropdown de usuario
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Determinar clases activas
  const isActive = (path) => pathname === path;
  const startsWith = (path) => pathname.startsWith(path);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Marca / Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center" onClick={closeMenu}>
          <Image src="/logo.png" alt="Marcon" width={200} height={80} />
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable */}
        <div
          className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link${isActive('/') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/nosotros"
                className={`nav-link${isActive('/nosotros') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/servicios"
                className={`nav-link${isActive('/servicios') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Servicios
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/propiedades"
                className={`nav-link${startsWith('/propiedades') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Propiedades
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contacto"
                className={`nav-link${isActive('/contacto') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Contacto
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            {status === 'authenticated' && session ? (
              <li className="nav-item dropdown" ref={dropdownRef}>
                {/* Nota: no dependemos de data-bs-toggle, controlamos con React */}
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown();
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  {session.user.name || 'Mi cuenta'}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end${dropdownOpen ? ' show' : ''}`}
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link href="/dashboard" className="dropdown-item" onClick={() => {
                      closeMenu();
                      setDropdownOpen(false);
                    }}>
                      Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        // signOut de next-auth
                        signOut();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  href="/auth/login"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  Acceder
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
