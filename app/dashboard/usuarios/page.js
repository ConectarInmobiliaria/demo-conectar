// app/dashboard/usuarios/page.js
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import UserRow from '@/components/dashboard/UserRow';

export const dynamic = 'force-dynamic';

export default async function UsuariosPage({ searchParams }) {
  // Esperar a searchParams antes de usar sus propiedades:
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Construir filtro:
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  // Obtener total y usuarios
  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Gestión de Usuarios</h1>
      {/* Barra de búsqueda */}
      <form className="d-flex mb-3" action="/dashboard/usuarios">
        <input
          name="search"
          className="form-control me-2"
          type="search"
          placeholder="Buscar por nombre o email"
          defaultValue={search}
        />
        <button className="btn btn-outline-primary" type="submit">Buscar</button>
      </form>
      {/* Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <nav aria-label="Paginación usuarios">
        <ul className="pagination">
          {/* Página anterior */}
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <Link
              href={{
                pathname: '/dashboard/usuarios',
                query: { page: page - 1, search }
              }}
              className="page-link"
            >
              Anterior
            </Link>
          </li>
          {/* Páginas numeradas */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
              <Link
                href={{
                  pathname: '/dashboard/usuarios',
                  query: { page: p, search }
                }}
                className="page-link"
              >
                {p}
              </Link>
            </li>
          ))}
          {/* Página siguiente */}
          <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
            <Link
              href={{
                pathname: '/dashboard/usuarios',
                query: { page: page + 1, search }
              }}
              className="page-link"
            >
              Siguiente
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
