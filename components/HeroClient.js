'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  '/slides/slide1.jpg',
  '/slides/slide2.jpg',
];

export default function HeroClient() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const delay = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      delay
    );
    return () => resetTimeout();
  }, [current]);

  const prevSlide = () => {
    resetTimeout();
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    resetTimeout();
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="position-relative overflow-hidden" style={{ height: '60vh' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current]}
            alt={`Slide ${current + 1}`}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="position-absolute top-1/2 start-0 translate-middle-y btn btn-link text-white"
        style={{ fontSize: '2rem', zIndex: 10 }}
        aria-label="Anterior"
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      <button
        onClick={nextSlide}
        className="position-absolute top-1/2 end-0 translate-middle-y btn btn-link text-white"
        style={{ fontSize: '2rem', zIndex: 10 }}
        aria-label="Siguiente"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </section>
  );
}
