// components/InquiryList.js
'use client';

import { useState, useEffect } from 'react';

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/inquiries');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al cargar solicitudes');
        }
        const data = await res.json();
        setInquiries(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Visita</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      {inquiries.length === 0 ? (
        <p>No hay solicitudes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Propiedad</th>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Teléfono</th>
                <th className="border px-4 py-2">Mensaje</th>
                <th className="border px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td className="border px-4 py-2">{inq.id}</td>
                  <td className="border px-4 py-2">
                    {inq.property?.title || '—'}
                  </td>
                  <td className="border px-4 py-2">{inq.name}</td>
                  <td className="border px-4 py-2">{inq.email}</td>
                  <td className="border px-4 py-2">{inq.phone || '—'}</td>
                  <td className="border px-4 py-2">{inq.message || '—'}</td>
                  <td className="border px-4 py-2">
                    {new Date(inq.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
