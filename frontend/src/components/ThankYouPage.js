import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AuthHeader from './AuthHeader'; 

const ThankYouPage = () => {
    const location = useLocation();
    // Get submissionId from the state passed by ComplaintStart
    const submissionId = location.state?.submissionId;

    const { isAdmin } = useAuth();

    // If no submissionId is found (e.g., page refresh), redirect to the correct dashboard.
    if (!submissionId) {
        const homePortal = isAdmin ? "/admin" : "/portal";
        return <Navigate to={homePortal} replace />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-siit-light font-sans">

            <AuthHeader /> 

            {/* Centered Content */}
            <div className="flex justify-center items-center flex-grow p-4">
                <div className="bg-white rounded-xl p-10 shadow-xl w-full max-w-3xl text-center">
                    
                    
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Submission Successful!
                    </h1>
                    
                    <p className="text-gray-600 mb-6">
                        Thank you for your feedback. Your complaint has been submitted.
                    </p>
                    
                    <div className="bg-gray-100 p-4 rounded-lg mb-8">
                        <span className="text-gray-600">Your Submission ID is:</span>
                        <br />
                        <span className="text-2xl font-bold text-siit-purple">
                            #{submissionId}
                        </span>
                    </div>

                    {/* Fix the Link 'to' prop */}
                    <Link 
                        to={isAdmin ? "/admin" : "/portal"}
                        className="bg-siit-purple text-white px-6 py-3 rounded-full w-full shadow-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
                    >
                        {/* Also make the text dynamic */}
                        {isAdmin ? "Back to Dashboard" : "Back to Menu"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;