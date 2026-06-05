import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type NotificationEvent = 'submission_created' | 'status_changed';

interface ParsedRequest {
  event: NotificationEvent;
  submissionId: number;
  oldStatus?: string;
}

interface SubmissionRow {
  SubmissionID: number;
  Status: string | null;
  TopicID: number | null;
  StudentID: string | null;
  StaffID: string | null;
  topic: { Tname: string } | null;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function parseRequestBody(body: Record<string, unknown>): ParsedRequest | null {
  if (typeof body.event === 'string') {
    const submissionId = Number(body.submission_id);
    if (!Number.isFinite(submissionId)) {
      return null;
    }

    if (body.event === 'submission_created') {
      return { event: 'submission_created', submissionId };
    }

    if (body.event === 'status_changed') {
      return {
        event: 'status_changed',
        submissionId,
        oldStatus: typeof body.old_status === 'string' ? body.old_status : undefined,
      };
    }

    return null;
  }

  if (body.type === 'UPDATE' && body.record && typeof body.record === 'object') {
    const record = body.record as Record<string, unknown>;
    const oldRecord = (body.old_record ?? {}) as Record<string, unknown>;
    const submissionId = Number(record.SubmissionID);

    if (!Number.isFinite(submissionId)) {
      return null;
    }

    const newStatus = typeof record.Status === 'string' ? record.Status : null;
    const previousStatus = typeof oldRecord.Status === 'string' ? oldRecord.Status : undefined;

    if (newStatus && previousStatus && newStatus === previousStatus) {
      return null;
    }

    return {
      event: 'status_changed',
      submissionId,
      oldStatus: previousStatus,
    };
  }

  return null;
}

function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length).trim();
}

async function resolveRecipientEmail(
  adminClient: ReturnType<typeof createClient>,
  submission: SubmissionRow
): Promise<string | null> {
  if (submission.StudentID) {
    const { data: student } = await adminClient
      .from('student')
      .select('Email')
      .eq('StudentID', submission.StudentID)
      .maybeSingle();

    return student?.Email ?? null;
  }

  if (submission.StaffID) {
    const { data: staff } = await adminClient
      .from('staff')
      .select('Email')
      .eq('StaffID', submission.StaffID)
      .maybeSingle();

    return staff?.Email ?? null;
  }

  return null;
}

async function userOwnsSubmission(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  submission: SubmissionRow
): Promise<boolean> {
  if (submission.StudentID) {
    const { data: student } = await adminClient
      .from('student')
      .select('UUID')
      .eq('StudentID', submission.StudentID)
      .maybeSingle();

    return student?.UUID === userId;
  }

  if (submission.StaffID) {
    const { data: staff } = await adminClient
      .from('staff')
      .select('UUID')
      .eq('StaffID', submission.StaffID)
      .maybeSingle();

    return staff?.UUID === userId;
  }

  return false;
}

async function userCanManageSubmission(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  submission: SubmissionRow
): Promise<boolean> {
  const { data: admin } = await adminClient
    .from('admin')
    .select('UUID')
    .eq('UUID', userId)
    .maybeSingle();

  if (admin) {
    return true;
  }

  const { data: staff } = await adminClient
    .from('staff')
    .select('StaffID, Division')
    .eq('UUID', userId)
    .maybeSingle();

  if (!staff || submission.TopicID == null) {
    return false;
  }

  const topicId = submission.TopicID;

  const { data: access } = await adminClient
    .from('topic_staff_access')
    .select('TopicID')
    .eq('TopicID', topicId)
    .eq('Division', staff.Division)
    .maybeSingle();

  return Boolean(access);
}

