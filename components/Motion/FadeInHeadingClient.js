// components/Motion/FadeInHeadingClient.js
'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * Encapsula un heading (h1/h2/h3...) con animación de fade-in.
 * Usar: <FadeInHeadingClient as="h2" className="..." delay={0.2}>Título</FadeInHeadingClient>
 */
export function FadeInHeadingClient({ as: Tag = 'h2', children, delay = 0, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <Tag className={className} {...props}>
        {children}
      </Tag>
    </motion.div>
  );
}
