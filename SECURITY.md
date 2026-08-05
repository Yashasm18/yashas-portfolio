# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public issue.** Instead, email me directly at:

📧 **yashasm1807@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

I will respond within **48 hours** and work on a fix promptly.

## Scope

This policy applies to the portfolio website and its codebase. The `/api/chat` serverless function proxies requests to the Gemini API — API keys are stored as environment variables on Vercel and are never exposed to the client.

## Best Practices for Contributors

- **Never** commit `.env` files or API keys
- Always use the `.env.example` template
- Keep dependencies up to date
- Report any exposed secrets immediately
