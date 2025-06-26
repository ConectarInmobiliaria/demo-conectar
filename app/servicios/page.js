// app/servicios/page.js
import ServiciosClient from '@/components/ServiciosClient';

export const metadata = {
  title: 'Servicios | Inmobiliaria Marcon',
  description: 'Conoce nuestros servicios: Tasaciones, Ventas, Alquileres, Asesoría Legal, Gestión Contable, Búsqueda Personalizada, etc.',
};

export default function ServiciosPage() {
  return <ServiciosClient />;
}
