# SIIT Complaint System

**Deployed web:** [https://siit-complaint-system.vercel.app](https://siit-complaint-system.vercel.app)

The SIIT Complaint System is a web application for submitting, tracking, and managing complaints or suggestions from the SIIT community. Students can file structured reports and monitor progress, while authorized staff and administrators can review submissions, update statuses, and record official responses.

This project began as a team-built legacy system by Thanutch Mel Pholsukcharoen, Pakkapol Maluangnont, and Phunyaphat Vijitrapornphan. I later renovated the project by modernizing the frontend, migrating the active application flow to Supabase, adding Google-based SIIT authentication, improving the student and staff dashboards, and preparing the app for Vercel deployment.

## Current Features

- SIIT Google sign-in for `@g.siit.tu.ac.th` student accounts and `@siit.tu.ac.th` staff accounts
- Role-aware routing for students, staff, and administrators
- Student profile completion with year and department details
- Staff profile completion with division-based access
- Dynamic complaint topics and questions loaded from Supabase
- Support for text answers, dropdowns, checkboxes, and file attachments
- Student dashboard with complaint history, filtering, and status summaries
- Public anonymized complaint board with detail pages
- Staff/admin complaint management with status updates, responses, attachments, and deletion
- Email notification support for new submissions and status changes through Supabase Edge Functions
- Responsive React interface styled with Tailwind CSS and reusable UI components

## Tech Stack

- React 18
- Tailwind CSS
- Supabase Auth, Database, Storage, RPCs (Remote Procedure Calls), and Edge Functions
- Vercel deployment

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project configured with the required complaint-system schema, policies, RPCs, storage buckets, and Edge Functions
- Google OAuth configured in Supabase Auth for SIIT accounts

### Frontend Setup

1. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Set the frontend environment variables shown in `frontend/.env.example`:

   ```bash
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open the local React app in your browser.

### Supabase Functions

The repository includes Edge Functions for:

- rejecting non-SIIT authentication domains
- sending complaint submission and status-update notifications

These functions require the matching Supabase secrets and deployed function configuration before notification flows will work in production.

## Application Flow

### Students

1. Sign in with an SIIT student Google account.
2. Complete the profile with year and department.
3. File a complaint by selecting a topic and answering the generated questions.
4. Receive a submission ID and track progress from the student dashboard.
5. View public anonymized complaint statuses from the public board.

### Staff and Administrators

1. Sign in with an SIIT staff Google account.
2. Complete the staff profile when required.
3. Review submitted complaints from the admin dashboard.
4. Open complaint details, update status, add an official response, and attach supporting files.
5. Trigger notification emails when submissions are created or statuses change.

## Repository Notes

- The active frontend uses Supabase directly for authentication, data access, storage, and server-side functions.
- Deployment routing for the single-page React app is configured for Vercel.

## Credits

Original legacy system by Thanutch Mel Pholsukcharoen, Pakkapol Maluangnont, and Phunyaphat Vijitrapornphan.

Renovation and current implementation work by me, including the Supabase migration, authentication flow, dashboard redesign, notification workflow, and deployed web version.
