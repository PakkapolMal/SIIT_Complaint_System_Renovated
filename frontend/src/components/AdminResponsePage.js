import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import SubmissionDetail from './SubmissionDetail';
import {
  fetchSubmissionDetails,
  getErrorMessage,
  submitResolution,
} from '../lib/complaintsService';

const AdminResponsePage = () => {
    const { submissionID } = useParams();
    const navigate = useNavigate();
    
    const { userId } = useAuth();
    const [resText, setResText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [status, setStatus] = useState('In Progress');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSubmissionDetails(submissionID)
            .then((data) => {
                if (data?.details?.Status) {
                    setStatus(data.details.Status);
                }
            })
            .catch((err) => setError(getErrorMessage(err)));
    }, [submissionID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!resText || !status) {
            setError('Response text and status are required.');
            setLoading(false);
            return;
        }

        if (!userId) {
            setError('Staff ID is missing from your session.');
            setLoading(false);
            return;
        }

        try {
            await submitResolution({
                submissionId: submissionID,
                staffId: userId,
                resText,
                status,
                attachment,
            });

            setSuccess('Response submitted and status updated successfully.');
            setTimeout(() => navigate('/admin/complaints'), 2000);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-siit-light font-sans">
            <SubmissionDetail /> 
            
            <main className="flex-grow p-8 -mt-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-t-4 border-siit-purple">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                        Administrator Response
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Set Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resText" className="block text-sm font-medium text-gray-700">
                                Official Response
                            </label>
                            <textarea
                                id="resText"
                                rows="6"
                                value={resText}
                                onChange={(e) => setResText(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Write your official response here..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                                Attach File (Optional)
                            </label>
                            <input
                                id="attachment"
                                type="file"
                                onChange={(e) => setAttachment(e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-50 file:text-purple-700
                                hover:file:bg-purple-100"
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300">
                                {success}
                            </div>
                        )}

                        <div className="text-right">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 bg-siit-purple text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Response'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminResponsePage;
