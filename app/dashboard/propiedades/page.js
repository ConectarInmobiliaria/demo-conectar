// app/dashboard/propiedades/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPropiedadesPage() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer propiedades
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch('/api/propiedades');
        const data = await res.json();
        setProps(data || []);
      } catch (e) {
        console.error('Error trayendo propiedades:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  // Alternar publicado
  const handleTogglePublished = async (id, current) => {
    try {
      const res = await fetch(`/api/propiedades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setProps(prev =>
        prev.map(p => (p.id === id ? { ...p, published: !current } : p))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Eliminar
  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar propiedad "${title}"?`)) return;
    try {
      const res = await fetch(`/api/propiedades/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setProps(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h1 className="mb-0">Propiedades</h1>
        <div className="d-flex gap-2">
          <input
            type="search"
            placeholder="Buscar propiedad..."
            className="form-control form-control-sm"
            style={{ maxWidth: '250px' }}
          />
          <Link href="/dashboard/propiedades/new" className="btn btn-primary">
            + Nueva Propiedad
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Cod. Prop.</th>
              <th scope="col">Título</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Creado por</th>
              <th scope="col">Publicado</th>
              <th scope="col" className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Cargando...
                </td>
              </tr>
            ) : props.length > 0 ? (
              props.map(prop => (
                <tr key={prop.id}>
                  <td>
                    <span className="badge bg-secondary">{prop.code || prop.id}</span>
                  </td>
                  <td className="fw-semibold">{prop.title}</td>
                  <td>{prop.category?.name || '—'}</td>
                  <td>
                    {prop.price === 0
                      ? 'Consultar'
                      : `${prop.currency === 'USD' ? 'US$' : 'AR$'} ${prop.price.toLocaleString()}`}
                  </td>
                  <td>{prop.city ? `${prop.city}, ${prop.location}` : prop.location}</td>
                  <td>
                    {prop.creator
                      ? [prop.creator.firstName, prop.creator.lastName].filter(Boolean).join(' ')
                      : '—'}
                  </td>
                  <td>
                    <span
                      className={`badge ${prop.published ? 'bg-success' : 'bg-danger'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTogglePublished(prop.id, prop.published)}
                    >
                      {prop.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link
                        href={`/dashboard/propiedades/${prop.id}`}
                        className="btn btn-outline-info"
                        title="Ver"
                      >
                        👁
                      </Link>
                      <Link
                        href={`/dashboard/propiedades/${prop.id}/edit`}
                        className="btn btn-outline-secondary"
                        title="Editar"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        className="btn btn-outline-danger"
                        title="Eliminar"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No hay propiedades cargadas todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
