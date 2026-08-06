# Security Policy

## Overview

This repository is engineered with strict security standards to ensure complete separation between open-source code and environment secrets. 

Cloning or forking this repository exposes **zero API keys, zero personal GitHub tokens, zero access credentials, and zero private environment data**.

---

## Security Model & Safeguards

### 1. Environment Variable Isolation
- All sensitive credentials (such as `VITE_GEMINI_API_KEY`, `GITHUB_TOKEN`, and `GITHUB_USERNAME`) are loaded dynamically from environment variables.
- `.env` and all `.env.*.local` files are strictly excluded from version control via `.gitignore`.
- Reference configuration placeholders are documented safely in `.env.example`.

### 2. Serverless API Proxying
- External API calls requiring secret keys (e.g., Gemini AI API and GitHub GraphQL API) are proxied through serverless edge functions in `/api`.
- Client-side code never receives or exposes secret keys.

### 3. HTTP Security Headers
All production responses serve hardening headers configured in `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential credential exposure in this project, please report it responsibly:

1. **Do NOT open a public issue.**
2. Send an email directly to **yashasm1807@gmail.com** with:
   - Summary of the vulnerability
   - Step-by-step reproduction instructions
   - Estimated impact
3. You will receive an acknowledgment within 24 to 48 hours.
