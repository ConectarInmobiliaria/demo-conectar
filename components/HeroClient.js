'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroClient() {
  return (
    <section className="relative w-screen min-h-[400px] max-h-[600px] h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-800/40 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-[600px] px-4 text-center text-white">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Bienvenido a Conectar Inmobiliaria
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-3 text-lg md:text-xl"
        >
          Gestionamos tu propiedad con profesionalismo y cercanía.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/propiedades" className="btn btn-primary mt-4">
            Explorar Propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
