// app/dashboard/propiedades/[id]/page.js
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function PropertyDetailPage({ params }) {
  const { id } = params;
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: { 
      category: true,
      creator: true 
    },
  });

  if (!property) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>Propiedad no encontrada</h4>
          <p>La propiedad que buscas no existe o fue eliminada.</p>
          <Link href="/dashboard/propiedades" className="btn btn-primary">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  // Combinar todas las imágenes
  const images = [
    ...(property.imageUrl ? [property.imageUrl] : []),
    ...(Array.isArray(property.otherImageUrls) ? property.otherImageUrls : []),
  ];

  // Formatear precio
  const formatPrice = (price, currency) => {
    if (!price || Number(price) <= 0) return 'Consultar';
    const formatted = Number(price).toLocaleString('es-AR');
    return `${currency === 'USD' ? 'u$d' : '$'} ${formatted}`;
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{property.title}</h1>
        <div className="d-flex gap-2">
          <Link 
            href={`/dashboard/propiedades/${id}/edit`}
            className="btn btn-primary"
          >
            <i className="bi bi-pencil me-2"></i>
            Editar
          </Link>
          <Link 
            href={`/propiedades/${id}`}
            className="btn btn-outline-secondary"
            target="_blank"
          >
            <i className="bi bi-eye me-2"></i>
            Ver pública
          </Link>
        </div>
      </div>

      {/* Información básica */}
      <div className="row g-4">
        {/* Columna principal */}
        <div className="col-lg-8">
          {/* Galería de imágenes */}
          {images.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-0">
                <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-indicators">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        data-bs-target="#propertyCarousel"
                        data-bs-slide-to={idx}
                        className={idx === 0 ? 'active' : ''}
                        aria-current={idx === 0 ? 'true' : 'false'}
                        aria-label={`Imagen ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                  
                  <div className="carousel-inner" style={{ borderRadius: '0.375rem' }}>
                    {images.map((img, idx) => (
                      <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                        <img
                          src={img}
                          className="d-block w-100"
                          alt={`${property.title} - imagen ${idx + 1}`}
                          style={{ 
                            height: '400px', 
                            objectFit: 'contain',
                            backgroundColor: '#000'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {images.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#propertyCarousel"
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#propertyCarousel"
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Miniaturas */}
                {images.length > 1 && (
                  <div className="d-flex gap-2 p-3 overflow-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        data-bs-target="#propertyCarousel"
                        data-bs-slide-to={idx}
                        className="border-0 p-0"
                        style={{ flexShrink: 0 }}
                      >
                        <img
                          src={img}
                          alt={`Miniatura ${idx + 1}`}
                          style={{
                            width: '80px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '0.375rem',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '1'}
                          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Descripción</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                {property.description || 'Sin descripción'}
              </p>
            </div>
          </div>

          {/* Video */}
          {property.videoUrl && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Video</h5>
                <div className="ratio ratio-16x9">
                  <iframe
                    src={property.videoUrl}
                    title="Video de la propiedad"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna lateral */}
        <div className="col-lg-4">
          {/* Detalles */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Detalles</h5>
              
              <div className="mb-3">
                <strong className="d-block text-muted small">Precio</strong>
                <span className="fs-4 text-primary fw-bold">
                  {formatPrice(property.price, property.currency)}
                </span>
              </div>

              <hr />

              <div className="mb-2">
                <strong className="text-muted small">Categoría:</strong>
                <span className="ms-2">
                  {property.category?.name || 'Sin categoría'}
                </span>
              </div>

              {property.location && (
                <div className="mb-2">
                  <strong className="text-muted small">Ubicación:</strong>
                  <span className="ms-2">{property.location}</span>
                </div>
              )}

              {property.address && (
                <div className="mb-2">
                  <strong className="text-muted small">Dirección:</strong>
                  <span className="ms-2">{property.address}</span>
                </div>
              )}

              {property.bedrooms && Number(property.bedrooms) > 0 && (
                <div className="mb-2">
                  <strong className="text-muted small">Dormitorios:</strong>
                  <span className="ms-2">{property.bedrooms}</span>
                </div>
              )}

              {property.bathrooms && Number(property.bathrooms) > 0 && (
                <div className="mb-2">
                  <strong className="text-muted small">Baños:</strong>
                  <span className="ms-2">{property.bathrooms}</span>
                </div>
              )}

              {property.surface && Number(property.surface) > 0 && (
                <div className="mb-2">
                  <strong className="text-muted small">Superficie:</strong>
                  <span className="ms-2">{property.surface} m²</span>
                </div>
              )}

              {property.garages && Number(property.garages) > 0 && (
                <div className="mb-2">
                  <strong className="text-muted small">Garajes:</strong>
                  <span className="ms-2">{property.garages}</span>
                </div>
              )}

              <hr />

              <div className="mb-2">
                <strong className="text-muted small">Estado:</strong>
                <span className={`ms-2 badge ${property.publicado ? 'bg-success' : 'bg-warning'}`}>
                  {property.publicado ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              {property.creator && (
                <div className="mb-2">
                  <strong className="text-muted small">Creado por:</strong>
                  <span className="ms-2">{property.creator.name || property.creator.email}</span>
                </div>
              )}

              <div className="mb-2">
                <strong className="text-muted small">Creado:</strong>
                <span className="ms-2">
                  {new Date(property.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>

              <div className="mb-2">
                <strong className="text-muted small">Actualizado:</strong>
                <span className="ms-2">
                  {new Date(property.updatedAt).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Acciones</h5>
              
              <Link
                href={`/dashboard/propiedades/${id}/edit`}
                className="btn btn-primary w-100 mb-2"
              >
                <i className="bi bi-pencil me-2"></i>
                Editar propiedad
              </Link>

              <Link
                href={`/propiedades/${id}`}
                className="btn btn-outline-secondary w-100 mb-2"
                target="_blank"
              >
                <i className="bi bi-eye me-2"></i>
                Ver en sitio público
              </Link>

              <Link
                href="/dashboard/propiedades"
                className="btn btn-outline-secondary w-100"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver al listado
              </Link>

              <hr />

              <Link
                href={`/dashboard/propiedades/${id}/delete`}
                className="btn btn-outline-danger w-100"
              >
                <i className="bi bi-trash me-2"></i>
                Eliminar propiedad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}