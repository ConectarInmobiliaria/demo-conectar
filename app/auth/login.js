// pages/auth/login.js
'use client'; // si en App Router; pero en Pages Router, no usar 'use client'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogle = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4 text-primary">Iniciar sesión</h1>
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Password */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
        >
          Entrar
        </button>
        {/* Si configuras GoogleProvider */}
        {process.env.NEXTAUTH_URL && process.env.GOOGLE_CLIENT_ID && (
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full mt-3 bg-secondary text-white py-2 rounded hover:bg-secondary/90 transition"
          >
            Entrar con Google
          </button>
        )}
      </form>
    </div>
  );
}

