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

  // ── Precio ────────────────────────────────────────────────────────────────
  const hasPrice = price != null && Number(price) > 0;
  const formattedPrice = hasPrice
    ? `${currency === 'USD' ? 'u$d' : '$'} ${Number(price).toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : 'Consultar';

  // ── Expensas ──────────────────────────────────────────────────────────────
  const hasExpenses = expenses != null && Number(expenses) > 0;
  const formattedExpenses = hasExpenses
    ? `${currency === 'USD' ? 'u$d' : '$'} ${Number(expenses).toLocaleString('es-AR', {
        minimumFractionDigits: 0,
      })}`
    : null;

  // ── Ubicación ─────────────────────────────────────────────────────────────
  const locationText = address
    ? `${address}${city ? `, ${city}` : ''}`
    : location || city || null;

  // ── Superficie ────────────────────────────────────────────────────────────
  const hasDimensions =
    (squareMeters != null && Number(squareMeters) > 0) ||
    (width != null && length != null);

  const surfaceText = hasDimensions
    ? squareMeters && Number(squareMeters) > 0
      ? `${Number(squareMeters)} m²`
      : `${Number(width)} m × ${Number(length)} m ≈ ${(Number(width) * Number(length)).toFixed(2)} m²`
    : null;

  // ── Filas de características ──────────────────────────────────────────────
  const features = [
    {
      show: true,
      icon: <FaMoneyBillAlt className="text-success" aria-hidden="true" />,
      label: 'Precio',
      value: formattedPrice,
    },
    {
      show: !!locationText,
      icon: <FaMapMarkerAlt className="text-danger" aria-hidden="true" />,
      label: 'Ubicación',
      value: locationText,
    },
    {
      show: !!surfaceText,
      icon: <FaRulerCombined className="text-primary" aria-hidden="true" />,
      label: 'Superficie',
      value: surfaceText,
    },
    {
      show: !!category?.name,
      icon: null,
      label: 'Categoría',
      value: category?.name,
    },
    {
      show: bedrooms != null && Number(bedrooms) > 0,
      icon: <FaBed className="text-dark" aria-hidden="true" />,
      label: 'Dormitorios',
      value: bedrooms,
    },
    {
      show: bathrooms != null && Number(bathrooms) > 0,
      icon: <FaBath className="text-info" aria-hidden="true" />,
      label: 'Baños',
      value: bathrooms,
    },
    {
      show: garage !== null && garage !== undefined,
      icon: <FaCar className="text-secondary" aria-hidden="true" />,
      label: 'Garage',
      value: garage ? 'Sí' : 'No',
    },
    {
      show: !!formattedExpenses,
      icon: <FaMoneyBillAlt className="text-muted" aria-hidden="true" />,
      label: 'Expensas',
      value: formattedExpenses,
    },
  ].filter((f) => f.show);

  return (
    <div className="card p-4 shadow-sm mb-4">
      {/* h2 porque es una sub-sección dentro del h1 de la página de detalle */}
      <h2 className="h5 text-dark mb-3">Detalles de la Propiedad</h2>

      {/* Descripción */}
      {description && (
        <p className="mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
          {description}
        </p>
      )}

      {/*
        <dl> es la etiqueta semántica correcta para listas de
        término → definición/valor, exactamente lo que son estas características.
        Screen readers lo anuncian como "lista de definiciones".
      */}
      <dl className="row gy-3 mb-0">
        {features.map(({ icon, label, value }) => (
          <div key={label} className="col-md-6 d-flex align-items-center gap-2">
            {icon && <span aria-hidden="true">{icon}</span>}
            <dt className="mb-0 me-1 fw-bold" style={{ minWidth: 'max-content' }}>
              {label}:
            </dt>
            <dd className="mb-0 text-muted">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Video: va separado porque es un link, no un par término/valor */}
      {videoUrl && (
        <div className="d-flex align-items-center gap-2 mt-3">
          <FaVideo className="text-danger" aria-hidden="true" />
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-underline"
            aria-label="Ver video de la propiedad (abre en nueva pestaña)"
          >
            Ver video de la propiedad
          </a>
        </div>
      )}
    </div>
  );
}