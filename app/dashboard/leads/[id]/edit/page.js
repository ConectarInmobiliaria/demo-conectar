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
    fetch('/api/propiedades').then(r => r.json()).then(data => setProperties(data || []));
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => { if (!data.error) reset(data); });
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
      <h1 className="mb-4">Editar Potencial</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3">
          {/* Nombre / Apellido */}
          <div className="col-md-6">
            <label className="form-label">Nombre *</label>
            <input {...register('firstName', { required: true })} className="form-control" />
            {errors.firstName && <small className="text-danger">Requerido</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido *</label>
            <input {...register('lastName', { required: true })} className="form-control" />
            {errors.lastName && <small className="text-danger">Requerido</small>}
          </div>

          {/* Teléfono / Email */}
          <div className="col-md-6">
            <label className="form-label">Teléfono *</label>
            <input {...register('phone', { required: true })} className="form-control" />
            {errors.phone && <small className="text-danger">Requerido</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" {...register('email')} className="form-control" />
          </div>

          {/* Dirección / Ciudad-Zona */}
          <div className="col-md-6">
            <label className="form-label">Dirección</label>
            <input {...register('address')} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ciudad / Zona</label>
            <input {...register('cityZone')} className="form-control" />
          </div>

          {/* Intento (Comprar/Vender) / Fuente */}
          <div className="col-md-6">
            <label className="form-label">Tipo de Operación *</label>
            <select {...register('intent', { required: true })} className="form-select">
              <option value="">-- Seleccionar --</option>
              <option value="comprar">Comprar</option>
              <option value="vender">Vender</option>
            </select>
            {errors.intent && <small className="text-danger">Requerido</small>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Fuente</label>
            <input {...register('source')} className="form-control" placeholder="web, llamada…" />
          </div>

          {/* Propiedad / Notas */}
          <div className="col-md-6">
            <label className="form-label">Propiedad de interés</label>
            <select {...register('propertyId')} className="form-select">
              <option value="">-- Ninguna --</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Notas</label>
            <textarea {...register('notes')} className="form-control" rows={3} />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}
