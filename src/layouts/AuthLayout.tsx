/**
 * AuthLayout - Authentication Pages Layout
 * 
 * Specialized layout for login/signup pages that need centered content
 * with consistent Header/Footer positioning.
 * 
 * Replaces the current pattern:
 * <div className="min-h-screen bg-gradient-to-br...">
 *   <Header isHome={false} />
 *   <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16">
 *     ...content...
 *   </div>
 *   <Footer isHome={false} />
 * </div>
 * 
 * With:
 * <AuthLayout>...content...</AuthLayout>
 */

import { ReactNode } from 'react';
import BaseLayout from './BaseLayout';

export default function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <BaseLayout 
      headerProps={{ isHome: false }} 
      footerProps={{ isHome: false }}
    >
      <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="min-h-screen flex items-center justify-center px-4 pb-16">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}