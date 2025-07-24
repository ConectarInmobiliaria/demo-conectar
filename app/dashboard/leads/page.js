'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = url => fetch(url).then(r => r.json());

export default function DashboardLeadsPage() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [intent, setIntent] = useState('');
  const [page, setPage] = useState(1);

  // Construir parámetros de consulta
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (intent) params.append('intent', intent);
  params.append('page', page);
  params.append('pageSize', PAGE_SIZE);

  const { data, error } = useSWR(`/api/leads?${params.toString()}`, fetcher);
  const leads = data?.items || [];
  const total = data?.total || 0;

  // Handlers
  const onSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
  const onStatusChange = (e) => { setStatus(e.target.value); setPage(1); };
  const onIntentChange = (e) => { setIntent(e.target.value); setPage(1); };
  const prevPage = () => { if (page > 1) setPage(page - 1); };
  const nextPage = () => { if (page * PAGE_SIZE < total) setPage(page + 1); };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Potenciales</h1>
        <Link href="/dashboard/leads/new" className="btn btn-primary">Nuevo Potencial</Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={onSearchChange}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={onStatusChange}>
            <option value="">Todos los estados</option>
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="calificado">Calificado</option>
            <option value="convertido">Convertido</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={intent} onChange={onIntentChange}>
            <option value="">Todos los tipos</option>
            <option value="comprar">Comprar</option>
            <option value="vender">Vender</option>
          </select>
        </div>
      </div>

      {/* Tabla de leads */}
      {error && <p className="text-danger">Error al cargar leads</p>}
      {!data && <p>Cargando…</p>}
      {data && leads.length === 0 && <p>No hay resultados que coincidan</p>}

      {data && leads.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Tipo</th>
                  <th>Estatus</th>
                  <th>Agente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.firstName} {lead.lastName}</td>
                    <td>{lead.email || '—'}</td>
                    <td>{lead.phone || '—'}</td>
                    <td>{lead.intent === 'comprar' ? 'Comprar' : lead.intent === 'vender' ? 'Vender' : '—'}</td>
                    <td>{lead.status}</td>
                    <td>{lead.agent?.firstName} {lead.agent?.lastName}</td>
                    <td>
                      <Link href={`/dashboard/leads/${lead.id}`} className="btn btn-sm btn-outline-info me-2">Ver</Link>
                      <Link href={`/dashboard/leads/${lead.id}/edit`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p className="mb-0">Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} de {total}</p>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={prevPage} disabled={page === 1}>
                Anterior
              </button>
              <button className="btn btn-sm btn-outline-primary" onClick={nextPage} disabled={page * PAGE_SIZE >= total}>
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
