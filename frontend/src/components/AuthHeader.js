import React from 'react';
import { useAuth } from '../contexts/AuthProvider';

const AuthHeader = () => {
    // We get all the auth info from the context
    const { roleLabel, handleLogout } = useAuth();

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            
            {/* Standardized Title */}
            <h1 className="text-xl font-bold text-siit-purple">
                SIIT Complaint System
            </h1>
            
            {/* Standardized Nav Logic */}
            <nav className="flex items-center">
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 mr-4">
                    Role: {roleLabel}
                </span>
                <button
                    onClick={handleLogout}
                    className="bg-siit-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Sign Out
                </button>
            </nav>
        </header>
    );
};

export default AuthHeader;