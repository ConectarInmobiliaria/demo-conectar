import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata = {
  title: 'Contacto | Conectar Inmobiliaria',
  description: 'Contáctanos en Conectar Inmobiliaria. Dirección, teléfono y redes sociales.',
};

export default function ContactoPage() {
  const mapSrc =
    'https://maps.google.com/maps?q=Av.%20Padre%20Kolping%20y%20Av.%20Lopez%20y%20Planes%20Posadas%20Misiones%20Argentina&z=15&output=embed';

  return (
    <section className="container py-5">
      <h1 className="mb-4 text-center">Contáctanos</h1>
      <div className="row gy-4">
        {/* Información y mapa */}
        <div className="col-lg-6">
          <h5 className="mb-3">
            <i className="bi bi-geo-alt-fill me-2"></i>Visítanos
          </h5>
          <div className="ratio ratio-16x9 mb-3 rounded">
            <iframe
              src={mapSrc}
              title="Ubicación Conectar Inmobiliaria"
              allowFullScreen
              loading="lazy"
              className="rounded"
            />
          </div>
          <p><i className="bi bi-geo-alt me-2"></i>Av. Padre Kolping y Av. López y Planes, Posadas, Misiones</p>
          <p>
            <i className="bi bi-telephone-fill me-2"></i>
            <a href="tel:+543764617711" className="text-decoration-none">3764 617711</a>
          </p>
          <div className="mt-4">
            <Link href="#" target="_blank" className="me-3" aria-label="YouTube">
              <i className="bi bi-youtube fs-3 text-danger"></i>
            </Link>
            <Link href="https://www.facebook.com/share/1ArTwrAaEZ/" target="_blank" className="me-3" aria-label="Facebook">
              <i className="bi bi-facebook fs-3 text-primary"></i>
            </Link>
            <Link href="https://www.instagram.com/conectarinmobposadas?igsh=MXI0eG1tbzM5ZTZkZA==" target="_blank" aria-label="Instagram">
              <i className="bi bi-instagram fs-3 text-warning"></i>
            </Link>
          </div>
        </div>

        {/* Formulario */}
        <div className="col-lg-6">
          <h5 className="mb-3">
            <i className="bi bi-chat-dots-fill me-2"></i>Escríbenos
          </h5>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
