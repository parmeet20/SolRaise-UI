<!--
  ====== Welcome ======
  Paste this into your profile’s README.md for a sleek showcase.
-->

## Snapshot

SolRaise UI is the frontend companion to the SolRaise smart contract—built with Next.js for lightning‑fast SSR/SSG, TypeScript for type‑safe development, Tailwind CSS for utility‑first styling, and Bun for ultra‑quick local builds and installs. It offers responsive design, dark‑mode support, and a modular component-driven architecture, making it easy to extend and maintain.

---

## 🚀 Hero Section

<div align="center">
  <h1>💻 SolRaise UI</h1>
  <p><em>Decentralized Crowdfunding Platform Frontend on Solana</em></p>
  <p>
    <a href="https://github.com/parmeet20/SolRaise-UI/stargazers">
      <img src="https://img.shields.io/github/stars/parmeet20/SolRaise-UI?style=social" alt="Stars" />
    </a>
    <a href="https://github.com/parmeet20/SolRaise-UI/network/members">
      <img src="https://img.shields.io/github/forks/parmeet20/SolRaise-UI?style=social" alt="Forks" />
    </a>
    <a href="https://github.com/parmeet20/SolRaise-UI/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/parmeet20/SolRaise-UI" alt="License" />
    </a>
    <a href="https://shields.io">
      <img src="https://img.shields.io/badge/Badges-Shields.io-blue" alt="Shields.io" />
    </a>
  </p>
  <p>
    <img src="https://raw.githubusercontent.com/parmeet20/SolRaise-UI/main/public/demo.png" alt="SolRaise UI Demo" width="80%" />
  </p>
</div>

---

## ✨ Key Features

<details>
<summary><strong>⚡ Blazing‑Fast Rendering</strong> <em>(Next.js)</em></summary>

- **Server‑Side Rendering & SSG**: Pages pre-rendered at build time or per-request for instant load and SEO benefits.
- **API Routes**: Built‑in support for backend endpoints directly in the frontend.
</details>

<details>
<summary><strong>🛡️ Type Safety</strong> <em>(TypeScript)</em></summary>

- **Strict Typing**: Catch bugs at compile time, enjoy rich IntelliSense and editor tooling.
- **Seamless JSX**: Type‑checked React components for robust UIs.
</details>

<details>
<summary><strong>🎨 Utility‑First Styling</strong> <em>(Tailwind CSS)</em></summary>

- **Rapid Prototyping**: Compose responsive layouts and components using low‑level utility classes.
- **Custom Themes**: Easily configure design tokens (colors, spacing, fonts) via `tailwind.config.ts`.
</details>

<details>
<summary><strong>🚄 Instant Dev Experience</strong> <em>(Bun)</em></summary>

- **Zero‑Config Bundler & Dev Server**: Run `bun dev` for immediate hot‑reloads.
- **Built‑in TypeScript & JSX**: No additional transpilation setup needed.
</details>

---

## 📂 Code Highlights

| File                                  | Purpose                                             |
|---------------------------------------|-----------------------------------------------------|
| [`src/app/page.tsx`](programs/SolRaise-UI/src/app/page.tsx)        | Main landing and campaign listing page.             |
| [`src/components/CampaignCard.tsx`](/src/components/CampaignCard.tsx) | Reusable card component for displaying campaigns.   |
| [`components.json`](components.json)     | Configuration for auto‑imported UI components.      |
| [`next.config.ts`](next.config.ts)      | Next.js settings: routes, image domains, env vars.  |
| [`tailwind.config.ts`](tailwind.config.ts) | Tailwind theme customization.                       |

---

## 🛠️ Getting Started

```bash
# 1. Clone
git clone https://github.com/parmeet20/SolRaise-UI.git

# 2. Install deps & start
cd SolRaise-UI
# with Bun:
bun install         # fast, built‑in package manager
bun dev             # launch dev server on http://localhost:3000

# or with npm/yarn/pnpm:
npm install && npm run dev
