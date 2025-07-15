// app/servicios/page.js
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import Link from 'next/link';

export const metadata = {
  title: 'Servicios | Conectar Inmobiliaria',
  description: 'Conoce los servicios de Conectar Inmobiliaria: venta, alquiler, tasaciones, asesoría legal y más.',
};

export default function ServiciosPage() {
  const servicios = [
    'Venta de inmuebles (casas, departamentos, terrenos, locales comerciales)',
    'Alquileres particulares y corporativos',
    'Tasaciones y avalúos realistas y basados en datos actuales',
    'Asesoría legal y documental: revisión de contratos, verificación de títulos, guías para escrituraciones y trámites ante organismos',
    'Proyectos y desarrollos: acompañamiento a inversores y desarrolladores en el análisis de viabilidad, búsqueda de socios o financiamiento, y comercialización de unidades',
    'Marketing Inmobiliario: difusión estratégica de propiedades en portales, redes y canales locales para maximizar alcance',
  ];

  const razones = [
    'Experiencia local + enfoque renovado: aprovechamos la trayectoria acumulada combinada con metodologías actuales de atención y marketing digital',
    'Red de contactos sólida: relaciones con propietarios, inversores, constructores y entidades financieras en la región',
    'Comunicación fluida: respuestas ágiles y seguimiento continuo con actualizaciones periódicas sobre avances y propuestas',
    'Ética profesional: priorizamos el respeto, la confidencialidad y la honestidad en cada interacción',
  ];

  return (
    <div className="container py-5">
      <FadeInHeadingClient as="h1" className="mb-4 text-primary">
        Nuestros Servicios
      </FadeInHeadingClient>

      <FadeInSectionClient>
        <div className="row g-4 mb-5">
          {servicios.map((texto, i) => (
            <div key={i} className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <p className="card-text">{texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeInSectionClient>

      <FadeInHeadingClient as="h2" className="mb-4 text-secondary">
        ¿Por qué elegir Conectar Inmobiliaria?
      </FadeInHeadingClient>

      <FadeInSectionClient>
        <ul className="list-group list-group-flush mb-5">
          {razones.map((texto, i) => (
            <li key={i} className="list-group-item">
              {texto}
            </li>
          ))}
        </ul>
      </FadeInSectionClient>

      <div className="text-center">
        <Link href="/contacto" className="btn btn-primary btn-lg">
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
