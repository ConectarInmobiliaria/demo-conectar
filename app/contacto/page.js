// app/contacto/page.js
import Link from 'next/link';
import { MapPin, Phone, Youtube, Facebook, Instagram } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contacto | Conectar Inmobiliaria',
  description: 'Contáctanos en Conectar Inmobiliaria. Dirección, teléfono y redes sociales.',
};

export default function ContactoPage() {
  const mapSrc =
    'https://maps.google.com/maps?q=Av.%20Padre%20Kolping%20y%20Av.%20Lopez%20y%20Planes%20Posadas%20Misiones%20Argentina&z=15&output=embed';

  return (
    <section className="container py-5">
      <h1 className="mb-4 text-center text-2xl font-semibold">Contáctanos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información y mapa */}
        <div>
          <h5 className="text-xl font-medium mb-3 flex items-center gap-2">
            <MapPin size={24} /> Visítanos
          </h5>
          <div className="aspect-video mb-4 rounded-2xl shadow">
            <iframe
              src={mapSrc}
              title="Ubicación Conectar Inmobiliaria"
              allowFullScreen
              loading="lazy"
              className="w-full h-full rounded-2xl"
            />
          </div>
          <p className="flex items-center gap-2 mb-2">
            <MapPin /> Av. Padre Kolping y Av. López y Planes, Posadas, Misiones
          </p>
          <p className="flex items-center gap-2 mb-2">
            <Phone />
            <a href="tel:+543764462x" className="hover:underline">0376 446-2711</a>
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link href="https://www.youtube.com/channel/UCHwQO6YQq9iJJGsxbrj2KjQ" target="_blank" aria-label="YouTube">
              <Youtube size={28} className="text-red-600 hover:text-red-700" />
            </Link>
            <Link href="https://www.facebook.com/ConectarInmobiliaria" target="_blank" aria-label="Facebook">
              <Facebook size={28} className="text-blue-600 hover:text-blue-700" />
            </Link>
            <Link href="https://www.instagram.com/conectarinmobiliaria/" target="_blank" aria-label="Instagram">
              <Instagram size={28} className="text-pink-500 hover:text-pink-600" />
            </Link>
          </div>
        </div>

        {/* Formulario */}
        <div>
          <h5 className="text-xl font-medium mb-3 flex items-center gap-2">
            <Phone /> Escríbenos
          </h5>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}