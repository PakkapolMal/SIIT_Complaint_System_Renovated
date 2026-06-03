import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import SubmissionDetail from './SubmissionDetail';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
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
    <AuthenticatedLayout mainClassName="p-4 sm:p-8">
      <SubmissionDetail embedded />
      <div className="mx-auto -mt-2 max-w-4xl rounded-xl border border-border border-t-4 border-t-primary bg-card p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Administrator response</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground">
              Set status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full cursor-pointer rounded-lg border border-input bg-card px-4 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="resText" className="block text-sm font-medium text-foreground">
              Official response
            </label>
            <textarea
              id="resText"
              rows="6"
              value={resText}
              onChange={(e) => setResText(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-input px-4 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Write your official response here..."
              required
            />
          </div>

          <div>
            <label htmlFor="attachment" className="block text-sm font-medium text-foreground">
              Attach file (optional)
            </label>
            <input
              id="attachment"
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" role="status">
              {success}
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-primary px-8 py-3 font-bold text-primary-foreground shadow-md transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              {loading ? 'Submitting...' : 'Submit response'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminResponsePage;
