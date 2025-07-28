/**
 * Layout System Exports
 * 
 * Clean, centralized exports for the new layout system.
 * This makes importing layouts consistent across the app.
 */

export { default as BaseLayout } from './BaseLayout';
export { default as PageLayout } from './PageLayout';
export { default as AuthLayout } from './AuthLayout';
export { default as HomeLayout } from './HomeLayout';

// Smart Footer system
export { default as SmartFooter } from '../components/layout/SmartFooter';
export { useScrollProgress } from '../hooks/useScrollProgress';

// Type exports would go here if we had explicit prop interfaces exported