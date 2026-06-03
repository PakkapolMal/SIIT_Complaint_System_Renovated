import React, { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthProvider';
import { fetchUserHistory, getErrorMessage } from '../lib/complaintsService';
import DashboardShell from './dashboard/DashboardShell';
import ComplaintsList from './dashboard/ComplaintsList';
import { filterSubmissions } from './dashboard/complaintUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In progress' },
  { value: 'Resolved', label: 'Resolved' },
];

const UserHistory = () => {
  const { userId } = useAuth();
  const searchId = useId();
  const statusId = useId();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredSubmissions = useMemo(
    () => filterSubmissions(submissions, { search, status: statusFilter }),
    [submissions, search, statusFilter]
  );

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
              <Link to="/portal">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to dashboard
              </Link>
            </Button>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Complaint history
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Full list of complaints you have submitted.
            </p>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" aria-busy="true" aria-label="Loading history" />
        ) : error ? (
          <Card className="border-destructive/30 bg-destructive/5" role="alert">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              <div>
                <CardTitle className="text-base text-destructive">Error</CardTitle>
                <CardDescription className="text-destructive/90">{error}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-4 pb-4">
              <CardDescription>
                {filteredSubmissions.length} of {submissions.length} complaints
              </CardDescription>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={searchId}>Search</Label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={searchId}
                      type="search"
                      placeholder="Search complaints…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={statusId}>Status</Label>
                  <select
                    id={statusId}
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
            </CardHeader>
            <CardContent>
              <ComplaintsList submissions={filteredSubmissions} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default UserHistory;
