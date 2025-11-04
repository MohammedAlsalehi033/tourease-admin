import "reflect-metadata"

import { Suspense } from 'react';
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import { revalidatePath } from 'next/cache';
import { ReportsController } from "@/app/(controller)/reports/reportsController";

// --- NEW SERVER ACTIONS FOR REPORTS ---

async function resolveReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'resolved');
  revalidatePath('/reports');
}

async function dismissReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'dismissed');
  revalidatePath('/reports');
}

async function investigateReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'investigating');
  revalidatePath('/reports');
}

async function deleteReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.deleteReport(reportId);
  revalidatePath('/reports');
}

// --- REFACTORED COMPONENTS FOR REPORTS ---

function ReportTable({ reports }) {
  console.log('ReportTable received reports:', reports, 'length:', reports?.length);
  
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No reports found</div>
        <p className="text-gray-400 dark:text-gray-500">There are no reports matching your current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reporter</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reported User</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <Link href={`/reports/${report.id}`} className="text-primary underline">{report.id}</Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{report.reportableType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.User_Report_reporterIdToUser?.username || report.User_Report_reporterIdToUser?.email || report.reporterId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.User_Report_reportedUserIdToUser?.username || report.User_Report_reportedUserIdToUser?.email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{report.reportReason}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  report.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  report.status === 'dismissed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(report.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {report.status === 'pending' || report.status === 'investigating' ? (
                  <div className="flex space-x-2">
                    <form action={resolveReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button className="text-green-600 hover:text-green-900">Resolve</button>
                    </form>
                    <form action={dismissReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button className="text-gray-600 hover:text-gray-900">Dismiss</button>
                    </form>
                    <form action={investigateReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button className="text-blue-600 hover:text-blue-900">Investigate</button>
                    </form>
                    <form action={deleteReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </form>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Handled</span>
                    <form action={deleteReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </form>
                  </div>
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
    <form action="/reports" method="GET">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select id="status" name="status" className="input w-full" defaultValue={searchParams.status || ""}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select id="type" name="type" className="input w-full" defaultValue={searchParams.type || ""}>
            <option value="">All Types</option>
            <option value="USER">USER</option>
            <option value="TRANSPORTATION_LISTING">TRANSPORTATION_LISTING</option>
            <option value="ACCOMMODATION">ACCOMMODATION</option>
            <option value="ROOM">ROOM</option>
            <option value="REVIEW">REVIEW</option>
            <option value="QUESTION">QUESTION</option>
            <option value="COMMENT">COMMENT</option>
            <option value="MESSAGE">MESSAGE</option>
          </select>
        </div>
        <div>
          <label htmlFor="reporterId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reporter ID
          </label>
          <input type="text" id="reporterId" name="reporterId" placeholder="Reporter userId"
            className="input w-full" defaultValue={searchParams.reporterId || ''} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary h-10">
            Apply Filters
          </button>
          <Link href="/reports" className="btn-outlined ml-2 h-10 flex items-center justify-center">
            Reset
          </Link>
        </div>
      </div>
    </form>
  );
}

export default async function ReportModerationPage({ searchParams }) {
  console.log('=== ReportModerationPage Starting ===');
  console.log('searchParams:', searchParams);
  
  const status = searchParams?.status || '';
  const type = searchParams?.type || '';
  const reporterId = searchParams?.reporterId || '';
  const currentPage = Number(searchParams?.pageNumber) || 1;
  const limit = Number(searchParams?.limit) || 10;

  console.log('Parsed params:', { status, type, reporterId, currentPage, limit });

  const reportsDI = container.resolve(ReportsController);
  console.log('ReportsController resolved:', !!reportsDI);
 
  let reportsData = [];
  let pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };
  
  try {
    console.log('Calling listReports...');
    const result = await reportsDI.listReports(currentPage, limit, {
      status: status || undefined,
      reportableType: type || undefined,
      reporterId: reporterId || undefined,
    });
    console.log('Fetched reports result:', result);
    
    // Handle different possible response formats
    if (result && result.reports) {
      reportsData = result.reports;
      pagination = result.pagination || pagination;
    } else if (Array.isArray(result)) {
      // Fallback if the response is directly an array
      reportsData = result;
    }
    
    console.log('Final reports data:', reportsData, 'length:', reportsData?.length);
    console.log('Final pagination:', pagination);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return (
      <div className="px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error fetching reports</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
          <p className="text-red-600 text-sm mt-2">Check the console for more details.</p>
        </div>
      </div>
    );
  }
  
  let stats = {
    data: {
      totalReports: 0,
      pendingReports: 0,
      resolvedReports: 0,
      dismissedReports: 0
    }
  };
  
  try {
    console.log('Fetching statistics...');
    stats = await reportsDI.getReportsStatistics();
    console.log('Fetched statistics:', stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }

  console.log('=== ReportModerationPage Rendering ===');
  console.log('Reports to render:', reportsData?.length || 0);
  console.log('Stats:', stats?.data);

  return (
    <div className="px-6 py-8 ">
      <div className="mb-6">
        <h1 className="text-headline-lg font-semibold mb-2">Report Moderation</h1>
        <p className="text-body-md text-gray-600 dark:text-gray-400">
          Review and manage user-submitted reports to ensure platform integrity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4"><div className="text-sm text-gray-500">Total</div><div className="text-2xl font-semibold">{stats.data.totalReports}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Pending</div><div className="text-2xl font-semibold">{stats.data.pendingReports}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Resolved</div><div className="text-2xl font-semibold">{stats.data.resolvedReports}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Dismissed</div><div className="text-2xl font-semibold">{stats.data.dismissedReports}</div></div>
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
             {status === 'pending' && <span className="font-medium text-yellow-500">Pending reports require review</span>}
           </div>
        </div>
        
        <div className="p-4">
          <Suspense fallback={<ReportTableSkeleton />}>
            <ReportTable reports={reportsData} />
          </Suspense>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            
            <div className="flex space-x-2">
              <Link 
                href={{ pathname: '/reports', query: { ...searchParams, pageNumber: Math.max(1, pagination.page - 1) } }}
                className={`btn-outlined text-sm py-1 px-3 ${pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={pagination.page <= 1}
                tabIndex={pagination.page <= 1 ? -1 : undefined}
              >
                Previous
              </Link>
              <Link 
                href={{ pathname: '/reports', query: { ...searchParams, pageNumber: Math.min(pagination.totalPages, pagination.page + 1) } }}
                className={`btn-outlined text-sm py-1 px-3 ${pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={pagination.page >= pagination.totalPages}
                tabIndex={pagination.page >= pagination.totalPages ? -1 : undefined}
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