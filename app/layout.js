import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import BootstrapClient from '@/components/BootstrapClient';
import { NextAuthProvider } from './providers/SessionProvider';

// ── Constantes del sitio ───────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmobiliariamarcon.com.ar';
const SITE_NAME = 'Conectar Inmobiliaria';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ── Metadata global (heredada por todas las rutas) ────────────────────────────
// Cada página puede sobreescribir title y description via generateMetadata o
// export const metadata = { ... }. El template garantiza consistencia.
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `Inmobiliaria en Posadas, Misiones | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    'Conectar Inmobiliaria: compra, venta y alquiler de propiedades en Posadas y toda la provincia de Misiones. Casas, departamentos, terrenos y locales comerciales.',

  keywords: [
    'inmobiliaria Posadas',
    'propiedades Misiones',
    'casas en venta Posadas',
    'alquiler Posadas',
    'departamentos Misiones',
    'terrenos Posadas',
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `Inmobiliaria en Posadas, Misiones | ${SITE_NAME}`,
    description:
      'Compra, venta y alquiler de propiedades en Posadas y Misiones. Encontrá tu próxima casa, departamento o terreno.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Inmobiliaria en Posadas, Misiones`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Inmobiliaria en Posadas, Misiones | ${SITE_NAME}`,
    description:
      'Compra, venta y alquiler de propiedades en Posadas y Misiones.',
    images: [DEFAULT_OG_IMAGE],
  },

  alternates: {
    canonical: SITE_URL,
  },

  // Verifica tu sitio en Search Console pegando el código acá:
  // verification: {
  //   google: 'TU_CODIGO_DE_VERIFICACION',
  // },
};

// ── Layout raíz ───────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <style>{`
          :root {
            --bs-primary: #00D86D;
            --bs-secondary: #ECC94B;
          }
        `}</style>
      </head>
      <body className="d-flex flex-column min-vh-100">
        <NextAuthProvider>
          <Navbar />
          {/*
            Nota: el <main> está en cada page.js individual para respetar
            semántica por ruta. Acá envolvemos en un fragmento neutral.
          */}
          <div className="flex-fill">{children}</div>
          <Footer />
          <ChatbotWidget />
          <BootstrapClient />
        </NextAuthProvider>
      </body>
    </html>
  );
}