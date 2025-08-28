'use client';

import Link from 'next/link';

export default function ShareButtons({ title, price, currency, url }) {
  const amount = typeof price === 'number' ? price.toLocaleString() : price;
  const prefix = currency === 'USD' ? 'US$' : 'AR$';
  const message = `Hola, me interesa "${title}" (${prefix} ${amount}). Acá el link: ${url}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="d-flex flex-wrap gap-2">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success"
      >
        <i className="bi bi-whatsapp me-2" />
        Compartir por WhatsApp
      </a>

      <button
        className="btn btn-outline-secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            alert('Enlace copiado ✅');
          } catch {
            alert('No se pudo copiar el enlace');
          }
        }}
      >
        <i className="bi bi-link-45deg me-2" />
        Copiar enlace
      </button>
    </div>
  );
}
