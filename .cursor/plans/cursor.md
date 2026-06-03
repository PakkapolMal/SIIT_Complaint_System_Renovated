# SIIT Complaint System Renovation - Project Rules

## Project Overview
An internal university application allowing students to submit structural/academic complaints and allowing staff/admins to resolve them. 

## Tech Stack
- Frontend: React, Tailwind CSS
- Deployment: Vercel (Frontend + Serverless Functions)
- Database & Auth: Supabase (PostgreSQL)
- Legacy Context: Migrating away from a legacy PHP/MySQL architecture. Do not generate PHP code unless explicitly asked.

## Database Schema Context
- Primary users are mapped to `auth.users` via foreign keys on `UUID`.
- Key tables: `student`, `staff`, `admin`, `submission`, `topic`, `question`, `user_answer`, `resolution`.
- RLS (Row Level Security) is strictly enabled across all public tables.
- Anonymous users can view submissions and resolutions freely.

## Coding Guidelines
1. Environment Variables: Never hardcode sensitive API endpoints or keys. Access them strictly via `process.env.REACT_APP_SUPABASE_URL` and `process.env.REACT_APP_SUPABASE_ANON_KEY`.
2. Supabase SDK: Prioritize the `@supabase/supabase-js` client SDK for direct frontend data fetching and user authentication.
3. UI Style: Use Tailwind CSS for styling. Keep components accessible, clean, and modular.
4. Serverless Functions: If complex backend processing is required, place it in the `/api` directory using Node.js for Vercel Serverless compatibility.