'use client';

import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Cargar propiedades
    fetch('/api/propiedades').then(r => r.json()).then(data => setProperties(Array.isArray(data)?data:[]));

    // Cargar datos del lead
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) reset(data);
      })
      .catch(console.error);
  }, [id, reset]);

  const onSubmit = async data => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/dashboard/leads');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Editar Lead</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos iguales a new pero con valores precargados */}
        <div className="mb-3">
          <label className="form-label">Nombre *</label>
          <input {...register('name', { required: true })} className="form-control" />
          {errors.name && <small className="text-danger">Requerido</small>}
        </div>
        {/* ... email, phone, source, status, propertyId, notes */}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
}
