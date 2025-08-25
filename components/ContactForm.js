'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Nombre: ${name}%0AEmail: ${email}%0AMensaje: ${message}`;
    // WhatsApp al primer número
    window.open(`https://wa.me/543764728718?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre *</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email *</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">Mensaje *</label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
      >
        <i className="bi bi-whatsapp me-2"></i>Enviar por WhatsApp
      </button>
    </form>
  );
}
