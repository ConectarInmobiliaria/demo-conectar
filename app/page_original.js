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

  const catWithProps = await Promise.all(
    categories.map(async (cat) => {
      const props = await prisma.property.findMany({
        where: { categoryId: cat.id, published: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });
      return { category: cat, properties: props };
    })
  );

  return (
    <>
      <HeroClient />

      {/* 🏠 Sección 1: Tu hogar te espera */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center">
            <h2 className="fw-bold mb-3 text-dark">Tu hogar te espera</h2>
            <p className="lead text-muted">
              Te ayudamos a encontrar la propiedad ideal, ya sea para comprar o
              alquilar. Descubrí casas, departamentos y terrenos en Posadas y
              toda la región.
            </p>
          </div>
        </FadeInSectionClient>
      </section>

      {/* 🏘️ Sección 2: Propiedades destacadas */}
      <section className="container py-5">
        {catWithProps.map(({ category, properties }) => (
          <div key={category.id} className="mb-5">
            <FadeInHeadingClient
              as="h3"
              className="mb-4 fw-bold text-dark border-start ps-3 border-success"
            >
              {category.name}
            </FadeInHeadingClient>

            {properties.length === 0 ? (
              <p className="text-muted">No hay propiedades disponibles.</p>
            ) : (
              <div className="row">
                {properties.map((prop) => (
                  <div key={prop.id} className="col-md-4 mb-4">
                    <HoverScaleClient className="card h-100 shadow-sm border-0">
                      {/* 🖼 Imagen */}
                      {prop.imageUrl ? (
                        <Image
                          src={prop.imageUrl}
                          alt={prop.title}
                          width={400}
                          height={250}
                          className="card-img-top rounded-top"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-top"
                          style={{ height: '200px' }}
                        >
                          Sin imagen
                        </div>
                      )}

                      {/* 📋 Contenido */}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-semibold text-dark">
                          {prop.title || 'Propiedad sin título'}
                        </h5>

                        {/* Descripción truncada */}
                        <p
                          className="card-text text-muted small"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {prop.description || 'Sin descripción disponible.'}
                        </p>

                        {/* 💰 Precio y detalles */}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span
                            className="fw-bold"
                            style={{ color: verdeInstitucional }}
                          >
                            {formatCurrency(prop.price, prop.currency)}
                          </span>
                          <span className="text-muted small">
                            🛏 {prop.bedrooms ?? 0} &nbsp; | &nbsp; 🚿{' '}
                            {prop.bathrooms ?? 0}
                          </span>
                        </div>

                        {/* 🔗 Botón CTA */}
                        <div className="mt-auto pt-3">
                          <Link
                            href={`/propiedades/${prop.id}`}
                            className="btn btn-sm w-100"
                            style={{
                              backgroundColor: verdeInstitucional,
                              color: 'white',
                            }}
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </HoverScaleClient>
                  </div>
                ))}
              </div>
            )}

            {/* 🔗 Enlace a más propiedades */}
            <div className="text-end mt-3">
              <Link
                href={{ pathname: '/propiedades', query: { category: category.id } }}
                className="btn btn-link text-success fw-semibold"
              >
                Ver más en {category.name} →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 🏢 Sección 3: Administra tu propiedad */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center bg-light">
            <h2 className="fw-bold mb-3 text-dark">
              Administra tu propiedad con nosotros
            </h2>
            <p className="lead text-muted mb-4">
              Si querés vender o alquilar tu inmueble, contá con nuestro equipo.
              Tu propiedad tendrá la mejor visibilidad y atención personalizada.
            </p>
            <Link
              href="/contacto"
              className="btn btn-lg px-4"
              style={{
                backgroundColor: verdeInstitucional,
                color: 'white',
              }}
            >
              Publicar propiedad
            </Link>
          </div>
        </FadeInSectionClient>
      </section>
    </>
  );
}
