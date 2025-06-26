// app/dashboard/propiedades/[id]/edit/page.js
import DashboardLayout from '@/components/dashboard/Layout';
import { prisma } from '@/lib/prisma';
import EditPropertyForm from '@/components/dashboard/EditPropertyForm';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }) {
  const id = parseInt(params.id, 10);
  const property = await prisma.property.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!property) {
    return (
      <DashboardLayout>
        <p>Propiedad no encontrada.</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <EditPropertyForm property={property} />
    </DashboardLayout>
  );
}
