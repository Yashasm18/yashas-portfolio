<div align="center">

# Yashas M — Developer Portfolio

**A premium, open-source developer portfolio built with React, Three.js, and GSAP.**

*Fork it. Customize it. Make it yours.*

[![Live Demo](https://img.shields.io/badge/▶_LIVE_DEMO-yashas--portfolio.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://yashas-portfolio-mauve.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.168-black?style=for-the-badge&logo=threedotjs)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## ⚡ Why This Template?

Most portfolio templates are flat pages with static text. This one isn't.

- 🎭 **Interactive 3D Character** — A rigged GLB model that reacts to scroll, follows your mouse, and transitions between sections using GSAP ScrollTrigger
- 🖱️ **Custom Cursor System** — GPU-accelerated lerp cursor with `data-cursor` attribute support, `mix-blend-mode: difference`, and automatic detection of dynamically-loaded elements via MutationObserver
- 🎬 **Cinematic Loading Sequence** — Percentage-based loader with marquee text, animated reveal, and sessionStorage-backed "show once" logic
- ♟️ **AI Chess Playground** — Full chess engine (Stockfish WASM) with a Gemini-powered AI commentary chat, proxied through a secure serverless function
- 🌀 **Scroll-Driven Animations** — Every section entrance, career timeline, and tech stack reveal is orchestrated through GSAP ScrollTrigger with scrub-based parallax
- 📱 **Fully Responsive** — Graceful degradation: 3D character hides on mobile, touch-optimized scroll, custom cursor disabled on touch devices

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:---:|:---|:---|
| ⚛️ | **React 19** | UI framework with lazy loading & Suspense |
| 🎨 | **Three.js + R3F** | 3D character rendering (`@react-three/fiber` + `@react-three/drei`) |
| 🎞️ | **GSAP 3** | Scroll-driven animations, timeline orchestration, and text splitting |
| 🌊 | **Lenis** | Butter-smooth scroll with momentum |
| ⚡ | **Vite 8** | Lightning-fast HMR, build, and dev server |
| 🧹 | **OxLint** | Rust-powered linting (React hooks rules enforced) |
| 🚀 | **Vercel** | Edge deployment with serverless API functions |
| 🤖 | **Gemini API** | AI chat in the chess playground (server-side proxied) |
| ♟️ | **Stockfish WASM** | Client-side chess engine |

---

## Project Structure

```
yashas-portfolio/
├── api/
│   └── chat.js               # Vercel serverless function (Gemini proxy)
├── public/
│   ├── models/
│   │   └── character.glb      # 3D avatar model (rigged, animated)
│   ├── images/                # Project screenshots & tech logos
│   ├── video/                 # Background video assets
│   ├── draco/                 # Draco mesh compression decoder
│   └── redoxchess.wasm        # Stockfish chess engine (WebAssembly)
├── src/
│   ├── components/
│   │   ├── Scene.jsx          # Three.js canvas, camera, lighting
│   │   ├── Avatar.jsx         # 3D character controller & mouse tracking
│   │   ├── Cursor.jsx         # Custom GPU-accelerated cursor
│   │   ├── Loading.jsx        # Cinematic loading screen
│   │   ├── Landing.jsx        # Hero section with parallax text
│   │   ├── About.jsx          # About me section
│   │   ├── WhatIDo.jsx        # Skills showcase with 3D integration
│   │   ├── Career.jsx         # Animated career timeline
│   │   ├── TechStackNew.jsx   # Tech stack grid with hover effects
│   │   ├── Work.jsx           # Project cards with image reveals
│   │   ├── Contact.jsx        # Contact form & social links
│   │   ├── Navbar.jsx         # Sticky navigation bar
│   │   ├── SocialIcons.jsx    # Floating social sidebar
│   │   └── MainContainer.jsx  # Layout orchestrator
│   ├── pages/
│   │   ├── Play.tsx           # AI Chess playground
│   │   └── MyWorks.tsx        # Full project gallery
│   ├── utils/
│   │   ├── GsapScroll.js      # All GSAP ScrollTrigger timelines
│   │   ├── character.js       # Character loading & bone setup
│   │   ├── lighting.js        # Three.js scene lighting
│   │   ├── mouseUtils.js      # Mouse-follow camera calculations
│   │   └── textSplitter.js    # Text split animation utilities
│   ├── context/
│   │   └── LoadingProvider.jsx # Global loading state
│   ├── config.js              # ⬅️ YOUR DATA GOES HERE
│   ├── App.jsx                # Router & lazy-loaded pages
│   └── index.css              # Global styles & CSS variables
├── .env.example               # Environment variable template
├── vercel.json                # Deployment config + security headers
├── vite.config.js             # Vite config + Gemini dev proxy
└── package.json
```

---

## Quick Start — Use This Template

### 1. Clone & Install

```bash
git clone https://github.com/Yashasm18/yashas-portfolio.git my-portfolio
cd my-portfolio
npm install
```

### 2. Configure Your Data

Open **`src/config.js`** — this single file controls your entire portfolio:

```js
export const config = {
  developer: {
    name: "Your Name",
    fullName: "Your Full Name",
    title: "Your Title",
    description: "Your bio..."
  },
  social: {
    github: "your-github-username",
    email: "you@email.com",
    location: "Your City, Country"
  },
  contact: {
    email: "you@email.com",
    github: "https://github.com/you",
    linkedin: "https://linkedin.com/in/you",
    twitter: "https://x.com/you",
    instagram: "https://instagram.com/you"
  },
  experiences: [ /* your career timeline */ ],
  projects: [ /* your project cards */ ],
  skills: { /* your skill categories */ }
};
```

### 3. Swap the 3D Avatar (Optional)

Replace `public/models/character.glb` with your own rigged GLB model. The character needs these bone names for scroll animations to work:

- `spine005` — neck bone for head tilt
- `Plane004` — monitor mesh for screen glow effect

> **Tip:** Use [Ready Player Me](https://readyplayer.me) to generate a free 3D avatar, then rig it in Blender.

### 4. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key (free from [Google AI Studio](https://aistudio.google.com/)):

```env
VITE_GEMINI_API_KEY=your_key_here
```

> This key is only used for the `/play` chess AI chat feature. The portfolio works perfectly without it.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you're live! 🎉

### 6. Deploy to Vercel

```bash
npx -y vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

> **Important:** Add your `VITE_GEMINI_API_KEY` in **Vercel → Project → Settings → Environment Variables** for the chess AI chat to work in production.

---

## Security

This project follows security best practices out of the box:

| Measure | Implementation |
|:---|:---|
| **API Key Protection** | Keys stored in `.env` (gitignored), proxied through Vercel serverless functions — never exposed to the client |
| **Security Headers** | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy` configured in `vercel.json` |
| **Input Sanitization** | Chat API validates request method, checks for missing keys, and wraps all responses in try/catch |
| **Asset Caching** | Immutable cache headers on hashed assets, 7-day cache on 3D models |
| **Responsible Disclosure** | See [`SECURITY.md`](./SECURITY.md) for how to report vulnerabilities |

---

## Customization Guide

### Colors & Theme

Edit the CSS variables in `src/index.css`:

```css
:root {
  --accentColor: #c2a4ff;        /* Purple accent — change to your brand color */
  --backgroundColor: #0b080c;    /* Dark background */
  color: #eae5ec;                 /* Light text */
}
```

### Sections

Each section is a standalone component in `src/components/`. To remove a section, simply delete its import and JSX line from `MainContainer.jsx`.

### Animations

All scroll-triggered animations live in `src/utils/GsapScroll.js`. Tweak `scrub`, `start`, `end`, and `duration` values to adjust timing.

### Loading Screen

Customize the loading text in `src/components/Loading.jsx`. The loading screen only appears on the first visit (controlled by `sessionStorage`).

---

## Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run OxLint for code quality checks |

---

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, new feature, or design improvement:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

Please read [`SECURITY.md`](./SECURITY.md) before contributing.

---

## License

This project is open source under the [MIT License](./LICENSE).

**You are free to:**
- ✅ Use it as your own portfolio
- ✅ Modify it however you want
- ✅ Deploy it anywhere
- ✅ Use it commercially

**Just keep the MIT license notice** and give credit if you'd like — it's appreciated but not required.

---

<div align="center">

**Built and Engineered by [Yashas M](https://github.com/Yashasm18)**

If this template helped you, consider giving it a ⭐

[![GitHub Stars](https://img.shields.io/github/stars/Yashasm18/yashas-portfolio?style=social)](https://github.com/Yashasm18/yashas-portfolio)

</div>
