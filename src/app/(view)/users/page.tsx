import React, { Suspense } from 'react';
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import {  UserController } from '@/app/(controller)/user/userController';
import FilterSection from './FilterSection';






async function UsersTable({ role, status, search }) {
  const userController = container.resolve(UserController);
  const response = await userController.getAllUsers(); 
  
  // Transform and filter data
  let transformedUsers = response.users.map(user => {
    
    return {
      id: user.id,
      name: user.username.split('@')[0] || 'Unknown',
      email: user.email,
      role: user.roles,
      status: user.accountStatus === 'active' ? 'Active' : 'Deactivated',
      lastActive: user.updatedAt ? user.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]
    };
  });
  
 
  
  if (status) {
    transformedUsers = transformedUsers.filter(user => 
      user.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    transformedUsers = transformedUsers.filter(user => 
      user.id.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Render the table with filtered data
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {transformedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                   bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`}>
  {user.role.map((role, index) => (
    <React.Fragment key={index}>
      {index > 0 && <div className="w-1 h-1 bg-purple-400 rounded-full"></div>}
      {role}
    </React.Fragment>
  ))}
</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.lastActive}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link 
                    href={`/users/${user.id}`}
                    className="text-primary hover:text-primary-light"
                  >
                    View
                  </Link>
                  
                  {/* These links would be replaced with client components that have event handlers */}
                  <Link 
                    href="#" 
                    className={`${user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    data-user-id={user.id}
                    data-action={user.status === 'Active' ? 'deactivate' : 'activate'}
                  >
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 
    </table>
  );
}

function UserTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default function UserManagement({ searchParams }) {
  const role = searchParams?.role || '';
  const status = searchParams?.status || '';
  const search = searchParams?.search || '';
  

  return (
    <div className="px-6 py-8 ml-64">
      <div className="mb-6">
        <h1 className="text-headline-lg font-semibold mb-2">User Management</h1>
        <p className="text-body-md text-gray-600 dark:text-gray-400">
          View and manage all user accounts on the platform
        </p>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-headline-sm font-semibold">Search & Filter</h2>
        </div>
        <div className="p-4">
          <FilterSection />
        </div>
      </div>
      
      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-headline-sm font-semibold">User Accounts</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing 10 of 235 users
          </div>
        </div>
        
        <div className="p-4">
          <Suspense fallback={<UserTableSkeleton />}>
            <UsersTable role={role} status={status} search={search} />
          </Suspense>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">235</span> results
            </div>
            
            <div className="flex space-x-2">
              <button className="btn-outlined text-sm py-1 px-3 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="btn-outlined text-sm py-1 px-3">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}