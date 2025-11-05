 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Users, Home, Settings, FileText } from 'lucide-react';
import React from 'react';

export default function AdminSidebar() {
  const pathname = usePathname() || '/';

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/properties', label: 'Properties', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 hidden md:block bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
          <House className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Easy Home</h4>
          <p className="text-xs text-gray-500">Admin panel</p>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                active ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link href="/admin/properties" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
          <FileText className="w-5 h-5 text-gray-400" />
          Quick properties
        </Link>
      </div>
    </aside>
  );
}
