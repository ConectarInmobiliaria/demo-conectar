import Image from 'next/image';
import Link from 'next/link';

import HeroClient from '@/components/HeroClient';
import { FadeInClient } from '@/components/Motion/FadeInClient';
import { HoverScaleClient } from '@/components/Motion/HoverScaleClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Definimos color institucional (puedes moverlo a globals.css)
const verdeInstitucional = '#28a745';

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
        where: { categoryId: cat.id },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });
      return { category: cat, properties: props };
    })
  );

  return (
    <>
      <HeroClient />

      {/* Sección 1: Tu hogar te espera */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center">
            <h2 className="fw-bold mb-3 text-dark">Tu hogar te espera</h2>
            <p className="lead text-muted">
              Te ayudamos a encontrar la propiedad de tus sueños, ya sea para comprar o alquilar.
              Accedé a una amplia variedad de casas, departamentos y terrenos en Posadas y alrededores,
              así como opciones en provincias cercanas.
            </p>
          </div>
        </FadeInSectionClient>
      </section>

      {/* Sección 2: Propiedades destacadas */}
      <section className="container py-5">
        {catWithProps.map(({ category, properties }) => (
          <div key={category.id} className="mb-5">
            <FadeInHeadingClient as="h3" className="mb-4 fw-bold text-dark">
              {category.name}
            </FadeInHeadingClient>
            {properties.length === 0 ? (
              <p className="text-muted">No hay propiedades.</p>
            ) : (
              <div className="row">
                {properties.map((prop) => (
                  <div key={prop.id} className="col-md-4 mb-4">
                    <HoverScaleClient className="card h-100 shadow-sm border-0">
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
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-semibold text-dark">
                          {prop.title}
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
                          {prop.description}
                        </p>

                        {/* Info rápida */}
                        <div className="d-flex justify-content-between align-items-center mt-2 text-sm">
                          <span
                            className="fw-bold"
                            style={{ color: verdeInstitucional }}
                          >
                            ${prop.price.toLocaleString()}
                          </span>
                          <span className="text-muted">
                            🛏 {prop.bedrooms || 0} &nbsp; | &nbsp; 🚿 {prop.bathrooms || 0}
                          </span>
                        </div>

                        {/* Botón CTA */}
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
            <div className="text-end">
              <Link
                href={{ pathname: '/propiedades', query: { category: category.id } }}
                className="btn btn-link text-dark"
              >
                Ver más en {category.name} →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Sección 3: Administra tu propiedad */}
      <section className="container py-5">
        <FadeInSectionClient>
          <div className="card shadow-lg border-0 rounded-3 p-5 text-center bg-light">
            <h2 className="fw-bold mb-3 text-dark">
              Administra tu propiedad con nosotros
            </h2>
            <p className="lead text-muted">
              ¿Querés vender o alquilar tu inmueble? Confía en nosotros. Tu propiedad tendrá la máxima visibilidad
              y recibirás el acompañamiento de nuestros expertos para asegurar una transacción rápida y exitosa.
            </p>
          </div>
        </FadeInSectionClient>
      </section>
    </>
  );
}
