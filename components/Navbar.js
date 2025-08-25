// components/Navbar.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const PHONE_MAIN = '3764828008';
const PHONE_ALT = '3764728718';
const EMAIL = 'conectarinmobposadas@gmail.com';
const FACEBOOK_URL = 'https://www.facebook.com/share/1ArTwrAaEZ/';
const INSTAGRAM_URL =
  'https://www.instagram.com/conectarinmobposadas?igsh=MXI0eG1tbzM5ZTZkZA==';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Estado para menú colapsable en móvil
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para dropdown de usuario
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);
  const toggleDropdown = () => setDropdownOpen((p) => !p);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path;
  const startsWith = (path) => pathname.startsWith(path);

  return (
    <header className="border-bottom">
      {/* --- Top Info Bar --- */}
      <div className="bg-white">
        <div className="container py-2 d-flex flex-wrap align-items-center gap-3">
          {/* Logo (siempre a la izquierda) */}
           <div><br></br></div>
          <Link
            href="/"
            className="d-flex align-items-center me-auto"
            onClick={closeMenu}
            aria-label="Ir al inicio"
          >
            <Image src="/logo.png" alt="Conectar Inmobiliaria" width={140} height={54} />
          </Link>

          {/* Teléfonos y Email (centrales, se adaptan en mobile) */}
          <div className="d-flex align-items-center flex-wrap gap-3">
            <a
              href={`tel:+54${PHONE_MAIN}`}
              className="text-decoration-none d-inline-flex align-items-center text-body"
            >
              <i className="bi bi-telephone me-2 text-primary"></i>
              <span className="fw-medium">{PHONE_MAIN}</span>
            </a>
            <span className="text-muted">|</span>
            <a
              href={`tel:+54${PHONE_ALT}`}
              className="text-decoration-none d-inline-flex align-items-center text-body"
            >
              <i className="bi bi-telephone me-2 text-primary"></i>
              <span className="fw-medium">{PHONE_ALT}</span>
            </a>
            <span className="text-muted d-none d-md-inline">|</span>
            <a
              href={`mailto:${EMAIL}`}
              className="text-decoration-none d-none d-md-inline-flex align-items-center text-body"
            >
              <i className="bi bi-envelope me-2 text-primary"></i>
              <span className="fw-medium">{EMAIL}</span>
            </a>
          </div>

          {/* Redes (alineadas a la derecha) */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link
              href={FACEBOOK_URL}
              target="_blank"
              className="text-decoration-none"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook fs-4 text-primary"></i>
            </Link>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              className="text-decoration-none"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram fs-4" style={{ color: '#C13584' }}></i>
            </Link>
          </div>
        </div>
        <div><br></br></div>
      </div>
     {/* --- Main Nav Bar --- */}
<nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#ffffff' }}>
  <div className="container">
    {/* Botón hamburguesa */}
    <button
      className="navbar-toggler"
      type="button"
      aria-controls="mainNavbar"
      aria-expanded={menuOpen}
      aria-label="Abrir menú"
      onClick={toggleMenu}
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div
      className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}
      id="mainNavbar"
    >
      {/* Menú principal */}
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0">
        {[
          { href: '/', label: 'Home' },
          { href: '/nosotros', label: 'Nosotros' },
          { href: '/servicios', label: 'Servicios' },
          { href: '/propiedades', label: 'Propiedades', startsWith: true },
          { href: '/contacto', label: 'Contacto' },
        ].map(({ href, label, startsWith: s }) => (
          <li key={href} className="nav-item me-2">
            <Link
              href={href}
              className={`btn ${
                (s ? startsWith(href) : isActive(href))
                  ? 'btn-success text-white fw-semibold'
                  : 'btn-outline-success'
              } px-3`}
              onClick={closeMenu}
              style={{
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Acceder / Usuario */}
      <ul className="navbar-nav mb-2 mb-lg-0">
        {status === 'authenticated' && session ? (
          <li className="nav-item dropdown" ref={dropdownRef}>
            <button
              className="btn btn-success dropdown-toggle px-3"
              type="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
            >
              {session.user.name || 'Mi cuenta'}
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end${
                dropdownOpen ? ' show' : ''
              }`}
              aria-labelledby="userDropdown"
            >
              <li>
                <Link
                  href="/dashboard"
                  className="dropdown-item"
                  onClick={() => {
                    closeMenu();
                    setDropdownOpen(false);
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
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
              className="btn btn-outline-success ms-lg-3"
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


      {/* Separador fino para claridad visual */}
      <div className="border-bottom"></div>
    </header>
  );
}
