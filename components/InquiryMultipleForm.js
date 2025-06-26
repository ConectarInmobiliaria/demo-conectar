// components/InquiryMultipleForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiryMultipleForm() {
  const [favoritos, setFavoritos] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(guardados);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Nombre y email son requeridos.');
      return;
    }
    if (favoritos.length === 0) {
      setErrorMsg('No tienes propiedades en favoritos.');
      return;
    }
    try {
      // Enviar una solicitud por cada propiedad o una sola con array?
      // Aquí enviamos múltiples solicitudes, una por cada propiedad:
      for (const item of favoritos) {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: item.id,
            name,
            email,
            phone,
            message: `Solicitud para propiedad: ${item.title}. ${message}`,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al enviar solicitud');
        }
      }
      setSuccess(true);
      // Opcional: limpiar favoritos
      // localStorage.removeItem('favoritos');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Solicitudes enviadas</h2>
        <p>Hemos enviado tu solicitud para {favoritos.length} propiedades. Nos contactaremos pronto.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Solicitar visita a favoritos</h2>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <ul className="mb-4">
        {favoritos.map((item) => (
          <li key={item.id} className="mb-1">
            • {item.title} (${item.price?.toLocaleString()})
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          placeholder="Mensaje adicional"
          className="w-full border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Enviar Solicitudes
        </button>
      </form>
    </div>
  );
}
