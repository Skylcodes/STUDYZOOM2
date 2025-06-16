'use client';

import React from 'react';
import { 
  motion as framerMotion,
  AnimatePresence as FramerAnimatePresence,
  MotionProps
} from 'framer-motion';

// This wrapper component ensures framer-motion only runs on the client side
// and handles the proper types and props

export const Motion = {
  div: (props: React.HTMLAttributes<HTMLDivElement> & MotionProps) => framerMotion.div(props),
  span: (props: React.HTMLAttributes<HTMLSpanElement> & MotionProps) => framerMotion.span(props),
  section: (props: React.HTMLAttributes<HTMLElement> & MotionProps) => framerMotion.section(props),
  custom: (component: any, props: any) => framerMotion(component)(props)
};

export const AnimatePresence = FramerAnimatePresence;

// Helper components for commonly used animations
export const FadeIn = ({ 
  children, 
  duration = 0.6, 
  delay = 0, 
  ...props 
}: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement> & MotionProps) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </Motion.div>
  );
};

export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  ...props 
}: { 
  children: React.ReactNode; 
  staggerDelay?: number;
} & React.HTMLAttributes<HTMLDivElement> & MotionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </Motion.div>
  );
};

export const StaggerItem = ({ 
  children,
  ...props 
}: { 
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & MotionProps) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <Motion.div
      variants={itemVariants}
      whileHover="hover"
      {...props}
    >
      {children}
    </Motion.div>
  );
};
