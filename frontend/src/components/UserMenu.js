import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AuthHeader from './AuthHeader';

const UserMenu = () => {
    // --- Get 'userName' from the context ---
    const { userName } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-siit-light">
            {/* --- Header --- */}
            <AuthHeader /> 

            {/* --- Main Content --- */}
            <main className="flex-grow p-4 sm:p-8">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                    
                    {/* --- Use 'userName' in the heading --- */}
                    <h2 className="text-3xl font-extrabold text-siit-purple mb-6">
                        Welcome, {userName || 'User'}!
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Please choose an option below to proceed:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Overall Public View (Top Left) */}
                        <Link 
                            to="/overall-view" 
                            className="block p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-shadow duration-200 shadow-md hover:shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Overall Public View
                            </h3>
                            <p className="text-gray-600 text-sm">
                                View the public list of all submitted complaints.
                            </p>
                        </Link>

                        {/* View My Submissions (Top Right - Placeholder) */}
                        <Link 
                            to="/my-history"
                            className="block p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-shadow duration-200 shadow-md hover:shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                View My Complaint History
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Track the status and response for your filed complaints.
                            </p>
                        </Link>
                        
                        {/* File New Complaint (Bottom - Spans Full Width) */}
                        <Link 
                            to="/topics" 
                            className="block p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-shadow duration-200 shadow-md hover:shadow-lg col-span-1 md:col-span-2"
                        >
                            <h3 className="text-xl font-semibold text-siit-purple mb-2">
                                File New Complaint
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Start the submission process by selecting a topic.
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserMenu;