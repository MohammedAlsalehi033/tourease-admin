// 'use client'
// import "reflect-metadata";
// import { useTheme } from "next-themes";
// import { useState, useEffect } from "react";
// import { Users, Home, AlertTriangle, ChevronRight, Truck, BarChart2, Settings, Bell, Search } from "lucide-react";
// import { container } from '@/app/lib/diContainer';
// import { AnalyticsController } from "@/app/(controller)/analytics/analyticsController";
// import { ProviderController } from "@/app/(controller)/providers/providerController";
// // Removed unused import: import { data } from "autoprefixer";

// // --- Helper Function ---
// const formatDate = (dateString: string | Date | undefined): string => {
//     if (!dateString) return 'N/A';
//     try {
//         return new Date(dateString).toLocaleDateString('en-GB', {
//             day: '2-digit', month: 'short', year: 'numeric'
//         });
//     } catch (e) {
//         return 'Invalid Date';
//     }
// };

// // --- Component ---
// export default function AdminDashboard() {
//     const { theme, setTheme } = useTheme();
//     const [mounted, setMounted] = useState(false);
//     const [activeTab, setActiveTab] = useState("dashboard");
//     const [isLoading, setIsLoading] = useState(true);
//     const [fetchError, setFetchError] = useState<string | null>(null);

//     // --- State for Real Data ---
//     const [dashboardStats, setDashboardStats] = useState({
//         totalUsers: 0,
//         activeUsers: 0,
//         newUsersToday: 0,
//         pendingApprovalsCount: 0, // Will be updated based on fetched pending providers
//         reportedContentCount: 0, // Will use mock data length for now
//     });

//     // Keep mock data for reported content as no fetch method was provided for it
//     const reportedContent = [
//         { id: "RC-7842", type: "Review", reporter: "user@example.com", date: "11 Apr 2025", status: "Pending" },
//         { id: "RC-7841", type: "Dispute", reporter: "provider@example.com", date: "10 Apr 2025", status: "Pending" },
//         { id: "RC-7835", type: "Forum Post", reporter: "traveler@example.com", date: "09 Apr 2025", status: "Pending" }
//     ];

//     // State for pending providers (will hold fetched data)
//     const [pendingProviders, setPendingProviders] = useState<Array<{ id: string; name: string; type: string; submitted: string }>>([]);


//     // --- Fetch Data ---
//     useEffect(() => {
//         async function fetchData() {
//             setIsLoading(true);
//             setFetchError(null);
//             try {
//                 const analyticsController = container.resolve(AnalyticsController);
//                 const providerController = container.resolve(ProviderController);
//                 // const contentController = container.resolve(ContentController); // Keep if needed later e.g., for reported content

//                 // Fetch data concurrently
//                 const [analyticsData, pendingTransportData /*, questionsData */] = await Promise.all([
//                     analyticsController.getAnalyticsOverview(),
//                     providerController.getPendingTransportationProviders(),
//                     // contentController.getAllQuestions() // Fetch questions if needed elsewhere
//                 ]);

//                 // --- Process Analytics Data ---
//                 // Assuming analyticsData has structure: { totalUsers, activeUsers, newUsersToday, /* ... possibly other counts */ }
//                 if (analyticsData) {
//                      // Use mock length for counts not directly available in analyticsData for now
//                      setDashboardStats({
//                          totalUsers: analyticsData.totalUsers ?? 0,
//                          activeUsers: analyticsData.activeUsers ?? 0,
//                          newUsersToday: analyticsData.newUsersToday ?? 0,
//                          pendingApprovalsCount: pendingTransportData?.length ?? 0, // Update based on fetched providers
//                          reportedContentCount: reportedContent.length, // Using mock data length
//                      });
//                  } else {
//                     // Fallback or keep initial state if analytics data fails
//                     setDashboardStats(prev => ({
//                         ...prev,
//                          pendingApprovalsCount: pendingTransportData?.length ?? 0,
//                          reportedContentCount: reportedContent.length,
//                     }));
//                  }


//                 // --- Process Pending Transportation Providers ---
//                 // Assuming pendingTransportData is an array of { providerId, user: { username }, createdAt, ... }
//                  if (pendingTransportData && Array.isArray(pendingTransportData)) {
//                      const mappedProviders = pendingTransportData.map((provider: any) => ({
//                          id: provider.providerId || 'N/A',
//                          name: provider.user?.username || 'Unknown Name', // Make sure 'user' is included in the response
//                          type: 'Transportation', // Hardcoded as we only fetched transportation
//                          submitted: formatDate(provider.createdAt),
//                      }));
//                      setPendingProviders(mappedProviders);

