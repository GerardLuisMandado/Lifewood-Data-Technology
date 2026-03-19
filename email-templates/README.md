## EmailJS Template Setup

Use these two HTML files with EmailJS:

1. `emailjs-hired.html`
   Use for the hired/offer message.
2. `emailjs-update.html`
   Use for both interview scheduling and rejection updates.

### Required env vars

Add these to `.env.local`:

- `VITE_EMAILJS_SERVICE_ID=service_d7glscr`
- `VITE_EMAILJS_PUBLIC_KEY=...`
- `VITE_EMAILJS_TEMPLATE_HIRED=...`
- `VITE_EMAILJS_TEMPLATE_UPDATE=...`

### EmailJS template mapping

Set the recipient in EmailJS to `{{to_email}}`.
Set the EmailJS template subject to `{{subject}}`.

`emailjs-hired.html` variables:

- `subject`
- `to_email`
- `candidate_name`
- `position`
- `next_steps`
- `support_email`
- `signature_name`
- `signature_title`

`emailjs-update.html` variables:

- `subject`
- `to_email`
- `candidate_name`
- `position`
- `update_category`
- `update_title`
- `update_message`
- `interview_block_style`
- `rejection_block_style`
- `action_block_style`
- `interview_type`
- `interview_datetime`
- `interview_timezone`
- `interview_location`
- `interview_notes`
- `rejection_note`
- `action_label`
- `action_url`
- `support_email`
- `signature_name`
- `signature_title`

### Flexible update template behavior

For interview emails:

- `interview_block_style` = empty
- `rejection_block_style` = `display:none;`
- `action_block_style` = `display:none;`

For rejection emails:

- `interview_block_style` = `display:none;`
- `rejection_block_style` = empty
- `action_block_style` = `display:none;`
