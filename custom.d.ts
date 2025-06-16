/// <reference types="@types/react" />

// Extend the Window interface to include any global browser APIs you're using
declare global {
  interface Window {
    // Add any global browser APIs here if needed
  }
}

// For CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// For SVG imports
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// For other assets
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.woff';
declare module '*.woff2';
declare module '*.ttf';

// For environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    // Add other environment variables here
  }
}
