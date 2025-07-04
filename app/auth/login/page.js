import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div>Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}