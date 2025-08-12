// components/dashboard/PropertyRow.js
'use client';
import Link from 'next/link';

export default function PropertyRow({ property, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm(`Eliminar propiedad "${property.title}"?`)) return;
    const res = await fetch(`/api/propiedades/${property.id}`, { method: 'DELETE' });
    if (res.ok) {
      onDeleted(property.id);
    } else {
      const json = await res.json();
      alert(json.error || 'Error al eliminar');
    }
  };
  return (
    <tr>
      <td>{property.id}</td>
      <td>{property.title}</td>
      <td>{property.category?.name || '-'}</td>
      <td>{property.creator?.email || '-'}</td>
      <td>{new Date(property.createdAt).toLocaleDateString()}</td>
      <td>
        <Link href={`/dashboard/propiedades/${property.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
          Editar
        </Link>
        <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
          Eliminar
        </button>
      </td>
    </tr>
  );
}
