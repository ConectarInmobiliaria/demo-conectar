// components/Motion/HoverScaleClient.js
'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * Envuelve children con un <motion.div> que escala ligeramente al hover.
 * Ideal para tarjetas.
 */
export function HoverScaleClient({ children, className = '', style = {}, ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
