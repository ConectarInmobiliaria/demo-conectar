// components/PropertyCard.js
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyCard({ property }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition">
      <figure className="relative h-48 w-full">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-t-lg">
            Sin imagen
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{property.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
        <div className="mt-2">
          <span className="font-semibold">Precio: </span>
          <span>${property.price.toLocaleString()}</span>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href={`/propiedades/${property.id}`}>
            <button className="btn btn-primary btn-sm">Ver detalles</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
