// components/LoginForm.js
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from 'react-bootstrap'; // Asegúrate de tener instalado react-bootstrap

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setSubmitting(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleGoogle = () => signIn('google', { callbackUrl });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <form onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow-sm"
            style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="h4 text-center mb-3">Iniciar sesión</h1>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email"
                 type="email"
                 className="form-control"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 required />
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input id="password"
                 type={showPassword ? 'text' : 'password'}
                 className="form-control pe-5"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 required />
          <button type="button"
                  className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-1"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>

        <button type="submit"
                className="btn btn-primary w-100 mb-2"
                disabled={submitting}>
          {submitting
            ? <>
                <Spinner animation="border" size="sm" className="me-2" />
                Entrando…
              </>
            : 'Entrar'}
        </button>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <button type="button"
                  onClick={handleGoogle}
                  className="btn btn-outline-secondary w-100">
            <i className="bi bi-google me-2"></i>Entrar con Google
          </button>
        )}
      </form>
    </div>
  );
}
