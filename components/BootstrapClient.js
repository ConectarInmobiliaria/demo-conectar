// app/components/BootstrapClient.js
'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Carga JS de Bootstrap solo en el cliente
    // Al usar require dentro de useEffect, evitamos errores SSR
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .catch(err => console.error('Error cargando Bootstrap JS:', err));
  }, []);
  return null;
}
