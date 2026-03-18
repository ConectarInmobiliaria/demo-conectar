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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmobiliariamarcon.com.ar';
const WA_NUMBER = '5493764728718';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNumberAR(value) {
  try {
    return Number(value).toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch {
    return String(value);
  }
}

function getPriceDisplay(price, currency) {
  if (price == null || Number(price) <= 0) return 'Consultar';
  const prefix = currency === 'USD' ? 'u$d' : '$';
  return `${prefix} ${formatNumberAR(price)}`;
}

function getPropertyImages(prop) {
  return [
    ...(prop.imageUrl ? [prop.imageUrl] : []),
    ...(Array.isArray(prop.otherImageUrls) ? prop.otherImageUrls : []),
  ];
}

// ── Metadata dinámica (Open Graph / Twitter / WhatsApp) ───────────────────────

export async function generateMetadata({ params }) {
  const { id } = params;

  const prop = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      price: true,
      currency: true,
      location: true,
      city: true,
      bedrooms: true,
      bathrooms: true,
      squareMeters: true,
      imageUrl: true,
      otherImageUrls: true,
      category: { select: { name: true } },
    },
  });

  if (!prop) {
    return {
      title: 'Propiedad no encontrada | Conectar Inmobiliaria',
      robots: { index: false },
    };
  }

  const url = `${SITE_URL}/propiedades/${id}`;
  const priceLabel = getPriceDisplay(prop.price, prop.currency);
  const images = getPropertyImages(prop);
  const ogImage = images[0] || `${SITE_URL}/og-default.jpg`;

  // Título enriquecido: "Casa en venta • u$d 80.000 | Conectar Inmobiliaria"
  const categoryLabel = prop.category?.name ? `${prop.category.name} en` : '';
  const locationLabel = prop.city || prop.location || '';
  const title = [prop.title, priceLabel, 'Conectar Inmobiliaria']
    .filter(Boolean)
    .join(' • ');

  // Descripción con datos clave primero (CTR en SERP)
  const baseDesc = prop.description?.slice(0, 120) || '';
  const metaParts = [
    prop.bedrooms ? `${prop.bedrooms} dorm.` : '',
    prop.bathrooms ? `${prop.bathrooms} baños` : '',
    prop.squareMeters ? `${prop.squareMeters} m²` : '',
    locationLabel,
  ].filter(Boolean);

  const description = metaParts.length
    ? `${metaParts.join(' · ')} — ${baseDesc}`
    : baseDesc || `Propiedad publicada en Conectar Inmobiliaria.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Conectar Inmobiliaria',
      images: images.slice(0, 4).map((img) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: prop.title,
      })),
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// ── JSON-LD (Schema.org RealEstateListing) ────────────────────────────────────

function PropertyJsonLd({ prop, id, priceDisplay, images }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: prop.title,
    description: prop.description || undefined,
    url: `${SITE_URL}/propiedades/${id}`,
    image: images,
    ...(images[0] ? { thumbnailUrl: images[0] } : {}),
    datePosted: prop.createdAt?.toISOString?.() || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: prop.address || undefined,
      addressLocality: prop.city || prop.location,
      addressCountry: 'AR',
    },
    ...(prop.latitude && prop.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: prop.latitude,
            longitude: prop.longitude,
          },
        }
      : {}),
    ...(prop.price && Number(prop.price) > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: Number(prop.price),
            priceCurrency: prop.currency === 'USD' ? 'USD' : 'ARS',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    numberOfRooms: prop.bedrooms || undefined,
    numberOfBathroomsTotal: prop.bathrooms || undefined,
    floorSize: prop.squareMeters
      ? { '@type': 'QuantitativeValue', value: prop.squareMeters, unitCode: 'MTK' }
      : undefined,
  };

  // Limpiar keys undefined para JSON limpio
  const clean = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default async function PropertyDetailPage({ params }) {
  const { id } = params;

  const prop = await prisma.property.findUnique({
    where: { id },
    include: { category: true, creator: true },
  });

  if (!prop) {
    return (
      <main className="container py-5" aria-label="Propiedad no encontrada">
        <p>Propiedad no encontrada.</p>
        <Link href="/propiedades" className="btn btn-outline-secondary mt-3">
          ← Volver al listado
        </Link>
      </main>
    );
  }

  const images = getPropertyImages(prop);
  const pageUrl = `${SITE_URL}/propiedades/${prop.id}`;
  const priceDisplay = getPriceDisplay(prop.price, prop.currency);

  const waText = encodeURIComponent(
    `Hola, estoy interesado en "${prop.title}" (${priceDisplay}). ${pageUrl}`
  );

  return (
    <>
      {/* JSON-LD estructurado */}
      <PropertyJsonLd prop={prop} id={id} priceDisplay={priceDisplay} images={images} />

      <main className="container py-5" aria-label={`Detalle de propiedad: ${prop.title}`}>

        {/* ── Encabezado ── */}
        <header className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-3">
          <FadeInHeadingClient as="h1" className="h-title m-0 text-dark">
            {prop.title}
          </FadeInHeadingClient>
          <div className="ms-md-auto">
            <span
              className="badge rounded-pill text-bg-light fs-6 border"
              aria-label={`Precio: ${priceDisplay}`}
            >
              {priceDisplay}
            </span>
          </div>
        </header>

        {/* ── Galería ── */}
        <section aria-label="Imágenes de la propiedad" className="mb-4">
          <PropertyGallery images={images} title={prop.title} />
        </section>

        {/* ── Contenido principal ── */}
        <div className="row g-4">

          {/* Columna izquierda: detalles */}
          <div className="col-lg-8">
            <FadeInSectionClient>
              <section aria-label="Características de la propiedad">
                <PropertyFeatures property={prop} />
              </section>
            </FadeInSectionClient>

            {/* Video */}
            {prop.videoUrl && (
              <section className="mt-4" aria-label="Video de la propiedad">
                <h2 className="h6 h-title mb-2">Video de la propiedad</h2>
                <PropertyVideo url={prop.videoUrl} />
              </section>
            )}

            {/* Mapa */}
            {typeof prop.latitude === 'number' && typeof prop.longitude === 'number' && (
              <section className="mt-4" aria-label="Ubicación en mapa">
                <h2 className="h6 h-title mb-2">Ubicación</h2>
                <PropertyMap
                  lat={prop.latitude}
                  lng={prop.longitude}
                  label={prop.address || prop.location || prop.title}
                />
              </section>
            )}
          </div>

          {/* Columna derecha: contacto */}
          <aside className="col-lg-4" aria-label="Contacto y compartir">
            <div className="card border-0 shadow-sm rounded-4 p-3">

              {/* WhatsApp CTA */}
              <div className="cta-box mb-3">
                <p className="fw-semibold mb-2">¿Te interesó esta propiedad?</p>
                <Link
                  href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                  className="btn btn-success w-100"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Consultar por WhatsApp sobre ${prop.title}`}
                >
                  <i className="bi bi-whatsapp me-2" aria-hidden="true" />
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

              <Link
                href="/propiedades"
                className="btn btn-outline-secondary w-100"
                aria-label="Volver al listado de propiedades"
              >
                ← Volver al listado
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}