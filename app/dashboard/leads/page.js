'use client';
import Link from 'next/link';
import useSWR from 'swr';
const fetcher = url => fetch(url).then(r => r.json());

export default function DashboardLeadsPage() {
  const { data: leads, error } = useSWR('/api/leads', fetcher);

  if (error) return <p>Error al cargar leads</p>;
  if (!leads) return <p>Cargando…</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h1>Potenciales</h1>
        <Link href="/dashboard/leads/new" className="btn btn-primary">Nuevo Lead</Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Status</th><th>Agente</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.status}</td>
              <td>{lead.agent?.name}</td>
              <td>
                <Link href={`/dashboard/leads/${lead.id}`} className="btn btn-sm btn-outline-info me-2">Ver</Link>
                <Link href={`/dashboard/leads/${lead.id}/edit`} className="btn btn-sm btn-outline-secondary">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
