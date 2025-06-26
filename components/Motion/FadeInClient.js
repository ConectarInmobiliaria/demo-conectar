// components/Motion/FadeInClient.js
'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * Envuelve children con un <motion.div> que hace fade-in al montar.
 * Props adicionales se pasan al motion.div.
 */
export function FadeInClient({ children, className = '', style = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
