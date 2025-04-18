// app/admin/provider-approval/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data fetching functions (in a real app, these would connect to your database)
async function getTransportationProviders(status = 'pending') {
  return [
    {
      providerId: "tp1",
      licenseMmediaUrls: ["/api/placeholder/400/300"],
      vehicleMediaUrls: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      vehicleType: "Sedan",
      seatsAvailable: 4,
      createdAt: new Date("2025-04-15"),
      accountStatus: "pending",
      user: {
        id: "u1",
        name: "John Driver",
        email: "john.driver@example.com",
        phone: "+1234567890"
      }
    },
    {
      providerId: "tp2",
      licenseMmediaUrls: ["/api/placeholder/400/300"],
      vehicleMediaUrls: ["/api/placeholder/400/300"],
      vehicleType: "SUV",
      seatsAvailable: 7,
      createdAt: new Date("2025-04-14"),
      accountStatus: "pending",
      user: {
        id: "u2",
        name: "Maria Transit",
        email: "maria.transit@example.com",
        phone: "+1987654321"
      }
    },
    {
      providerId: "tp3",
      licenseMmediaUrls: ["/api/placeholder/400/300"],
      vehicleMediaUrls: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      vehicleType: "Van",
      seatsAvailable: 12,
      createdAt: new Date("2025-04-13"),
      accountStatus: "pending",
      user: {
        id: "u3",
        name: "Alex Shuttle",
        email: "alex.shuttle@example.com",
        phone: "+1122334455"
      }
    }
  ];
}

async function getAccommodationProviders(status = 'pending') {
  return [
    {
      providerId: "ap1",
      accommodationName: "Mountain View Hotel",
      address: "123 Peak Road, Highland City",
      contactNumber: "+1122334455",
      mediaUrls: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      createdAt: new Date("2025-04-16"),
      user: {
        id: "u4",
        name: "Robert Host",
        email: "robert.host@example.com",
        phone: "+1122334455"
      }
    },
    {
      providerId: "ap2",
      accommodationName: "Seaside Cottage",
      address: "45 Beach Avenue, Coastal Town",
      contactNumber: "+1567890123",
      mediaUrls: ["/api/placeholder/400/300"],
      createdAt: new Date("2025-04-12"),
      user: {
        id: "u5",
        name: "Lisa Lodge",
        email: "lisa.lodge@example.com",
        phone: "+1567890123"
      }
    }
  ];
}

// Transportation Provider Table Component
async function TransportationProviderTable({ status, search }) {
  const providers = await getTransportationProviders(status);
  
  // Filter by search if provided
  const filteredProviders = search 
    ? providers.filter(provider => 
        provider.user.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.user.email.toLowerCase().includes(search.toLowerCase()) ||
        provider.vehicleType.toLowerCase().includes(search.toLowerCase())
      )
    : providers;
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider Info</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documentation</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredProviders.map((provider) => (
            <tr key={provider.providerId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {provider.providerId.substring(0, 8)}...
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-300">{provider.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white font-medium">{provider.vehicleType}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Seats: {provider.seatsAvailable}</div>
                <div className="mt-2 flex space-x-2">
                  {provider.vehicleMediaUrls.map((url, index) => (
                    <div key={index} className="h-16 w-16 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <img src={url} className="h-full w-full object-cover" alt="Vehicle" />
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white mb-2">License Documents:</div>
                <div className="flex space-x-2">
                  {provider.licenseMmediaUrls.map((url, index) => (
                    <div key={index} className="h-16 w-16 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <img src={url} className="h-full w-full object-cover" alt="License" />
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {provider.createdAt.toDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-2">
                  <button className="btn-primary text-sm py-1">
                    Approve
                  </button>
                  <button className="btn-outlined text-sm py-1 text-error">
                    Reject
                  </button>
                  <Link href={`/admin/transportation/${provider.providerId}`} className="btn-text text-primary text-center">
                    View Details
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Accommodation Provider Table Component
async function AccommodationProviderTable({ status, search }) {
  const providers = await getAccommodationProviders(status);
  
  // Filter by search if provided
  const filteredProviders = search 
    ? providers.filter(provider => 
        provider.user.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.user.email.toLowerCase().includes(search.toLowerCase()) ||
        provider.accommodationName.toLowerCase().includes(search.toLowerCase()) ||
        provider.address.toLowerCase().includes(search.toLowerCase())
      )
    : providers;
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider Info</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accommodation Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Media</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredProviders.map((provider) => (
            <tr key={provider.providerId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {provider.providerId.substring(0, 8)}...
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-300">{provider.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.accommodationName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{provider.address}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{provider.contactNumber}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  {provider.mediaUrls.map((url, index) => (
                    <div key={index} className="h-16 w-16 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <img src={url} className="h-full w-full object-cover" alt="Accommodation" />
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {provider.createdAt.toDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-2">
                  <button className="btn-primary text-sm py-1">
                    Approve
                  </button>
                  <button className="btn-outlined text-sm py-1 text-error">
                    Reject
                  </button>
                  <Link href={`/admin/accommodation/${provider.providerId}`} className="btn-text text-primary text-center">
                    View Details
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Loading Skeleton Component
function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider Info</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Media</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(3)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-4"></div>
                  <div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Filter Section Component
function ProviderFilterSection({ providerType }) {
  return (
    <form action="/admin/provider-approval" method="GET">
      <input type="hidden" name="tab" value={providerType} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="input w-full"
            defaultValue="pending"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
            placeholder={providerType === "transportation" ? "Search by name, email, or vehicle type" : "Search by name, email, or accommodation name"}
            className="input w-full"
          />
        </div>
        
        <div className="flex items-end">
          <button type="submit" className="btn-primary h-10">
            Apply Filters
          </button>
          <button type="reset" className="btn-outlined ml-2 h-10">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

// Main Page Component
export default function ProviderApprovalPage({ searchParams }) {
  const tab = searchParams?.tab || 'transportation';
  const status = searchParams?.status || 'pending';
  const search = searchParams?.search || '';
  
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col">
      <div className="app-bar w-full p-4 bg-light-surface dark:bg-dark-surface shadow-md fixed top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-headline-md">Provider Approval Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning text-warning-800">
              {tab === 'transportation' ? '3 Pending Transportation' : '2 Pending Accommodation'}
            </span>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300">A</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-8 mt-16 ml-64">  {/* Adjust margins based on your layout */}
        <div className="mb-6">
          <h1 className="text-headline-lg font-semibold mb-2">Provider Approval</h1>
          <p className="text-body-md text-gray-600 dark:text-gray-400">
            Review and approve or reject transportation and accommodation provider applications
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <Link 
            href="/admin/provider-approval?tab=transportation"
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              tab === 'transportation' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Transportation Providers
          </Link>
          <Link 
            href="/admin/provider-approval?tab=accommodation"
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              tab === 'accommodation' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Accommodation Providers
          </Link>
        </div>
        
        {/* Filter Section */}
        <div className="card mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-headline-sm font-semibold">Search & Filter</h2>
          </div>
          <div className="p-4">
            <ProviderFilterSection providerType={tab} />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-headline-sm font-semibold">
              {tab === 'transportation' ? 'Transportation Provider Requests' : 'Accommodation Provider Requests'}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {status === 'pending' && (
                <span className="font-medium text-warning">
                  Pending requests require review
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <Suspense fallback={<TableSkeleton />}>
              {tab === 'transportation' ? (
                <TransportationProviderTable status={status} search={search} />
              ) : (
                <AccommodationProviderTable status={status} search={search} />
              )}
            </Suspense>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {tab === 'transportation' ? '3' : '2'} results
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
    </div>
  );
}