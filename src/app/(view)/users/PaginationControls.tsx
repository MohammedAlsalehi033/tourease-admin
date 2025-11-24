"use client";

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({ 
  currentPage, 
  totalItems, 
  itemsPerPage 
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Debug logging
  console.log('Pagination Debug:', {
    currentPage,
    totalItems,
    itemsPerPage,
    totalPages,
    isNextDisabled: currentPage >= totalPages
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/users?${params.toString()}`);
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="btn-outlined text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'btn-outlined'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 2 ||
              page === currentPage + 2
            ) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}
        </div>
        
        <button 
          className="btn-outlined text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages || totalItems === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
