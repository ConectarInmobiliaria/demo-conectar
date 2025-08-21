// app/page.js
import Image from 'next/image';
import Link from 'next/link';

import HeroClient from '@/components/HeroClient';
import { FadeInClient } from '@/components/Motion/FadeInClient';
import { HoverScaleClient } from '@/components/Motion/HoverScaleClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let categories = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (e) {
    console.error('Error fetching categories:', e);
  }

  const catWithProps = await Promise.all(
    categories.map(async cat => {
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
      {/* Introducción */}
<section className="container py-5">
  <div className="row align-items-center gy-4">
    <div className="col-lg-6">
      <FadeInSectionClient>
        <h2 className="fw-bold mb-3 text-primary">Tu hogar te espera</h2>
        <p className="lead">
          Te ayudamos a encontrar la propiedad de tus sueños, ya sea para comprar o alquilar.
          En nuestro sitio web, tienes acceso a una amplia variedad de casas, departamentos y terrenos
          en distintos puntos de la ciudad de Posadas y alrededores, así como opciones en provincias aledañas.
        </p>
      </FadeInSectionClient>
    </div>
    <div className="col-lg-6">
      <FadeInSectionClient delay={0.2}>
        <h2 className="fw-bold mb-3 text-primary">Administra tu propiedad con nosotros</h2>
        <p className="lead">
          Si buscas vender o alquilar tu inmueble, confía en nosotros. Te ofrecemos una plataforma
          donde tu propiedad recibirá la máxima visibilidad. Nuestros expertos te guiarán en cada paso
          para asegurar una transacción rápida y exitosa.
        </p>
      </FadeInSectionClient>
    </div>
  </div>
</section>

      {/* Destacados */}
      <section className="container py-5">
        {catWithProps.map(({ category, properties }) => (
          <div key={category.id} className="mb-5">
            <FadeInHeadingClient as="h3" className="mb-3">
              {category.name}
            </FadeInHeadingClient>
            {properties.length === 0 ? (
              <p className="text-muted">No hay propiedades.</p>
            ) : (
              <div className="row">
                {properties.map(prop => (
                  <div key={prop.id} className="col-md-4 mb-4">
                    <HoverScaleClient className="card h-100 shadow-sm">
                      {prop.imageUrl ? (
                        <Image
                          src={prop.imageUrl}
                          alt={prop.title}
                          width={300}
                          height={450}
                          className="card-img-top"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{ height: '200px' }}
                        >
                          Sin imagen
                        </div>
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{prop.title}</h5>
                        <p className="card-text text-truncate">{prop.description}</p>
                        <div className="mt-auto">
                          <Link href={`/propiedades/${prop.id}`} className="btn btn-sm btn-outline-primary">
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
              <Link href={{ pathname: '/propiedades', query: { category: category.id } }} className="btn btn-link">
                Ver más en {category.name} →
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}