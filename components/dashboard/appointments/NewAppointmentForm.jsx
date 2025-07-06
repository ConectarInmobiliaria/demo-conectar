// components/dashboard/appointments/NewAppointmentForm.jsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-day-picker/style.css';
import { DayPicker } from 'react-day-picker';

export default function NewAppointmentForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultDate = params.get('date') || new Date().toISOString().slice(0,16);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { date: defaultDate },
  });

  const [properties, setProperties] = useState([]);
  const [leads,       setLeads]       = useState([]);
  const [clients,     setClients]     = useState([]);

  useEffect(() => {
    fetch('/api/propiedades')
      .then(r => r.json())
      .then(data => setProperties(Array.isArray(data) ? data : []));

    fetch('/api/leads')
      .then(r => r.json())
      .then(data => setLeads(Array.isArray(data) ? data : []));

    fetch('/api/usuarios')
      .then(r => r.json())
      .then(data => {
        const mapped = Array.isArray(data)
          ? data.map(u => ({
              id: u.id,
              name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
            }))
          : [];
        setClients(mapped);
      });
  }, []);

  const onSubmit = async formData => {
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(formData),
    });
    router.push('/dashboard/appointments');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Nueva Cita</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Fecha y hora *</label>
          <input
            type="datetime-local"
            {...register('date', { required: true })}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Propiedad *</label>
          <select {...register('propertyId', { required: true })} className="form-select">
            <option value="">-- Selecciona propiedad --</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Lead (opcional)</label>
          <select {...register('leadId')} className="form-select">
            <option value="">-- Ninguno --</option>
            {leads.map(l => {
              const label = [l.firstName, l.lastName].filter(Boolean).join(' ') || l.name || l.email;
              return <option key={l.id} value={l.id}>{label}</option>;
            })}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cliente registrado (opcional)</label>
          <select {...register('clientId')} className="form-select">
            <option value="">-- Ninguno --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
