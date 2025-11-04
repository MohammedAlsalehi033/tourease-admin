import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- Mock Data ---
// A representative structure for the main analytics overview.
const analyticsOverviewApiData = {
    totalUsers: 1250,
    totalBookings: 780,
    totalRevenue: 125400.75,
    averageRating: 4.45,
    totalTransportationBookings: 550,
    totalAccommodationBookings: 230
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
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-xl w-full transform transition-all duration-300">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        AI Insights
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="max-h-[65vh] overflow-y-auto pr-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            <p className="mt-3 text-gray-500 dark:text-gray-400">Analyzing your data...</p>
                        </div>
                    ) : (
                        <div className="space-y-3 whitespace-pre-wrap">{insights}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Chart Component ---

const AnalyticsOverviewDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze this travel app overview data concisely:

            📊 Data:
            • Users: ${data.totalUsers}
            • Bookings: ${data.totalBookings}
            • Revenue: $${data.totalRevenue.toFixed(2)}
            • Rating: ${data.averageRating.toFixed(2)}/5
            • Split: ${data.totalTransportationBookings} Transportation, ${data.totalAccommodationBookings} Accommodation

            Provide a brief analysis (max 200 words) covering:
            1. Business health summary
            2. Booking distribution insights
            3. Top 2-3 actionable recommendations

            Use bullet points and emojis. Be concise and executive-friendly.
        `;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyAADt7PpTCF2r3qlqpDPNiOpUhBEEls_5w";
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

    const bookingData = [
        { name: 'Transportation', value: data.totalTransportationBookings },
        { name: 'Accommodation', value: data.totalAccommodationBookings }
    ];
    const PIE_COLORS = ['#3b82f6', '#10b981'];

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Business Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">A high-level summary of key performance indicators.</p>
                    </div>
                    <button
                        onClick={handleGenerateInsights}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="text-lg">✨</span>
                        AI Insights
                    </button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card title="Total Users"><p className="text-4xl font-extrabold text-pink-500">{data.totalUsers.toLocaleString()}</p></Card>
                    <Card title="Total Bookings"><p className="text-4xl font-extrabold text-purple-500">{data.totalBookings.toLocaleString()}</p></Card>
                    <Card title="Total Revenue"><p className="text-4xl font-extrabold text-green-500">${data.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p></Card>
                    <Card title="Average Rating"><p className="text-4xl font-extrabold text-amber-500">⭐ {data.averageRating.toFixed(2)}</p></Card>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <Card title="Booking Distribution">
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={bookingData} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {bookingData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} bookings`} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
            <InsightsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} insights={insights} isLoading={isLoading} />
        </>
    );
};


export default AnalyticsOverviewDashboard;