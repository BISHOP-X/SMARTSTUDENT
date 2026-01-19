import { ReactNode } from 'react';
import Navigation from './Navigation';
import MobileNav from './MobileNav';

interface PageLayoutProps {
  children: ReactNode;
  userRole: 'student' | 'lecturer';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function PageLayout({
  children,
  userRole,
  activeTab,
  onTabChange,
  onLogout
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Navigation 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
      />
      <main className="flex-1 bg-background pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav userRole={userRole} />
    </div>
  );
}
