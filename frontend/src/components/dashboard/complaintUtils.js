export function statusToBadgeVariant(status) {
  switch (status) {
    case 'Pending':
      return 'pending';
    case 'In Progress':
      return 'progress';
    case 'Resolved':
      return 'resolved';
    default:
      return 'muted';
  }
}

export function computeComplaintStats(submissions) {
  const stats = {
    total: submissions.length,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  };

  submissions.forEach((item) => {
    if (item.Status === 'Pending') stats.pending += 1;
    else if (item.Status === 'In Progress') stats.inProgress += 1;
    else if (item.Status === 'Resolved') stats.resolved += 1;
  });

  return stats;
}

export function filterSubmissions(submissions, { search, status }) {
  const query = search.trim().toLowerCase();

  return submissions.filter((item) => {
    const matchesStatus = status === 'all' || item.Status === status;
    if (!matchesStatus) return false;

    if (!query) return true;

    const haystack = [
      String(item.SubmissionID),
      item.TopicName,
      item.Status,
      item.Date,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
