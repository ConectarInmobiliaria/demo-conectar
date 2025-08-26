// app/servicios/page.js
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import {
  Home,
  Key,
  FileText,
  Building2,
  Users,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Servicios | Conectar Inmobiliaria',
  description:
    'Conectamos tus sueños con el hogar perfecto. Venta, alquiler, tasaciones, asesoría legal y administración de propiedades.',
};

export default function ServiciosPage() {
  const servicios = [
    {
      Icon: Home,
      title: 'Compraventa de Inmuebles',
      desc:
        'Te acompañamos desde la primera visita hasta la firma final. Nos encargamos de la tasación, promoción y negociación de propiedades para garantizar que obtengas el mejor valor.',
    },
    {
      Icon: Key,
      title: 'Alquileres',
      desc:
        'Facilitamos la búsqueda de inquilinos o del hogar ideal. Hacemos análisis de mercado, gestionamos contratos, trámites legales y verificaciones necesarias.',
    },
    {
      Icon: FileText,
      title: 'Asesoramiento Legal y Financiero',
      desc:
        'Te conectamos con profesionales de confianza para asesoría en documentación, hipotecas y trámites notariales —para que tomes decisiones seguras.',
    },
    {
      Icon: Building2,
      title: 'Administración de Propiedades',
      desc:
        'Cobros, mantenimiento, gestión de incidencias y relaciones con inquilinos. Gestionamos tu inmueble como si fuera propio para darte tranquilidad.',
    },
  ];

  const razones = [
    {
      Icon: Users,
      texto: 'Asesoría personalizada: acompañamiento en todo el proceso, desde la búsqueda hasta la firma.',
    },
    {
      Icon: TrendingUp,
      texto: 'Tasación profesional: determinamos el valor real según mercado y tendencias locales.',
    },
    {
      Icon: ClipboardList,
      texto: 'Gestión de visitas y contratos: coordinamos visitas y nos ocupamos del papeleo legal.',
    },
    {
      Icon: ShieldCheck,
      texto: 'Red de confianza: formamos parte de CCPIM y FIRA para acceso a la mayor oferta del mercado.',
    },
  ];

  return (
    <div className="container py-5">
      {/* HERO */}
      <div className="text-center mb-5">
        <FadeInHeadingClient as="h1" className="display-5 fw-bold text-dark mb-3">
          Conectamos tus sueños con el hogar perfecto
        </FadeInHeadingClient>
        <p className="lead text-muted mx-auto" style={{ maxWidth: 900 }}>
          En Conectar Inmobiliaria, no solo vendemos o alquilamos propiedades; creamos puentes entre tus deseos
          y el lugar ideal para vivirlos. Cada búsqueda es única — por eso ofrecemos un servicio personalizado,
          transparente y de alta calidad.
        </p>
      </div>

      {/* SERVICIOS */}
      <FadeInSectionClient>
        <div className="row g-4 mb-5">
          {servicios.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div key={i} className="col-12 col-md-6">
                <article className="card h-100 shadow-sm border-0 rounded-3">
                  <div className="card-body d-flex gap-3">
                    <div
                      className="d-flex align-items-start justify-content-center rounded-3"
                      style={{
                        width: 68,
                        height: 68,
                        backgroundColor: '#eaf7ee', // suave fondo verde claro
                        flexShrink: 0,
                      }}
                      aria-hidden
                    >
                      <Icon size={32} className="text-success" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h5 mb-2 text-dark fw-semibold">{s.title}</h3>
                      <p className="text-muted mb-3" style={{ lineHeight: 1.5 }}>
                        {s.desc}
                      </p>
                      <div>
                        <Link
                          href="/contacto"
                          className="btn btn-outline-success btn-sm"
                          aria-label={`Contactar sobre ${s.title}`}
                        >
                          Consultar
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </FadeInSectionClient>

      {/* WHY CHOOSE US */}
      <div className="my-5">
        <FadeInHeadingClient as="h2" className="h3 text-dark fw-bold text-center mb-3">
          ¿Por qué elegirnos?
        </FadeInHeadingClient>
        <p className="text-center text-muted mb-4" style={{ maxWidth: 900, margin: '0 auto' }}>
          En Conectar simplificamos el complejo mundo inmobiliario: experiencia, ética y pasión para ayudarte a
          comprar, vender o alquilar con confianza.
        </p>

        <FadeInSectionClient>
          <div className="row g-3">
            {razones.map((r, i) => {
              const Icon = r.Icon;
              return (
                <div key={i} className="col-12 col-md-6">
                  <div className="d-flex bg-light rounded-3 p-3 align-items-start gap-3 shadow-sm">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#f1fbf5',
                        flexShrink: 0,
                      }}
                      aria-hidden
                    >
                      <Icon size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="mb-0 text-dark" style={{ fontWeight: 600 }}>
                        {r.texto}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInSectionClient>
      </div>

      {/* ALQUILERES (sección explicativa) */}
      <section className="mb-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-3 p-4 h-100">
              <h3 className="h5 fw-semibold text-dark">Alquiler de propiedades</h3>
              <p className="text-muted mb-3">
                Te ofrecemos un servicio completo para que alquiles tu propiedad sin preocupaciones: tasación justa,
                selección rigurosa de inquilinos, redacción y gestión de contratos y administración continua.
              </p>
              <ul className="list-unstyled text-muted mb-3">
                <li>• Tasación y fijación del precio</li>
                <li>• Selección de inquilinos y verificación</li>
                <li>• Redacción y gestión de contratos</li>
                <li>• Administración y mantenimiento</li>
              </ul>
              <Link href="/contacto" className="btn btn-success">
                Quiero alquilar con Conectar
              </Link>
            </div>
          </div>

          <div className="col-md-6">
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
              {/* Placeholder: podés reemplazar con una imagen representativa */}
              <img
                src="/slides/slide1.jpg"
                alt="Alquileres - Conectar Inmobiliaria"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <div className="text-center py-4">
        <Link href="/contacto" className="btn btn-lg btn-success rounded-pill shadow">
          Contactanos — Empezá tu búsqueda
        </Link>
      </div>
    </div>
  );
}
