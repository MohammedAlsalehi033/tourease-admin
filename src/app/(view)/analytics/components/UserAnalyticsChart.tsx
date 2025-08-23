import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';



// --- Helper Components ---

// A reusable card component for consistent styling
const Card = ({ children, title }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
        {children}
    </div>
);

// --- Gemini-Powered Insights Modal ---
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

export const UserAnalyticsDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to call Gemini API
    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze the following user analytics data for a travel-related application and provide actionable insights.
            The data includes user registrations over time, user roles (Travelers vs. Providers), and user status (Active vs. Blocked).

            Data:
            - Registrations Over Time: ${JSON.stringify(data.registrationsOverTime)}
            - User Count by Role: ${JSON.stringify(data.countByRole)}
            - User Count by Status: ${JSON.stringify(data.countByStatus)}

            Please provide:
            1.  A summary of the key trends observed in the data.
            2.  Potential reasons for these trends (e.g., seasonality, marketing campaigns).
            3.  Actionable recommendations to improve user growth, engagement, and retention.
            Format the response in a clear, easy-to-read manner.
        `;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyBBCO6gIeUcu0xFAirEjTbbg45znAYI19g"
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

                if (response.ok) {
                    break;
                } else if (response.status === 429 || response.status >= 500) {
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
    const registrationsData = data.registrationsOverTime.map(item => ({
        name: new Date(item.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        "New Users": item.count,
    }));

    const roleData = data.countByRole;
    const statusData = data.countByStatus;
    const PIE_CHART_COLORS = ['#3b82f6', '#10b981']; 
    const totalUsers = roleData.reduce((acc, curr) => acc + curr.count, 0);
    const activeUsers = statusData.find(s => s.category === 'Active')?.count || 0;
    const blockedUsers = statusData.find(s => s.category === 'Blocked')?.count || 0;

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Analytics Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">An overview of user registration and activity.</p>
                    </div>
                    <button 
                        onClick={handleGenerateInsights}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        ✨ Generate Insights
                    </button>
                </header>

                {/* --- Summary Metrics --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card title="Total Users">
                        <p className="text-4xl font-extrabold text-blue-500">{totalUsers}</p>
                    </Card>
                    <Card title="Active Users">
                        <p className="text-4xl font-extrabold text-green-500">{activeUsers}</p>
                    </Card>
                    <Card title="Blocked Users">
                        <p className="text-4xl font-extrabold text-red-500">{blockedUsers}</p>
                    </Card>
                </div>

                {/* --- Main Charts Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Registrations Over Time">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={registrationsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis dataKey="name" stroke="rgb(156 163 175)" />
                                        <YAxis stroke="rgb(156 163 175)" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                        <Legend />
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Line type="monotone" dataKey="New Users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                    <Card title="User Roles">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="count" nameKey="category" label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                        return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>;
                                    }}>
                                        {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="lg:col-span-3">
                        <Card title="User Status">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis type="number" stroke="rgb(156 163 175)" />
                                        <YAxis type="category" dataKey="category" stroke="rgb(156 163 175)" width={80} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(55, 65, 81, 1)', color: '#ffffff', borderRadius: '0.5rem' }} />
                                        <Bar dataKey="count" barSize={40}>
                                            {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.category === 'Active' ? '#10b981' : '#ef4444'} />)}
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
