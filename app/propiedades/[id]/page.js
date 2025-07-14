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
  const whatsappUrl = `https://wa.me/5493764579547?text=${whatsappText}`;

  return (
    <div className="container py-5">
      <FadeInHeadingClient as="h1" className="mb-4 text-primary">
        {prop.title}
      </FadeInHeadingClient>

      {/* Galería de imágenes */}
      {images.length > 0 && (
        <div
          id={`carousel-${prop.id}`}
          className="carousel slide mb-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded overflow-hidden" style={{ height: '400px', position: 'relative' }}>
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`carousel-item${idx === 0 ? ' active' : ''}`}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image
                  src={src}
                  alt={`${prop.title} imagen ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-fit-cover w-100 h-100"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${prop.id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" />
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${prop.id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" />
                <span className="visually-hidden">Siguiente</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Características con íconos estilo Airbnb */}
      <FadeInSectionClient>
        <PropertyFeatures property={prop} />

        <div className="text-center text-md-end mt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg"
          >
            <i className="bi bi-whatsapp me-2"></i>
            Consultar por WhatsApp
          </a>
        </div>
      </FadeInSectionClient>

      <div className="text-center mt-5">
        <Link href="/propiedades" className="btn btn-outline-secondary">
          ← Volver al listado
        </Link>
      </div>
    </div>
  );
}
