// app/propiedades/[id]/page.js
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import PropertyFeatures from '@/components/Property/PropertyFeatures';

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const prop = await prisma.property.findUnique({
    where: { id },
    include: { category: true, creator: true },
  });

  if (!prop) {
    return <p className="container py-5">Propiedad no encontrada.</p>;
  }

  const images = [
    ...(prop.imageUrl ? [prop.imageUrl] : []),
    ...(Array.isArray(prop.otherImageUrls) ? prop.otherImageUrls : []),
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const whatsappText = encodeURIComponent(
    `Hola, estoy interesado en "${prop.title}" (ID: ${prop.id}).\n${siteUrl}/propiedades/${prop.id}`
  );
  const whatsappUrl = `https://wa.me/5493764728718?text=${whatsappText}`;

  return (
    <div className="container py-5">
      {/* Título */}
      <FadeInHeadingClient as="h1" className="mb-3 text-primary fw-bold text-center">
        {prop.title}
      </FadeInHeadingClient>

      {/* Galería de imágenes tipo hero */}
      {images.length > 0 && (
        <div className="mb-5">
          <div className="relative w-100 h-[500px] rounded-3 overflow-hidden shadow">
            <Image
              src={images[0]}
              alt={`${prop.title} imagen principal`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {images.slice(1, 7).map((src, idx) => (
                <div key={idx} className="relative w-full h-40 rounded-xl overflow-hidden">
                  <Image
                    src={src}
                    alt={`${prop.title} imagen ${idx + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Características */}
      <FadeInSectionClient>
        <div className="bg-white shadow rounded-3 p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Detalles de la propiedad</h2>
          <PropertyFeatures property={prop} />
        </div>

        {/* Descripción */}
        {prop.description && (
          <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
            <h3 className="text-md font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{prop.description}</p>
          </div>
        )}

        {/* Precio y acción */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between bg-white rounded-3 shadow p-4 mb-5">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {prop.price > 0
                ? `$${prop.price.toLocaleString()}`
                : 'Consultar precio'}
            </h3>
            <p className="text-muted m-0">{prop.location || 'Ubicación no disponible'}</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg mt-3 mt-md-0"
          >
            <i className="bi bi-whatsapp me-2"></i>
            Consultar por WhatsApp
          </a>
        </div>
      </FadeInSectionClient>

      {/* Volver */}
      <div className="text-center">
        <Link href="/propiedades" className="btn btn-outline-secondary px-4">
          ← Volver al listado
        </Link>
      </div>
    </div>
  );
}
