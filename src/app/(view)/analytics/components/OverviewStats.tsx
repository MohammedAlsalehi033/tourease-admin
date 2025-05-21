import React from 'react';
import { AnalyticsOverviewData } from '@/app/(model)/analytics/analyticsModel';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OverviewStatsProps {
    data: AnalyticsOverviewData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function OverviewStats({ data }: OverviewStatsProps) {
    // Create chart data for bookings distribution
    const bookingData = [
        { name: 'Transportation', value: data.totalTransportationBookings },
        { name: 'Accommodation', value: data.totalAccommodationBookings }
    ];

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded bg-blue-100 dark:bg-blue-900 shadow">
                    <h3 className="text-title-sm text-center">Total Users</h3>
                    <p className="text-headline-lg text-center font-bold">{data.totalUsers}</p>
                </div>
                <div className="p-4 rounded bg-green-100 dark:bg-green-900 shadow">
                    <h3 className="text-title-sm text-center">Total Bookings</h3>
                    <p className="text-headline-lg text-center font-bold">{data.totalBookings}</p>
                </div>
                <div className="p-4 rounded bg-purple-100 dark:bg-purple-900 shadow">
                    <h3 className="text-title-sm text-center">Total Revenue</h3>
                    <p className="text-headline-lg text-center font-bold">
                        ${data.totalRevenue?.toFixed(2) ?? '0.00'}
                    </p>
                </div>
                <div className="p-4 rounded bg-amber-100 dark:bg-amber-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Rating</h3>
                    <p className="text-headline-lg text-center font-bold">
                        {data.averageRating?.toFixed(2) ?? 'N/A'}
                    </p>
                </div>
            </div>

            {/* Bookings Distribution Chart */}
            <div className="mt-4">
                <h3 className="text-title-md mb-2 text-center">Booking Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={bookingData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {bookingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} bookings`, '']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}