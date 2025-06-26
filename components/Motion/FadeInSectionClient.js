// components/Motion/FadeInSectionClient.js
'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * Similar a FadeInClient, pero con posibilidad de delay y custom props.
 */
export function FadeInSectionClient({ children, delay = 0, className = '', style = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
