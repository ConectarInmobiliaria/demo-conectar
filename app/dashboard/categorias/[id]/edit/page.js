// app/dashboard/categorias/[id]/edit/page.js
import DashboardLayout from '@/components/dashboard/Layout'
import EditCategoryForm from '@/components/dashboard/EditCategoryForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({ params }) {
  // Esperamos params por si vienen de forma async
  const { id } = await params
  const categoryId = parseInt(id, 10)

  let category = null
  try {
    category = await prisma.category.findUnique({ where: { id: categoryId } })
  } catch (err) {
    console.error('Error al cargar categoría para edición:', err)
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="container py-5">
          <h1 className="mb-4">Editar Categoría</h1>
          <p className="text-danger">Categoría no encontrada.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h1 className="mb-4">Editar Categoría</h1>
        <EditCategoryForm category={category} />
      </div>
    </DashboardLayout>
  )
}
