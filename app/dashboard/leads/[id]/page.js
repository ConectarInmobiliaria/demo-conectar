'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => setLead(data))
      .catch(console.error);
  }, [id]);

  if (!lead) return <p className="container py-5">Cargando...</p>;
  if (lead.error) return <p className="container py-5">Lead no encontrado</p>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">{lead.name}</h1>
      <dl className="row">
        <dt className="col-sm-3">Email</dt><dd className="col-sm-9">{lead.email || '—'}</dd>
        <dt className="col-sm-3">Teléfono</dt><dd className="col-sm-9">{lead.phone || '—'}</dd>
        <dt className="col-sm-3">Fuente</dt><dd className="col-sm-9">{lead.source || '—'}</dd>
        <dt className="col-sm-3">Estatus</dt><dd className="col-sm-9">{lead.status}</dd>
        <dt className="col-sm-3">Propiedad</dt>
        <dd className="col-sm-9">
          {lead.property ? (
            <Link href={`/dashboard/propiedades/${lead.property.id}`} className="text-decoration-none">
              {lead.property.title}
            </Link>
          ) : '—'}
        </dd>
        <dt className="col-sm-3">Agente</dt><dd className="col-sm-9">{lead.agent?.name || '—'}</dd>
        <dt className="col-sm-3">Notas</dt><dd className="col-sm-9">{lead.notes || '—'}</dd>
      </dl>
      <Link href={`/dashboard/leads/${id}/edit`} className="btn btn-secondary me-2">Editar</Link>
      <Link href="/dashboard/leads" className="btn btn-outline-secondary">Volver</Link>
    </div>
  );
}
