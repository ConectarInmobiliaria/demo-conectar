'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleGoogle = () => signIn('google', { callbackUrl });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="h4 text-center mb-3">Iniciar sesión</h1>
        {errorMsg && <p className="text-danger">{errorMsg}</p>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-2">Entrar</button>
        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <button type="button" onClick={handleGoogle} className="btn btn-outline-secondary w-100">
            Entrar con Google
          </button>
        )}
      </form>
    </div>
  );
}
