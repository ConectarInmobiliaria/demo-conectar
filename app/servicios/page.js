// app/servicios/page.js
import { FadeInHeadingClient } from '@/components/Motion/FadeInHeadingClient';
import { FadeInSectionClient } from '@/components/Motion/FadeInSectionClient';
import { Home, Key, FileText, Building2, Users, ShieldCheck, TrendingUp, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Servicios | Conectar Inmobiliaria',
  description: 'Conoce los servicios de Conectar Inmobiliaria: venta, alquiler, tasaciones, asesoría legal y más.',
};

export default function ServiciosPage() {
  const servicios = [
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: 'Compraventa de Inmuebles',
      desc: 'Te acompañamos desde la tasación y promoción hasta la negociación y firma final. Comprá o vendé con tranquilidad.',
    },
    {
      icon: <Key className="w-8 h-8 text-primary" />,
      title: 'Alquileres',
      desc: 'Encontramos al inquilino ideal o tu próximo hogar, ocupándonos de contratos, trámites legales y gestión completa.',
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: 'Asesoramiento Legal y Financiero',
      desc: 'Te conectamos con profesionales para que tomes decisiones seguras sobre documentación, contratos e hipotecas.',
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      title: 'Administración de Propiedades',
      desc: 'Nos ocupamos de todo: cobro de alquiler, mantenimiento y resolución de incidencias para tu tranquilidad.',
    },
  ];

  const razones = [
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      texto: 'Asesoría personalizada: te acompañamos en cada paso, de la búsqueda a la firma.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-secondary" />,
      texto: 'Tasación profesional: valoramos tu inmueble según el mercado actual.',
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-secondary" />,
      texto: 'Gestión de visitas y contratos: coordinamos interesados y trámites legales.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
      texto: 'Red de confianza: parte del CCPIM y FIRA, con acceso a todo el mercado.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* HERO */}
      <FadeInHeadingClient as="h1" className="text-4xl font-bold text-center mb-6 text-primary">
        Conectamos tus sueños con el hogar perfecto
      </FadeInHeadingClient>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        No solo vendemos o alquilamos propiedades; creamos puentes entre tus deseos y el lugar ideal para vivirlos.
        Nuestro compromiso es un servicio personalizado, transparente y de alta calidad.
      </p>

      {/* SERVICIOS */}
      <FadeInSectionClient>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {servicios.map((s, i) => (
            <div
              key={i}
              className="card bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 flex items-start gap-4"
            >
              {s.icon}
              <div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeInSectionClient>

      {/* POR QUÉ ELEGIRNOS */}
      <FadeInHeadingClient as="h2" className="text-3xl font-bold text-center mb-8 text-secondary">
        ¿Por qué elegirnos?
      </FadeInHeadingClient>

      <FadeInSectionClient>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {razones.map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              {r.icon}
              <p className="text-gray-700">{r.texto}</p>
            </div>
          ))}
        </div>
      </FadeInSectionClient>

      {/* CTA */}
      <div className="text-center">
        <Link href="/contacto" className="btn btn-primary btn-lg rounded-full shadow-md hover:shadow-lg">
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
