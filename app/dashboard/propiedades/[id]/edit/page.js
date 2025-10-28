// app/dashboard/propiedades/[id]/edit/page.js
import EditPropertyForm from '@/components/dashboard/EditPropertyForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }) {
  try {
    // ✅ Esperamos params para evitar error de "sync dynamic APIs"
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || typeof id !== 'string') {
      console.error('❌ ID inválido recibido en EditPropertyPage:', id);
      return (
        <div className="container py-5">
          <p>ID de propiedad inválido.</p>
        </div>
      );
    }

    // ✅ Buscamos la propiedad (id string)
    const prop = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!prop) {
      console.warn(`⚠️ No se encontró la propiedad con id ${id}`);
      return (
        <div className="container py-5">
          <p>Propiedad no encontrada.</p>
        </div>
      );
    }

    return <EditPropertyForm property={prop} />;
  } catch (error) {
    console.error('💥 Error al obtener la propiedad en EditPropertyPage:', error);
    return (
      <div className="container py-5">
        <p>Ocurrió un error al cargar la propiedad.</p>
      </div>
    );
  }
}
