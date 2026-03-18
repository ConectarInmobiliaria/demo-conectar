// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-auto">
      <div className="container text-center d-flex flex-column align-items-center">
        <p className="mb-2">© {new Date().getFullYear()} Inmobiliaria Conectar. Todos los derechos reservados.</p>

      </div>
    </footer>
  );
}
