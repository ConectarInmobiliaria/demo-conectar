// components/InquiryForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiryForm({ propertyId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email) {
      setErrorMsg('Nombre y email son requeridos.');
      return;
    }
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, name, email, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar solicitud');
      }
      setSuccess(true);
      // Opcional: redirigir o limpiar formulario
      // Por ejemplo, redirigir a página de confirmación:
      // router.push('/confirmacion-solicitud');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Solicitud enviada</h2>
        <p>Gracias por tu interés. Nos pondremos en contacto pronto para coordinar la visita.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Solicitar visita</h2>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
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
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
