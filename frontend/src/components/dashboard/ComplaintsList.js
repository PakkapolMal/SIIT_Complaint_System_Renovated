import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import ComplaintStatusBadge from './ComplaintStatusBadge';

function ComplaintsList({ submissions }) {
  const navigate = useNavigate();

  if (submissions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center"
        role="status"
      >
        <Inbox className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-medium text-foreground">No complaints match your filters</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting search or status filters, or file a new complaint to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="space-y-3 md:hidden" aria-label="Your complaints">
        {submissions.map((submission) => (
          <li key={submission.SubmissionID}>
            <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">
                    #{submission.SubmissionID}
                  </p>
                  <h3 className="mt-1 truncate font-medium text-foreground">
                    {submission.TopicName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <time dateTime={submission.Date}>{submission.Date}</time>
                  </p>
                </div>
                <ComplaintStatusBadge status={submission.Status} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => navigate(`/view-detail/${submission.SubmissionID}`)}
                aria-label={`View details for complaint ${submission.SubmissionID}, ${submission.TopicName}`}
              >
                View details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </article>
          </li>
        ))}
      </ul>

      {/* Desktop: data table */}
      <div className="hidden md:block">
        <Table aria-label="Your complaints">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.SubmissionID}>
                <TableCell className="font-mono font-medium">
                  #{submission.SubmissionID}
                </TableCell>
                <TableCell>
                  <time dateTime={submission.Date}>{submission.Date}</time>
                </TableCell>
                <TableCell className="max-w-[240px] truncate font-medium">
                  {submission.TopicName}
                </TableCell>
                <TableCell>
                  <ComplaintStatusBadge status={submission.Status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/view-detail/${submission.SubmissionID}`)}
                    aria-label={`View details for complaint ${submission.SubmissionID}`}
                  >
                    View
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ComplaintsList;
