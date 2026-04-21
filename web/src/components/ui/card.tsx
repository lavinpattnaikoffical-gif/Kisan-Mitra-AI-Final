'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverable = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { 
          y: -4, 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        } : {}}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'rounded-[28px] bg-card p-6 shadow-premium border border-brown-muted/10 transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
