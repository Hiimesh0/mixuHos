# Mixu Infosystem — Healthcare SaaS Marketing Website

Independent, standalone marketing and product showcase website for the **Mixu Infosystem Hospital Management System**.

---

## Architecture & Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Design System:** Tailored Healthcare UI (`#0B1B3D` Deep Navy, `#0D9488` Medical Teal, `#10B981` Mint Accents, CSS Modules, Glassmorphism)
- **Icons:** Lucide React
- **Dependencies:** Completely independent of the hospital management core app (lives in its own root directory `marketing-website/`).

---

## 11 Core Functional Sections

1. **Header / Navbar:** Sticky blurred brand navigation with quick section links and live hospital application launcher.
2. **Hero Section:** High-converting value proposition, pulse production badges, live demo CTA, and core operational metrics (50+ modules, 100% live bed matrix, zero-orphan data guarantee).
3. **Product Overview:** Comprehensive architectural breakdown of unified hospital workflows (OPD, IPD, Dr. Rounds, OT, Diagnostics, Pharmacy, Billing, Discharge).
4. **Feature Highlights:** 6 departmental feature cards detailing rapid registration, bed matrix, rounds logging, consolidated billing, 2D Echo, and discharge cards.
5. **Module Showcase (Interactive Tabs):** Functional suite switcher covering Clinical Care, Diagnostics & Pathology, Billing & Accounts, and Hospital Administration with direct deep-links to each app screen.
6. **Live Dashboard Preview:** Interactive mockup simulating live ward occupancy (ICU, Deluxe AC, General), occupancy gauges, patient counters, and live action tiles.
7. **Operational Benefits:** Tailored value proposition cards for Doctors & Specialists, Nursing Stations, Billing Desks, and Hospital Directors.
8. **End-to-End Patient Journey Workflow:** Interactive 4-step timeline tracking a patient from registration and bed allocation to bedside care and final discharge invoicing.
9. **FAQ Section:** Expandable accordion addressing deployment flexibility (on-premise LAN vs cloud), offline continuity, billing leakage prevention, and NABH compliance.
10. **Executive Walkthrough Request Form / Modal:** Interactive form with client-side validation, multi-select module interest tags, hospital bed capacity dropdown, and confirmation feedback.
11. **Footer:** Comprehensive site navigation, featured module deep-links, compliance badges, and copyright notices.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

From the project root:

```bash
cd marketing-website
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the target hospital app live URL:

```env
VITE_HOSPITAL_APP_URL=https://hiimesh0.github.io/mixuHos/
```

### Development Server

Run the local Vite development server:

```bash
npm run dev
```

The site will be live at `http://localhost:3000`.

### Production Build

Create an optimized static distribution build:

```bash
npm run build
```

Output files will be generated in `marketing-website/dist/`.

### Preview Production Build

Preview the production bundle locally:

```bash
npm run preview
```
