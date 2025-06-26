// components/dashboard/CategoryRow.js
'use client';
import Link from 'next/link';

export default function CategoryRow({ category, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm(`Eliminar categoría "${category.name}"?`)) return;
    const res = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
    if (res.ok) {
      onDeleted(category.id);
    } else {
      const json = await res.json();
      alert(json.error || 'Error al eliminar');
    }
  };
  return (
    <tr>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>
        <Link href={`/dashboard/categorias/${category.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
          Editar
        </Link>
        <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
          Eliminar
        </button>
      </td>
    </tr>
  );
}
