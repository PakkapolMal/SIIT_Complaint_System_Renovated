import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import SectionHeader from './SectionHeader';
import LandingSection from './LandingSection';
import { landingCopy } from './landingContent';
import { fetchPublicSubmissions } from '../../lib/complaintsService';
import { layout } from '../../lib/designTokens';

function computeStats(submissions) {
  const resolved = submissions.filter((s) => s.Status === 'Resolved').length;
  const inProgress = submissions.filter((s) => s.Status === 'In Progress').length;

  return {
    total: submissions.length,
    resolved,
    inProgress,
  };
}

function LandingStats() {
  const { stats: copy } = landingCopy;
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSubmissions()
      .then((rows) => setMetrics(computeStats(rows)))
      .catch(() =>
        setMetrics({ total: 0, resolved: 0, inProgress: 0 })
      )
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      key: 'total',
      label: copy.labels.total,
      value: metrics?.total,
      icon: Activity,
    },
    {
      key: 'resolved',
      label: copy.labels.resolved,
      value: metrics?.resolved,
      icon: CheckCircle2,
    },
    {
      key: 'inProgress',
      label: copy.labels.inProgress,
      value: metrics?.inProgress,
      icon: Clock,
    },
  ];

  return (
    <LandingSection id="stats">
      <SectionHeader
        id="stats-heading"
        //eyebrow="Trust"
        title={copy.title}
        description={copy.subtitle}
      />
      <div className={layout.grid3Cols}>
        {statCards.map(({ key, label, value, icon: Icon, isStatic }) => (
          <Card key={key} className="flex h-full flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent className="mt-auto">
              {loading && !isStatic ? (
                <Skeleton className="h-8 w-20" aria-label="Loading statistic" />
              ) : (
                <p className="font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {isStatic ? value : value ?? '—'}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </LandingSection>
  );
}

export default LandingStats;
