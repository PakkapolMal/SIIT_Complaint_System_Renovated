import React from 'react';
import { Badge } from '../ui/badge';
import { statusToBadgeVariant } from './complaintUtils';

function ComplaintStatusBadge({ status }) {
  return (
    <Badge variant={statusToBadgeVariant(status)}>
      <span className="sr-only">Status: </span>
      {status}
    </Badge>
  );
}

export default ComplaintStatusBadge;
