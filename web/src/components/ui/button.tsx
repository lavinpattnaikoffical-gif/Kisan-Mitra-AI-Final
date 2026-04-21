'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white shadow-premium hover:bg-primary-hover',
      secondary: 'bg-card text-brown border border-brown-muted/10 shadow-sm hover:bg-sand',
      outline: 'border-2 border-primary text-primary hover:bg-primary-50',
      ghost: 'text-brown-muted hover:bg-card hover:text-brown',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'inline-flex items-center justify-center rounded-pill font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary-50 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
