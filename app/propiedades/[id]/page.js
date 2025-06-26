// app/propiedades/[id]/page.js
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import PropertyInquiryForm from '@/components/PropertyInquiryForm';

export const dynamic = 'force-dynamic'; // Forzar siempre dinámico, por datos en BD

export default async function PropiedadPage({ params }) {
  // Esperar params antes de usarlo:
  const { id } = await params; 
  const propId = parseInt(id, 10);
  let prop = null;
  try {
    prop = await prisma.property.findUnique({
      where: { id: propId },
      include: { category: true, creator: true },
    });
  } catch (err) {
    console.error('Error en PropiedadPage prisma.property.findUnique:', err);
  }
  if (!prop) {
    return (
      <section className="container py-5">
        <p>Propiedad no encontrada.</p>
      </section>
    );
  }
  return (
    <section className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          {prop.imageUrl ? (
            <Image
              src={prop.imageUrl}
              alt={prop.title}
              width={800}
              height={500}
              className="img-fluid rounded mb-4"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="bg-secondary text-white d-flex align-items-center justify-content-center rounded mb-4"
              style={{ height: '500px' }}
            >
              Sin imagen
            </div>
          )}
          <h2>{prop.title}</h2>
          <p>{prop.description}</p>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <strong>Precio:</strong> ${prop.price}
            </li>
            <li className="list-group-item">
              <strong>Ubicación:</strong> {prop.location}
            </li>
            {prop.category && (
              <li className="list-group-item">
                <strong>Categoría:</strong> {prop.category.name}
              </li>
            )}
            <li className="list-group-item">
              <strong>Publicado:</strong>{' '}
              {new Date(prop.createdAt).toLocaleDateString()}
            </li>
          </ul>
        </div>
        <div className="col-lg-4">
          <h5>Contactar al agente</h5>
          {/* Asegúrate de que PropertyInquiryForm sea un componente cliente si usa useState, fetch en cliente, etc. */}
          <PropertyInquiryForm propertyId={propId} />
        </div>
      </div>
    </section>
  );
}
