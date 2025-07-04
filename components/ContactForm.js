// components/ContactForm.js
'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Nombre: ${name}%0AEmail: ${email}%0AMensaje: ${message}`;
    window.open(`https://wa.me/3764617711?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Nombre *</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-2xl"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email *</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-2xl"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium">Mensaje *</label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-2xl"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-2xl font-semibold bg-green-600 hover:bg-green-700 text-white"
      >
        Enviar por WhatsApp
      </button>
    </form>
  );
}
