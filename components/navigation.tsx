'use client';

import { useRouter } from 'next/navigation';
import { Home, Plus, User, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab?: string;
  className?: string;
}

export function Navigation({ activeTab = 'home', className }: NavigationProps) {
  const router = useRouter();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'markets',
      label: 'Markets',
      icon: TrendingUp,
      path: '/markets',
    },
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      path: '/create-market',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 bg-background border-t border-border',
      'max-w-md mx-auto',
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors',
                'min-w-[60px]',
                isActive
                  ? 'text-accent bg-accent/10'
                  : 'text-text-secondary hover:text-foreground hover:bg-surface'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

