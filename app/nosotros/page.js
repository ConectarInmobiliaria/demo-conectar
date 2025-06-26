// app/nosotros/page.js
import Image from 'next/image';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

export const metadata = {
  title: 'Nosotros | Inmobiliaria Marcon',
  description: 'Conoce Inmobiliaria Marcon: misión, legal, contable y presentación de Mirta Marcon.',
};

export default function NosotrosPage() {
  return (
    <div className="d-flex flex-column">
      {/* Hero/banner inicial */}
      <section
        className="position-relative text-white"
        style={{
          minHeight: '50vh',
          backgroundImage: "url('/nosotros-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(49, 49, 49, 0.5)' }}
        />
        <div className="position-relative container h-100 d-flex align-items-center">
          <FadeInHeadingClient
            as="h1"
            className="display-4 text-center w-100"
          >
            Nosotros
          </FadeInHeadingClient>
        </div>
      </section>

      {/* Descripción general */}
      <section className="container py-5">
        <FadeInSectionClient>
          <p className="lead text-center mx-auto" style={{ maxWidth: '800px' }}>
            En Inmobiliaria Marcon contamos con más de tres décadas de experiencia en negocios inmobiliarios
            en el noreste argentino, sur de Paraguay y costa de Brasil. Nuestro know-how abarca tasaciones,
            comercialización de alquileres y administración de propiedades en Posadas y principales ciudades de Misiones.
          </p>
        </FadeInSectionClient>
      </section>

      {/* Sección Misión */}
      <section
        className="position-relative text-white"
        style={{
          backgroundImage: "url('/mision-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        />
        <div className="position-relative container py-5 d-flex align-items-center">
          <FadeInSectionClient>
            <div className="row align-items-center">
              {/* Icono a la izquierda, texto a la derecha en pantallas md+, o centrado en móvil */}
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div className="fs-1 text-primary">
                  <i className="bi bi-bullseye"></i>
                </div>
              </div>
              <div className="col-md-10">
                <FadeInHeadingClient as="h2" className="mb-3">
                  Misión
                </FadeInHeadingClient>
                <p className="lead">
                  Nuestra misión es transformar tu experiencia de compra, venta o alquiler en un proceso fácil y rentable.
                  Queremos que, a lo largo de toda la operación, disfrutes del camino hacia tu nuevo hogar o inversión.
                </p>
              </div>
            </div>
          </FadeInSectionClient>
        </div>
      </section>

      {/* Sección Legal */}
      <section
        className="position-relative text-white"
        style={{
          backgroundImage: "url('/legal-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        />
        <div className="position-relative container py-5 d-flex align-items-center">
          <FadeInSectionClient delay={0.2}>
            <div className="row align-items-center flex-md-row-reverse">
              {/* Icono a la derecha en md+, texto a la izquierda */}
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div className="fs-1 text-success">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
              </div>
              <div className="col-md-10">
                <FadeInHeadingClient as="h2" className="mb-3">
                  Legal
                </FadeInHeadingClient>
                <p className="lead">
                  En nuestra empresa, valoramos tu tranquilidad. Contamos con un departamento legal especializado
                  que te brindará asistencia en cada paso del proceso inmobiliario, asegurando que estés respaldado en todo momento.
                </p>
              </div>
            </div>
          </FadeInSectionClient>
        </div>
      </section>

      {/* Sección Contable */}
      <section
        className="position-relative text-white"
        style={{
          backgroundImage: "url('/contable-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        />
        <div className="position-relative container py-5 d-flex align-items-center">
          <FadeInSectionClient delay={0.4}>
            <div className="row align-items-center">
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div className="fs-1 text-warning">
                  <i className="bi bi-calculator"></i>
                </div>
              </div>
              <div className="col-md-10">
                <FadeInHeadingClient as="h2" className="mb-3">
                  Contable
                </FadeInHeadingClient>
                <p className="lead">
                  La gestión adecuada de las obligaciones impositivas es esencial en cualquier transacción económica.
                  Con nuestra experiencia en el ámbito contable, nos encargamos de que estés al día, permitiéndote centrarte solo en realizar un buen negocio.
                </p>
              </div>
            </div>
          </FadeInSectionClient>
        </div>
      </section>

      {/* Presentación de Mirta Marcon */}
      <section className="container py-5">
        <FadeInHeadingClient as="h2" className="mt-5 mb-4 text-center">
          Arquitecta Mirta Marcon
        </FadeInHeadingClient>
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
      </section>
    </div>
  );
}
