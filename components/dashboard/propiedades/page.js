// app/dashboard/propiedades/page.js
import DashboardLayout from '@/components/dashboard/Layout';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PropertyRow from '@/components/dashboard/PropertyRow';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  // Obtener todas las propiedades, incluir categoría y creador
  const properties = await prisma.property.findMany({
    include: { category: true, creator: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Propiedades</h1>
        <Link href="/dashboard/propiedades/new" className="btn btn-primary">
          Nueva Propiedad
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Creado por</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(prop => (
              <PropertyRow key={prop.id} property={prop} onDeleted={() => {
                location.reload();
              }} />
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
