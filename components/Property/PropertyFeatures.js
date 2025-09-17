import {
  FaBath,
  FaBed,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaVideo,
  FaMapSigns,
  FaExpandArrowsAlt,
} from 'react-icons/fa';

export default function PropertyFeatures({ property }) {
  const {
    description,
    price,
    currency,
    location,
    city,
    address,
    bedrooms,
    bathrooms,
    garage,
    expenses,
    videoUrl,
    category,
    area, // m² si existe
  } = property;

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h3 className="h5 h-title mb-3">Detalles de la Propiedad</h3>

      {/* Chips destacados */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <span className="feature-chip">
          <FaMoneyBillAlt className="text-primary" /> {currency === 'USD' ? 'U$S' : '$'} {price?.toLocaleString()}
        </span>
        <span className="feature-chip">
          <FaBed className="text-primary" /> {bedrooms ?? 0} dorm.
        </span>
        <span className="feature-chip">
          <FaBath className="text-primary" /> {bathrooms ?? 0} baños
        </span>
        <span className="feature-chip">
          <FaCar className="text-primary" /> {garage ? 'Cochera' : 'Sin cochera'}
        </span>
        {typeof area === 'number' && (
          <span className="feature-chip">
            <FaExpandArrowsAlt className="text-primary" /> {area} m²
          </span>
        )}
        {category?.name && (
          <span className="feature-chip">
            <strong className="me-1">Categoría:</strong> {category.name}
          </span>
        )}
      </div>

      {/* Texto descriptivo */}
      {description && <p className="mb-4 text-muted">{description}</p>}

      {/* Grid de info */}
      <div className="row gy-3">
        <div className="col-md-6 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2 text-primary" />
          <div>
            <div className="fw-semibold">Ubicación</div>
            <div className="text-muted">{location || '-'}</div>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaMapSigns className="me-2 text-primary" />
          <div>
            <div className="fw-semibold">Dirección</div>
            <div className="text-muted">{[address, city].filter(Boolean).join(', ') || '-'}</div>
          </div>
        </div>

        {typeof expenses === 'number' && (
          <div className="col-md-6 d-flex align-items-center">
            <FaMoneyBillAlt className="me-2 text-primary" />
            <div>
              <div className="fw-semibold">Expensas</div>
              <div className="text-muted">AR$ {expenses.toLocaleString()}</div>
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="col-md-6 d-flex align-items-center">
            <FaVideo className="me-2 text-primary" />
            <div>
              <div className="fw-semibold">Video</div>
              <div className="text-muted">Disponible en la sección de video más abajo</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
