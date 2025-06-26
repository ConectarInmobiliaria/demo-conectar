// app/api/dashboard/usuarios/role/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }
  const { userId, role } = await req.json();
  if (!userId || !role) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
  }
  const allowedRoles = ['ADMIN', 'CORREDOR', 'PROPIETARIO', 'INQUILINO'];
  if (!allowedRoles.includes(role)) {
    return new Response(JSON.stringify({ error: 'Rol inválido' }), { status: 400 });
  }
  try {
    await prisma.user.update({ where: { id: userId }, data: { role } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('Error updating role:', error);
    return new Response(JSON.stringify({ error: 'Error en servidor' }), { status: 500 });
  }
}
