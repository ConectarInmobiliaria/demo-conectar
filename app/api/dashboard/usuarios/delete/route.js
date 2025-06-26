// app/api/dashboard/usuarios/delete/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }
  const { userId } = await req.json();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId faltante' }), { status: 400 });
  }
  try {
    await prisma.user.delete({ where: { id: userId } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return new Response(JSON.stringify({ error: 'Error en servidor' }), { status: 500 });
  }
}
