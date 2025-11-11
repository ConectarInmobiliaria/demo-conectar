'use client';

import { useId, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import '@/styles/property-gallery.css';

/**
 * Galería profesional de propiedades
 * - Soporta URLs de Supabase (relativas o completas)
 * - Miniaturas sincronizadas
 * - Modo fullscreen con navegación
 */
export default function PropertyGallery({ images = [], title = '' }) {
  const galleryId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperMainRef = useRef(null);
  const swiperFullscreenRef = useRef(null);

  // ✅ Tomar dominio Supabase del entorno
  const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://TU-PROJECT-ID.supabase.co';
  const BUCKET_BASE = `${SUPABASE_URL}/storage/v1/object/public`;

  // 🧩 Normalizar imágenes (eliminar nulos y duplicados)
  const normalizedImages = Array.from(
    new Set(
      images
        .filter(Boolean)
        .map((src) =>
          src.startsWith('http')
            ? src
            : `${BUCKET_BASE}/${src.replace(/^\/+/, '')}`
        )
    )
  );

  // ⌨️ Cerrar con tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    if (fullscreen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fullscreen]);

  // 🚫 Bloquear scroll al abrir fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  if (!normalizedImages.length) return null;

  const goToSlide = (idx) => {
    setActiveIndex(idx);
    swiperMainRef.current?.slideTo(idx);
  };

  const openFullscreen = (idx) => {
    setActiveIndex(idx);
    setFullscreen(true);
    // Esperar a que se monte el Swiper fullscreen antes de mover el slide
    setTimeout(() => {
      swiperFullscreenRef.current?.slideTo(idx);
    }, 100);
  };

  return (
    <div className="w-full">
      {/* 🖼️ Galería principal */}
      <div className="property-gallery">
        <Swiper
          modules={[Navigation, Keyboard]}
          navigation
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => (swiperMainRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {normalizedImages.map((src, idx) => (
            <SwiperSlide key={`${galleryId}-main-${idx}`}>
              <div
                className="relative w-full h-[420px] md:h-[480px] bg-black cursor-pointer"
                onClick={() => openFullscreen(idx)}
              >
                <Image
                  src={src}
                  alt={`${title} - imagen ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 960px"
                  priority={idx === 0}
                  style={{ objectFit: 'contain', backgroundColor: '#000' }}
                  onError={() => console.error('Error cargando imagen:', src)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🧩 Miniaturas */}
        {normalizedImages.length > 1 && (
          <div className="property-gallery-thumbs flex gap-2 mt-2 justify-center flex-wrap">
            {normalizedImages.map((src, idx) => (
              <div
                key={`${galleryId}-thumb-${idx}`}
                className={`thumb overflow-hidden rounded-md border ${
                  idx === activeIndex
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-300 opacity-80 hover:opacity-100'
                } transition-all cursor-pointer`}
                onClick={() => goToSlide(idx)}
              >
                <Image
                  src={src}
                  alt={`Miniatura ${idx + 1}`}
                  width={96}
                  height={64}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌙 Fullscreen Overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreen(false)}
        >
          {/* Botón cerrar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
            className="absolute top-6 right-8 text-white hover:text-gray-400 transition"
            aria-label="Cerrar galería"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Swiper fullscreen */}
          <Swiper
            modules={[Navigation, Keyboard]}
            navigation
            keyboard={{ enabled: true }}
            initialSlide={activeIndex}
            onSwiper={(swiper) => (swiperFullscreenRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="flex-1 w-full"
          >
            {normalizedImages.map((src, idx) => (
              <SwiperSlide key={`${galleryId}-fullscreen-${idx}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={src}
                    alt={`${title} fullscreen - ${idx + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={idx === activeIndex}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
