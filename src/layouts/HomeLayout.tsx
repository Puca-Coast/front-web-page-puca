/**
 * HomeLayout - Special Layout for Home Page
 * 
 * The home page has unique layout requirements due to the intro system.
 * This component preserves the EXACT logic from MainContent.tsx while
 * fixing the critical header height bug (6px → 80px).
 * 
 * Key Preservations:
 * - isHome prop logic for Header/Footer timing
 * - Intro completion state handling
 * - Carousel height calculations
 * - Overflow hidden behavior
 * 
 * Bug Fixes:
 * - Header height: 6px → 80px (matches actual header height)
 * - Z-index: Uses consistent design tokens
 */

import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LAYOUT_TOKENS } from '@/design-system/tokens/layout';

export default function HomeLayout({ 
  children, 
  showIntro, 
  introCompleted 
}: {
  children?: ReactNode;
  showIntro: boolean;
  introCompleted: boolean;
}) {
  // Preserve EXACT logic from MainContent.tsx but fix the header height bug
  const headerHeight = LAYOUT_TOKENS.header.height; // 80px instead of 6px!
  const carouselHeight = `calc(100vh - ${headerHeight}px)`;
  
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div style={{ zIndex: LAYOUT_TOKENS.header.zIndex }}>
        <Header isHome={!introCompleted} />
      </div>
      
      <div
        className="flex-grow"
        style={{
          marginTop: `${headerHeight}px`, // FIXED: was 6px, now 80px
          height: carouselHeight,
        }}
      >
        {children}
      </div>

      <div style={{ zIndex: LAYOUT_TOKENS.footer.zIndex }}>
        <Footer isHome={!introCompleted} />
      </div>
    </div>
  );
}