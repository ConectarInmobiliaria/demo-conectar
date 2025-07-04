"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useParams } from 'next/navigation';


export default function DeleteCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        router.push('/dashboard/categorias');
      } else {
        // intentar leer JSON sólo si no fue 204
        const json = await res.json();
        throw new Error(json.error || 'Error al eliminar categoría');
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Eliminar Categoría</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <p>
        ¿Seguro que deseas eliminar la categoría con ID <strong>{id}</strong>? 
        Esta acción es irreversible.
      </p>
      <button
        onClick={handleDelete}
        className="btn btn-danger me-2"
        disabled={loading}
      >
        {loading ? 'Eliminando...' : 'Sí, eliminar'}
      </button>
      <button
        onClick={() => router.back()}
        className="btn btn-outline-secondary"
        disabled={loading}
      >
        Cancelar
      </button>
    </div>
  );
}
