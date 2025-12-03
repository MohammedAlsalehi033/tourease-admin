'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon, UsersIcon, Cog6ToothIcon,
    ChartBarIcon, ShieldCheckIcon, BuildingStorefrontIcon,
    FlagIcon, DocumentTextIcon, Bars3Icon,
    XMarkIcon, ArrowLeftOnRectangleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import ThemeToggler from './themeToggler';

const NavLink = ({ href, icon: Icon, text, isActive, onClick }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative group flex items-center px-4 py-3 my-1 mx-2 rounded-xl transition-all duration-200 ease-in-out overflow-hidden
                ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }
            `}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary z-0 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            
            <div className="relative z-10 flex items-center w-full">
                <Icon className={`h-5 w-5 mr-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`font-medium tracking-wide ${isActive ? 'text-white' : ''}`}>{text}</span>
            </div>
        </Link>
    );
};

const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Close sidebar on route change on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const isActive = (path) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    const navSections = [
        {
            title: 'Main',
            links: [
                { href: '/dashboard', text: 'Dashboard', icon: HomeIcon },
                { href: '/users', text: 'User Management', icon: UsersIcon },
                { href: '/moderation', text: 'Content Moderation', icon: FlagIcon },
                { href: '/providers', text: 'Provider Approvals', icon: BuildingStorefrontIcon },
            ]
        },
        {
            title: 'Additional',
            links: [
                { href: '/analytics', text: 'Analytics & Reports', icon: ChartBarIcon },
                { href: '/reports', text: 'Dispute Management', icon: ShieldCheckIcon },
                { href: '/policies', text: 'Platform Policies', icon: DocumentTextIcon },
                { href: '/settings', text: 'System Configuration', icon: Cog6ToothIcon },
            ]
        }
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 dark:border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <SparklesIcon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                        TourEase Admin
                    </span>
                </Link>
                <div className="xl:hidden">
                    <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.links.map((link) => (
                                <NavLink
                                    key={link.text}
                                    {...link}
                                    isActive={isActive(link.href)}
                                    onClick={() => setSidebarOpen(false)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                {session?.user ? (
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                            {session.user.name ? session.user.name[0].toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {session.user.name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.user.email}
                            </p>
                        </div>
                        <button 
                            onClick={() => signOut()}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Sign out"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <Link 
                        href="/api/auth/signin"
                        className="flex items-center justify-center w-full p-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Theme Toggler - Fixed Position */}
            <div className="fixed top-4 right-4 z-40">
                <ThemeToggler />
            </div>

            {/* Mobile Toggle Button */}
            <div className="xl:hidden fixed top-4 left-4 z-40">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2.5 rounded-xl text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl xl:hidden border-r border-gray-200 dark:border-gray-800"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden xl:flex fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col transition-all duration-300 translate-x-0">
                {sidebarContent}
            </aside>
        </>
    );
}

export default AdminSidebar;
