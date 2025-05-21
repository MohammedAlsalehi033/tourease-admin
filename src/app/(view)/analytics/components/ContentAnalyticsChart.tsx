import React from 'react';
import { ContentAnalyticsData } from '@/app/(model)/analytics/analyticsModel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ContentAnalyticsChartProps {
    data: ContentAnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ContentAnalyticsChart({ data }: ContentAnalyticsChartProps) {
    // Format content types for pie chart
    const contentTypeData = data.contentTypeDistribution?.map(item => ({
        name: item.contentType || 'Unknown',
        value: item.count || 0
    })) || [];

    // Format most viewed content for bar chart
    const popularContentData = data.mostViewedContent?.map(item => ({
        name: item.title?.substring(0, 20) || 'Unknown',
        views: item.views || 0
    })) || [];

    // Calculate key metrics
    const totalContent = data.totalContentCount || 0;
    const totalViews = data.totalViews || 0;
    const avgViews = totalContent > 0 ? Math.round(totalViews / totalContent) : 0;
    const engagementRate = data.averageEngagementRate ? (data.averageEngagementRate * 100).toFixed(2) : 'N/A';

    return (
        <div>
            {/* Content Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded bg-blue-100 dark:bg-blue-900 shadow">
                    <h3 className="text-title-sm text-center">Total Content</h3>
                    <p className="text-headline-md text-center font-bold">{totalContent}</p>
                </div>
                <div className="p-4 rounded bg-green-100 dark:bg-green-900 shadow">
                    <h3 className="text-title-sm text-center">Total Views</h3>
                    <p className="text-headline-md text-center font-bold">{totalViews}</p>
                </div>
                <div className="p-4 rounded bg-purple-100 dark:bg-purple-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Views</h3>
                    <p className="text-headline-md text-center font-bold">{avgViews}</p>
                </div>
                <div className="p-4 rounded bg-amber-100 dark:bg-amber-900 shadow">
                    <h3 className="text-title-sm text-center">Engagement Rate</h3>
                    <p className="text-headline-md text-center font-bold">{engagementRate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Type Distribution Chart */}
                {contentTypeData.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Content Type Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={contentTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {contentTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} items`, '']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Most Viewed Content Chart */}
                {popularContentData.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Most Viewed Content</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={popularContentData.slice(0, 5)} // Show top 5 only
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={150} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" name="Views" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}