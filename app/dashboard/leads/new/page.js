'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewLeadPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Cargar lista de propiedades para el select
    fetch('/api/propiedades')
      .then(r => r.json())
      .then(data => setProperties(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/dashboard/leads');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Nuevo Lead</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Nombre *</label>
          <input {...register('name', { required: true })} className="form-control" />
          {errors.name && <small className="text-danger">Requerido</small>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" {...register('email')} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input {...register('phone')} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Fuente</label>
          <input {...register('source')} className="form-control" placeholder="web form, llamada..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Propiedad de interés</label>
          <select {...register('propertyId')} className="form-select">
            <option value="">-- Ninguna --</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Notas</label>
          <textarea {...register('notes')} className="form-control" rows={3} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
