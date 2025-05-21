import React from 'react';
import { ProviderAnalyticsData } from '@/app/(model)/analytics/analyticsModel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProviderAnalyticsChartProps {
    data: ProviderAnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ProviderAnalyticsChart({ data }: ProviderAnalyticsChartProps) {
    // Format top providers by revenue
    const topProvidersByRevenue = data.topProvidersByRevenue?.map(item => ({
        name: item.providerName?.substring(0, 15) || 'Unknown',
        revenue: item.totalRevenue || 0
    })).slice(0, 5) || [];

    // Format top providers by bookings
    const topProvidersByBookings = data.topProvidersByBookings?.map(item => ({
        name: item.providerName?.substring(0, 15) || 'Unknown',
        bookings: item.totalBookings || 0
    })).slice(0, 5) || [];

    // Format provider type distribution
    const providerTypeData = data.providerTypeDistribution?.map(item => ({
        name: item.providerType || 'Unknown',
        value: item.count || 0
    })) || [];

    // Calculate key metrics
    const totalProviders = data.totalProviders || 0;
    const activeProviders = data.activeProviderCount || 0;
    const avgRevenue = data.averageRevenuePerProvider?.toFixed(2) || '0.00';
    const avgRating = data.averageProviderRating?.toFixed(2) || 'N/A';

    return (
        <div>
            {/* Provider Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded bg-blue-100 dark:bg-blue-900 shadow">
                    <h3 className="text-title-sm text-center">Total Providers</h3>
                    <p className="text-headline-md text-center font-bold">{totalProviders}</p>
                </div>
                <div className="p-4 rounded bg-green-100 dark:bg-green-900 shadow">
                    <h3 className="text-title-sm text-center">Active Providers</h3>
                    <p className="text-headline-md text-center font-bold">{activeProviders}</p>
                </div>
                <div className="p-4 rounded bg-purple-100 dark:bg-purple-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Revenue</h3>
                    <p className="text-headline-md text-center font-bold">${avgRevenue}</p>
                </div>
                <div className="p-4 rounded bg-amber-100 dark:bg-amber-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Rating</h3>
                    <p className="text-headline-md text-center font-bold">⭐ {avgRating}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Providers by Revenue */}
                {topProvidersByRevenue.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Top Providers by Revenue</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topProvidersByRevenue}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Top Providers by Bookings */}
                {topProvidersByBookings.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Top Providers by Bookings</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topProvidersByBookings}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="bookings" name="Total Bookings" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Provider Type Distribution */}
                {providerTypeData.length > 0 && (
                    <div className="md:col-span-2 mt-6">
                        <h3 className="text-title-md mb-2 text-center">Provider Type Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={providerTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {providerTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} providers`, '']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}