// app/propiedades/[id]/page.js
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage(props) {
  // Next.js 15+: params llegan en props y deben 'esperarse' si vienen de dynamic
  const { params } = await props;
  const id = params.id;

  // 1️⃣ Traer la propiedad
  const prop = await prisma.property.findUnique({
    where: { id },
    include: { category: true, creator: true },
  });
  if (!prop) {
    return <p className="container py-5">Propiedad no encontrada.</p>;
  }

  // 2️⃣ Montar el array de imágenes
  const images = [
    ...(prop.imageUrl ? [prop.imageUrl] : []),
    ...(Array.isArray(prop.otherImageUrls) ? prop.otherImageUrls : []),
  ];

  // 3️⃣ Preparar enlace de WhatsApp
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const whatsappText = encodeURIComponent(
    `Hola, estoy interesado en "${prop.title}" (ID: ${prop.id}).\n${siteUrl}/propiedades/${prop.id}`
  );
  const whatsappUrl = `https://wa.me/5493764579547?text=${whatsappText}`;

  return (
    <div className="container py-5">
      {/* Título Animado */}
      <FadeInHeadingClient as="h1" className="mb-4 text-primary">
        {prop.title}
      </FadeInHeadingClient>

      {/* Carrusel de Imágenes */}
      {images.length > 0 && (
        <div id={`carousel-${prop.id}`} className="carousel slide mb-4" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`carousel-item${idx === 0 ? ' active' : ''}`}
                style={{ height: '400px' }}
              >
                <Image
                  src={src}
                  alt={`${prop.title} imagen ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="d-block w-100"
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
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${prop.id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Detalles */}
      <FadeInSectionClient>
        <div className="row mb-4">
          <div className="col-md-8">
            <p><strong>Descripción:</strong> {prop.description}</p>
            <p>
              <strong>Precio:</strong>{' '}
              {prop.currency === 'USD' ? '$ ' : 'AR$ '}
              {prop.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p><strong>Ubicación:</strong> {prop.location}</p>
            <p><strong>Categoría:</strong> {prop.category.name}</p>
          </div>
          <div className="col-md-4 text-center text-md-end">
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
        </div>
      </FadeInSectionClient>

      {/* Volver */}
      <div className="text-center">
        <Link href="/propiedades" className="btn btn-outline-secondary">
          ← Volver al listado
        </Link>
      </div>
    </div>
  );
}
