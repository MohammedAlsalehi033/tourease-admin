'use client';
import "reflect-metadata";
import React, { useState, useEffect, ChangeEvent } from 'react'; // Import ChangeEvent
import { AnalyticsController } from '@/app/(controller)/analytics/analyticsController'; // Adjust path
import { container } from '@/app/lib/diContainer'; // Adjust path
import {
    AnalyticsOverviewData,
    UserAnalyticsData,
    BookingAnalyticsData,
    ContentAnalyticsData,
    RatingAnalyticsData,
    ProviderAnalyticsData,
    AnalyticsFilters, // Use the filter type
    AnalyticsExportFilters
} from '@/app/(model)/analytics/analyticsModel'; // Adjust path

type LoadingState = Record<string, boolean>;
type ErrorState = Record<string, string | null>;
type ExportFormat = 'json' | 'pdf' | 'csv'; // Type for export format

let analyticsController: AnalyticsController;
try {
    analyticsController = container.resolve(AnalyticsController);
} catch (error) {
    console.error("DI Container Error:", error);
}

export default function AnalyticsPage() {


    const [overviewData, setOverviewData] = useState<AnalyticsOverviewData | null>(null);
    const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsData | null>(null);
    const [transportBookings, setTransportBookings] = useState<BookingAnalyticsData | null>(null);
    const [accomBookings, setAccomBookings] = useState<BookingAnalyticsData | null>(null);
    const [contentAnalytics, setContentAnalytics] = useState<ContentAnalyticsData | null>(null);
    const [ratingAnalytics, setRatingAnalytics] = useState<RatingAnalyticsData | null>(null);
    const [providerAnalytics, setProviderAnalytics] = useState<ProviderAnalyticsData | null>(null);

    const [loading, setLoading] = useState<LoadingState>({});
    const [errors, setErrors] = useState<ErrorState>({});

    const [filters, setFilters] = useState<AnalyticsFilters>({
        startDate: '',
        endDate: '',
        interval: 'day',
        status: '',
        reviewableType: ''
    });

    const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
    const [reportType, setReportType] = useState<string>('overview'); // reportType could be more strictly typed if desired


    const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'interval') {
             setFilters({...filters, [name]: value as 'day' | 'week' | 'month'});
        } else {
             setFilters({...filters, [name]: value});
        }
    };

    function fetchOverview() {
        setLoading(prev => ({...prev, overview: true}));
        setErrors(prev => ({...prev, overview: null})); // Clear previous error
        analyticsController.getAnalyticsOverview()
            .then(data => setOverviewData(data))
            .catch(err => setErrors(prev => ({...prev, overview: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, overview: false})));
    }

    function fetchUserAnalytics() {
        setLoading(prev => ({...prev, users: true}));
        setErrors(prev => ({...prev, users: null}));
        analyticsController.getUserAnalytics(filters) // Pass current filters
            .then(data => setUserAnalytics(data))
            .catch(err => setErrors(prev => ({...prev, users: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, users: false})));
    }

    function fetchTransportBookings() {
        setLoading(prev => ({...prev, transport: true}));
         setErrors(prev => ({...prev, transport: null}));
        analyticsController.getTransportationBookingAnalytics(filters)
            .then(data => setTransportBookings(data))
            .catch(err => setErrors(prev => ({...prev, transport: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, transport: false})));
    }

     function fetchAccomBookings() {
        setLoading(prev => ({...prev, accom: true}));
         setErrors(prev => ({...prev, accom: null}));
        analyticsController.getAccommodationBookingAnalytics(filters)
            .then(data => setAccomBookings(data))
            .catch(err => setErrors(prev => ({...prev, accom: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, accom: false})));
    }

     function fetchContentAnalytics() {
        setLoading(prev => ({...prev, content: true}));
         setErrors(prev => ({...prev, content: null}));
        analyticsController.getContentAnalytics(filters)
            .then(data => setContentAnalytics(data))
            .catch(err => setErrors(prev => ({...prev, content: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, content: false})));
    }

     function fetchRatingAnalytics() {
        setLoading(prev => ({...prev, ratings: true}));
         setErrors(prev => ({...prev, ratings: null}));
        analyticsController.getRatingAnalytics(filters)
            .then(data => setRatingAnalytics(data))
            .catch(err => setErrors(prev => ({...prev, ratings: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, ratings: false})));
    }

     function fetchProviderAnalytics() {
        setLoading(prev => ({...prev, providers: true}));
         setErrors(prev => ({...prev, providers: null}));
        analyticsController.getProviderAnalytics(filters)
            .then(data => setProviderAnalytics(data))
            .catch(err => setErrors(prev => ({...prev, providers: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, providers: false})));
    }

    function handleExport() {
        setLoading(prev => ({...prev, export: true}));
        setErrors(prev => ({...prev, export: null}));

        const exportFilters: AnalyticsExportFilters = {
            startDate: filters.startDate || undefined, 
            endDate: filters.endDate || undefined,
            interval: filters.interval,
            status: filters.status || undefined,
            reviewableType: filters.reviewableType || undefined,
            reportType: reportType,
            format: exportForma
        };

        analyticsController.exportAnalytics(exportFilters)
            .then(result => {
                if (result instanceof Blob) {
                    const url = window.URL.createObjectURL(result);
                    const a = document.createElement('a');
                    a.style.display = 'none'; 
                    a.href = url;
                    a.download = `analytics_${reportType}.${exportFormat}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url); // Clean up the object URL
                    a.remove(); // Clean up the temporary anchor element
                } else if (result) {
                     console.log("Export returned non-blob data (likely JSON):", result);
                     alert("Export returned JSON data. Check console.");
                } else {
                     setErrors(prev => ({...prev, export: "Export returned no data."}));
                }
            })
            .catch(err => setErrors(prev => ({...prev, export: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, export: false})));
    }

    useEffect(() => {
        fetchOverview();
    }, []); 


    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-12 pb-12">


            <div className="max-w-5xl w-full px-6 ">
                <h1 className="mb-6 text-display-sm">Analytics Data</h1> {/* Adjusted text size */}

                {/* Overview Section */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Overview</h2> {/* Adjusted text size */}
                    <button onClick={fetchOverview} className="btn-text mb-2" disabled={loading['overview']}>
                        {loading['overview'] ? 'Loading...' : 'Refresh'}
                    </button>

                    {errors['overview'] && <p className="text-error text-body-md">Error: {errors['overview']}</p>} {/* Adjusted text size */}

                    {overviewData ? ( // Check if data exists before rendering
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-body-md"> {/* Adjusted text size */}
                            <p>Total Users: <strong>{overviewData.totalUsers}</strong></p>
                            <p>Total Bookings: <strong>{overviewData.totalBookings}</strong></p>
                           <p>Trans. Bookings: <strong>{overviewData.totalTransportationBookings}</strong></p>
                            <p>Acc. Bookings: <strong>{overviewData.totalAccommodationBookings}</strong></p>
                            <p>Total Revenue: <strong>{overviewData.totalRevenue?.toFixed(2)}</strong></p>
                            <p>Avg Rating: <strong>{overviewData.averageRating?.toFixed(2) ?? 'N/A'}</strong></p>
                        </div>
                    ) : (!loading['overview'] && !errors['overview'] && <p className="text-body-md">No overview data loaded.</p>)}
                </div>

                {/* Filter Controls */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-title-sm mb-1">Start Date</label> {/* Added labels */}
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="input w-full"
                            />
                        </div>
                        <div>
                             <label className="block text-title-sm mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-title-sm mb-1">Interval</label>
                            <select
                                name="interval"
                                value={filters.interval}
                                onChange={handleFilterChange}
                                className="input w-full"
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-title-sm mb-1">Status (Bookings)</label>
                             <input
                                type="text"
                                name="status"
                                placeholder="e.g., confirmed"
                                value={filters.status ?? ''} // Handle potential undefined
                                onChange={handleFilterChange}
                                className="input w-full"
                            />
                        </div>
                         <div>
                             <label className="block text-title-sm mb-1">Reviewable Type</label>
                            <input
                                type="text"
                                name="reviewableType"
                                placeholder="e.g., TransportationListing"
                                value={filters.reviewableType ?? ''} // Handle potential undefined
                                onChange={handleFilterChange}
                                className="input w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* User Analytics */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">User Analytics</h2>
                    <button onClick={fetchUserAnalytics} className="btn-text mb-2" disabled={loading['users']}>
                        {loading['users'] ? 'Loading...' : 'Load User Data'}
                    </button>

                    {errors['users'] && <p className="text-error text-body-md">Error: {errors['users']}</p>}

                    {userAnalytics && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto"> {/* Added dark mode bg */}
                            {JSON.stringify(userAnalytics, null, 2)}
                        </pre>
                    )}
                </div>

                {/* Transport Bookings */}
                 <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Transport Bookings</h2>
                    <button onClick={fetchTransportBookings} className="btn-text mb-2" disabled={loading['transport']}>
                         {loading['transport'] ? 'Loading...' : 'Load Transport Data'}
                    </button>

                     {errors['transport'] && <p className="text-error text-body-md">Error: {errors['transport']}</p>}

                     {transportBookings && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto">
                             {JSON.stringify(transportBookings, null, 2)}
                        </pre>
                    )}
                </div>

                 {/* Accommodation Bookings */}
                 <div className="card mb-8">
                     <h2 className="mb-4 text-headline-md">Accommodation Bookings</h2>
                     <button onClick={fetchAccomBookings} className="btn-text mb-2" disabled={loading['accom']}>
                         {loading['accom'] ? 'Loading...' : 'Load Accommodation Data'}
                     </button>

                     {errors['accom'] && <p className="text-error text-body-md">Error: {errors['accom']}</p>}

                     {accomBookings && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto">
                             {JSON.stringify(accomBookings, null, 2)}
                         </pre>
                     )}
                 </div>

                 {/* Content Analytics */}
                 <div className="card mb-8">
                     <h2 className="mb-4 text-headline-md">Content Analytics</h2>
                     <button onClick={fetchContentAnalytics} className="btn-text mb-2" disabled={loading['content']}>
                         {loading['content'] ? 'Loading...' : 'Load Content Data'}
                     </button>

                     {errors['content'] && <p className="text-error text-body-md">Error: {errors['content']}</p>}

                     {contentAnalytics && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto">
                             {JSON.stringify(contentAnalytics, null, 2)}
                         </pre>
                     )}
                 </div>

                 {/* Rating Analytics */}
                 <div className="card mb-8">
                     <h2 className="mb-4 text-headline-md">Rating Analytics</h2>
                     <button onClick={fetchRatingAnalytics} className="btn-text mb-2" disabled={loading['ratings']}>
                         {loading['ratings'] ? 'Loading...' : 'Load Rating Data'}
                     </button>

                     {errors['ratings'] && <p className="text-error text-body-md">Error: {errors['ratings']}</p>}

                     {ratingAnalytics && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto">
                             {JSON.stringify(ratingAnalytics, null, 2)}
                        </pre>
                     )}
                 </div>

                  {/* Provider Analytics */}
                 <div className="card mb-8">
                     <h2 className="mb-4 text-headline-md">Provider Analytics</h2>
                     <button onClick={fetchProviderAnalytics} className="btn-text mb-2" disabled={loading['providers']}>
                         {loading['providers'] ? 'Loading...' : 'Load Provider Data'}
                     </button>

                     {errors['providers'] && <p className="text-error text-body-md">Error: {errors['providers']}</p>}

                     {providerAnalytics && (
                        <pre className="text-body-sm bg-light-surface dark:bg-dark-surface p-2 rounded overflow-x-auto">
                             {JSON.stringify(providerAnalytics, null, 2)}
                        </pre>
                     )}
                 </div>


                {/* Export Section */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Export Data</h2>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                             <label className="block text-title-sm mb-1">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setReportType(e.target.value)}
                                className="input w-full"
                            >
                                <option value="overview">Overview</option>
                                <option value="users">Users</option>
                                <option value="bookings_transportation">Transport Bookings</option>
                                <option value="bookings_accommodation">Accommodation Bookings</option>
                                 <option value="content">Content</option>
                                 <option value="ratings">Ratings</option>
                                 <option value="providers">Providers</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-title-sm mb-1">Format</label>
                            <select
                                value={exportFormat}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setExportFormat(e.target.value as ExportFormat)}
                                className="input w-full"
                            >
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                            </select>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleExport}
                            disabled={loading['export']}
                        >
                            {loading['export'] ? 'Exporting...' : 'Export'}
                        </button>
                    </div>
                    {errors['export'] && <p className="text-error text-body-md mt-2">Export Error: {errors['export']}</p>}
                </div>
            </div>
        </div>
    );
}