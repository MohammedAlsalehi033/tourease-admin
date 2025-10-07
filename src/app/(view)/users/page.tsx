import "reflect-metadata"

import React, { Suspense } from 'react';
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import {  UserController } from '@/app/(controller)/user/userController';
import FilterSection from './FilterSection';
import PaginationControls from './PaginationControls';

const ITEMS_PER_PAGE = 10;


async function UsersTable({ role, accountStatus, search, page }) {
  const userController = container.resolve(UserController);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await userController.getAllUsers();
    // Handle both array response and paginated response
    users = Array.isArray(response) ? response : (response.users || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    return <div>Error fetching users : {(error as Error).message}</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transformedUsers = users.map((user: any) => {
    
    return {
      id: user.id,
      name: user.username.split('@')[0] || 'Unknown',
      email: user.email,
      role: user.roles,
      accountStatus: user.accountStatus === 'active' ? 'Active' : 'Deactivated',
      lastActive: user.updatedAt ? user.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]
    };
  });
  
  
  if (accountStatus) {
    transformedUsers = transformedUsers.filter(user => 
      user.accountStatus.toLowerCase() === accountStatus.toLowerCase()
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

  if (role) {
    transformedUsers = transformedUsers.filter(user => 
      user.role.some(r => r.toLowerCase() === role.toLowerCase())
    );
  }

  // Get total count before pagination
  const totalUsers = transformedUsers.length;
  
  // Apply pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = transformedUsers.slice(startIndex, endIndex);
  
  // Render the table with filtered and paginated data
  return (
    <>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">accountStatus</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedUsers.map((user) => (
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
                  user.accountStatus === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {user.accountStatus}
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
                  
                 
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <PaginationControls 
      currentPage={page}
      totalItems={totalUsers}
      itemsPerPage={ITEMS_PER_PAGE}
    />
    </>
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">accountStatus</th>
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
  const accountStatus = searchParams?.accountStatus || '';
  const search = searchParams?.search || '';
  const page = parseInt(searchParams?.page || '1', 10);
  

  console.log(accountStatus, role, search, page);

  return (
    <div className="px-6 py-8">
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
        </div>
        
        <div className="p-4">
          <Suspense fallback={<UserTableSkeleton />}>
            <UsersTable role={role} accountStatus={accountStatus} search={search} page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}