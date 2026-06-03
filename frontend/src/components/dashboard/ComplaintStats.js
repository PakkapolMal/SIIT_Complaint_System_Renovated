import React from 'react';
import { Clock, Loader2, CheckCircle2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total submissions',
    icon: FileText,
    className: 'text-foreground',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    className: 'text-amber-700',
  },
  {
    key: 'inProgress',
    label: 'In progress',
    icon: Loader2,
    className: 'text-blue-700',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: CheckCircle2,
    className: 'text-emerald-700',
  },
];

function ComplaintStats({ stats }) {
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Complaint statistics
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon, className }) => (
          <li key={key}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon
                  className={`h-4 w-4 shrink-0 ${className}`}
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <p
                  className="font-mono text-2xl font-semibold tabular-nums text-foreground sm:text-3xl"
                  aria-label={`${label}: ${stats[key]}`}
                >
                  {stats[key]}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ComplaintStats;
