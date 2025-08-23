// app/dashboard/propiedades/page.js
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPropiedadesPage({ searchParams }) {
  let props = [];
  try {
    props = await prisma.property.findMany({
      include: { category: true, creator: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error trayendo propiedades en DashboardPropiedadesPage:', e);
  }

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
            {props.length > 0 ? (
              props.map((prop) => (
                <tr key={prop.id}>
                  <td>
                    <span className="badge bg-secondary">{prop.code || prop.id}</span>
                  </td>
                  <td className="fw-semibold">{prop.title}</td>
                  <td>{prop.category?.name || '—'}</td>
                  <td>
                    {prop.currency === 'USD' ? 'US$' : 'AR$'}{' '}
                    {prop.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </td>
                  <td>{prop.city ? `${prop.city}, ${prop.location}` : prop.location}</td>
                  <td>
                    {prop.creator
                      ? [prop.creator.firstName, prop.creator.lastName]
                          .filter(Boolean)
                          .join(' ')
                      : '—'}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        prop.published ? 'bg-success' : 'bg-danger'
                      }`}
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
                      <Link
                        href={`/dashboard/propiedades/${prop.id}/delete`}
                        className="btn btn-outline-danger"
                        title="Eliminar"
                      >
                        🗑
                      </Link>
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
