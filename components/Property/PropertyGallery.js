'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

export default function PropertyGallery({ images = [], title = '' }) {
  const galleryId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="w-full">
      {/* Galería principal */}
      <div className="w-full bg-white shadow-md border border-gray-200 overflow-hidden">
        <Swiper
          modules={[Navigation, Keyboard]}
          navigation
          keyboard={{ enabled: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-[400px]"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={`${galleryId}-main-${idx}`}>
              <div
                className="relative w-full h-[400px] cursor-pointer"
                onClick={() => {
                  setActiveIndex(idx);
                  setFullscreen(true);
                }}
              >
                <Image
                  src={src}
                  alt={`${title} - imagen ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 960px"
                  priority={idx === 0}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 bg-gray-50 border-t border-gray-200 overflow-x-auto">
            {images.map((src, idx) => (
              <div
                key={`${galleryId}-thumb-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-24 h-16 cursor-pointer border ${
                  idx === activeIndex ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <Image
                  src={src}
                  alt={`Miniatura ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
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
