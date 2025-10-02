'use client'
import "reflect-metadata";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Users, Home, AlertTriangle, ChevronRight, Truck, BarChart2, Settings, Bell, Search } from "lucide-react";
import { container } from '@/app/lib/diContainer';
import { AnalyticsController } from "@/app/(controller)/analytics/analyticsController";
import { ProviderController } from "@/app/(controller)/providers/providerController";
import { UserController } from "@/app/(controller)/user/userController";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Removed unused import: import { data } from "autoprefixer";

// --- Helper Function ---
const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

// --- Component ---
export default function AdminDashboard() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // --- State for Real Data ---
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        pendingApprovalsCount: 0, // Will be updated based on fetched pending providers
        recentUsersCount: 0, // Will be updated based on fetched recent users
    });

    // State for pending providers (will hold fetched data)
    const [pendingProviders, setPendingProviders] = useState<Array<{ id: string; name: string; type: string; submitted: string }>>([]);

    // State for recent users (will hold fetched data)
    const [recentUsers, setRecentUsers] = useState<Array<{ id: string; username: string; email: string; role: string; registrationDate: string; accountStatus: string }>>([]);

    // Handler to navigate to provider details
    const handleViewProvider = (providerId: string) => {
        router.push(`/providers/${providerId}`);
    };


    // --- Fetch Data ---
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setFetchError(null);
            try {
                const analyticsController = container.resolve(AnalyticsController);
                const providerController = container.resolve(ProviderController);
                const userController = container.resolve(UserController);

                // Fetch data concurrently
                const [analyticsData, pendingTransportData, recentUsersData] = await Promise.all([
                    analyticsController.getAnalyticsOverview(),
                    providerController.getPendingTransportationProviders("pending", 1, 10),
                    userController.getAllUsers(1, 5), // Fetch 5 most recent users
                ]);

                // --- Process Analytics Data ---
                // Assuming analyticsData has structure: { totalUsers, activeUsers, newUsersToday, /* ... possibly other counts */ }
                if (analyticsData) {
                     // Update stats with real data
                     setDashboardStats({
                         totalUsers: analyticsData.totalUsers ?? 0,
                         activeUsers: analyticsData.activeUsers ?? 0,
                         newUsersToday: analyticsData.newUsersToday ?? 0,
                         pendingApprovalsCount: pendingTransportData?.length ?? 0, // Update based on fetched providers
                         recentUsersCount: recentUsersData?.users?.length ?? 0, // Update based on fetched recent users
                     });
                 } else {
                    // Fallback or keep initial state if analytics data fails
                    setDashboardStats(prev => ({
                        ...prev,
                         pendingApprovalsCount: pendingTransportData?.length ?? 0,
                         recentUsersCount: recentUsersData?.users?.length ?? 0,
                    }));
                 }


                // --- Process Pending Transportation Providers ---
                // Assuming pendingTransportData is an array of { providerId, user: { username }, createdAt, ... }
                 if (pendingTransportData && Array.isArray(pendingTransportData)) {
                     const mappedProviders = pendingTransportData.map((provider: unknown) => {
                         const p = provider as { providerId?: string; user?: { username?: string }; createdAt?: string };
                         return {
                             id: p.providerId || 'N/A',
                             name: p.user?.username || 'Unknown Name',
                             type: 'Transportation',
                             submitted: formatDate(p.createdAt),
                         };
                     });
                     setPendingProviders(mappedProviders);

                     // Update the pending count stat again in case analytics data wasn't available
                     setDashboardStats(prev => ({
                         ...prev,
                         pendingApprovalsCount: mappedProviders.length,
                     }));
                 } else {
                     setPendingProviders([]); // Set empty if fetch fails or returns invalid data
                      setDashboardStats(prev => ({ ...prev, pendingApprovalsCount: 0 }));
                 }

                // --- Process Recent Users ---
                // Assuming recentUsersData has structure: { users: [], totalUsers, currentPage, totalPages }
                if (recentUsersData && Array.isArray(recentUsersData.users)) {
                    const mappedUsers = recentUsersData.users.map((user: unknown) => {
                        const u = user as { userId?: string; username?: string; email?: string; role?: string; createdAt?: string; accountStatus?: string };
                        return {
                            id: u.userId || 'N/A',
                            username: u.username || 'Unknown User',
                            email: u.email || 'N/A',
                            role: u.role || 'User',
                            registrationDate: formatDate(u.createdAt),
                            accountStatus: u.accountStatus || 'active',
                        };
                    });
                    setRecentUsers(mappedUsers);

                    // Update the recent users count stat
                    setDashboardStats(prev => ({
                        ...prev,
                        recentUsersCount: mappedUsers.length,
                    }));
                } else {
                    setRecentUsers([]); // Set empty if fetch fails or returns invalid data
                    setDashboardStats(prev => ({ ...prev, recentUsersCount: 0 }));
                }


                // console.log("Fetched Analytics:", analyticsData);
                // console.log("Fetched Pending Transport:", pendingTransportData);

            } catch (error: unknown) {
                console.error("Failed to fetch dashboard data:", error);
                setFetchError("Failed to load dashboard data. Please try again later.");
                // Keep potentially partially loaded stats, but clear lists that failed
                setPendingProviders([]);
                setDashboardStats(prev => ({ ...prev, pendingApprovalsCount: 0 })); // Reset count on error
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        setMounted(true); // For hydration mismatch prevention
    }, []); // Empty dependency array ensures this runs once on mount

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="min-h-screen transition-colors duration-300 flex">
       

            {/* Main content */}
             <div className=" flex-1 flex flex-col">
               

                {/* Dashboard Content */}
                 <main className="p-6 flex-1 overflow-y-auto">
                     {isLoading && (
                         <div className="flex justify-center items-center h-40">
                             {/* Add a spinner or loading indicator here */}
                             <p>Loading Dashboard Data...</p>
                         </div>
                     )}
                     {fetchError && !isLoading && (
                         <div className="bg-error/10 text-error p-4 rounded-md mb-6">
                             {fetchError}
                         </div>
                     )}
                     {!isLoading && !fetchError && (
                         <>
                             <div className="mb-6">
                                 <h1 className="text-headline-lg font-semibold mb-2">Dashboard Overview</h1>
                                 <p className="text-body-md text-gray-600 dark:text-gray-400">Welcome back! Here&apos;s what&apos;s happening on the platform today.</p>
                             </div>

                            {/* Stats Cards - Now using dashboardStats state */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Link href="/users" className="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Total Users</h3>
                                    <p className="text-display-md font-bold">{dashboardStats.totalUsers}</p>
                                    <div className="text-success text-sm mt-2 flex items-center">
                                        <span>+{dashboardStats.newUsersToday} today</span>
                                    </div>
                                </Link>
                                <Link href="/users?accountStatus=active" className="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Active Users</h3>
                                    <p className="text-display-md font-bold">{dashboardStats.activeUsers}</p>
                                     <div className="text-body-sm text-gray-500 dark:text-gray-400 mt-2">
                                         {dashboardStats.totalUsers > 0 ? `${Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100)}% of total` : 'N/A'}
                                     </div>
                                </Link>
                                <Link href="/providers?accountStatus=pending" className="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                     <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Pending Approvals</h3>
                                     <p className="text-display-md font-bold">{dashboardStats.pendingApprovalsCount}</p>
                                     {dashboardStats.pendingApprovalsCount > 0 && (
                                        <div className="text-warning text-sm mt-2 flex items-center">
                                             <span>Requires attention</span>
                                         </div>
                                     )}
                                 </Link>
                                <Link href="/moderation" className="card p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                    <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Content Flags</h3>
                                     <p className="text-display-md font-bold">{dashboardStats.reportedContentCount}</p>
                                     {dashboardStats.reportedContentCount > 0 && (
                                        <div className="text-error text-sm mt-2 flex items-center">
                                             <span>Requires review</span>
                                         </div>
                                     )}
                                 </Link>
                            </div>

                            {/* Content that needs attention */}
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                 {/* Recent User Registrations - Uses real data from UserController */}
                                 <div className="card">
                                     <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                         <h2 className="text-headline-sm font-semibold">Recent User Registrations</h2>
                                         <Link href="/users" className="btn-text flex items-center">
                                             View All <ChevronRight size={16} />
                                         </Link>
                                     </div>
                                     <div className="p-4">
                                        {recentUsers.length > 0 ? (
                                             <table className="w-full">
                                                 <thead>
                                                     <tr className="text-left text-gray-500 dark:text-gray-400 text-body-sm">
                                                         <th className="pb-2">Username</th>
                                                         <th className="pb-2">Email</th>
                                                         <th className="pb-2">Role</th>
                                                         <th className="pb-2">Registered</th>
                                                         <th className="pb-2">Status</th>
                                                     </tr>
                                                 </thead>
                                                 <tbody>
                                                     {recentUsers.map((user) => (
                                                         <tr 
                                                             key={user.id} 
                                                             className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                                             onClick={() => router.push(`/users/${user.id}`)}
                                                         >
                                                             <td className="py-3 text-body-md">{user.username}</td>
                                                             <td className="py-3 text-body-md">{user.email}</td>
                                                             <td className="py-3 text-body-md capitalize">{user.role}</td>
                                                             <td className="py-3 text-body-md">{user.registrationDate}</td>
                                                             <td className="py-3 text-body-md">
                                                                 <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                                     user.accountStatus === 'active' 
                                                                         ? 'bg-success/10 text-success' 
                                                                         : user.accountStatus === 'blocked'
                                                                         ? 'bg-error/10 text-error'
                                                                         : 'bg-warning/10 text-warning'
                                                                 }`}>
                                                                     {user.accountStatus}
                                                                 </span>
                                                             </td>
                                                         </tr>
                                                     ))}
                                                 </tbody>
                                             </table>
                                         ) : (
                                             <p className="text-body-md text-gray-500 dark:text-gray-400 text-center py-4">No recent user registrations.</p>
                                         )}
                                     </div>
                                 </div>

                                {/* Provider approvals section - Now uses pendingProviders state */}
                                 <div className="card">
                                     <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                         <h2 className="text-headline-sm font-semibold">Pending Provider Approvals</h2>
                                         <Link href="/providers?accountStatus=pending" className="btn-text flex items-center">
                                             View All <ChevronRight size={16} />
                                         </Link>
                                     </div>
                                     <div className="p-4">
                                         {pendingProviders.length > 0 ? (
                                             <table className="w-full">
                                                 <thead>
                                                     <tr className="text-left text-gray-500 dark:text-gray-400 text-body-sm">
                                                         <th className="pb-2">ID</th>
                                                         <th className="pb-2">Name</th>
                                                         <th className="pb-2">Type</th>
                                                         <th className="pb-2">Submitted</th>
                                                         <th className="pb-2">Action</th>
                                                     </tr>
                                                 </thead>
                                                 <tbody>
                                                     {pendingProviders.map((item) => (
                                                         <tr 
                                                             key={item.id} 
                                                             className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                                             onClick={() => handleViewProvider(item.id)}
                                                         >
                                                             <td className="py-3 text-body-md">{item.id}</td>
                                                             <td className="py-3 text-body-md">{item.name}</td>
                                                             <td className="py-3 text-body-md">{item.type}</td>
                                                             <td className="py-3 text-body-md">{item.submitted}</td>
                                                             <td className="py-3 text-body-md">
                                                                 <div className="flex space-x-2">
                                                                     {/* Navigate to provider details page */}
                                                                     <button 
                                                                         onClick={(e) => {
                                                                             e.stopPropagation();
                                                                             handleViewProvider(item.id);
                                                                         }}
                                                                         className="btn-text text-primary text-sm py-1"
                                                                     >
                                                                         View Details
                                                                     </button>
                                                                 </div>
                                                             </td>
                                                         </tr>
                                                     ))}
                                                 </tbody>
                                             </table>
                                         ) : (
                                             <p className="text-body-md text-gray-500 dark:text-gray-400 text-center py-4">No providers awaiting approval.</p>
                                         )}
                                     </div>
                                 </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card mb-8">
                                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                     <h2 className="text-headline-sm font-semibold">Quick Actions</h2>
                                 </div>
                                 <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                     {/* Quick action buttons with navigation */}
                                     <Link href="/users" className="btn-primary w-full flex justify-center items-center">
                                         <Users size={18} className="mr-2" />
                                         Manage Users
                                     </Link>
                                     <Link href="/analytics" className="btn-outlined w-full flex justify-center items-center">
                                         <BarChart2 size={18} className="mr-2" />
                                         View Analytics
                                     </Link>
                                     <Link href="/settings" className="btn-outlined w-full flex justify-center items-center">
                                         <Settings size={18} className="mr-2" />
                                         System Settings
                                     </Link>
                                 </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}













// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('session_token');
//     if (!token) {
//       router.push('/login');
//     } else {
//       setUser(JSON.parse(token));
//     }
//   }, [router]);

//   if (!user) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   return (
//     <div className="">
//       <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
//       <p>This is your protected dashboard.</p>
//     </div>
//   );
// }