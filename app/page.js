import Image from 'next/image';
import Link from 'next/link';
import HeroClient from '@/components/HeroClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { HoverScaleClient } from '@/components/Motion/HoverScaleClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 🎨 Color institucional
const verdeInstitucional = '#28a745';

// ✅ SEO Metadata
export const metadata = {
  title: 'Conectar Inmobiliaria | Compra, Venta y Alquiler de Propiedades en Posadas',
  description: 'Encontrá tu hogar ideal en Posadas, Misiones. Casas, departamentos, terrenos y locales comerciales en venta y alquiler. Asesoramiento profesional y tasaciones gratuitas.',
  keywords: [
    'inmobiliaria Posadas',
    'propiedades en venta Posadas',
    'alquiler Posadas',
    'casas en venta Posadas',
    'departamentos Posadas',
    'terrenos Posadas',
    'inmuebles Misiones',
    'Conectar Inmobiliaria',
    'comprar casa Posadas',
    'alquilar departamento Posadas',
  ],
  authors: [{ name: 'Conectar Inmobiliaria' }],
  creator: 'Conectar Inmobiliaria',
  publisher: 'Conectar Inmobiliaria',
  openGraph: {
    title: 'Conectar Inmobiliaria | Tu Hogar en Posadas',
    description: 'Propiedades en venta y alquiler en Posadas, Misiones. Encontrá casas, departamentos y terrenos con asesoramiento profesional.',
    url: 'https://inmobiliariamarcon.com.ar',
    siteName: 'Conectar Inmobiliaria',
    images: [
      {
        url: 'https://inmobiliariamarcon.com.ar/logo.png',
        width: 1200,
        height: 630,
        alt: 'Conectar Inmobiliaria Posadas',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conectar Inmobiliaria | Propiedades en Posadas',
    description: 'Encontrá tu hogar ideal en Posadas. Casas, departamentos y terrenos en venta y alquiler.',
    images: ['https://inmobiliariamarcon.com.ar/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://inmobiliariamarcon.com.ar',
  },
  verification: {
    // Agrega aquí tu código de verificación de Google Search Console cuando lo tengas
    // google: 'tu-codigo-de-verificacion',
  },
};

// 🔹 Función de formateo robusta
function formatCurrency(price, currency) {
  if (!price || price <= 0) return 'Consultar';
  const prefix = currency === 'USD' ? 'U$D' : 'AR$';
  const formatted = Number(price).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${prefix} ${formatted}`;
}

export default async function HomePage() {
  let categories = [];

  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (e) {
    console.error('Error fetching categories:', e);
  }

  // 🔹 Obtener propiedades en ALQUILER (3)
  const rentProperties = await prisma.property.findMany({
    where: {
      published: true,
      categoryId: {
        in: categories
          .filter((cat) => cat.name.toLowerCase().includes('alquiler'))
          .map((cat) => cat.id),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // 🔹 Obtener propiedades en VENTA (3)
  const saleProperties = await prisma.property.findMany({
    where: {
      published: true,
      categoryId: {
        in: categories
          .filter((cat) => cat.name.toLowerCase().includes('venta'))
          .map((cat) => cat.id),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <>
      {/* 📊 JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Conectar Inmobiliaria',
            image: 'https://inmobiliariamarcon.com.ar/logo.png',
            '@id': 'https://inmobiliariamarcon.com.ar',
            url: 'https://inmobiliariamarcon.com.ar',
            telephone: '+54-3764-728718',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Posadas',
              addressRegion: 'Misiones',
              addressCountry: 'AR',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: -27.3671,
              longitude: -55.8961,
            },
            sameAs: [
              'https://www.facebook.com/conectarinmobiliariaposadas',
              'https://www.instagram.com/conectarinmobiliaria',
            ],
            priceRange: '$$',
            areaServed: {
              '@type': 'City',
              name: 'Posadas',
            },
          }),
        }}
      />

      <HeroClient />

      {/* 🏠 Sección 1: Tu hogar te espera */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center">
            <h1 className="fw-bold mb-3 text-dark h2">
              Tu hogar te espera en Posadas
            </h1>
            <p className="lead text-muted">
              Te ayudamos a encontrar la propiedad ideal, ya sea para comprar o
              alquilar. Descubrí casas, departamentos y terrenos en Posadas y
              toda la región de Misiones con asesoramiento profesional.
            </p>
          </div>
        </FadeInSectionClient>
      </section>

      {/* 🏘️ Sección 2: PROPIEDADES EN ALQUILER */}
      <section className="container py-5">
        <FadeInHeadingClient
          as="h2"
          className="mb-4 fw-bold text-dark border-start ps-3 border-success h3"
        >
          Propiedades en Alquiler
        </FadeInHeadingClient>

        {rentProperties.length === 0 ? (
          <p className="text-muted">
            No hay propiedades en alquiler disponibles en este momento.
          </p>
        ) : (
          <>
            <div className="row">
              {rentProperties.map((prop) => (
                <div key={prop.id} className="col-md-4 mb-4">
                  <HoverScaleClient className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    {/* 🖼 Imagen */}
                    {prop.imageUrl ? (
                      <div style={{ position: 'relative', height: '220px' }}>
                        <Image
                          src={prop.imageUrl}
                          alt={`${prop.title} - Alquiler en Posadas`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="rounded-top"
                        />
                      </div>
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-top"
                        style={{ height: '220px' }}
                      >
                        <i className="bi bi-house-door fs-1"></i>
                      </div>
                    )}

                    {/* 📋 Contenido */}
                    <div className="card-body d-flex flex-column">
                      <h3 className="card-title fw-semibold text-dark h6 mb-2">
                        {prop.title || 'Propiedad sin título'}
                      </h3>

                      {/* Descripción truncada */}
                      <p
                        className="card-text text-muted small mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {prop.description || 'Sin descripción disponible.'}
                      </p>

                      {/* 💰 Precio y detalles */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: verdeInstitucional }}
                        >
                          {formatCurrency(prop.price, prop.currency)}
                        </span>
                        <span className="text-muted small">
                          {prop.bedrooms > 0 && (
                            <>
                              <i className="bi bi-door-closed"></i> {prop.bedrooms}
                            </>
                          )}
                          {prop.bedrooms > 0 && prop.bathrooms > 0 && ' | '}
                          {prop.bathrooms > 0 && (
                            <>
                              <i className="bi bi-droplet"></i> {prop.bathrooms}
                            </>
                          )}
                        </span>
                      </div>

                      {/* 🔗 Botón CTA */}
                      <div className="mt-auto">
                        <Link
                          href={`/propiedades/${prop.id}`}
                          className="btn btn-sm w-100 btn-success"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </HoverScaleClient>
                </div>
              ))}
            </div>

            {/* 🔗 Enlace a más propiedades en alquiler */}
            <div className="text-end mt-3">
              <Link
                href="/propiedades?tipo=alquiler"
                className="btn btn-outline-success"
              >
                Ver más propiedades en alquiler
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 🏘️ Sección 3: PROPIEDADES EN VENTA */}
      <section className="container py-5 bg-light rounded-3">
        <FadeInHeadingClient
          as="h2"
          className="mb-4 fw-bold text-dark border-start ps-3 border-success h3"
        >
          Propiedades en Venta
        </FadeInHeadingClient>

        {saleProperties.length === 0 ? (
          <p className="text-muted">
            No hay propiedades en venta disponibles en este momento.
          </p>
        ) : (
          <>
            <div className="row">
              {saleProperties.map((prop) => (
                <div key={prop.id} className="col-md-4 mb-4">
                  <HoverScaleClient className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    {/* 🖼 Imagen */}
                    {prop.imageUrl ? (
                      <div style={{ position: 'relative', height: '220px' }}>
                        <Image
                          src={prop.imageUrl}
                          alt={`${prop.title} - Venta en Posadas`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="rounded-top"
                        />
                      </div>
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-top"
                        style={{ height: '220px' }}
                      >
                        <i className="bi bi-house-door fs-1"></i>
                      </div>
                    )}

                    {/* 📋 Contenido */}
                    <div className="card-body d-flex flex-column">
                      <h3 className="card-title fw-semibold text-dark h6 mb-2">
                        {prop.title || 'Propiedad sin título'}
                      </h3>

                      {/* Descripción truncada */}
                      <p
                        className="card-text text-muted small mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {prop.description || 'Sin descripción disponible.'}
                      </p>

                      {/* 💰 Precio y detalles */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: verdeInstitucional }}
                        >
                          {formatCurrency(prop.price, prop.currency)}
                        </span>
                        <span className="text-muted small">
                          {prop.bedrooms > 0 && (
                            <>
                              <i className="bi bi-door-closed"></i> {prop.bedrooms}
                            </>
                          )}
                          {prop.bedrooms > 0 && prop.bathrooms > 0 && ' | '}
                          {prop.bathrooms > 0 && (
                            <>
                              <i className="bi bi-droplet"></i> {prop.bathrooms}
                            </>
                          )}
                        </span>
                      </div>

                      {/* 🔗 Botón CTA */}
                      <div className="mt-auto">
                        <Link
                          href={`/propiedades/${prop.id}`}
                          className="btn btn-sm w-100 btn-success"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </HoverScaleClient>
                </div>
              ))}
            </div>

            {/* 🔗 Enlace a más propiedades en venta */}
            <div className="text-end mt-3">
              <Link
                href="/propiedades?tipo=venta"
                className="btn btn-outline-success"
              >
                Ver más propiedades en venta
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 🏢 Sección 4: Administra tu propiedad */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center bg-light">
            <h2 className="fw-bold mb-3 text-dark h3">
              Administrá tu propiedad con nosotros
            </h2>
            <p className="lead text-muted mb-4">
              Si querés vender o alquilar tu inmueble, contá con nuestro equipo.
              Tu propiedad tendrá la mejor visibilidad y atención personalizada
              en toda la región de Posadas.
            </p>
            <Link
              href="/contacto"
              className="btn btn-lg px-4 btn-success"
            >
              Publicar propiedad
            </Link>
          </div>
        </FadeInSectionClient>
      </section>

      {/* 🎥 Sección 5: Video Institucional */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
            <div className="card-body p-0">
              <div className="bg-success text-white p-4 text-center">
                <h2 className="fw-bold mb-2 h4">Conocé Conectar Inmobiliaria</h2>
                <p className="mb-0">
                  Nuestro compromiso es ayudarte a encontrar tu lugar ideal
                </p>
              </div>
              <div className="ratio ratio-16x9" style={{ backgroundColor: '#000' }}>
                <video
                  controls
                  preload="metadata"
                  className="w-100 h-100"
                  poster="/slides/slide1.jpg"
                  style={{ objectFit: 'contain' }}
                >
                  <source src="/pao-navidad_subtitulado.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
        </FadeInSectionClient>
      </section>

      {/* 🏆 Sección 6: Certificaciones y Miembros */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark h4 mb-2">
              Somos parte de:
            </h2>
            <p className="text-muted">
              Respaldados por las principales organizaciones inmobiliarias de Argentina
            </p>
          </div>

          <div className="row justify-content-center align-items-center g-4">
            {/* Federación Inmobiliaria de la República Argentina */}
            <div className="col-md-5">
              <div className="card border-0 shadow-sm p-4 text-center h-100">
                <div style={{ position: 'relative', height: '150px', marginBottom: '1rem' }}>
                  <Image
                    src="/equipo/federacion-inmobiliaria.png"
                    alt="Federación Inmobiliaria de la República Argentina"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 className="h6 fw-semibold text-dark mb-2">
                  Federación Inmobiliaria de la República Argentina
                </h3>
                <p className="small text-muted mb-0">
                  Entidad que agrupa a las principales instituciones inmobiliarias del país
                </p>
              </div>
            </div>

            {/* CCPIM */}
            <div className="col-md-5">
              <div className="card border-0 shadow-sm p-4 text-center h-100">
                <div style={{ position: 'relative', height: '150px', marginBottom: '1rem' }}>
                  <Image
                    src="/equipo/ccpim-logo.png"
                    alt="Colegio de Corredores Públicos Inmobiliarios de Misiones"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 className="h6 fw-semibold text-dark mb-2">
                  Colegio de Corredores Públicos Inmobiliarios de Misiones
                </h3>
                <p className="small text-muted mb-0">
                  Matrícula profesional habilitante en la provincia de Misiones
                </p>
              </div>
            </div>
          </div>
        </FadeInSectionClient>
      </section>
    </>
  );
}