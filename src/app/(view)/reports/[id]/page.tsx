import "reflect-metadata"
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import { revalidatePath } from 'next/cache';
import { ReportsController } from "@/app/(controller)/reports/reportsController";

async function resolveReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  const notes = (formData.get('resolutionNotes') || '') as string;
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'resolved', notes || undefined);
  revalidatePath(`/reports/${reportId}`);
}

async function dismissReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  const notes = (formData.get('resolutionNotes') || '') as string;
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'dismissed', notes || undefined);
  revalidatePath(`/reports/${reportId}`);
}

async function investigateReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  const notes = (formData.get('resolutionNotes') || '') as string;
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.updateReportStatus(reportId, 'investigating', notes || undefined);
  revalidatePath(`/reports/${reportId}`);
}

async function deleteReportAction(formData: FormData) {
  'use server';
  const reportId = Number(formData.get('reportId'));
  if (!reportId) return;
  const reportsDI = container.resolve(ReportsController);
  await reportsDI.deleteReport(reportId);
  revalidatePath(`/reports`);
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'pending'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : status === 'resolved'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : status === 'dismissed'
      ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const reportsDI = container.resolve(ReportsController);
  const report = await reportsDI.getReportById(id);

  const createdAt = new Date(report.createdAt).toLocaleString();
  const updatedAt = new Date(report.updatedAt).toLocaleString();

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-semibold mb-2">Report #{report.id}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <StatusBadge status={report.status} />
            <span>Created: {createdAt}</span>
            <span>Updated: {updatedAt}</span>
          </div>
        </div>
        <Link href="/reports" className="btn-outlined">Back to Reports</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-headline-sm font-semibold">Details</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div><span className="text-gray-500">Type:</span> <span className="font-medium">{report.reportableType}</span></div>
              <div><span className="text-gray-500">Reason:</span> <span className="font-medium">{report.reportReason}</span></div>
              {report.description && (<div><span className="text-gray-500">Description:</span> <span>{report.description}</span></div>)}
              {report.resolutionNotes && (<div><span className="text-gray-500">Resolution Notes:</span> <span>{report.resolutionNotes}</span></div>)}
              {report.resolvedBy && (<div><span className="text-gray-500">Resolved By:</span> <span>{report.resolvedBy}</span></div>)}
              {report.resolvedAt && (<div><span className="text-gray-500">Resolved At:</span> <span>{new Date(report.resolvedAt).toLocaleString()}</span></div>)}
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-headline-sm font-semibold">Reported Entity</h2>
            </div>
            <div className="p-4 text-sm space-y-3">
              {report.reportableType === 'QUESTION' && report.Question && (
                <div>
                  <div className="font-medium">Question: {report.Question.title}</div>
                  <div className="text-gray-500">{report.Question.description}</div>
                  <Link href={`/moderation/questions/${report.Question.id}`} target="_blank" className="text-primary underline">Open question</Link>
                </div>
              )}
              {report.reportableType === 'COMMENT' && report.Comment && (
                <div>
                  <div className="font-medium">Comment: {report.Comment.content}</div>
                  {report.Comment.question?.title && <div className="text-gray-500">On: {report.Comment.question.title}</div>}
                  <Link href={`/comments/${report.Comment.id}`} target="_blank" className="text-primary underline">Open comment</Link>
                </div>
              )}
              {report.reportableType === 'USER' && report.User_Report_reportedUserIdToUser && (
                <div>
                  <div className="font-medium">User: {report.User_Report_reportedUserIdToUser.username || report.User_Report_reportedUserIdToUser.email}</div>
                  <Link href={`/users/${report.reportedUserId}`} target="_blank" className="text-primary underline">Open user</Link>
                </div>
              )}
              {report.reportableType === 'TRANSPORTATION_LISTING' && report.TransportationListing && (
                <div>
                  <div className="font-medium">Transport Listing #{report.TransportationListing.id}</div>
                  <div className="text-gray-500">{report.TransportationListing.startLocationText} → {report.TransportationListing.endLocationText}</div>
                  <Link href={`/transportation/listings/${report.TransportationListing.id}`} target="_blank" className="text-primary underline">Open listing</Link>
                </div>
              )}
              {report.reportableType === 'ACCOMMODATION' && report.Accommodation && (
                <div>
                  <div className="font-medium">Accommodation: {report.Accommodation.name}</div>
                  <div className="text-gray-500">{report.Accommodation.location}</div>
                  <Link href={`/accommodations/${report.Accommodation.id}`} target="_blank" className="text-primary underline">Open accommodation</Link>
                </div>
              )}
              {report.reportableType === 'ROOM' && report.Room && (
                <div>
                  <div className="font-medium">Room #{report.Room.id} - {report.Room.roomType}</div>
                  <Link href={`/rooms/${report.Room.id}`} target="_blank" className="text-primary underline">Open room</Link>
                </div>
              )}
              {report.reportableType === 'MESSAGE' && report.Message && (
                <div>
                  <div className="font-medium">Message #{report.Message.id}</div>
                  <div className="text-gray-500">{report.Message.content}</div>
                </div>
              )}
              {report.reportableType === 'REVIEW' && report.Review && (
                <div>
                  <div className="font-medium">Review #{report.Review.id}</div>
                  <div className="text-gray-500">Rating: {report.Review.rating}/5</div>
                  <div className="text-gray-500">{report.Review.content}</div>
                  {report.Review.transportationListing && (
                    <div className="text-gray-500">For: {report.Review.transportationListing.startLocationText} → {report.Review.transportationListing.endLocationText}</div>
                  )}
                  {report.Review.accommodation && (
                    <div className="text-gray-500">For: {report.Review.accommodation.name} - {report.Review.accommodation.location}</div>
                  )}
                  <Link href={`/reviews/${report.Review.id}`} target="_blank" className="text-primary underline">Open review</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-headline-sm font-semibold">People</h2>
            </div>
            <div className="p-4 text-sm space-y-3">
              <div>
                <div className="text-gray-500">Reporter</div>
                <div className="font-medium">{report.User_Report_reporterIdToUser?.username || report.User_Report_reporterIdToUser?.email || report.reporterId}</div>
                {report.User_Report_reporterIdToUser?.id && (
                  <Link href={`/users/${report.User_Report_reporterIdToUser.id}`} target="_blank" className="text-primary underline">Open reporter</Link>
                )}
              </div>
              <div>
                <div className="text-gray-500">Reported User</div>
                <div className="font-medium">{report.User_Report_reportedUserIdToUser?.username || report.User_Report_reportedUserIdToUser?.email || '-'}</div>
                {report.User_Report_reportedUserIdToUser?.id && (
                  <Link href={`/users/${report.User_Report_reportedUserIdToUser.id}`} target="_blank" className="text-primary underline">Open user</Link>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-headline-sm font-semibold">Actions</h2>
            </div>
            <div className="p-4 space-y-4">
              {(report.status === 'pending' || report.status === 'investigating') && (
                <>
                  <form action={resolveReportAction} className="space-y-2">
                    <input type="hidden" name="reportId" value={report.id} />
                    <textarea name="resolutionNotes" placeholder="Resolution notes (optional)" className="input w-full h-20" />
                    <button className="btn-primary w-full">Mark as Resolved</button>
                  </form>
                  <form action={dismissReportAction} className="space-y-2">
                    <input type="hidden" name="reportId" value={report.id} />
                    <textarea name="resolutionNotes" placeholder="Dismissal notes (optional)" className="input w-full h-20" />
                    <button className="btn-outlined w-full">Dismiss</button>
                  </form>
                  <form action={investigateReportAction} className="space-y-2">
                    <input type="hidden" name="reportId" value={report.id} />
                    <textarea name="resolutionNotes" placeholder="Investigation notes (optional)" className="input w-full h-20" />
                    <button className="btn-outlined w-full">Move to Investigating</button>
                  </form>
                </>
              )}
              <form action={deleteReportAction}>
                <input type="hidden" name="reportId" value={report.id} />
                <button className="btn-danger w-full">Delete Report</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



