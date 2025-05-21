// app/admin/provider-approval/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { container } from '@/app/lib/diContainer';
import { ProviderController } from '@/app/(controller)/providers/providerController';

const provider = container.resolve(ProviderController);

async function approveTransporationProvider(providerId: string) {
  'use server'
  const response = await provider.approveTransportationProvider(providerId)
  return response;
}

async function rejectTransporationProvider(providerId: string) {
  'use server'
  const response = await provider.rejectTransportationProvider(providerId)
  return response;
}

async function getTransportationProviders(accountStatus = 'pending') {
  // Pass the accountStatus parameter to the API call
  const response = await provider.getPendingTransportationProviders(accountStatus)
  console.log("Fetching transportation providers with accountStatus:", accountStatus)
  return response;
}

async function getAccommodationProviders(accountStatus = 'pending') {
  // Update this function to also use the accountStatus parameter
  const response = await provider.getPendingAccommodationProviders(accountStatus)
  console.log("Fetching accommodation providers with accountStatus:", accountStatus)
  return response;
}

async function TransportationProviderTable({ accountStatus, search }) {
  const providers = await getTransportationProviders(accountStatus);
  
  // Filter by search if provided
  const filteredProviders = search 
    ? providers.filter(provider => 
        provider.user.name?.toLowerCase().includes(search.toLowerCase()) ||
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
                    <span className="text-gray-500 dark:text-gray-300">{provider.user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.user.username}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{provider.user.email}</div>
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
                {provider.user.createdAt.toString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-2">
                  <form action={approveTransporationProvider.bind(null, provider.providerId)}>
                    <button type="submit" className="btn-primary text-sm py-1">
                      Approve
                    </button>
                  </form>
                  <form action={rejectTransporationProvider.bind(null, provider.providerId)}>
                    <button type="submit" className="btn-outlined text-sm py-1 text-error">
                      Reject
                    </button>
                  </form>
                  <Link href={`/providers/${provider.providerId}`} className="btn-text text-primary text-center">
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

async function AccommodationProviderTable({ accountStatus, search }) {
  const providers = await getAccommodationProviders(accountStatus);
  
  // Filter by search if provided
  const filteredProviders = search 
    ? providers.filter(provider => 
        provider.user.name?.toLowerCase().includes(search.toLowerCase()) ||
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
                    <span className="text-gray-500 dark:text-gray-300">{provider.user.name?.charAt(0).toUpperCase()}</span>
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
                  <Link href={`/providers/${provider.providerId}`} className="btn-text text-primary text-center">
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
      </table>
    </div>
  );
}

function ProviderFilterSection({ providerType, currentaccountStatus, currentSearch }) {
  return (
    <form action="/providers" method="GET">
      <input type="hidden" name="tab" value={providerType} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="accountStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            accountStatus
          </label>
          <select
            id="accountStatus"
            name="accountStatus"
            className="input w-full"
            defaultValue={currentaccountStatus || "pending"}
          >
            <option value="pending">Pending</option>
            <option value="active">active</option>
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
            defaultValue={currentSearch || ""}
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

export default function ProviderApprovalPage({ searchParams }) {
  const tab = searchParams?.tab || 'transportation';
  const accountStatus = searchParams?.accountStatus ;
  const search = searchParams?.search || '';

  console.log("Tab:", tab);
  console.log("accountStatus:", accountStatus);
  console.log("Search:", search);
    
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col">
      <div className="px-6 py-8 ml-64">  {/* Adjust margins based on your layout */}
        <div className="mb-6">
          <h1 className="text-headline-lg font-semibold mb-2">Provider Approval</h1>
          <p className="text-body-md text-gray-600 dark:text-gray-400">
            Review and approve or reject transportation and accommodation provider applications
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <Link 
            href={`/providers?tab=transportation&accountStatus=${accountStatus}&search=${search}`}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              tab === 'transportation' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Transportation Providers
          </Link>
          <Link 
            href={`/providers?tab=accommodation&accountStatus=${accountStatus}&search=${search}`}
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
            <ProviderFilterSection 
              providerType={tab} 
              currentaccountStatus={accountStatus}  
              currentSearch={search}
            />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-headline-sm font-semibold">
              {tab === 'transportation' ? 'Transportation Provider Requests' : 'Accommodation Provider Requests'}
              {accountStatus && ` - ${accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}`}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {accountStatus === 'pending' && (
                <span className="font-medium text-warning">
                  Pending requests require review
                </span>
              )}
              {accountStatus === 'approved' && (
                <span className="font-medium text-success">
                  Approved providers
                </span>
              )}
              {accountStatus === 'rejected' && (
                <span className="font-medium text-error">
                  Rejected providers
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <Suspense fallback={<TableSkeleton />}>
              {tab === 'transportation' ? (
                <TransportationProviderTable accountStatus={accountStatus} search={search} />
              ) : (
                <AccommodationProviderTable accountStatus={accountStatus} search={search} />
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