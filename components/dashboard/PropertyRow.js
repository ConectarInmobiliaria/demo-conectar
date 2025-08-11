'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Edit2, Trash2, Share2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function PropertyRow({ property, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm(`¿Eliminar propiedad "${property.title}"?`)) return;
    try {
      const res = await fetch(`/api/propiedades/${property.id}`, { method: 'DELETE' });
      if (res.ok) onDeleted(property.id);
      else {
        const { error } = await res.json();
        alert(error || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/propiedades/${property.id}`;
  const shareText = `${property.title} - Mira esta propiedad: `;

  return (
    <tr>
      <td className="align-middle text-monospace">{property.code}</td>
      <td className="d-flex align-items-center align-middle">
        <Image
          src={property.imageUrl || '/placeholder.png'}
          alt={property.title}
          width={80}
          height={60}
          className="me-2 rounded"
        />
        <span className="fw-semibold">{property.title}</span>
      </td>
      <td className="align-middle">{property.category?.name || '—'}</td>
      <td className="align-middle">
        {property.creator ? `${property.creator.firstName} ${property.creator.lastName}` : '—'}
      </td>
      <td className="align-middle">
        {new Date(property.createdAt).toLocaleDateString()}
      </td>
      <td className="align-middle">
        <div className="d-flex gap-3">
          <Link href={`/dashboard/propiedades/${property.id}`}>
            <Eye size={20} className="text-info hover-opacity" title="Ver detalle" />
          </Link>
          <Link href={`/dashboard/propiedades/${property.id}/edit`}>
            <Edit2 size={20} className="text-secondary hover-opacity" title="Editar" />
          </Link>
          <Trash2
            size={20}
            onClick={handleDelete}
            className="text-danger hover-opacity"
            title="Eliminar"
          />
          <Share2
            size={20}
            className="text-success hover-opacity"
            title="Compartir"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: property.title, text: shareText, url: shareUrl }).catch(console.error);
              } else {
                alert('Función de compartir no soportada en este navegador');
              }
            }}
          />
          <FaWhatsapp
            size={20}
            className="text-success hover-opacity"
            title="Compartir en WhatsApp"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`
              )
            }
          />
        </div>
      </td>
    </tr>
  );
}
