// components/Hero.js
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const imageUrl = '/slide1.avif';
  return (
    <div className="position-relative overflow-hidden" style={{ height: '500px' }}>
      <Image
        src={imageUrl}
        alt="Portada Inmobiliaria"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <h1 className="text-white display-4 text-center">Encuentra tu hogar ideal</h1>
        <p className="text-white lead text-center mb-4">
          Explora las mejores propiedades adaptadas a tus necesidades y presupuesto.
        </p>
        <Link href="/contacto" className="btn btn-primary btn-lg">
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
