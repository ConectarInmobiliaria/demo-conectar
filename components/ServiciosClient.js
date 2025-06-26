// components/ServiciosClient.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Array de servicios. Ajusta backgroundImage según nombres de archivos en public/services/
const servicios = [
  {
    key: 'tasaciones',
    title: 'Tasaciones',
    description:
      'Realizamos tasaciones precisas basadas en nuestro profundo conocimiento del mercado local.',
    iconClass: 'bi bi-rulers',
    // URL relativa en public/
    backgroundImage: '/services/tasaciones.jpg',
  },
  {
    key: 'ventas',
    title: 'Ventas',
    description:
      'Comercializamos casas, departamentos, dúplex, terrenos, locales y cocheras con estrategia de marketing digital y tradicional.',
    iconClass: 'bi bi-currency-dollar',
    backgroundImage: '/services/ventas.jpg',
  },
  {
    key: 'alquileres',
    title: 'Alquileres y Administración',
    description:
      'Gestionamos contratos de alquiler y administración de propiedades para propietarios e inquilinos, incluyendo mantenimiento y cobros.',
    iconClass: 'bi bi-house-lock',
    backgroundImage: '/services/alquileres.jpg',
  },
  {
    key: 'asesoria-legal',
    title: 'Asesoría Legal',
    description:
      'Contamos con un equipo legal especializado en derecho inmobiliario para asegurar transacciones seguras.',
    iconClass: 'bi bi-briefcase',
    backgroundImage: '/services/asesoria-legal.jpg',
  },
  {
    key: 'gestion-contable',
    title: 'Gestión Contable',
    description:
      'Manejamos todas las obligaciones impositivas y contables para que tu operación esté al día.',
    iconClass: 'bi bi-calculator',
    backgroundImage: '/services/gestion-contable.jpg',
  },
  {
    key: 'busqueda',
    title: 'Búsqueda Personalizada',
    description:
      'Ayudamos a encontrar la propiedad que se ajuste a tus necesidades y presupuesto, con opciones exclusivas.',
    iconClass: 'bi bi-search',
    backgroundImage: '/services/busqueda-personalizada.jpg',
  },
  // ... agrega más servicios si se desea
];

export default function ServiciosClient() {
  return (
    <div>
      {/* Título general de Servicios */}
      <section className="container py-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center"
        >
          Servicios
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mx-auto"
          style={{ maxWidth: '800px' }}
        >
          Ofrecemos servicios integrales: tasación de inmuebles, venta y alquiler, administración de propiedades, asesoría legal inmobiliaria, búsqueda personalizada de vivienda, gestión contable, entre otros.
        </motion.p>
      </section>

      {/* Secciones individuales de cada servicio */}
      {servicios.map((srv, idx) => {
        // Alternar la dirección del texto: par => texto a la izquierda, impar => a la derecha (opcional)
        const isEven = idx % 2 === 0;
        return (
          <section
            key={srv.key}
            className="position-relative text-white"
            style={{
              // altura mínima para la sección hero
              minHeight: '60vh',
              backgroundImage: `url(${srv.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay oscuro para contraste */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

            {/* Contenido: usamos container para centrar y padding */}
            <div className="position-relative container h-100 d-flex align-items-center">
              <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`row w-100 gy-3`}
              >
                {/* Para controlar alineación: en pantallas md+, texto ocupa 6 columnas y se alinea left/right */}
                {isEven ? (
                  <>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <i className={`${srv.iconClass} fs-1 me-3 text-primary`}></i>
                        <h2 className="mb-0">{srv.title}</h2>
                      </div>
                      <p>{srv.description}</p>
                    </div>
                    <div className="col-md-6 d-none d-md-block">
                      {/* Imagen decorativa adicional; por simplicidad, la misma background se usa de fondo */}
                      {/* Podrías incluir aquí un <Image> pequeño o icono extra */}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-6 d-none d-md-block">
                      {/* Lado vacío para espacio */}
                    </div>
                    <div className="col-md-6 text-md-end">
                      <div className="d-flex align-items-center justify-content-md-end mb-3">
                        <h2 className="mb-0">{srv.title}</h2>
                        <i className={`${srv.iconClass} fs-1 ms-3 text-primary`}></i>
                      </div>
                      <p className="text-md-end">{srv.description}</p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
