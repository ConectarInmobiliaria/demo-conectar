'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './HeroClient.module.css';
import { useRef, useEffect } from 'react';

export default function HeroClient() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forzar que siempre arranque en el segundo 6
    const handlePlay = () => {
      if (video.currentTime < 6) {
        video.currentTime = 6;
      }
    };

    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('play', handlePlay);
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/posadas-conectar.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className={`${styles.content} text-center text-white px-3`}>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="display-5 fw-bold"
        >
          Bienvenido a Conectar Inmobiliaria!
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lead"
        >
          ¿Necesitas ayuda para encontrar el hogar de tus sueños?. Estamos listos para asistirte.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/propiedades" className="btn btn-primary mt-3">
            Explorar Propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
