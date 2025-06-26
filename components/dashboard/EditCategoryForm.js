// components/dashboard/EditCategoryForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCategoryForm({ category }) {
  const [name, setName] = useState(category.name);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Nombre requerido');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Error al actualizar categoría');
      }
      router.push('/dashboard/categorias');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Editar Categoría</h1>
      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary me-2">
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
}
