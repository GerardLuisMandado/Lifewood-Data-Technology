<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1a0r2WsS7qoHjKgX2sFNW6SAuJhPYldFH

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Tip: start from `.env.local.example` and copy it to `.env.local`.

## Careers Form (Supabase)

The Careers page includes an embedded application form that submits to Supabase (DB insert + CV upload to Storage).

1. Create a Supabase project and run `supabase/migrations/20260317_career_applications.sql` in the SQL editor.
1. Run `supabase/migrations/20260317_contact_messages.sql` for Contact Us submissions.
2. In your local env file (recommended: `.env.local`), set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAILS` (comma-separated; used for admin login and dashboard access)
3. Run `supabase/migrations/20260317_admin_dashboard.sql` to enable the admin dashboard read policies.

### Create your admin user

You can create your admin user in Supabase Auth UI, or via the helper script (requires a Service Role key):

- `node scripts/create-admin.mjs`
- Required env vars for the script: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

Tip: start from `scripts/create-admin.env.example` and copy it to `scripts/create-admin.env.local`, then set env vars in your shell before running the script.

## EmailJS setup

The admin dashboard can send candidate emails for:

- Hired
- Interview schedule
- Rejection

This project is set up for the EmailJS free tier using only 2 templates:

1. A hired template
2. A flexible update template used for both interview scheduling and rejection

Add these env vars to `.env.local`:

- `VITE_EMAILJS_SERVICE_ID=service_d7glscr`
- `VITE_EMAILJS_PUBLIC_KEY=...`
- `VITE_EMAILJS_TEMPLATE_HIRED=...`
- `VITE_EMAILJS_TEMPLATE_UPDATE=...`

Template HTML files are in `email-templates/` and setup notes are in `email-templates/README.md`.
Set the EmailJS template subject field to `{{subject}}` so the dashboard can control it programmatically.
