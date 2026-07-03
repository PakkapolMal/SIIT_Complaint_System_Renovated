import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AppLayout from './layout/AppLayout';
import PublicNav from './layout/PublicNav';
import AuthNav from './layout/AuthNav';
import { useHomePath } from './layout/useHomePath';
import { fetchPublicSubmissions, getErrorMessage } from '../lib/complaintsService';
import { layout } from '../lib/designTokens';

const OverallResponseView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const homeTo = useHomePath();

  useEffect(() => {
    fetchPublicSubmissions()
      .then(setSubmissions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/view-detail/${id}`);
  };

  return (
    <AppLayout
      headerRight={isAuthenticated ? <AuthNav /> : <PublicNav page="home" />}
      homeTo={homeTo}
      mainClassName={layout.mainPadding}
    >
      <div className="mx-auto max-w-6xl rounded-xl border border-border bg-card p-6 shadow-md">
        <h1 className="mb-4 border-b border-border pb-2 text-3xl font-bold text-foreground sm:text-4xl">
          Overall complaint status
        </h1>
        <p className="mb-6 text-muted-foreground">
          Publicly viewable complaints, anonymized by submitter.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 block text-primary transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          &larr; Back
        </button>

        {loading ? (
          <p className="p-8 text-center text-lg text-muted-foreground">Loading submissions...</p>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive" role="alert">
            Error: {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            No complaints have been submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3" scope="col">ID</th>
                  <th className="px-4 py-3" scope="col">Date</th>
                  <th className="px-4 py-3" scope="col">Topic</th>
                  <th className="px-4 py-3" scope="col">Submitter</th>
                  <th className="px-4 py-3" scope="col">Status</th>
                  <th className="px-4 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {submissions.map((submission) => (
                  <tr
                    key={submission.SubmissionID}
                    className="transition-colors duration-200 hover:bg-accent/50"
                  >
                    <td className="px-4 py-3 font-mono text-foreground">
                      {submission.SubmissionID}
                    </td>
                    <td className="px-4 py-3 text-foreground">{submission.Date}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {submission.TopicName}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {submission.SubmitterInfo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(submission.Status)}`}
                      >
                        {submission.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(submission.SubmissionID)}
                        className="cursor-pointer font-medium text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        View detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default OverallResponseView;
