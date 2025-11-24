'use client';
import "reflect-metadata";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { AnalyticsController } from '@/app/(controller)/analytics/analyticsController';
import { container } from '@/app/lib/diContainer';
import {
    AnalyticsOverviewData,
    UserAnalyticsData,
    BookingAnalyticsData,
    ContentAnalyticsData,
    RatingAnalyticsData,
    ProviderAnalyticsData,
    AnalyticsFilters,
    AnalyticsExportFilters
} from '@/app/(model)/analytics/analyticsModel';


// Chart components
import OverviewStats from './components/OverviewStats';
import RatingAnalyticsChart, { RatingAnalyticsDashboard } from './components/RatingAnalyticsChart';
import ProviderAnalyticsChart, { TransportationAnalyticsDashboard } from './components/ProviderAnalyticsChart';
import { UserAnalyticsDashboard } from "./components/UserAnalyticsChart";
import { ContentAnalyticsDashboard } from "./components/ContentAnalyticsChart";
import AnalyticsOverviewDashboard from "./components/OverviewStats";

type LoadingState = Record<string, boolean>;
type ErrorState = Record<string, string | null>;
type ExportFormat = 'json' | 'pdf' | 'csv';

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
    const [reportType, setReportType] = useState<string>('overview');

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
        setErrors(prev => ({...prev, overview: null}));
        analyticsController.getAnalyticsOverview()
            .then(data => setOverviewData(data))
            .catch(err => setErrors(prev => ({...prev, overview: err instanceof Error ? err.message : String(err)})))
            .finally(() => setLoading(prev => ({...prev, overview: false})));
    }

    function fetchUserAnalytics() {
        setLoading(prev => ({...prev, users: true}));
        setErrors(prev => ({...prev, users: null}));
        analyticsController.getUserAnalytics(filters)
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
            format: exportFormat
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
                    window.URL.revokeObjectURL(url);
                    a.remove();
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
        <div className="min-h-screen flex flex-col items-center w-full justify-start pt-12 pb-12">
            <div className="w-full px-6">
                <h1 className="mb-6 text-display-sm">Analytics Dashboard</h1>

                {/* Overview Section */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Overview</h2>
                    <button onClick={fetchOverview} className="btn-text mb-2" disabled={loading['overview']}>
                        {loading['overview'] ? 'Loading...' : 'Refresh'}
                    </button>

                    {errors['overview'] && <p className="text-error text-body-md">Error: {errors['overview']}</p>}

                    {overviewData ? (
                        <AnalyticsOverviewDashboard data={overviewData} />
                    ) : (!loading['overview'] && !errors['overview'] && <p className="text-body-md">No overview data loaded.</p>)}
                </div>

                {/* Filter Controls */}
                <div className="card mb-8">
                    <h2 className="mb-4 text-headline-md">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-title-sm mb-1">Start Date</label>
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
                                value={filters.status ?? ''}
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
                                value={filters.reviewableType ?? ''}
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
                        <UserAnalyticsDashboard data={userAnalytics} />
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
                        <ContentAnalyticsDashboard data={contentAnalytics} />
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
                        <RatingAnalyticsDashboard data={ratingAnalytics} />
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
                        <TransportationAnalyticsDashboard data={providerAnalytics} />
                    )}
                </div>

            </div>
        </div>
    );
}