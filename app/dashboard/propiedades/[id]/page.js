// app/dashboard/propiedades/[id]/page.js
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import SwiperGalleryWithThumbs from '@/components/Gallery/SwiperGalleryWithThumbs';
import {
  FaBath,
  FaBed,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaYoutube,
} from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default async function DashboardPropertyPage({ params }) {
  const { id } = await params;

  let prop = null;
  try {
    prop = await prisma.property.findUnique({
      where: { id },
      include: { category: true, creator: true },
    });
  } catch (e) {
    console.error('Error fetching property in DashboardPropertyPage:', e);
  }

  if (!prop) {
    return (
      <div className="container py-5">
        <p>Propiedad no encontrada.</p>
      </div>
    );
  }

  const images = [
    ...(prop.imageUrl ? [prop.imageUrl] : []),
    ...(Array.isArray(prop.otherImageUrls) ? prop.otherImageUrls : []),
  ];

  return (
    <div className="container py-5">
      {/* Header con título y precio */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="text-primary mb-3 mb-md-0">{prop.title}</h1>
        <h3 className="text-success fw-bold">
          {prop.currency} {prop.price.toLocaleString()}
        </h3>
      </div>

      {/* Galería */}
      <div className="mb-4">
        <SwiperGalleryWithThumbs images={images} title={prop.title} />
      </div>

      {/* Detalles */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <div className="row gy-3">
          <div className="col-md-6 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <span>
              <strong>Ubicación:</strong> {prop.location}, {prop.city}
            </span>
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <span>
              <strong>Dirección:</strong> {prop.address}
            </span>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaBed className="me-2 text-primary" />
            <span>
              <strong>Dormitorios:</strong> {prop.bedrooms ?? '-'}
            </span>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaBath className="me-2 text-info" />
            <span>
              <strong>Baños:</strong> {prop.bathrooms ?? '-'}
            </span>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaCar className="me-2 text-secondary" />
            <span>
              <strong>Garage:</strong> {prop.garage ? 'Sí' : 'No'}
            </span>
          </div>
          {prop.expenses !== null && (
            <div className="col-md-4 d-flex align-items-center">
              <FaMoneyBill className="me-2 text-success" />
              <span>
                <strong>Expensas:</strong> AR$ {prop.expenses.toLocaleString()}
              </span>
            </div>
          )}
          {prop.category && (
            <div className="col-md-4 d-flex align-items-center">
              <span>
                <strong>Categoría:</strong> {prop.category.name}
              </span>
            </div>
          )}
          {prop.videoUrl && (
            <div className="col-md-4 d-flex align-items-center">
              <FaYoutube className="me-2 text-danger" />
              <a
                href={prop.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline text-primary"
              >
                Ver Video
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h5 className="text-secondary mb-3">Descripción</h5>
        <p className="mb-0">{prop.description}</p>
      </div>

      {/* Botón volver */}
      <div className="text-end">
        <Link href="/dashboard/propiedades" className="btn btn-outline-secondary">
          ← Volver al listado
        </Link>
      </div>
    </div>
  );
}
