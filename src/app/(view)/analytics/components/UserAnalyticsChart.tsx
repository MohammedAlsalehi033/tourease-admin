import React from 'react';
import { UserAnalyticsData } from '@/app/(model)/analytics/analyticsModel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserAnalyticsChartProps {
    data: UserAnalyticsData;
}

export default function UserAnalyticsChart({ data }: UserAnalyticsChartProps) {
    // Format the time series data if available
    const timeSeriesData = data.userSignupsByPeriod?.map(item => ({
        ...item,
        period: item.period || 'Unknown', // Provide default for period if undefined
    })) || [];

    // Calculate engagement metrics for display cards
    const activeUsers = data.activeUserCount || 0;
    const inactiveUsers = (data.totalUsers || 0) - activeUsers;
    const engagementRate = data.userEngagementRate ? (data.userEngagementRate * 100).toFixed(2) : 'N/A';
    const avgSessionDuration = data.averageSessionDuration ? 
        `${Math.floor(data.averageSessionDuration / 60)}m ${Math.round(data.averageSessionDuration % 60)}s` : 'N/A';

    return (
        <div>
            {/* User Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded bg-blue-100 dark:bg-blue-900 shadow">
                    <h3 className="text-title-sm text-center">Total Users</h3>
                    <p className="text-headline-md text-center font-bold">{data.totalUsers || 0}</p>
                </div>
                <div className="p-4 rounded bg-green-100 dark:bg-green-900 shadow">
                    <h3 className="text-title-sm text-center">Active Users</h3>
                    <p className="text-headline-md text-center font-bold">{activeUsers}</p>
                </div>
                <div className="p-4 rounded bg-amber-100 dark:bg-amber-900 shadow">
                    <h3 className="text-title-sm text-center">Engagement Rate</h3>
                    <p className="text-headline-md text-center font-bold">{engagementRate}%</p>
                </div>
                <div className="p-4 rounded bg-purple-100 dark:bg-purple-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Session</h3>
                    <p className="text-headline-md text-center font-bold">{avgSessionDuration}</p>
                </div>
            </div>

            {/* User Signups Over Time Chart */}
            {timeSeriesData.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-title-md mb-2">User Signups Over Time</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={timeSeriesData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    name="New Users" 
                                    stroke="#8884d8" 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* User Demographics - if available */}
            {data.userDemographics && (
                <div className="mt-6">
                    <h3 className="text-title-md mb-2">Demographics Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Add demographic details as available in your data structure */}
                        <p className="text-body-md">Gender, age, location demographics would go here</p>
                    </div>
                </div>
            )}
        </div>
    );
}