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
  const { id } = params;

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
      <h1 className="mb-4 text-primary">{prop.title}</h1>

      <SwiperGalleryWithThumbs images={images} title={prop.title} />

      <div className="card p-4 shadow-sm border-0 mb-4">
        <p className="mb-3 text-muted">{prop.description}</p>

        <div className="row gy-2">
          <div className="col-md-4 d-flex align-items-center">
            <FaMoneyBill className="me-2 text-success" />
            <strong className="me-1">Precio:</strong> {prop.currency} {prop.price.toLocaleString()}
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <strong className="me-1">Ubicación:</strong> {prop.location}, {prop.city}
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <strong className="me-1">Dirección:</strong> {prop.address}
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaBed className="me-2" />
            <strong className="me-1">Dormitorios:</strong> {prop.bedrooms ?? '-'}
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaBath className="me-2" />
            <strong className="me-1">Baños:</strong> {prop.bathrooms ?? '-'}
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <FaCar className="me-2" />
            <strong className="me-1">Garage:</strong> {prop.garage ? 'Sí' : 'No'}
          </div>
          {prop.expenses !== null && (
            <div className="col-md-4 d-flex align-items-center">
              <FaMoneyBill className="me-2" />
              <strong className="me-1">Expensas:</strong> AR$ {prop.expenses.toLocaleString()}
            </div>
          )}
          {prop.category && (
            <div className="col-md-4 d-flex align-items-center">
              <strong className="me-1">Categoría:</strong> {prop.category.name}
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

      <Link href="/dashboard/propiedades" className="btn btn-outline-secondary">
        ← Volver al listado
      </Link>
    </div>
  );
}
