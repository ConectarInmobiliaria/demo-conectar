// app/page.js
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Componentes de animación cliente
import { FadeInClient } from '@/components/Motion/FadeInClient';
import { HoverScaleClient } from '@/components/Motion/HoverScaleClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
// HeroClient muestra ya el slide/hero principal con animaciones:
import HeroClient from '@/components/HeroClient';

export default async function HomePage() {
  // 1. Obtener categorías
  let categories = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error al obtener categorías en HomePage:', e);
  }
  // 2. Para cada categoría, obtener hasta 3 propiedades más recientes
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
      {/* Solo un HeroClient, no repetir sección manual */}
      <HeroClient />

      {/* Sección de introducción con misión / visión */}
      <section className="container py-5">
        <FadeInSectionClient>
          <h2 className="text-center mb-4">Bienvenidos a Inmobiliaria Marcon</h2>
          <p className="text-center mx-auto" style={{ maxWidth: '800px' }}>
            “Más de tres décadas de experiencia en negocios inmobiliarios en el noreste argentino,
            sur de Paraguay y costa de Brasil. Tenemos un know how propio sobre tasaciones,
            comercialización de alquileres y administración de propiedades en Posadas y principales
            ciudades de Misiones. Vendemos casas, departamentos, dúplex, terrenos, locales, depósitos y cocheras.”
          </p>
          <div className="text-center mt-4">
            <Link href="/propiedades" className="btn btn-outline-primary btn-lg">
              Ver todas las Propiedades
            </Link>
          </div>
        </FadeInSectionClient>
      </section>

      {/* Sección: Propiedades destacadas por categoría */}
      <section className="container py-5">
        <FadeInHeadingClient as="h2" className="mb-4">
          Propiedades destacadas por categoría
        </FadeInHeadingClient>

        {catWithProps.map(({ category, properties }) => (
          <div key={category.id} className="mb-5">
            <FadeInHeadingClient as="h3" className="mb-3">
              {category.name}
            </FadeInHeadingClient>
            {properties.length === 0 ? (
              <p className="text-muted">No hay propiedades disponibles en esta categoría.</p>
            ) : (
              <div className="row">
                {properties.map((prop) => (
                  <div key={prop.id} className="col-md-4 mb-4">
                    <HoverScaleClient className="card h-100 shadow-sm">
                      {prop.imageUrl ? (
                        <Image
                          src={prop.imageUrl}
                          alt={prop.title}
                          width={400}
                          height={250}
                          className="card-img-top"
                          style={{ objectFit: 'cover', height: '200px' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary d-flex align-items-center justify-content-center"
                          style={{ height: '200px' }}
                        >
                          <span className="text-white">Sin imagen</span>
                        </div>
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{prop.title}</h5>
                        <p className="card-text text-truncate">{prop.description}</p>
                        <div className="mt-auto">
                          <Link
                            href={`/propiedades/${prop.id}`}
                            className="btn btn-sm btn-outline-primary"
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
            {/* Botón ver más de esta categoría */}
            <div className="text-end">
              <Link
                href={{
                  pathname: '/propiedades',
                  query: { category: category.id }
                }}
                className="btn btn-link"
              >
                Ver más en {category.name} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
