// components/PropertyInquiryForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PropertyInquiryForm({ propertyId }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          name: nombre,
          email,
          phone,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Error al enviar consulta');
      }
      toast.success('Consulta enviada correctamente');
      // Limpiar formulario
      setNombre('');
      setEmail('');
      setPhone('');
      setMessage('');
      // Opcional: redirigir o mostrar confirmación
    } catch (err) {
      console.error('Error al enviar consulta:', err);
      toast.error(err.message || 'Error al enviar consulta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="inq-nombre" className="form-label">Nombre</label>
        <input
          type="text"
          id="inq-nombre"
          name="nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inq-email" className="form-label">Email</label>
        <input
          type="email"
          id="inq-email"
          name="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inq-phone" className="form-label">Teléfono</label>
        <input
          type="tel"
          id="inq-phone"
          name="phone"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inq-message" className="form-label">Mensaje</label>
        <textarea
          id="inq-message"
          name="message"
          className="form-control"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={submitting}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar consulta'}
      </button>
    </form>
  );
}
