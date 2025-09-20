'use client';

import { useId, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import '@/styles/property-gallery.css';

export default function PropertyGallery({ images = [], title = '' }) {
  const galleryId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  // Manejar tecla Escape (siempre llamar el hook)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setFullscreen(false);
    };

    if (fullscreen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [fullscreen]);

  // Bloquear scroll del body (siempre llamar el hook)
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  if (!images?.length) return null;

  const goToSlide = (idx) => {
    setActiveIndex(idx);
    if (swiperRef.current) {
      swiperRef.current.slideTo(idx);
    }
  };

  return (
    <div className="w-full">
      {/* Galería principal */}
      <div className="property-gallery">
        <Swiper
          modules={[Navigation, Keyboard]}
          navigation
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((src, idx) => (
            <SwiperSlide key={`${galleryId}-main-${idx}`}>
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  goToSlide(idx);
                  setFullscreen(true);
                }}
              >
                <Image
                  src={src}
                  alt={`${title} - imagen ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 960px"
                  priority={idx === 0}
                  style={{ objectFit: 'contain', backgroundColor: '#000' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbs */}
        {images.length > 1 && (
          <div className="property-gallery-thumbs">
            {images.map((src, idx) => (
              <div
                key={`${galleryId}-thumb-${idx}`}
                className={`thumb ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                <Image
                  src={src}
                  alt={`Miniatura ${idx + 1}`}
                  width={96}
                  height={64}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {fullscreen && (
        <div
          className="fullscreen-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
            className="close-btn"
            aria-label="Cerrar galería"
          >
            <X className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Navigation, Keyboard]}
            navigation
            keyboard={{ enabled: true }}
            initialSlide={activeIndex}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="flex-1 w-full"
          >
            {images.map((src, idx) => (
              <SwiperSlide key={`${galleryId}-fullscreen-${idx}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={src}
                    alt={`${title} fullscreen - ${idx + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
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