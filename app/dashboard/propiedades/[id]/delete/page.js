// app/dashboard/propiedades/[id]/delete/page.js
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePropertyPage({ params }) {
  const router = useRouter();
  const { id } = params; // id dinámico
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/propiedades/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Error al eliminar');
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
      <h1 className="mb-4">Eliminar Propiedad</h1>
      {error && <p className="text-danger">{error}</p>}
      <p>¿Estás seguro que deseas eliminar la propiedad con ID {id}?</p>
      <button
        className="btn btn-danger me-2"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Eliminando...' : 'Sí, eliminar'}
      </button>
      <button className="btn btn-secondary" onClick={() => router.back()}>
        Cancelar
      </button>
    </div>
  );
}
