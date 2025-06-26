// app/dashboard/propiedades/page.js
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPropiedadesPage({ searchParams }) {
  // Si quieres paginación, puedes usar searchParams; aquí listamos todas o puedes hacer paginación simple.
  // Ejemplo sin paginación (si pocas propiedades). Si son muchas, implementa skip/take con await searchParams.
  let props = [];
  try {
    props = await prisma.property.findMany({
      include: { category: true, creator: true },
      orderBy: { createdAt: 'desc' },
      // skip: ..., take: ...
    });
  } catch (e) {
    console.error('Error trayendo propiedades en DashboardPropiedadesPage:', e);
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Propiedades</h1>
        <Link href="/dashboard/propiedades/new" className="btn btn-primary">
          Nueva Propiedad
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Ubicación</th>
              <th>Creado por</th>
              <th>Publicado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {props.map(prop => (
              <tr key={prop.id}>
                <td>{prop.title}</td>
                <td>{prop.category?.name}</td>
                <td>${prop.price.toLocaleString()}</td>
                <td>{prop.location}</td>
                <td>{prop.creator?.name || '—'}</td>
                <td>{new Date(prop.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    href={`/dashboard/propiedades/${prop.id}`}
                    className="btn btn-sm btn-outline-info me-2"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/propiedades/${prop.id}/edit`}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/dashboard/propiedades/${prop.id}/delete`}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
