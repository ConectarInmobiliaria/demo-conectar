// app/dashboard/categorias/page.js
import DashboardLayout from '@/components/dashboard/Layout';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CategoryRow from '@/components/dashboard/CategoryRow';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // obtener todas las categorías
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <DashboardLayout>
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <CategoryRow key={cat.id} category={cat} onDeleted={(deletedId) => {
                // Client-side: tras eliminar, recarga la página
                // Pero como estamos en Server Component, simplest es forzar reload:
                location.reload();
              }} />
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
