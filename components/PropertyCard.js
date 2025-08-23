// components/PropertyCard.js
import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath, FaCar, FaMapMarkerAlt, FaMoneyBill } from 'react-icons/fa';

export default function PropertyCard({ property }) {
  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition rounded-2xl overflow-hidden">
      {/* Imagen principal */}
      <figure className="relative h-56 w-full">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            Sin imagen
          </div>
        )}
      </figure>

      {/* Contenido */}
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {property.title}
        </h2>

        {/* Descripción resumida */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {property.description}
        </p>

        {/* Ubicación */}
        {property.location && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt className="mr-1 text-red-500" />
            {property.location}
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center text-lg font-bold text-green-600 mb-3">
          <FaMoneyBill className="mr-2" />
          {property.currency === 'USD' ? 'USD' : 'AR$'}{' '}
          {property.price.toLocaleString()}
        </div>

        {/* Info rápida */}
        <div className="flex justify-start gap-4 text-gray-700 text-sm mb-3">
          {property.bedrooms !== null && (
            <div className="flex items-center">
              <FaBed className="mr-1 text-blue-500" />
              {property.bedrooms}
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex items-center">
              <FaBath className="mr-1 text-indigo-500" />
              {property.bathrooms}
            </div>
          )}
          {property.garage !== null && (
            <div className="flex items-center">
              <FaCar className="mr-1 text-gray-600" />
              {property.garage ? '1' : '0'}
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <div className="card-actions justify-end">
          <Link href={`/propiedades/${property.id}`}>
            <button className="btn btn-primary btn-sm">Ver detalles</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
