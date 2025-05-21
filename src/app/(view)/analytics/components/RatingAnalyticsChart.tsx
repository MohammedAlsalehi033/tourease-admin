import React from 'react';
import { RatingAnalyticsData } from '@/app/(model)/analytics/analyticsModel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface RatingAnalyticsChartProps {
    data: RatingAnalyticsData;
}

export default function RatingAnalyticsChart({ data }: RatingAnalyticsChartProps) {
    // Format ratings distribution for bar chart
    const ratingDistribution = data.ratingDistribution?.map(item => ({
        rating: item.rating?.toString() || 'Unknown',
        count: item.count || 0
    })) || [];

    // Format ratings over time for line chart
    const ratingsOverTime = data.ratingsByPeriod?.map(item => ({
        period: item.period || 'Unknown',
        averageRating: item.averageRating || 0
    })) || [];

    // Calculate key metrics
    const totalRatings = data.totalRatings || 0;
    const averageRating = data.averageRating?.toFixed(2) || 'N/A';
    const positiveRatio = data.positiveRatingRatio ? (data.positiveRatingRatio * 100).toFixed(2) : 'N/A';
    const negativeRatio = data.negativeRatingRatio ? (data.negativeRatingRatio * 100).toFixed(2) : 'N/A';

    return (
        <div>
            {/* Rating Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded bg-blue-100 dark:bg-blue-900 shadow">
                    <h3 className="text-title-sm text-center">Total Ratings</h3>
                    <p className="text-headline-md text-center font-bold">{totalRatings}</p>
                </div>
                <div className="p-4 rounded bg-green-100 dark:bg-green-900 shadow">
                    <h3 className="text-title-sm text-center">Avg Rating</h3>
                    <p className="text-headline-md text-center font-bold">⭐ {averageRating}</p>
                </div>
                <div className="p-4 rounded bg-purple-100 dark:bg-purple-900 shadow">
                    <h3 className="text-title-sm text-center">Positive %</h3>
                    <p className="text-headline-md text-center font-bold">{positiveRatio}%</p>
                </div>
                <div className="p-4 rounded bg-amber-100 dark:bg-amber-900 shadow">
                    <h3 className="text-title-sm text-center">Negative %</h3>
                    <p className="text-headline-md text-center font-bold">{negativeRatio}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating Distribution Chart */}
                {ratingDistribution.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Rating Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ratingDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="Number of Ratings" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Ratings Over Time Chart */}
                {ratingsOverTime.length > 0 && (
                    <div>
                        <h3 className="text-title-md mb-2 text-center">Average Rating Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={ratingsOverTime}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="averageRating" 
                                        name="Avg. Rating" 
                                        stroke="#82ca9d" 
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviewable Type Section - if available */}
            {data.ratingsByReviewableType && data.ratingsByReviewableType.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-title-md mb-2 text-center">Ratings by Type</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.ratingsByReviewableType.map(item => ({
                                    type: item.reviewableType || 'Unknown',
                                    averageRating: item.averageRating || 0,
                                    count: item.count || 0
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="count" name="Number of Ratings" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="averageRating" name="Avg. Rating" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}