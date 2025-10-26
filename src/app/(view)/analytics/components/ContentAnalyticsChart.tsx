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

    // Parse markdown-like formatting
    const formatInsights = (text) => {
        if (!text) return '';
        
        return text
            // Headers (## Title)
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2 flex items-center"><span class="w-1 h-5 bg-gradient-to-b from-teal-500 to-cyan-600 mr-2 rounded"></span>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 dark:text-white mt-5 mb-3 flex items-center"><span class="w-1.5 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 mr-2 rounded"></span>$1</h2>')
            // Bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
            // Bullet points
            .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-teal-500 mr-2 mt-1">•</span><span>$1</span></li>')
            .replace(/^• (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-teal-500 mr-2 mt-1">•</span><span>$1</span></li>')
            // Numbered lists
            .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 text-sm flex items-start"><span class="text-teal-600 font-semibold mr-2 min-w-[20px]">$1.</span><span>$2</span></li>')
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
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
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
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0"></div>
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

export const ContentAnalyticsDashboard = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to call Gemini API for content insights
    const handleGenerateInsights = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        const prompt = `
            Analyze this travel app content analytics data and provide a CONCISE summary (max 250 words).

            Data:
            - Questions Over Time: ${JSON.stringify(data.questionsOverTime)}
            - Offer Status: ${JSON.stringify(data.offerStatusCounts)}
            - Comments: ${data.commentCounts}
            - Votes: ${data.voteDistribution}

            Provide a brief analysis with:
            ## Key Trends
            - 2-3 main observations about content engagement
            
            ## Offer Performance
            - Brief analysis of acceptance/rejection rates
            
            ## Quick Recommendations
            - 3-4 actionable bullet points to improve engagement

            Keep it concise, clear, and actionable. Use bullet points where possible.
        `;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyAADt7PpTCF2r3qlqpDPNiOpUhBEEls_5w"; // API key will be handled by the environment
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

