// app/dashboard/page.js
export const dynamic = 'force-dynamic';

import DashboardLayout from '@/components/dashboard/Layout';
import { prisma } from '@/lib/prisma';

export default async function DashboardHome() {
  // Ahora esto se ejecuta en request-time, no en build
  let userCount = 0, propertyCount = 0, inquiryCount = 0;
  try {
    [userCount, propertyCount, inquiryCount] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.inquiry.count(),
    ]);
  } catch (e) {
    console.error('Error conectando a DB en DashboardHome:', e);
    // Opcional: manejar fallback, p.ej. mostrar mensaje de error en UI
  }

  return (
    <DashboardLayout>
      <h1 className="mb-4">Panel de Control</h1>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text fs-2">{userCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Propiedades</h5>
              <p className="card-text fs-2">{propertyCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">Consultas / Solicitudes</h5>
              <p className="card-text fs-2">{inquiryCount}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
