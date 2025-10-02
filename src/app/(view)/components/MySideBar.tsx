'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    HomeIcon, UsersIcon, Cog6ToothIcon,
    ChartBarIcon, ShieldCheckIcon, BuildingStorefrontIcon,
    FlagIcon, DocumentTextIcon, Bars3Icon
} from '@heroicons/react/24/outline';
import ThemeToggler from './themeToggler';
import SignoutButton from './signoutButton';

// Helper component for animated links
const NavLink = ({ href, icon: Icon, text, isActive, animationDelay = 0 }) => (
    <Link
        href={href}
        style={{ animationDelay: `${animationDelay}ms` }}
        title={text}
        className={`btn-text group flex items-center w-full transform transition-all duration-300 ${isActive ? 'bg-primary-light/90 text-white shadow-lg' : 'text-white hover:bg-primary-light/70 hover:translate-x-2'} animate-fade-in-up`}
    >
        {Icon && <Icon className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />}
        <span className="truncate">{text}</span>
    </Link>
);

const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const slogans = [
        "Manage with Precision.",
        "Insights at a Glance.",
        "Control Your Platform."
    ];
    const cyclingText = ["Admin Portal", ...slogans];

    // Effect for cycling through slogans
    useEffect(() => {
        const intervalId = setInterval(() => {
            
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [cyclingText.length]);

    // Close sidebar on route change on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const isActive = (path) => {
        return pathname === path;
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

    return (
        <div>
            <div className="fixed top-4 right-4 z-30">
                <ThemeToggler />
            </div>

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-30">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-20 w-64 bg-primary text-white transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div className="flex items-center justify-center h-20 border-b border-white/20">
                    {/* Animated Text */}
                    <p key={textIndex} className="text-2xl font-bold tracking-wider text-center px-2 animate-fade-in-up">
                        {cyclingText[textIndex]}
                    </p>
                </div>
                <nav className="mt-6 px-4 space-y-6">
                    {navSections.map((section, sectionIndex) => (
                        <div key={section.title}>
                            <p className="px-3 text-sm font-semibold text-white/60 uppercase tracking-wider animate-fade-in-up" style={{ animationDelay: `${sectionIndex * 150}ms` }}>
                                {section.title}
                            </p>
                            <div className="mt-3 space-y-1">
                                {section.links.map((link, linkIndex) => {
                                    const totalPreviousLinks = navSections.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.links.length, 0);
                                    const animationDelay = (totalPreviousLinks + linkIndex) * 50 + 150;

                                    return (
                                        <NavLink
                                            key={link.text}
                                            href={link.href}
                                            text={link.text}
                                            icon={link.icon}
                                            isActive={isActive(link.href)}
                                            animationDelay={animationDelay}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                {status === 'authenticated' && (
                    <div className="mt-6 px-4">
                        <SignoutButton />
                    </div>
                )}
            </aside>
        </div>
    )
}

export default AdminSidebar;
