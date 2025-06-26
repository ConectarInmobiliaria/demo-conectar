// app/dashboard/categorias/[id]/edit/page.js
import DashboardLayout from '@/components/dashboard/Layout';
import { prisma } from '@/lib/prisma';
import EditCategoryForm from '@/components/dashboard/EditCategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }) {
  const id = parseInt(params.id, 10);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return (
      <DashboardLayout>
        <p>Categoría no encontrada.</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <EditCategoryForm category={category} />
    </DashboardLayout>
  );
}
