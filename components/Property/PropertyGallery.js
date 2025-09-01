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

  if (!images?.length) return null;

  // --- Cuando hago click en una miniatura, muevo el Swiper principal
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
  {/* Principal */}
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


      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-50"
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
