// components/Property/PropertyFeatures.js
import {
  FaBath,
  FaBed,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaVideo,
  FaMapSigns,
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
  } = property;

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="text-primary mb-3">Detalles de la Propiedad</h5>
      <p className="mb-4 text-muted">{description}</p>

      <div className="row gy-3">
        <div className="col-md-6 d-flex align-items-center">
          <FaMoneyBillAlt className="me-2 text-success" />
          <strong className="me-1">Precio:</strong>
          {currency === 'USD' ? 'US$' : 'AR$'} {price.toLocaleString()}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2 text-danger" />
          <strong className="me-1">Ubicación:</strong>
          {location}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaMapSigns className="me-2 text-warning" />
          <strong className="me-1">Dirección:</strong>
          {address}, {city}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaBed className="me-2 text-primary" />
          <strong className="me-1">Dormitorios:</strong>
          {bedrooms ?? '-'}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaBath className="me-2 text-info" />
          <strong className="me-1">Baños:</strong>
          {bathrooms ?? '-'}
        </div>

        <div className="col-md-6 d-flex align-items-center">
          <FaCar className="me-2 text-secondary" />
          <strong className="me-1">Garage:</strong>
          {garage ? 'Sí' : 'No'}
        </div>

        {expenses != null && (
          <div className="col-md-6 d-flex align-items-center">
            <FaMoneyBillAlt className="me-2 text-muted" />
            <strong className="me-1">Expensas:</strong>
            AR$ {expenses.toLocaleString()}
          </div>
        )}

        {category && (
          <div className="col-md-6 d-flex align-items-center">
            <strong className="me-1">Categoría:</strong>
            {category.name}
          </div>
        )}

        {videoUrl && (
          <div className="col-md-6 d-flex align-items-center">
            <FaVideo className="me-2 text-danger" />
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-underline"
            >
              Ver Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
