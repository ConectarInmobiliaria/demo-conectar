// app/page.js
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

export const dynamic = 'force-dynamic';

// Color institucional
const verdeInstitucional = '#28a745';

export default async function HomePage() {
  return (
    <main className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <FadeInSectionClient>
        <div className="card shadow-lg border-0 rounded-4 p-5 text-center bg-light">
          <FadeInHeadingClient as="h1" className="fw-bold mb-3 text-danger">
            Acceso restringido
          </FadeInHeadingClient>

          <p className="lead text-muted mb-4">
            Este sitio está temporalmente bloqueado.
          </p>

          <p className="fw-semibold text-dark mb-4">
            Debe <span style={{ color: verdeInstitucional }}>contactarse con el administrador</span> y <br />
            <span className="text-danger">regularizar su deuda</span> para poder acceder nuevamente.
          </p>

          <div className="border-top pt-3 mt-3 small text-muted">
            © {new Date().getFullYear()} Conectar Inmobiliaria
          </div>
        </div>
      </FadeInSectionClient>
    </main>
  );
}
