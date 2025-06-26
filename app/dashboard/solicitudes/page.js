// app/dashboard/solicitudes/page.js
'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SolicitudesPage() {
  const { data: session, status } = useSession();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/solicitudes')
        .then(res => res.json())
        .then(data => setSolicitudes(data))
        .catch(console.error);
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="container py-5">Cargando...</div>;
  }
  if (status === 'unauthenticated') {
    return <div className="container py-5">Acceso denegado.</div>;
  }

  return (
    <section className="container py-5">
      <h1 className="mb-4">Solicitudes</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Propiedad</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.propiedadTitulo}</td>
              <td>{s.nombre}</td>
              <td>{s.email}</td>
              <td>{s.mensaje}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
