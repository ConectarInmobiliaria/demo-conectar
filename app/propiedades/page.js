// app/propiedades/page.js
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // opcional: siempre dinámico o ISR

export default async function PropiedadesPage() {
  let propiedades = [];
  try {
    propiedades = await prisma.property.findMany({
      include: { category: true }, // incluir categoría si la necesitas
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Error en PropiedadesPage prisma.property.findMany:', err);
    // Puedes mostrar UI indicando error, o retornar lista vacía:
    propiedades = [];
  }

  return (
    <section className="container py-5">
      <h1 className="mb-4">Propiedades</h1>
      {propiedades.length === 0 ? (
        <p>No hay propiedades para mostrar.</p>
      ) : (
        <div className="row">
          {propiedades.map((prop) => (
            <div key={prop.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {prop.imageUrl ? (
                  <Image
                    src={prop.imageUrl}
                    alt={prop.title}
                    width={400}
                    height={250}
                    className="card-img-top"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{ height: '250px' }}
                  >
                    Sin imagen
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{prop.title}</h5>
                  <p className="card-text text-truncate">{prop.description}</p>
                  <Link href={`/propiedades/${prop.id}`} className="btn btn-outline-primary mt-auto">
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
