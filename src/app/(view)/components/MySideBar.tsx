'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, UsersIcon, Cog6ToothIcon,
  ChartBarIcon, ShieldCheckIcon, BuildingStorefrontIcon,
  FlagIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';
import ThemeToggler from './themeToggler';

const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    
    const isActive = (path) => {
      return pathname === path;
    };

  return (
    <div>
      <ThemeToggler />
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-body-md focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-primary text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 border-b border-primary-light">
          <p className="text-title-lg font-bold">Admin Portal</p>
        </div>
        <nav className="mt-8">
          <div className="px-4 mb-4">
            <p className="text-title-sm font-semibold text-primary-light uppercase tracking-wider">Main</p>
            <div className="mt-3 space-y-1">
              <Link href="/dashboard" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/dashboard') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <HomeIcon className="mr-3 h-6 w-6" />
                Dashboard
              </Link>
              
              {/* User Account Management */}
              <Link href="/users" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/users') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <UsersIcon className="mr-3 h-6 w-6" />
                User Management
              </Link>
              
              {/* Content Moderation */}
              <Link href="/moderation" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/moderation') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <FlagIcon className="mr-3 h-6 w-6" />
                Content Moderation
              </Link>
              
              {/* Provider Approvals */}
              <Link href="/providers" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/providers') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <BuildingStorefrontIcon className="mr-3 h-6 w-6" />
                Provider Approvals
              </Link>
            </div>
          </div>
          
          
          <div className="px-4 mb-4">
            <p className="text-title-sm font-semibold text-primary-light uppercase tracking-wider">Additional</p>
            <div className="mt-3 space-y-1">
              {/* Analytics & Reporting */}
              <Link href="/analytics" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/analytics') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <ChartBarIcon className="mr-3 h-6 w-6" />
                Analytics & Reports
              </Link>
              
              {/* Dispute Management */}
              <Link href="/disputes" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/disputes') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <ShieldCheckIcon className="mr-3 h-6 w-6" />
                Dispute Management
              </Link>

              {/* Policy Management */}
              <Link href="/policies" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/policies') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <DocumentTextIcon className="mr-3 h-6 w-6" />
                Platform Policies
              </Link>
              
              {/* System Configuration */}
              <Link href="/settings" 
                className={`group flex items-center px-2 py-2 text-body-md font-medium rounded-md ${
                  isActive('/settings') ? 'bg-primary-light text-white' : 'text-white hover:bg-primary-light'
                }`}
              >
                <Cog6ToothIcon className="mr-3 h-6 w-6" />
                System Configuration
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  )
}

export default AdminSidebar