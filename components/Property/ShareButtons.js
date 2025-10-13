'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ShareButtons({ title, price, currency = 'ARS', url }) {
  const [copied, setCopied] = useState(false);

  // --- Formateo del precio ---
  const formattedPrice =
    typeof price === 'number'
      ? price.toLocaleString('es-AR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : price;

  const prefix = currency === 'USD' ? 'US$' : 'AR$';
  const displayPrice = price === 0 ? 'Consultar' : `${prefix} ${formattedPrice}`;

  // --- Mensaje de WhatsApp ---
  const message = `Hola, me interesa "${title}" (${displayPrice}). Acá el link: ${url}`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

  // --- Copiar al portapapeles ---
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('No se pudo copiar el enlace 😞');
    }
  };

  return (
    <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
      {/* WhatsApp */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success d-flex align-items-center gap-2 px-3 py-2"
        title="Compartir por WhatsApp"
      >
        <i className="bi bi-whatsapp fs-5"></i>
        <span>WhatsApp</span>
      </a>

      {/* Copiar enlace */}
      <button
        type="button"
        onClick={handleCopy}
        className={`btn ${
          copied ? 'btn-primary' : 'btn-outline-secondary'
        } d-flex align-items-center gap-2 px-3 py-2`}
        title="Copiar enlace"
      >
        <i className={`bi ${copied ? 'bi-check-circle' : 'bi-link-45deg'} fs-5`} />
        <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
      </button>

      {/* Facebook (opcional) */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2"
        title="Compartir en Facebook"
      >
        <i className="bi bi-facebook fs-5"></i>
        <span>Facebook</span>
      </a>
    </div>
  );
}
