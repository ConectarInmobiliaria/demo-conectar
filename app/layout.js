// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';         // CSS de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';     // Bootstrap Icons
import './globals.css';                                // Tus estilos globales
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import BootstrapClient from '@/components/BootstrapClient';
import { NextAuthProvider } from './providers/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Opcional: override de variables Bootstrap */}
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
          <main className="flex-fill">{children}</main>
          <Footer />
          <ChatbotWidget />
          <BootstrapClient />
        </NextAuthProvider>
      </body>
    </html>
  );
}
