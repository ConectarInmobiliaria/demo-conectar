// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-auto">
      <div className="container text-center d-flex flex-column align-items-center">
        <p className="mb-2">© {new Date().getFullYear()} Inmobiliaria Marcon. Todos los derechos reservados.</p>
        <Link href="#" className="text-white text-decoration-none d-inline-flex align-items-center justify-content-center">
          <span>Desarrollado por: </span>
          <Image src="/firma.png" alt="Firma" width={80} height={25} className="me-2" />
        </Link>
      </div>
    </footer>
  );
}
