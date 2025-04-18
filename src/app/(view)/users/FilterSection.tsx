"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    role: searchParams.get('role') || '',
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (filters.role) params.set('role', filters.role);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    
    // Navigate with the filters
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User Type
          </label>
          <select
            id="role-filter"
            name="role"
            className="input w-full"
            value={filters.role}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="traveler">Travelers</option>
            <option value="provider">Providers</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            name="status"
            className="input w-full"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search by ID, name or email"
            className="input w-full"
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button 
            type="submit"
            className="btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}