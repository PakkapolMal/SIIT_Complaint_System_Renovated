import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const STUDENT_EMAIL_PATTERN = /^(\d{10})@g\.siit\.tu\.ac\.th$/i;

function isAllowedSiitEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const normalized = email.trim().toLowerCase();

  if (STUDENT_EMAIL_PATTERN.test(normalized)) {
    return true;
  }

  if (normalized.endsWith('@siit.tu.ac.th') && !normalized.endsWith('@g.siit.tu.ac.th')) {
    return true;
  }

  return false;
}

serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await request.json();
    const email = payload?.user?.email || payload?.record?.email || payload?.email;

    if (!isAllowedSiitEmail(email)) {
      return new Response(
        JSON.stringify({
          error: {
            http_code: 403,
            message: 'Only @siit.tu.ac.th and @g.siit.tu.ac.th Google accounts are allowed.',
          },
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Invalid hook payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
