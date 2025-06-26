// app/dashboard/categorias/page.js
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // evitar prerender si la DB no está accesible en build

export default async function CategoriasPage({ searchParams }) {
  // No es “use client”, es server component
  // Paginación opcional o listar todas si pocas
  let categories = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (err) {
    console.error('Error al obtener categorías en dashboard:', err);
  }
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Categorías</h1>
        <Link href="/dashboard/categorias/new" className="btn btn-primary">
          Nueva Categoría
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>
                  <Link href={`/dashboard/categorias/${cat.id}/edit`} className="btn btn-sm btn-outline-secondary me-2">
                    Editar
                  </Link>
                  <Link href={`/dashboard/categorias/${cat.id}/delete`} className="btn btn-sm btn-outline-danger">
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
