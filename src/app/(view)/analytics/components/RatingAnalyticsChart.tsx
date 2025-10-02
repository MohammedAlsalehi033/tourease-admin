import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// --- Mock Data ---
// Using a representative structure for rating analytics.
const ratingAnalyticsApiData = {
    ratingDistribution: [
        { rating: 1, count: 5 },
        { rating: 2, count: 10 },
        { rating: 3, count: 15 },
        { rating: 4, count: 30 },
        { rating: 5, count: 50 }
    ],
    ratingsByPeriod: [
        { period: 'Jan', averageRating: 3.8 },
        { period: 'Feb', averageRating: 4.1 },
        { period: 'Mar', averageRating: 4.0 },
        { period: 'Apr', averageRating: 4.3 },
        { period: 'May', averageRating: 4.5 },
        { period: 'Jun', averageRating: 4.4 }
    ],
    ratingsByReviewableType: [
        { reviewableType: 'Provider', averageRating: 4.5, count: 60 },
        { reviewableType: 'Traveler', averageRating: 4.2, count: 50 }
    ],
    totalRatings: 110,
    averageRating: 4.25,
    positiveRatingRatio: 0.81, // (4s + 5s) / total
    negativeRatingRatio: 0.13 // (1s + 2s) / total
};

// --- Helper Components ---

const Card = ({ children, title }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
        {children}
    </div>
);

const InsightsModal = ({ isOpen, onClose, insights, isLoading }) => {
    if (!isOpen) return null;

    // Parse markdown-like formatting
    const formatInsights = (text) => {
        if (!text) return '';
        
        return text
            // Headers (## Title)
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2 flex items-center"><span class="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 mr-2 rounded"></span>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 dark:text-white mt-5 mb-3 flex items-center"><span class="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-orange-600 mr-2 rounded"></span>$1</h2>')
            // Bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
            // Bullet points
            .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-amber-500 mr-2 mt-1">•</span><span>$1</span></li>')
            .replace(/^• (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-amber-500 mr-2 mt-1">•</span><span>$1</span></li>')
            // Numbered lists
            .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-amber-600 font-semibold mr-2 min-w-[20px]">$1.</span><span>$2</span></li>')
            // Line breaks
            .replace(/\n\n/g, '<div class="h-3"></div>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 max-w-3xl w-full max-h-[85vh] transform transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Insights</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto pr-2 text-sm text-gray-700 dark:text-gray-300" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0"></div>
                            </div>
                            <p className="mt-6 text-base font-medium text-gray-600 dark:text-gray-400">Analyzing your data...</p>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">This may take a few moments</p>
                        </div>
                    ) : (
                        <div 
                            className="leading-relaxed space-y-2" 
                            dangerouslySetInnerHTML={{ __html: formatInsights(insights) }} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Chart Component ---

export const RatingAnalyticsDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze this travel app rating data and provide a CONCISE summary (max 250 words).

            Data:
            - Rating Distribution (1-5 stars): ${JSON.stringify(data.ratingDistribution)}
            - Average Ratings Over Time: ${JSON.stringify(data.ratingsByPeriod)}
            - Ratings by User Type: ${JSON.stringify(data.ratingsByReviewableType)}
            - Key Metrics: Total: ${data.totalRatings}, Average: ${data.averageRating}, Positive: ${(data.positiveRatingRatio * 100)}%, Negative: ${(data.negativeRatingRatio * 100)}%

            Provide a brief analysis with:
            ## Overall Sentiment
            - 2-3 main observations about rating distribution and sentiment
            
            ## Rating Trends
            - Brief analysis of whether ratings are improving, declining, or stable
            
            ## Quick Recommendations
            - 3-4 actionable bullet points to improve user satisfaction and increase average rating

            Keep it concise, clear, and actionable. Use bullet points where possible.
        `;
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyBBCO6gIeUcu0xFAirEjTbbg45znAYI19g";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            let response;
            let delay = 1000;
            for (let i = 0; i < 5; i++) {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) break;
                if (response.status === 429 || response.status >= 500) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    throw new Error(`API request failed with status ${response.status}`);
                }
            }
            if (!response.ok) {
                 throw new Error(`API request failed after multiple retries with status ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setInsights(result.candidates[0].content.parts[0].text);
            } else {
                setInsights("Could not generate insights from the provided data.");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setInsights("An error occurred while generating insights.");
        } finally {
            setIsLoading(false);
        }
    };

    const ratingDistribution = data.ratingDistribution;
    const ratingsOverTime = data.ratingsByPeriod;
    const ratingsByType = data.ratingsByReviewableType;

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rating & Review Analytics</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">An overview of user satisfaction and feedback.</p>
                    </div>
                    <button
                        onClick={handleGenerateInsights}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        ✨ Generate Insights
                    </button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card title="Total Ratings"><p className="text-4xl font-extrabold text-orange-500">{data.totalRatings}</p></Card>
                    <Card title="Average Rating"><p className="text-4xl font-extrabold text-amber-500">⭐ {data.averageRating}</p></Card>
                    <Card title="Positive Reviews"><p className="text-4xl font-extrabold text-green-500">{(data.positiveRatingRatio * 100)}%</p></Card>
                    <Card title="Negative Reviews"><p className="text-4xl font-extrabold text-red-500">{(data.negativeRatingRatio * 100)}%</p></Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Rating Distribution">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ratingDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <XAxis dataKey="rating" unit="★" stroke="rgb(156 163 175)" />
                                    <YAxis stroke="rgb(156 163 175)" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                    <Bar dataKey="count" name="Ratings" fill="#f97316" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <Card title="Average Rating Trend">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ratingsOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <XAxis dataKey="period" stroke="rgb(156 163 175)" />
                                    <YAxis domain={[1, 5]} stroke="rgb(156 163 175)" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="averageRating" name="Avg. Rating" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="lg:col-span-2">
                         <Card title="Ratings by User Type">
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ratingsByType}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="reviewableType" />
                                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                        <Radar name="Average Rating" dataKey="averageRating" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                                        <Radar name="Total Ratings" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Tooltip />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <InsightsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} insights={insights} isLoading={isLoading} />
        </>
    );
};

