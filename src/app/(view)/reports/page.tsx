import "reflect-metadata"
import { Suspense } from 'react';
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import { ContentController } from '@/app/(controller)/content/contentController';
import { revalidatePath } from 'next/cache';
import { reportsController } from "@/app/(controller)/reports/reportsController";

// --- NEW SERVER ACTIONS FOR REPORTS ---

async function updateReportStatusAction(reportId: number, status: 'RESOLVED' | 'DISMISSED' | 'INVESTIGATING') {
  'use server';
  try {
    const reportsDI = container.resolve(ContentController);
    // Assuming a method exists in your controller to update the report status
    await reportsDI.updateReportStatus(reportId, status /*, adminId */);
    revalidatePath('/moderation');
    return { success: true, message: `Report status updated to ${status}` };
  } catch (error) {
    console.error(`Error updating report status:`, error);
    return { success: false, message: `Failed to update report: ${error.message}` };
  }
}

// --- REFACTORED COMPONENTS FOR REPORTS ---

function ReportTable({ reports }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reported Content</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reporter</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <Link href={report.content.link} className="font-medium text-primary hover:underline">
                  {report.content.type} #{report.content.id}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.reporter.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{report.reason}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  report.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  report.status === 'DISMISSED' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' // Investigating
                }`}>
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {report.status === 'PENDING' || report.status === 'INVESTIGATING' ? (
                  <div className="flex space-x-2">
                    <form action={updateReportStatusAction.bind(null, report.id, 'RESOLVED')}>
                      <button className="text-green-600 hover:text-green-900">Resolve</button>
                    </form>
                    <form action={updateReportStatusAction.bind(null, report.id, 'DISMISSED')}>
                      <button className="text-gray-600 hover:text-gray-900">Dismiss</button>
                    </form>
                  </div>
                ) : (
                  <span className="text-gray-400">Handled</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reported Content</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reporter</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4"><div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ReportFilterSection({ searchParams }) {
  return (
    <form action="/moderation" method="GET">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select id="status" name="status" className="input w-full" defaultValue={searchParams.status || ""}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
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
            placeholder="Search by reason, reporter ID, or content ID"
            className="input w-full"
            defaultValue={searchParams.search || ''}
          />
        </div>
        
        <div className="flex items-end">
          <button type="submit" className="btn-primary h-10">
            Apply Filters
          </button>
          <Link href="/moderation" className="btn-outlined ml-2 h-10 flex items-center justify-center">
            Reset
          </Link>
        </div>
      </div>
    </form>
  );
}

export default async function ReportModerationPage({ searchParams }) {
  const status = searchParams?.status || '';
  const search = searchParams?.search || '';
  const currentPage = Number(searchParams?.pageNumber) || 1;

  // 1. Fetch reports data instead of questions
  const contentController = container.resolve(reportsController);
  // Assumes a new controller method `getAllReports` exists
  const response = await contentController.getAllReports();
  
  const reportsData = response || [];
  
  // 2. Transform the report data for the table
  const transformedReports = reportsData.map(report => ({
    id: report.id,
    reason: report.reason,
    status: report.status,
    createdAt: new Date(report.createdAt).toLocaleDateString(),
    reporter: {
      id: report.reporter?.id || 0,
      name: report.reporter?.name || 'Anonymous',
    },
    content: {
      id: report.content.id,
      type: report.content.type,
      // Generate a link to the reported content (you might need to adjust the path)
      link: `/moderation/${report.content.type.toLowerCase()}/${report.content.id}`
    }
  }));

  const hasNextPage = reportsData.length === 10; // Simple pagination logic

  return (
    <div className="px-6 py-8 ">
      <div className="mb-6">
        <h1 className="text-headline-lg font-semibold mb-2">Report Moderation</h1>
        <p className="text-body-md text-gray-600 dark:text-gray-400">
          Review and manage user-submitted reports to ensure platform integrity.
        </p>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-headline-sm font-semibold">Search & Filter Reports</h2>
        </div>
        <div className="p-4">
          <ReportFilterSection searchParams={searchParams} />
        </div>
      </div>
      
      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-headline-sm font-semibold">Inbox</h2>
           <div className="text-sm text-gray-500 dark:text-gray-400">
             {status === 'PENDING' && <span className="font-medium text-yellow-500">Pending reports require review</span>}
           </div>
        </div>
        
        <div className="p-4">
          <Suspense fallback={<ReportTableSkeleton />}>
            <ReportTable reports={transformedReports} />
          </Suspense>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage}
            </div>
            
            <div className="flex space-x-2">
              <Link 
                href={{ pathname: '/moderation', query: { ...searchParams, pageNumber: currentPage - 1 } }}
                className={`btn-outlined text-sm py-1 px-3 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
              >
                Previous
              </Link>
              <Link 
                href={{ pathname: '/moderation', query: { ...searchParams, pageNumber: currentPage + 1 } }}
                className={`btn-outlined text-sm py-1 px-3 ${!hasNextPage ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={!hasNextPage}
                tabIndex={!hasNextPage ? -1 : undefined}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}