//                      // Update the pending count stat again in case analytics data wasn't available
//                      setDashboardStats(prev => ({
//                          ...prev,
//                          pendingApprovalsCount: mappedProviders.length,
//                      }));
//                  } else {
//                      setPendingProviders([]); // Set empty if fetch fails or returns invalid data
//                       setDashboardStats(prev => ({ ...prev, pendingApprovalsCount: 0 }));
//                  }


//                 // console.log("Fetched Analytics:", analyticsData);
//                 // console.log("Fetched Pending Transport:", pendingTransportData);
//                 // console.log("Fetched Questions:", questionsData); // Use if needed

//             } catch (error: any) {
//                 console.error("Failed to fetch dashboard data:", error);
//                 setFetchError("Failed to load dashboard data. Please try again later.");
//                 // Keep potentially partially loaded stats, but clear lists that failed
//                 setPendingProviders([]);
//                 setDashboardStats(prev => ({ ...prev, pendingApprovalsCount: 0 })); // Reset count on error
//             } finally {
//                 setIsLoading(false);
//             }
//         }

//         fetchData();
//         setMounted(true); // For hydration mismatch prevention
//     }, []); // Empty dependency array ensures this runs once on mount

//     if (!mounted) return null; // Avoid hydration mismatch

//     return (
//         <div className="min-h-screen transition-colors duration-300 flex">
       

//             {/* Main content */}
//              <div className="ml-64 flex-1 flex flex-col">
               

//                 {/* Dashboard Content */}
//                  <main className="p-6 flex-1 overflow-y-auto">
//                      {isLoading && (
//                          <div className="flex justify-center items-center h-40">
//                              {/* Add a spinner or loading indicator here */}
//                              <p>Loading Dashboard Data...</p>
//                          </div>
//                      )}
//                      {fetchError && !isLoading && (
//                          <div className="bg-error/10 text-error p-4 rounded-md mb-6">
//                              {fetchError}
//                          </div>
//                      )}
//                      {!isLoading && !fetchError && (
//                          <>
//                              <div className="mb-6">
//                                  <h1 className="text-headline-lg font-semibold mb-2">Dashboard Overview</h1>
//                                  <p className="text-body-md text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening on the platform today.</p>
//                              </div>

//                             {/* Stats Cards - Now using dashboardStats state */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                                 <div className="card p-4">
//                                     <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Total Users</h3>
//                                     <p className="text-display-md font-bold">{dashboardStats.totalUsers}</p>
//                                     <div className="text-success text-sm mt-2 flex items-center">
//                                         <span>+{dashboardStats.newUsersToday} today</span>
//                                     </div>
//                                 </div>
//                                 <div className="card p-4">
//                                     <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Active Users</h3>
//                                     <p className="text-display-md font-bold">{dashboardStats.activeUsers}</p>
//                                      <div className="text-body-sm text-gray-500 dark:text-gray-400 mt-2">
//                                          {dashboardStats.totalUsers > 0 ? `${Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100)}% of total` : 'N/A'}
//                                      </div>
//                                 </div>
//                                 <div className="card p-4">
//                                      <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Pending Approvals</h3>
//                                      <p className="text-display-md font-bold">{dashboardStats.pendingApprovalsCount}</p>
//                                      {dashboardStats.pendingApprovalsCount > 0 && (
//                                         <div className="text-warning text-sm mt-2 flex items-center">
//                                              <span>Requires attention</span>
//                                          </div>
//                                      )}
//                                  </div>
//                                 <div className="card p-4">
//                                     <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Content Flags</h3>
//                                      <p className="text-display-md font-bold">{dashboardStats.reportedContentCount}</p>
//                                      {dashboardStats.reportedContentCount > 0 && (
//                                         <div className="text-error text-sm mt-2 flex items-center">
//                                              <span>Requires review</span>
//                                          </div>
//                                      )}
//                                  </div>
//                             </div>

