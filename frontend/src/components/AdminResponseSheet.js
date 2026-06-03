import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import {
  deleteSubmission,
  fetchAdminSubmissions,
  getErrorMessage,
} from '../lib/complaintsService';

const AdminResponseSheet = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const loadSubmissions = () => {
        setLoading(true);
        fetchAdminSubmissions()
            .then((rows) => {
                setSubmissions(rows);
                setError(null);
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadSubmissions();
    }, []);

    const handleDelete = async (submissionId) => {
        if (!window.confirm(`Are you sure you want to delete submission #${submissionId}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteSubmission(submissionId);
            setSubmissions((prevSubmissions) =>
                prevSubmissions.filter((s) => s.SubmissionID !== submissionId)
            );
        } catch (err) {
            alert(getErrorMessage(err));
        }
    };

    return (
        <AuthenticatedLayout mainClassName="p-4 sm:p-8">
                <div className="mx-auto max-w-6xl rounded-xl border border-border bg-card p-6 shadow-md">
                    <h1 className="text-4xl font-extrabold text-siit-purple mb-4 border-b pb-2">
                        Manage Complaints
                    </h1>
                    <p className="text-gray-600 mb-6">
                        View all submitted complaints, see submitter details, and update status or respond.
                    </p>
                    
                    <button 
                        onClick={() => navigate('/admin')} 
                        className="text-siit-purple hover:underline mb-4 block"
                    >
                        &larr; Back to Admin Dashboard
                    </button>

                    {loading ? (
                        <div className="text-center p-8">
                            <p className="text-lg text-gray-600">Loading submissions...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                            Error: {error}
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-300">
                            No complaints have been submitted yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Topic</th>
                                        <th className="px-4 py-3">Submitter</th> 
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {submissions.map(submission => (
                                        <tr key={submission.SubmissionID} className="hover:bg-purple-50 transition duration-150">
                                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">#{submission.SubmissionID}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{submission.Date}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{submission.TopicName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                {submission.SubmitterName}
                                                <span className="text-xs text-gray-500 ml-2">({submission.SubmitterRole})</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(submission.Status)}`}>
                                                    {submission.Status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button 
                                                    onClick={() => navigate(`/admin/respond/${submission.SubmissionID}`)}
                                                    className="bg-siit-purple text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-purple-700 transition-colors"
                                                >
                                                    Update
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(submission.SubmissionID)}
                                                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
        </AuthenticatedLayout>
    );
};

export default AdminResponseSheet;
