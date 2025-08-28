'use client';

import { useId } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function PropertyGallery({ images = [], title = '' }) {
  const galleryId = useId();

  if (!images?.length) return null;

  return (
    <div className="property-gallery">
      {/* Principal */}
      <Swiper
        modules={[Thumbs, Navigation, Keyboard]}
        navigation
        keyboard={{ enabled: true }}
        className="mb-2"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={`${galleryId}-main-${idx}`}>
            <div className="slide">
              <Image
                src={src}
                alt={`${title} - imagen ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                priority={idx === 0}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs */}
      {images.length > 1 && (
        <div className="property-thumbs">
          <Swiper
            slidesPerView={Math.min(5, images.length)}
            spaceBetween={10}
            modules={[Thumbs, Navigation]}
            watchSlidesProgress
          >
            {images.map((src, idx) => (
              <SwiperSlide key={`${galleryId}-thumb-${idx}`}>
                <div className="thumb">
                  <Image
                    src={src}
                    alt={`Miniatura ${idx + 1}`}
                    width={160}
                    height={80}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
