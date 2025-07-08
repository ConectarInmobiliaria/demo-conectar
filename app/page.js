// app/page.js
import Image from 'next/image';
import Link from 'next/link';

import HeroClient from '@/components/HeroClient';
import { FadeInClient } from '@/components/Motion/FadeInClient';
import { HoverScaleClient } from '@/components/Motion/HoverScaleClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

import { getSupabaseAdmin } from '@/lib/supabaseClient';

export const revalidate = 0;

export default async function HomePage() {
  const supabase = getSupabaseAdmin();

  // 1️⃣ Obtener categorías con manejo de error + fallback a []
  const { data: categoriesData, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (catError) {
    console.error('Error fetching categories:', catError);
  }
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // 2️⃣ Para cada categoría, obtener hasta 3 propiedades (idem: fallback)
  const catWithProps = await Promise.all(
    categories.map(async (cat) => {
      const { data: propsData, error: propError } = await supabase
        .from('properties')
        .select('id, title, description, imageUrl, createdAt')
        .eq('categoryId', cat.id)
        .order('createdAt', { ascending: false })
        .limit(3);

      if (propError) {
        console.error(`Error fetching properties for category ${cat.id}:`, propError);
      }
      const properties = Array.isArray(propsData) ? propsData : [];
      return { category: cat, properties };
    })
  );

  return (
    <>
      <HeroClient />

      <section className="container py-5">
        <FadeInSectionClient>
          <h2 className="text-center mb-4">Bienvenidos a Inmobiliaria Conectar</h2>
          <p className="text-center mx-auto" style={{ maxWidth: '800px' }}>
            “Más de tres décadas de experiencia en negocios inmobiliarios en el noreste argentino,
            sur de Paraguay y costa de Brasil. Tenemos un know‑how propio sobre tasaciones,
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

      <section className="container py-5">
        {catWithProps.map(({ category, properties }) => (
          <div key={category.id} className="mb-5">
            <FadeInHeadingClient as="h3" className="mb-3">
              {category.name}
            </FadeInHeadingClient>

            {properties.length === 0 ? (
              <p className="text-muted">No hay propiedades disponibles en esta categoría.</p>
            ) : (
              <div className="row">
                {properties.map(prop => (
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

            <div className="text-end">
              <Link
                href={{
                  pathname: '/propiedades',
                  query: { category: category.id },
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
