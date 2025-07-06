export const dynamic = 'force-dynamic';

import DashboardLayout from '@/components/dashboard/Layout';
import CalendarDashboard from '@/components/dashboard/CalendarDashboard';
import { prisma } from '@/lib/prisma';

export default async function DashboardHome() {
  // Contadores (si los necesitas aún)
  const [userCount, propCount, inqCount] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.inquiry.count(),
  ]);

  // Traer citas próximas (por ejemplo, del mes actual)
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth   = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const rawAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      }
    },
    include: {
      agent:    { select: { firstName: true, lastName: true } },
      property: { select: { title: true } },
    },
    orderBy: { date: 'asc' }
  });

  // Mapear a un formato más plano
  const appointments = rawAppointments.map(a => ({
    id:             a.id,
    date:           a.date.toISOString(),
    agentName:      `${a.agent.firstName || ''} ${a.agent.lastName || ''}`.trim(),
    propertyTitle:  a.property.title,
  }));

  return (
    <DashboardLayout>
      <h1 className="mb-4">Calendario de Reuniones / Visitas:</h1>
      <CalendarDashboard appointments={appointments} />
    </DashboardLayout>
  );
}