//                             {/* Content that needs attention */}
//                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                                  {/* Content moderation section - Still uses mock data */}
//                                  <div className="card">
//                                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                                          <h2 className="text-headline-sm font-semibold">Reported Content</h2>
//                                          <button className="btn-text flex items-center">
//                                              View All <ChevronRight size={16} />
//                                          </button>
//                                      </div>
//                                      <div className="p-4">
//                                         {reportedContent.length > 0 ? (
//                                              <table className="w-full">
//                                                  <thead>
//                                                      <tr className="text-left text-gray-500 dark:text-gray-400 text-body-sm">
//                                                          <th className="pb-2">ID</th>
//                                                          <th className="pb-2">Type</th>
//                                                          <th className="pb-2">Reporter</th>
//                                                          <th className="pb-2">Date</th>
//                                                          <th className="pb-2">Status</th>
//                                                      </tr>
//                                                  </thead>
//                                                  <tbody>
//                                                      {reportedContent.map((item, index) => (
//                                                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
//                                                              <td className="py-3 text-body-md">{item.id}</td>
//                                                              <td className="py-3 text-body-md">{item.type}</td>
//                                                              <td className="py-3 text-body-md">{item.reporter}</td>
//                                                              <td className="py-3 text-body-md">{item.date}</td>
//                                                              <td className="py-3 text-body-md">
//                                                                  <span className="inline-block px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
//                                                                      {item.status}
//                                                                  </span>
//                                                              </td>
//                                                          </tr>
//                                                      ))}
//                                                  </tbody>
//                                              </table>
//                                          ) : (
//                                              <p className="text-body-md text-gray-500 dark:text-gray-400 text-center py-4">No reported content requiring review.</p>
//                                          )}
//                                      </div>
//                                  </div>

//                                 {/* Provider approvals section - Now uses pendingProviders state */}
//                                  <div className="card">
//                                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                                          <h2 className="text-headline-sm font-semibold">Pending Provider Approvals</h2>
//                                          <button className="btn-text flex items-center">
//                                              View All <ChevronRight size={16} />
//                                          </button>
//                                      </div>
//                                      <div className="p-4">
//                                          {pendingProviders.length > 0 ? (
//                                              <table className="w-full">
//                                                  <thead>
//                                                      <tr className="text-left text-gray-500 dark:text-gray-400 text-body-sm">
//                                                          <th className="pb-2">ID</th>
//                                                          <th className="pb-2">Name</th>
//                                                          <th className="pb-2">Type</th>
//                                                          <th className="pb-2">Submitted</th>
//                                                          <th className="pb-2">Action</th>
//                                                      </tr>
//                                                  </thead>
//                                                  <tbody>
//                                                      {pendingProviders.map((item) => (
//                                                          <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
//                                                              <td className="py-3 text-body-md">{item.id}</td>
//                                                              <td className="py-3 text-body-md">{item.name}</td>
//                                                              <td className="py-3 text-body-md">{item.type}</td>
//                                                              <td className="py-3 text-body-md">{item.submitted}</td>
//                                                              <td className="py-3 text-body-md">
//                                                                  <div className="flex space-x-2">
//                                                                      {/* Add actual click handlers here */}
//                                                                      <button className="btn-text text-success text-sm py-1">Approve</button>
//                                                                      <button className="btn-text text-error text-sm py-1">Deny</button>
//                                                                  </div>
//                                                              </td>
//                                                          </tr>
//                                                      ))}
//                                                  </tbody>
//                                              </table>
//                                          ) : (
//                                              <p className="text-body-md text-gray-500 dark:text-gray-400 text-center py-4">No providers awaiting approval.</p>
//                                          )}
//                                      </div>
//                                  </div>
//                             </div>

//                             {/* Quick Actions */}
//                             <div className="card mb-8">
//                                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                                      <h2 className="text-headline-sm font-semibold">Quick Actions</h2>
//                                  </div>
//                                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                                      {/* Quick action buttons... (unchanged) */}
//                                      <button className="btn-primary w-full flex justify-center items-center">
//                                          <Users size={18} className="mr-2" />
//                                          Manage Users
//                                      </button>
//                                      <button className="btn-outlined w-full flex justify-center items-center">
//                                          <BarChart2 size={18} className="mr-2" />
//                                          Generate Report
//                                      </button>
//                                      <button className="btn-outlined w-full flex justify-center items-center">
//                                          <Settings size={18} className="mr-2" />
//                                          System Settings
//                                      </button>
//                                  </div>
//                             </div>
//                         </>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// }













"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(token));
    }
  }, [router]);

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
      <p>This is your protected dashboard.</p>
    </div>
  );
}