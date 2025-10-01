// components/Property/PropertyFeatures.js
import {
  FaBath,
  FaBed,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaVideo,
  FaRulerCombined,
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
    width,
    length,
    squareMeters,
  } = property || {};

  // Precio: si <= 0 -> "Consultar"
  const hasPrice = price != null && Number(price) > 0;
  const formattedPrice = hasPrice
    ? `${currency === 'USD' ? 'u$d' : '$'} ${Number(price).toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : 'Consultar';

  // Expensas (siempre en la moneda definida)
  const hasExpenses = expenses != null && Number(expenses) > 0;
  const formattedExpenses = hasExpenses
    ? `${currency === 'USD' ? 'u$d' : '$'} ${Number(expenses).toLocaleString('es-AR', {
        minimumFractionDigits: 0,
      })}`
    : null;

  // Helpers para mostrar filas
  const showBedrooms = bedrooms != null && Number(bedrooms) > 0;
  const showBathrooms = bathrooms != null && Number(bathrooms) > 0;
  const showGarage = garage !== null && garage !== undefined;
  const showLocation =
    (location && String(location).trim() !== '') ||
    (city && city.trim() !== '') ||
    (address && address.trim() !== '');
  const showDimensions =
    (squareMeters != null && Number(squareMeters) > 0) ||
    (width != null && length != null);

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="text-dark mb-3">Detalles de la Propiedad</h5>

      {/* Descripción breve */}
      {description && (
        <p className="mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
          {description}
        </p>
      )}

      <div className="row gy-3">
        {/* Precio */}
        <div className="col-md-6 d-flex align-items-center">
          <FaMoneyBillAlt className="me-2 text-success" />
          <strong className="me-1">Precio:</strong>
          <span>{formattedPrice}</span>
        </div>

        {/* Ubicación */}
        {showLocation && (
          <div className="col-md-6 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <strong className="me-1">Ubicación:</strong>
            <span>
              {address ? `${address}${city ? ', ' + city : ''}` : location || city || '-'}
            </span>
          </div>
        )}

        {/* Superficie */}
        {showDimensions && (
          <div className="col-md-6 d-flex align-items-center">
            <FaRulerCombined className="me-2 text-primary" />
            <strong className="me-1">Superficie:</strong>
            <span>
              {squareMeters && Number(squareMeters) > 0
                ? `${Number(squareMeters)} m²`
                : width && length
                ? `${Number(width)} m × ${Number(length)} m ≈ ${(Number(width) * Number(length)).toFixed(2)} m²`
                : '-'}
            </span>
          </div>
        )}

        {/* Categoría */}
        {category && (
          <div className="col-md-6 d-flex align-items-center">
            <strong className="me-1">Categoría:</strong>
            <span>{category.name}</span>
          </div>
        )}

        {/* Dormitorios */}
        {showBedrooms && (
          <div className="col-md-6 d-flex align-items-center">
            <FaBed className="me-2 text-dark" />
            <strong className="me-1">Dormitorios:</strong>
            <span>{bedrooms}</span>
          </div>
        )}

        {/* Baños */}
        {showBathrooms && (
          <div className="col-md-6 d-flex align-items-center">
            <FaBath className="me-2 text-info" />
            <strong className="me-1">Baños:</strong>
            <span>{bathrooms}</span>
          </div>
        )}

        {/* Garage */}
        {showGarage && (
          <div className="col-md-6 d-flex align-items-center">
            <FaCar className="me-2 text-secondary" />
            <strong className="me-1">Garage:</strong>
            <span>{garage ? 'Sí' : 'No'}</span>
          </div>
        )}

        {/* Expensas */}
        {formattedExpenses && (
          <div className="col-md-6 d-flex align-items-center">
            <FaMoneyBillAlt className="me-2 text-muted" />
            <strong className="me-1">Expensas:</strong>
            <span>{formattedExpenses}</span>
          </div>
        )}

        {/* Video */}
        {videoUrl && (
          <div className="col-md-6 d-flex align-items-center">
            <FaVideo className="me-2 text-danger" />
            <strong className="me-1">Video:</strong>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-underline"
            >
              Ver video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
