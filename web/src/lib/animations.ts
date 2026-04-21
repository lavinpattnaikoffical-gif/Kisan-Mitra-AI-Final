import { Variants } from 'framer-motion';

export const STANDARD_DURATION = 0.3;
export const STANDARD_EASE = [0.4, 0, 0.2, 1]; // Custom cubic-bezier for ease-in-out

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: STANDARD_DURATION,
      ease: STANDARD_EASE
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: STANDARD_DURATION,
      ease: STANDARD_EASE
    }
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: STANDARD_EASE
    }
  }
};

export const buttonPress = {
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

export const cardHover = {
  hover: { 
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  },
  transition: { duration: 0.2 }
};

export const urgentShake: Variants = {
  animate: {
    x: [0, -2, 2, -2, 2, 0],
    transition: {
      repeat: Infinity,
      repeatDelay: 5,
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: STANDARD_EASE
    }
  }
};
