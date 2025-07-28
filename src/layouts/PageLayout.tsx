/**
 * PageLayout - Standard Page Layout Component
 * 
 * This component provides the standard layout pattern used by most pages.
 * It wraps BaseLayout with common page-specific configurations.
 * 
 * Replaces the current pattern:
 * <Header isHome={false} />
 * <main className="puca-page-content">...</main>
 * <Footer isHome={false} />
 * 
 * With a clean, consistent API:
 * <PageLayout>...</PageLayout>
 */

import { ReactNode } from 'react';
import BaseLayout from './BaseLayout';
import { cn } from '@/design-system/utils/cn';

export default function PageLayout({ 
  children, 
  background = 'default',
  className,
  includeHeader = true,
  noPaddingTop = false,
}: { 
  children?: ReactNode; 
  background?: 'default' | 'gradient'; 
  className?: string; 
  includeHeader?: boolean;
  noPaddingTop?: boolean;
}) {
  const backgroundClass = background === 'gradient' 
    ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    : '';
    
  return (
    <BaseLayout 
      headerProps={{ isHome: false }} 
      footerProps={{ isHome: false }}
      includeHeader={includeHeader}
      noPaddingTop={noPaddingTop}
    >
      <div className={cn("min-h-full", backgroundClass, className)}>
        {children}
      </div>
    </BaseLayout>
  );
}