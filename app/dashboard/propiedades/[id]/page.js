// app/dashboard/propiedades/[id]/page.js
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPropertyPage({ params }) {
  const { id } = await params;

  let prop = null;
  try {
    prop = await prisma.property.findUnique({
      where: { id },
      include: { category: true, creator: true },
    });
  } catch (e) {
    console.error('Error fetching property in DashboardPropertyPage:', e);
  }

  if (!prop) {
    return (
      <div className="container py-5">
        <p>Propiedad no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1>{prop.title}</h1>
      <p>Categoría: {prop.category?.name}</p>
      <p>Creado por: {prop.creator ? `${prop.creator.firstName} ${prop.creator.lastName}` : '—'}</p>
      {/* y el resto del UI */}
      <Link href="/dashboard/propiedades" className="btn btn-outline-secondary">
        ← Volver
      </Link>
    </div>
  );
}
