// app/auth/login/page.js
import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Suspense fallback={
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando…</span>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
