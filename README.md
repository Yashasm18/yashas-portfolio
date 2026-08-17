<div align="center">

# Yashas M -- Developer Portfolio

**A high-performance developer portfolio built with React 19, Three.js, and GSAP.**

[![Live Demo](https://img.shields.io/badge/▶_LIVE_DEMO-yashas--portfolio.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://yashas-portfolio-mauve.vercel.app)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/Yashasm18/yashas-portfolio/ci-cd.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%2FCD)](https://github.com/Yashasm18/yashas-portfolio/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.168-black?style=for-the-badge&logo=threedotjs)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## Overview

This repository contains the source code for an interactive 3D developer portfolio. It combines Three.js character animation, GSAP scroll orchestration, a custom GPU-accelerated cursor, and a serverless AI chess playground into a single web application.

The project is structured as a reusable template. All personal details, project metadata, and social links are managed centrally in `src/config.js` and `.env`, allowing anyone to clone and deploy their own instance without exposing private keys or credentials.

---

## Key Features

- **Interactive 3D Character**: Rigged GLB model reacting to scroll position and mouse movement using GSAP ScrollTrigger and Three.js keyframe animations.
- **Custom Cursor System**: GPU-accelerated interpolation cursor with `data-cursor` attribute support, `mix-blend-mode` difference blending, and MutationObserver DOM re-binding.
- **Cinematic Loader**: Percentage-based initial loading sequence with session-backed storage to prevent repetitive loads.
- **AI Chess Playground**: WebAssembly-powered Stockfish engine paired with a serverless Gemini AI commentary assistant.
- **Scroll Orchestration**: Hardware-accelerated entrance and timeline animations powered by GSAP and smooth momentum scrolling via Lenis.
- **Responsive Architecture**: Automatic layout degradation for mobile devices, touch optimization, and conditional 3D model rendering.

---

## Tech Stack

| Category | Technology | Purpose |
|:---|:---|:---|
| Frontend | React 19 | Core UI component hierarchy with Suspense lazy-loading |
| 3D Graphics | Three.js / React Three Fiber | Real-time WebGL rendering (`@react-three/fiber`, `@react-three/drei`) |
| Animations | GSAP 3 | Timeline orchestration, text splitting, and ScrollTrigger |
| Smooth Scroll | Lenis | Smooth momentum-based viewport scrolling |
| Build Tool | Vite 8 | Development HMR and optimized production bundling |
| Linting | OxLint | Rust-based static analysis and linting |
| Hosting & Edge | Vercel | Production distribution and serverless API endpoints |
| AI Integration | Gemini API | Server-proxied chess analysis function |
| Chess Engine | Stockfish WebAssembly | Client-side move calculation engine |

---

## Security & Repository Isolation

This codebase enforces strict security isolation. Anyone cloning or forking this repository receives a clean template with zero exposed secrets or personal API tokens:

- **No Hardcoded Secrets**: All API keys and access tokens are managed strictly through environment variables.
- **Serverless API Protection**: External endpoints (Gemini AI chat, GitHub contribution graph) route requests through Vercel serverless functions in `/api/`.
- **Clean Clone Guarantee**: Cloning this repository contains no personal authentication tokens or private endpoints.
- **Configurable Placeholders**: All personal metadata is contained inside `src/config.js` and `.env.example`.

For detailed security guidelines and vulnerability reporting, see [SECURITY.md](./SECURITY.md).

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Yashasm18/yashas-portfolio.git
cd yashas-portfolio
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Gemini API Key (Optional — used for /play chess commentary)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# GitHub Personal Access Token (Optional — used for live contribution graph)
GITHUB_TOKEN=your_github_token_here

# Your GitHub Username
GITHUB_USERNAME=your_github_username
```

### 3. Update Personal Data

Modify `src/config.js` to customize your portfolio details:

```js
export const config = {
  developer: {
    name: "Your Name",
    fullName: "Your Full Name",
    title: "Your Title",
    description: "Your bio summary..."
  },
  social: {
    github: "your-username",
    email: "email@example.com",
    location: "City, Country"
  },
  experiences: [ /* Your career milestones */ ],
  projects: [ /* Your project cards */ ]
};
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
yashas-portfolio/
├── api/
│   ├── chat.js               # Gemini AI proxy serverless function
│   └── github.js             # GitHub contribution API proxy
├── public/
│   ├── models/               # 3D GLB character model
│   ├── images/               # Project screenshots and assets
│   └── redoxchess.wasm       # Stockfish WebAssembly engine
├── src/
│   ├── components/           # React UI and 3D canvas components
│   ├── pages/                # Page routes (/play, /works)
│   ├── utils/                # GSAP scroll and animation handlers
│   ├── config.js             # Central configuration file
│   └── index.css             # Global CSS variables and styles
├── .env.example              # Environment template
├── vercel.json               # Vercel deployment and security headers
└── package.json
```

---

## Build and Deployment

### Production Build

```bash
npm run build
```

The output bundle will be generated in the `dist/` directory.

### Deploying to Vercel

```bash
npx vercel
```

Alternatively, connect your repository to Vercel for automated CI/CD deployments on push. Ensure you configure your environment variables (`VITE_GEMINI_API_KEY`, `GITHUB_TOKEN`, `GITHUB_USERNAME`) in your Vercel Project Settings.

---

## Available Scripts

| Command | Action |
|:---|:---|
| `npm run dev` | Starts local development server |
| `npm run build` | Builds production bundle |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs OxLint static analysis |

---

## License

This project is open source and available under the [MIT License](./LICENSE).
