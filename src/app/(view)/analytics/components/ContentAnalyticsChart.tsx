import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const Card = ({ children, title }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
        {children}
    </div>
);

const InsightsModal = ({ isOpen, onClose, insights, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">✨ AI-Generated Insights</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-4 text-gray-600 dark:text-gray-300">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-4 text-lg">Generating analysis...</p>
                        </div>
                    ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Chart Component ---

export const ContentAnalyticsDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to call Gemini API for content insights
    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze the following content analytics data for a travel-related application and provide actionable insights.
            The data includes questions asked over time (visualized as a bar chart), offer statuses (donut chart), and a comparison of comments vs. votes.

            Data:
            - Questions Over Time: ${JSON.stringify(data.questionsOverTime)}
            - Offer Status Counts: ${JSON.stringify(data.offerStatusCounts)}
            - Total Comment Count: ${data.commentCounts}
            - Total Vote Count: ${data.voteDistribution}

            Please provide:
            1.  A summary of key content engagement trends based on the provided metrics.
            2.  Analysis of the offer acceptance/rejection rates and what they might indicate.
            3.  Actionable recommendations to improve content quality, user engagement (comments/votes), and offer acceptance rates.
            Format the response in a clear, easy-to-read manner.
        `;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyBBCO6gIeUcu0xFAirEjTbbg45znAYI19g"; // API key will be handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            // Exponential backoff implementation
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
                setInsights("Could not generate insights from the provided data. The response format was unexpected.");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setInsights("An error occurred while generating insights. Please check the console for more details.");
        } finally {
            setIsLoading(false);
        }
    };

    // Prepare data for the charts
    const questionsData = data.questionsOverTime.map(item => ({
        name: new Date(item.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        "Questions": item.count,
    }));

    const offerStatusData = data.offerStatusCounts;
    const engagementData = [
        { name: 'Comments', count: data.commentCounts },
        { name: 'Votes', count: data.voteDistribution }
    ];
    const PIE_CHART_COLORS = { accepted: '#10b981', pending: '#f59e0b', rejected: '#ef4444' };
    const totalOffers = offerStatusData.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Content Analytics Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">An overview of content performance and engagement.</p>
                    </div>
                    <button
                        onClick={handleGenerateInsights}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        ✨ Generate Insights
                    </button>
                </header>

                {/* --- Summary Metrics --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card title="Total Offers">
                        <p className="text-4xl font-extrabold text-cyan-500">{totalOffers}</p>
                    </Card>
                    <Card title="Total Comments">
                        <p className="text-4xl font-extrabold text-teal-500">{data.commentCounts}</p>
                    </Card>
                    <Card title="Total Votes">
                        <p className="text-4xl font-extrabold text-emerald-500">{data.voteDistribution}</p>
                    </Card>
                </div>

                {/* --- Main Charts Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Questions Over Time">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={questionsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis dataKey="name" stroke="rgb(156 163 175)" />
                                        <YAxis stroke="rgb(156 163 175)" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                        <Legend />
                                        <Bar dataKey="Questions" fill="#2dd4bf" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                    <Card title="Offer Status Distribution">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={offerStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="count" nameKey="category" paddingAngle={5}>
                                        {offerStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[entry.category]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                     <div className="lg:col-span-3">
                        <Card title="Engagement Metrics Comparison">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis dataKey="name" stroke="rgb(156 163 175)" />
                                        <YAxis stroke="rgb(156 163 175)" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                        <Bar dataKey="count" barSize={60}>
                                             <Cell fill="#34d399" />
                                             <Cell fill="#22d3ee" />
                                        </Bar>
                                    </BarChart>
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

