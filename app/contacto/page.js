// app/contacto/page.js
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata = {
  title: 'Contacto | Inmobiliaria Marcon',
  description: 'Contáctanos en Inmobiliaria Marcon. Dirección, teléfono y redes sociales.',
};

export default function ContactoPage() {
  // URL de embed de Google Maps centrado en San Luis 1663, Posadas
  const mapSrc =
    'https://maps.google.com/maps?q=San%20Luis%201663%20Posadas%20Misiones%20Argentina&z=15&output=embed';

  return (
    <section className="container py-5">
      <h1 className="mb-4 text-center">Contáctanos</h1>
      <div className="row gy-4">
        {/* Columna de información y mapa */}
        <div className="col-lg-6">
          <h5>Visítanos</h5>
          <div className="ratio ratio-16x9 mb-3">
            <iframe
              src={mapSrc}
              title="Ubicación Inmobiliaria Marcon"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p>
            <strong>Dirección:</strong> San Luis 1663, N3300 Posadas, Misiones, Argentina
          </p>
          <p>
            <strong>Teléfono:</strong>{' '}
            <a href="tel:03764424071">0376 442-4071</a>
          </p>
          <p>
            <strong>Redes Sociales:</strong>
          </p>
          <p>
            <a
              href="https://www.youtube.com/channel/UCHwQO6YQq9iJJGsxbrj2KjQ"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 text-decoration-none"
              aria-label="YouTube"
            >
              <i className="bi bi-youtube fs-4 text-danger"></i>
            </a>
            <a
              href="https://www.facebook.com/inmobiliariamarcon"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 text-decoration-none"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook fs-4 text-primary"></i>
            </a>
            <a
              href="https://www.instagram.com/inmobiliariamarcon/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram fs-4 text-warning"></i>
            </a>
          </p>
        </div>
        {/* Columna de formulario */}
        <div className="col-lg-6">
          <h5>Envíanos un mensaje</h5>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
