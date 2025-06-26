// components/ContactForm.js
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Error al enviar el formulario');
      }
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error en ContactForm:', err);
      setErrorMsg(err.message || 'Error en envío');
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'success' && (
        <div className="alert alert-success" role="alert">
          ¡Gracias! Tu mensaje ha sido enviado. Te responderemos pronto.
        </div>
      )}
      {status === 'error' && errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Teléfono (opcional)
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={status === 'submitting'}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Mensaje
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}
