import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import ComplaintsList from './dashboard/ComplaintsList';
import { filterSubmissions } from './dashboard/complaintUtils';
import { fetchUserHistory, getErrorMessage } from '../lib/complaintsService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Search } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const UserHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('You must be logged in to view your history.');
      return;
    }

    fetchUserHistory(userId)
      .then(setSubmissions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredSubmissions = React.useMemo(
    () => filterSubmissions(submissions, { search, status: statusFilter }),
    [submissions, search, statusFilter]
  );

  return (
    <AuthenticatedLayout mainClassName="p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          onClick={() => navigate('/portal')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Button>

        <Card className="shadow-md">
          <CardHeader className="space-y-4 pb-4">
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Complaint history</CardTitle>
              <CardDescription>
                {loading
                  ? 'Loading…'
                  : `${filteredSubmissions.length} of ${submissions.length} complaints`}
              </CardDescription>
            </div>

            {!loading && !error && submissions.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="history-search">Search</Label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="history-search"
                      type="search"
                      placeholder="Search complaints…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="history-status">Status</Label>
                  <select
                    id="history-status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Loading your submissions…</p>
            ) : error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive" role="alert">
                {error}
              </div>
            ) : (
              <ComplaintsList submissions={filteredSubmissions} />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default UserHistory;
