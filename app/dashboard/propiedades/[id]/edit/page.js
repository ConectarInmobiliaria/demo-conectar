// app/dashboard/propiedades/[id]/edit/page.js
import EditPropertyForm from '@/components/dashboard/EditPropertyForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }) {
  // 1️⃣ Esperamos params antes de usarlo
  const { id } = await params;
  
  // 2️⃣ Ahora podemos usar el id (un string cuid)
  let prop = null;
  try {
    prop = await prisma.property.findUnique({ where: { id } });
  } catch (e) {
    console.error('Error fetching property in EditPropertyPage:', e);
  }

  if (!prop) {
    return (
      <div className="container py-5">
        <p>Propiedad no encontrada.</p>
      </div>
    );
  }

  return <EditPropertyForm property={prop} />;
}

