'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './HeroClient.module.css';

export default function HeroClient() {
  const videoId = 'ksU5K57ZrcU';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`;

  return (
    <section className={styles.heroSection}>
      <div className={styles.videoWrapper}>
        <iframe
          className={styles.video}
          src={embedUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Fondo Hero Video"
        />
        <div className={styles.overlay} />
      </div>
      <div className={`${styles.content} text-center text-white px-3`}>        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="display-5 fw-bold"
        >
          Bienvenido a Conectar Inmobiliaria
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