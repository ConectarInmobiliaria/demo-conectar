// app/dashboard/propiedades/[id]/edit/page.js
import EditPropertyForm from '@/components/dashboard/EditPropertyForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }) {
  const id = Number(params.id); // ✅ Aseguramos que sea número

  if (isNaN(id)) {
    console.error('❌ ID inválido recibido en EditPropertyPage:', params.id);
    return (
      <div className="container py-5">
        <p>ID de propiedad inválido.</p>
      </div>
    );
  }

  try {
    const prop = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
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
  } catch (e) {
    console.error('💥 Error al obtener la propiedad en EditPropertyPage:', e);
    return (
      <div className="container py-5">
        <p>Ocurrió un error al cargar la propiedad.</p>
      </div>
    );
  }
}

