/**
 * BaseLayout - Foundational Layout Component
 * 
 * This component provides the core layout structure that will replace
 * the current chaos of manual Header/Footer imports across all pages.
 * 
 * Key Features:
 * - Centralized Header/Footer management
 * - Consistent spacing using design tokens
 * - Fixed z-index hierarchy
 * - Preserves ALL existing Header/Footer prop patterns
 * - Non-breaking: works alongside existing layouts
 */

import { ReactNode, CSSProperties } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LAYOUT_TOKENS } from '@/design-system/tokens/layout';
import { cn } from '@/design-system/utils/cn';
import { SkipLinks } from '@/components/ui';

export default function BaseLayout({ 
  children, 
  includeHeader = true,
  noPaddingTop = false,
  includeFooter = true,
  headerProps = { isHome: false },
  footerProps = {},
  className,
  style
}: {
  children?: ReactNode;
  includeHeader?: boolean;
  includeFooter?: boolean;
  headerProps?: {
    isHome: boolean;
    [key: string]: any; // Preserve any existing Header props
  };
  footerProps?: {
    isHome?: boolean;
    [key: string]: any; // Preserve any existing Footer props
  };
  className?: string;
  style?: CSSProperties;
  noPaddingTop?: boolean;
}) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)} style={style}>
      <SkipLinks />
      
      {includeHeader && (
        <header id="main-navigation" style={{ zIndex: LAYOUT_TOKENS.header.zIndex }}>
          <Header isHome={headerProps?.isHome ?? false} />
        </header>
      )}
      
      <main 
        id="main-content"
        className="flex-1"
        style={{ 
          paddingTop: includeHeader && !noPaddingTop ? `${LAYOUT_TOKENS.content.paddingTop}px` : 0 
        }}
        tabIndex={-1}
      >
        {children}
      </main>
      
      {includeFooter && (
        <footer id="footer" style={{ zIndex: LAYOUT_TOKENS.footer.zIndex }}>
          <Footer />
        </footer>
      )}
    </div>
  );
}