// app/nosotros/page.js
import Image from 'next/image';
import { Suspense } from 'react';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

export const metadata = {
  title: 'Nosotros | Inmobiliaria Marcon',
  description: 'Conoce Inmobiliaria Marcon: misión, visión, legal, contable y presentación de Mirta Marcon.',
};

export default function NosotrosPage() {
  return (
    <div className="d-flex flex-column">

      {/* Hero + Descripción */}
      <section
        className="position-relative text-white"
        style={{
          minHeight: '60vh',
          backgroundImage: "url('/nosotros-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(49,49,49,0.6)' }}
        />
        <div className="position-relative container h-100 d-flex flex-column justify-content-center text-center px-3">
          <Suspense fallback={null}>
            <FadeInSectionClient>
              <p
                className="lead mx-auto"
                style={{ maxWidth: '800px', fontSize: '1.25rem', lineHeight: 1.6 }}
              >
                En Inmobiliaria Marcon contamos con más de tres décadas de experiencia en negocios
                inmobiliarios en el noreste argentino, sur de Paraguay y costa de Brasil. Nuestro
                know‑how abarca tasaciones, comercialización de alquileres y administración de
                propiedades en Posadas y principales ciudades de Misiones.
              </p>
            </FadeInSectionClient>
          </Suspense>
        </div>
      </section>

      {/* Sección Misión */}
      <section className="container py-5">
        <div className="text-center mb-5 position-relative d-inline-block">
          <FadeInHeadingClient
            as="h2"
            className="fw-bold"
            style={{
              fontSize: '2.5rem',
              color: '#3B0747',
            }}
          >
            Misión
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-0.5rem',
                height: '4px',
                width: '100%',
                backgroundColor: '#6A3BA0',
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          </FadeInHeadingClient>
        </div>
        <Suspense fallback={null}>
          <FadeInSectionClient>
            <div className="row gy-4 align-items-center">
              <div className="col-lg-7">
                <p className="mb-4 lead">
                  Nuestra misión es transformar tu experiencia de compra, venta o alquiler en un proceso
                  fácil y rentable. Queremos que, a lo largo de toda la operación, disfrutes del camino hacia
                  tu nuevo hogar o inversión.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Asesoramiento personalizado
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Transparencia en cada paso
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Atención post‑venta y seguimiento
                  </li>
                </ul>
              </div>
              <div className="col-lg-5 text-center">
                <Image
                  src="/mision-bg.webp"
                  alt="Nuestra Misión"
                  width={600}
                  height={400}
                  className="img-fluid rounded shadow"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </FadeInSectionClient>
        </Suspense>
      </section>

      {/* Sección Visión */}
      <section className="container py-5">
        <div className="text-center mb-5 position-relative d-inline-block">
          <FadeInHeadingClient
            as="h2"
            className="fw-bold"
            style={{
              fontSize: '2.5rem',
              color: '#3B0747',
            }}
          >
            Visión
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-0.5rem',
                height: '4px',
                width: '100%',
                backgroundColor: '#6A3BA0',
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          </FadeInHeadingClient>
        </div>
        <Suspense fallback={null}>
          <FadeInSectionClient>
            <div className="row gy-4 align-items-center">
              <div className="col-lg-5">
                <Image
                  src="/vision.jpg"
                  alt="Visión Inmobiliaria Marcon"
                  width={600}
                  height={400}
                  className="img-fluid rounded shadow"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-7">
                <p className="mb-4">
                  Aspiramos a ser la inmobiliaria de referencia en la región, reconocida por nuestra calidad
                  de servicio, integridad y compromiso con la comunidad. Buscamos innovar continuamente para
                  ofrecer soluciones tecnológicas y personalizadas que superen las expectativas de nuestros clientes.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Liderazgo en atención al cliente
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Innovación en procesos digitales
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Compromiso con la comunidad y el medio ambiente
                  </li>
                </ul>
              </div>
            </div>
          </FadeInSectionClient>
        </Suspense>
      </section>

      {/* Sección Legal */}
      <section className="container py-5">
        <div className="text-center mb-5 position-relative d-inline-block">
          <FadeInHeadingClient
            as="h2"
            className="fw-bold"
            style={{
              fontSize: '2.5rem',
              color: '#3B0747',
            }}
          >
            Legal
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-0.5rem',
                height: '4px',
                width: '100%',
                backgroundColor: '#6A3BA0',
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          </FadeInHeadingClient>
        </div>
        <Suspense fallback={null}>
          <FadeInSectionClient delay={0.2}>
            <div className="row gy-4 align-items-center flex-md-row-reverse">
              <div className="col-lg-5 text-center">
                <Image
                  src="/legal-bg.jpg"
                  alt="Departamento Legal"
                  width={600}
                  height={400}
                  className="img-fluid rounded shadow"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-7">
                <p className="mb-4 lead">
                  En nuestra empresa, valoramos tu tranquilidad. Contamos con un departamento legal especializado
                  que te brindará asistencia en cada paso del proceso inmobiliario, asegurando que estés respaldado en todo momento.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Contratos claros y seguros
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Asesoramiento en cumplimiento normativo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Protección de tus intereses
                  </li>
                </ul>
              </div>
            </div>
          </FadeInSectionClient>
        </Suspense>
      </section>

      {/* Sección Contable */}
      <section className="container py-5">
        <div className="text-center mb-5 position-relative d-inline-block">
          <FadeInHeadingClient
            as="h2"
            className="fw-bold"
            style={{
              fontSize: '2.5rem',
              color: '#3B0747',
            }}
          >
            Contable
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-0.5rem',
                height: '4px',
                width: '100%',
                backgroundColor: '#6A3BA0',
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          </FadeInHeadingClient>
        </div>
        <Suspense fallback={null}>
          <FadeInSectionClient delay={0.4}>
            <div className="row gy-4 align-items-center">
              <div className="col-lg-5 order-lg-last text-center">
                <Image
                  src="/contable.jpg"
                  alt="Servicio Contable"
                  width={600}
                  height={400}
                  className="img-fluid rounded shadow"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-7 order-lg-first">
                <p className="mb-4 lead">
                  La gestión adecuada de las obligaciones impositivas es esencial en cualquier transacción económica.
                  Con nuestra experiencia en el ámbito contable, nos encargamos de que estés al día, permitiéndote centrarte
                  solo en realizar un buen negocio.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Declaraciones tributarias precisas
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Optimización de cargas impositivas
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-secondary me-2"></i>
                    Reportes financieros claros
                  </li>
                </ul>
              </div>
            </div>
          </FadeInSectionClient>
        </Suspense>
      </section>

      {/* Presentación de Mirta Marcon */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <FadeInHeadingClient
            as="h2"
            className="fw-bold"
            style={{
              fontSize: '2.5rem',
              color: '#3B0747',
            }}
          >
            Arquitecta Mirta Marcon
            <span
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-0.5rem',
                transform: 'translateX(-50%)',
                height: '4px',
                width: '120px',
                backgroundColor: '#6A3BA0',
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          </FadeInHeadingClient>
        </div>
        <Suspense fallback={null}>
          <FadeInSectionClient delay={0.6}>
            <div className="row align-items-center gx-4">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <Image
                  src="/mirta.png"
                  alt="Mirta Marcon"
                  width={300}
                  height={300}
                  className="rounded-circle img-fluid shadow perfil-mirta"
                />
              </div>
              <div className="col-md-8">
                <p className="lead">
                  Con una sólida formación en arquitectura, Mirta Marcon ha forjado su carrera en el vibrante mundo inmobiliario,
                  acompañando a su padre desde muy temprana edad, en un entorno donde los remates de ganado, los campos y las tasaciones
                  son parte de su historia. Desde su llegada a tierras misioneras en 1984, Mirta ha estado comprometida con la misión de ayudar
                  a las personas a encontrar las mejores opciones de compra y venta de inmuebles. Su pasión por el sector y su experiencia única
                  le permiten ofrecer un servicio excepcional, garantizando que cada cliente reciba la atención y asesoramiento que necesita para
                  tomar decisiones informadas.
                </p>
              </div>
            </div>
          </FadeInSectionClient>
        </Suspense>
      </section>
    </div>
  );
}
