import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';



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

export const TransportationAnalyticsDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze the following transportation and accommodation provider data for a travel application.

            Data:
            - Transport Provider Status: ${JSON.stringify(data.transportProviderStatusCounts)}
            - Accommodation Provider Count: ${data.accommodationProviderCount}
            - New Provider Applications: ${data.providerApplicationsOverTime}
            - Top Performing Providers (Count): ${data.topPerformingProviders}

            Please provide:
            1.  A summary of the current transportation provider landscape based on their status.
            2.  An analysis of the most critical issue: the complete lack of accommodation providers (count is zero).
            3.  Actionable recommendations to attract and onboard accommodation providers.
            4.  Suggestions on how to manage the new provider applications pipeline effectively.
            Format the response clearly.
        `;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
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

    const statusData = data.transportProviderStatusCounts;
    const activeProviders = statusData.find(s => s.category === 'active')?.count || 0;
    const PIE_COLORS = { active: '#10b981', inactive: '#6b7280', pending: '#f59e0b' };

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Logistics Analytics</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">An overview of transportation and accommodation providers.</p>
                    </div>
                    <button
                        onClick={handleGenerateInsights}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        ✨ Generate Insights
                    </button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card title="Active Transport"><p className="text-4xl font-extrabold text-lime-500">{activeProviders}</p></Card>
                    <Card title="Accommodation"><p className="text-4xl font-extrabold text-red-500">{data.accommodationProviderCount}</p></Card>
                    <Card title="New Applications"><p className="text-4xl font-extrabold text-emerald-500">{data.providerApplicationsOverTime}</p></Card>
                    <Card title="Top Performers"><p className="text-4xl font-extrabold text-green-500">{data.topPerformingProviders}</p></Card>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <Card title="Transport Provider Status">
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="count" nameKey="category" paddingAngle={5}>
                                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.category]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
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

