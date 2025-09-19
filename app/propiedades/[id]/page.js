import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import PropertyFeatures from '@/components/Property/PropertyFeatures';
import PropertyGallery from '@/components/Property/PropertyGallery';
import PropertyVideo from '@/components/Property/PropertyVideo';
import ShareButtons from '@/components/Property/ShareButtons';
import PropertyMap from '@/components/Property/PropertyMap';
export const dynamic = 'force-dynamic';

// Helper: formatea número según locale AR (se usa sólo para mostrar precio cuando >0)
function formatNumberAR(value) {
  try {
    return Number(value).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  } catch {
    return String(value);
  }
}

// --- Metadata dinámica para OG/WhatsApp ---
export async function generateMetadata({ params }) {
  const { id } = await params;
  const prop = await prisma.property.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!prop) {
    return { title: 'Propiedad no encontrada | Conectar Inmobiliaria' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const url = `${siteUrl}/propiedades/${prop.id}`;
  const images = [
    ...(prop.imageUrl ? [prop.imageUrl] : []),
    ...(Array.isArray(prop.otherImageUrls) ? prop.otherImageUrls : []),
  ];
  const ogImage = images[0] || `${siteUrl}/logo.png`;
  // Mostrar "Consultar" en metadata si price <= 0
  const priceLabel = prop.price && Number(prop.price) > 0
    ? `${prop.currency === 'USD' ? 'u$d' : '$'} ${formatNumberAR(prop.price)}`
    : 'Consultar';
  const title = `${prop.title} • ${priceLabel}`;
  const description = prop.description?.slice(0, 160) || 'Propiedad en Conectar Inmobiliaria';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

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
  const pageUrl = `${siteUrl}/propiedades/${prop.id}`;

  // Precio a mostrar: si price <= 0 -> "Consultar"
  const priceDisplay = (prop.price == null || Number(prop.price) <= 0)
    ? 'Consultar'
    : `${prop.currency === 'USD' ? 'u$d' : '$'} ${formatNumberAR(prop.price)}`;

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-3">
        <FadeInHeadingClient as="h1" className="h-title m-0 text-dark">
          {prop.title}
        </FadeInHeadingClient>
        <div className="ms-md-auto">
          <span className="badge rounded-pill text-bg-light fs-6 border">
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Galería */}
      <div className="mb-4">
        <PropertyGallery images={images} title={prop.title} />
      </div>

      {/* Grid principal: Detalle + Aside de contacto/compartir */}
      <div className="row g-4">
        <div className="col-lg-8">
          <FadeInSectionClient>
            <PropertyFeatures property={prop} />
          </FadeInSectionClient>

          {/* Video */}
          {prop.videoUrl && (
            <div className="mt-4">
              <h3 className="h6 h-title mb-2">Video de la propiedad</h3>
              <PropertyVideo url={prop.videoUrl} />
            </div>
          )}

          {/* Mapa si hay coordenadas */}
         {(typeof prop.latitude === 'number' && typeof prop.longitude === 'number') && (
  <div className="mt-4">
    <h3 className="h6 h-title mb-2">Ubicación</h3>
    <PropertyMap
      lat={prop.latitude}
      lng={prop.longitude}
      label={prop.address || prop.location || prop.title}
    />
  </div>
)}

        </div>

        {/* Aside: CTA y compartir */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="cta-box mb-3">
              <div className="fw-semibold mb-2">¿Te interesó esta propiedad?</div>
              <Link
                href={`https://wa.me/5493764728718?text=${encodeURIComponent(
                  `Hola, estoy interesado en "${prop.title}" (${priceDisplay}). ${pageUrl}`
                )}`}
                className="btn btn-success w-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-whatsapp me-2"></i>
                Consultar por WhatsApp
              </Link>
            </div>

            <ShareButtons
              title={prop.title}
              price={prop.price}
              currency={prop.currency}
              url={pageUrl}
            />

            <hr className="my-3" />
            <Link href="/propiedades" className="btn btn-outline-secondary w-100">
              ← Volver al listado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