function buildEmailContent(
  event: NotificationEvent,
  submission: SubmissionRow,
  appUrl: string,
  oldStatus?: string
) {
  const topicName = submission.topic?.Tname ?? 'Complaint';
  const detailUrl = `${appUrl.replace(/\/$/, '')}/view-detail/${submission.SubmissionID}`;
  const currentStatus = submission.Status ?? 'Unknown';

  if (event === 'submission_created') {
    return {
      subject: `Complaint #${submission.SubmissionID} received — ${topicName}`,
      html: `
        <p>Your complaint has been submitted successfully.</p>
        <p><strong>Reference:</strong> #${submission.SubmissionID}</p>
        <p><strong>Topic:</strong> ${topicName}</p>
        <p><strong>Status:</strong> ${currentStatus}</p>
        <p><a href="${detailUrl}">View your complaint</a></p>
      `.trim(),
    };
  }

  const statusLine = oldStatus
    ? `<p><strong>Status:</strong> ${oldStatus} → ${currentStatus}</p>`
    : `<p><strong>Status:</strong> ${currentStatus}</p>`;

  return {
    subject: `Complaint #${submission.SubmissionID} updated — now ${currentStatus}`,
    html: `
      <p>Your complaint status has been updated.</p>
      <p><strong>Reference:</strong> #${submission.SubmissionID}</p>
      <p><strong>Topic:</strong> ${topicName}</p>
      ${statusLine}
      <p><a href="${detailUrl}">View your complaint</a></p>
    `.trim(),
  };
}

async function sendEmail(
  resendApiKey: string,
  fromEmail: string,
  toEmail: string,
  subject: string,
  html: string
) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL');
  const appUrl = Deno.env.get('APP_URL');

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  if (!resendApiKey || !fromEmail || !appUrl) {
    return jsonResponse({ error: 'Email notification secrets are not configured' }, 500);
  }

  const token = getBearerToken(request);
  if (!token) {
    return jsonResponse({ error: 'Missing authorization' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = parseRequestBody(body);
  if (!parsed) {
    return jsonResponse({ error: 'Invalid or unsupported request payload' }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const isServiceRole = token === serviceRoleKey;

  if (isServiceRole && parsed.event !== 'status_changed') {
    return jsonResponse({ error: 'Service role may only trigger status_changed events' }, 403);
  }

  const { data: submission, error: submissionError } = await adminClient
    .from('submission')
    .select(`
      SubmissionID,
      Status,
      TopicID,
      StudentID,
      StaffID,
      topic:TopicID ( Tname )
    `)
    .eq('SubmissionID', parsed.submissionId)
    .maybeSingle();

  if (submissionError) {
    console.error('Failed to load submission:', submissionError.message);
    return jsonResponse({ error: 'Failed to load submission' }, 500);
  }

  if (!submission) {
    return jsonResponse({ error: 'Submission not found' }, 404);
  }

  if (!isServiceRole) {
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) {
      return jsonResponse({ error: 'Invalid authorization' }, 401);
    }

    const submissionRow = submission as SubmissionRow;

    if (parsed.event === 'submission_created') {
      const ownsSubmission = await userOwnsSubmission(adminClient, user.id, submissionRow);
      if (!ownsSubmission) {
        return jsonResponse({ error: 'Not authorized for this submission' }, 403);
      }
    } else {
      const canManage = await userCanManageSubmission(adminClient, user.id, submissionRow);
      if (!canManage) {
        return jsonResponse({ error: 'Not authorized to notify for this submission' }, 403);
      }
    }
  }

  const recipientEmail = await resolveRecipientEmail(adminClient, submission as SubmissionRow);
  if (!recipientEmail) {
    console.warn(`No recipient email for submission #${parsed.submissionId}`);
    return jsonResponse({ ok: true, skipped: true, reason: 'no_recipient_email' });
  }

  const { subject, html } = buildEmailContent(
    parsed.event,
    submission as SubmissionRow,
    appUrl,
    parsed.oldStatus
  );

  try {
    await sendEmail(resendApiKey, fromEmail, recipientEmail, subject, html);
  } catch (error) {
    console.error('Failed to send email:', error);
    return jsonResponse({ error: 'Failed to send email' }, 500);
  }

  return jsonResponse({ ok: true });
});
