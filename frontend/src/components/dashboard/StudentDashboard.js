import React, { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';
import { fetchUserHistory, getErrorMessage } from '../../lib/complaintsService';
import DashboardShell from './DashboardShell';
import ComplaintStats from './ComplaintStats';
import ComplaintsList from './ComplaintsList';
import { computeComplaintStats, filterSubmissions } from './complaintUtils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In progress' },
  { value: 'Resolved', label: 'Resolved' },
];

function StudentDashboard() {
  const { userName, userId } = useAuth();
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
      setError('You must be logged in to view your dashboard.');
      return;
    }

    fetchUserHistory(userId)
      .then(setSubmissions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  const stats = useMemo(() => computeComplaintStats(submissions), [submissions]);

  const filteredSubmissions = useMemo(
    () => filterSubmissions(submissions, { search, status: statusFilter }),
    [submissions, search, statusFilter]
  );

  const displayName = userName || 'Student';

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <section aria-labelledby="welcome-heading" className="space-y-2">
          <h1
            id="welcome-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Welcome back, {displayName}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Track complaint status, review your submissions, and file new issues from one place.
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/topics">
              <Plus className="h-4 w-4" aria-hidden="true" />
              File new complaint
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/overall-view">
              <Globe className="h-4 w-4" aria-hidden="true" />
              Public complaint board
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : error ? (
          <Card className="border-destructive/30 bg-destructive/5" role="alert">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <div>
                <CardTitle className="text-base text-destructive">
                  Could not load your complaints
                </CardTitle>
                <CardDescription className="text-destructive/90">
                  {error}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <>
            <ComplaintStats stats={stats} />

            <Card>
              <CardHeader className="space-y-4 pb-4">
                <div>
                  <CardTitle>Your complaints</CardTitle>
                  <CardDescription>
                    {filteredSubmissions.length} of {submissions.length} shown
                  </CardDescription>
                </div>

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
                        placeholder="Search by ID, topic, or date…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                        aria-describedby={`${searchId}-hint`}
                      />
                    </div>
                    <p id={`${searchId}-hint`} className="text-xs text-muted-foreground">
                      Filters update results as you type.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={statusId}>Status</Label>
                    <select
                      id={statusId}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                {submissions.length === 0 ? (
                  <div
                    className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center"
                    role="status"
                  >
                    <p className="font-medium text-foreground">
                      You have not filed any complaints yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start a submission to track progress here.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/topics">File your first complaint</Link>
                    </Button>
                  </div>
                ) : (
                  <ComplaintsList submissions={filteredSubmissions} />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

export default StudentDashboard;
