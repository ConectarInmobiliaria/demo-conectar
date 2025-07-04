'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

const servicios = [
  {
    key: 'tasaciones',
    title: 'Tasaciones',
    description:
      'Realizamos tasaciones precisas basadas en nuestro profundo conocimiento del mercado local.',
    iconClass: 'bi bi-rulers',
    img: '/tasaciones.jpg',
  },
  {
    key: 'ventas',
    title: 'Ventas',
    description:
      'Comercializamos casas, departamentos, dúplex, terrenos, locales y cocheras con estrategia de marketing digital y tradicional.',
    iconClass: 'bi bi-currency-dollar',
    img: '/ventas.jpg',
  },
  {
    key: 'alquileres',
    title: 'Alquileres y Administración',
    description:
      'Gestionamos contratos de alquiler y administración de propiedades para propietarios e inquilinos, incluyendo mantenimiento y cobros.',
    iconClass: 'bi bi-house-lock',
    img: '/alquileres.jpg',
  },
  {
    key: 'asesoria-legal',
    title: 'Asesoría Legal',
    description:
      'Contamos con un equipo legal especializado en derecho inmobiliario para asegurar transacciones seguras.',
    iconClass: 'bi bi-briefcase',
    img: '/asesoria-legal.jpg',
  },
  {
    key: 'gestion-contable',
    title: 'Gestión Contable',
    description:
      'Manejamos todas las obligaciones impositivas y contables para que tu operación esté al día.',
    iconClass: 'bi bi-calculator',
    img: '/gestion-contable.jpg',
  },
  {
    key: 'busqueda',
    title: 'Búsqueda Personalizada',
    description:
      'Ayudamos a encontrar la propiedad que se ajuste a tus necesidades y presupuesto, con opciones exclusivas.',
    iconClass: 'bi bi-search',
    img: '/busqueda-personalizada.jpg',
  },
];

export default function ServiciosClient() {
  return (
    <div>
      {/* Encabezado General */}
      <section className="container py-5">
        <FadeInHeadingClient
          as="h1"
          className="mb-4 text-center fw-bold"
          style={{ position: 'relative', fontSize: '2.5rem' }}
        >
          Servicios
          <span
            style={{
              display: 'block',
              width: '80px',
              height: '4px',
              background: '#6e4bb7', // lila institucional
              margin: '8px auto 0',
              borderRadius: '2px',
            }}
          />
        </FadeInHeadingClient>
        <FadeInSectionClient>
          <p className="text-center mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Ofrecemos servicios integrales: tasación de inmuebles, venta y alquiler,
            administración de propiedades, asesoría legal, búsqueda personalizada
            y gestión contable.
          </p>
        </FadeInSectionClient>
      </section>

      {/* Secciones individuales */}
      {servicios.map((srv, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section key={srv.key} className="container py-5">
            <FadeInSectionClient delay={0.1 * idx}>
              <div className="row align-items-center gy-4">
                {/* Imagen */}
                <div
                  className={`col-lg-6 ${
                    isEven ? '' : 'order-lg-2'
                  } d-flex justify-content-center`}
                >
                  <Image
                    src={srv.img}
                    alt={srv.title}
                    width={600}
                    height={400}
                    className="img-fluid rounded shadow"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Texto */}
                <div
                  className={`col-lg-6 d-flex flex-column justify-content-center ${
                    isEven ? '' : 'order-lg-1 text-lg-end'
                  }`}
                >
                  <FadeInHeadingClient
                    as="h2"
                    className={`fw-bold mb-3 ${isEven ? 'text-start' : 'text-end'}`}
                    style={{ fontSize: '2rem' }}
                  >
                    {srv.title}
                    <span
                      style={{
                        display: 'block',
                        width: '60px',
                        height: '3px',
                        background: '#6e4bb7',
                        margin: isEven ? '8px 0 0 0' : '8px 0 0 auto',
                        borderRadius: '2px',
                      }}
                    />
                  </FadeInHeadingClient>
                  <p className={`${isEven ? '' : 'text-lg-end'}`} style={{ fontSize: '1.05rem' }}>
                    {srv.description}
                  </p>
                </div>
              </div>
            </FadeInSectionClient>
          </section>
        );
      })}
    </div>
  );
}
