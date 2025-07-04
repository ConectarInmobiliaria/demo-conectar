// components/HeroClient.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroClient() {
  return (
    <section className="position-relative">
      <Image
        src="/slide1.avif"
        alt="Portada Inmobiliaria Marcon"
        width={1920}
        height={600}
        className="w-100"
        style={{ objectFit: 'cover', height: '60vh' }}
      />
      <div
        className="position-absolute top-50 start-50 translate-middle text-center text-white px-3"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderRadius: '8px' }}
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="display-5 fw-bold"
        >
          Bienvenido a Marcon Inmobiliaria
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lead"
        >
          Gestionamos tu propiedad con profesionalismo y cercanía.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <Link href="/propiedades" className="btn btn-primary mt-3">
            Explorar Propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
