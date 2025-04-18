'use client'

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Users, Home, AlertTriangle, ChevronRight, Truck, BarChart2, Settings, Bell, Search } from "lucide-react";

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock data for dashboard
  const userStats = {
    total: 3542,
    active: 3128,
    deactivated: 414,
    newToday: 24
  };
  
  const reportedContent = [
    { id: "RC-7842", type: "Review", reporter: "user@example.com", date: "11 Apr 2025", status: "Pending" },
    { id: "RC-7841", type: "Dispute", reporter: "provider@example.com", date: "10 Apr 2025", status: "Pending" },
    { id: "RC-7835", type: "Forum Post", reporter: "traveler@example.com", date: "09 Apr 2025", status: "Pending" }
  ];
  
  const pendingApprovals = [
    { id: "TR-1204", name: "City Cab Services", type: "Transportation", submitted: "11 Apr 2025" },
    { id: "AC-0857", name: "Mountain View Resort", type: "Accommodation", submitted: "10 Apr 2025" },
    { id: "TR-1203", name: "QuickRide Taxi", type: "Transportation", submitted: "09 Apr 2025" }
  ];
  
  // This is to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen transition-colors duration-300 flex">
      {/* Sidebar */}
      <div className="w-64 bg-light-surface dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 fixed h-screen">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-headline-md font-semibold">Admin Portal</h1>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li onClick={() => setActiveTab("dashboard")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "dashboard" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <Home size={20} className="mr-3" />
              <span>Dashboard</span>
            </li>
            <li onClick={() => setActiveTab("users")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "users" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <Users size={20} className="mr-3" />
              <span>User Management</span>
            </li>
            <li onClick={() => setActiveTab("moderation")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "moderation" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <AlertTriangle size={20} className="mr-3" />
              <span>Content Moderation</span>
            </li>
            <li onClick={() => setActiveTab("providers")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "providers" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <Truck size={20} className="mr-3" />
              <span>Provider Approvals</span>
            </li>
            <li onClick={() => setActiveTab("analytics")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "analytics" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <BarChart2 size={20} className="mr-3" />
              <span>Analytics & Reports</span>
            </li>
            <li onClick={() => setActiveTab("settings")} className={`p-2 rounded-md cursor-pointer flex items-center ${activeTab === "settings" ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <Settings size={20} className="mr-3" />
              <span>System Configuration</span>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="bg-light-surface dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="input pl-10 w-full"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">5</span>
            </button>
            
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white mr-2">
                A
              </div>
              <span className="mr-2">Admin</span>
            </div>
            
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="btn-outlined"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-headline-lg font-semibold mb-2">Dashboard Overview</h1>
            <p className="text-body-md text-gray-600 dark:text-gray-400">Welcome back Heres whats happening on the platform today.</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Total Users</h3>
              <p className="text-display-md font-bold">{userStats.total}</p>
              <div className="text-success text-sm mt-2 flex items-center">
                <span>+{userStats.newToday} today</span>
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Active Users</h3>
              <p className="text-display-md font-bold">{userStats.active}</p>
              <div className="text-body-sm text-gray-500 dark:text-gray-400 mt-2">
                {Math.round((userStats.active / userStats.total) * 100)}% of total
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Pending Approvals</h3>
              <p className="text-display-md font-bold">{pendingApprovals.length}</p>
              <div className="text-warning text-sm mt-2 flex items-center">
                <span>Requires attention</span>
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-body-md mb-2">Content Flags</h3>
              <p className="text-display-md font-bold">{reportedContent.length}</p>
              <div className="text-error text-sm mt-2 flex items-center">
                <span>Requires review</span>
              </div>
            </div>
          </div>
          
          {/* Content that needs attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Content moderation section */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-headline-sm font-semibold">Reported Content</h2>
                <button className="btn-text flex items-center">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 text-body-sm">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Reporter</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedContent.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-body-md">{item.id}</td>
                        <td className="py-3 text-body-md">{item.type}</td>
                        <td className="py-3 text-body-md">{item.reporter}</td>
                        <td className="py-3 text-body-md">{item.date}</td>
                        <td className="py-3 text-body-md">
                          <span className="inline-block px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Provider approvals section */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-headline-sm font-semibold">Pending Provider Approvals</h2>
                <button className="btn-text flex items-center">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="p-4">
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
                    {pendingApprovals.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-body-md">{item.id}</td>
                        <td className="py-3 text-body-md">{item.name}</td>
                        <td className="py-3 text-body-md">{item.type}</td>
                        <td className="py-3 text-body-md">{item.submitted}</td>
                        <td className="py-3 text-body-md">
                          <div className="flex space-x-2">
                            <button className="btn-text text-success text-sm py-1">Approve</button>
                            <button className="btn-text text-error text-sm py-1">Deny</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card mb-8">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-headline-sm font-semibold">Quick Actions</h2>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary w-full flex justify-center items-center">
                <Users size={18} className="mr-2" />
                Manage Users
              </button>
              <button className="btn-outlined w-full flex justify-center items-center">
                <BarChart2 size={18} className="mr-2" />
                Generate Report
              </button>
              <button className="btn-outlined w-full flex justify-center items-center">
                <Settings size={18} className="mr-2" />
                System Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}