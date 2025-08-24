// app/dashboard/propiedades/[id]/delete/page.js
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePropertyPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/propiedades/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Error al eliminar la propiedad');
      }
      router.push('/dashboard/propiedades');
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow border-0 rounded-3 p-4">
        <h1 className="mb-4 text-danger fw-bold">Eliminar Propiedad</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <p className="mb-4">
          ¿Estás seguro que deseas <strong>eliminar</strong> la propiedad con ID <code>{id}</code>?<br />
          Esta acción no se puede deshacer.
        </p>

        <div className="d-flex gap-3">
          <button
            className="btn btn-danger px-4"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
          <button
            className="btn btn-secondary px-4"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
