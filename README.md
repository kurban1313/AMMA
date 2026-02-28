![AMMA Banner](https://via.placeholder.com/1200x300/0070a0/ffffff?text=AMMA+Healthcare+Ecosystem)

# AMMA Triple-Platform Healthcare Ecosystem 🏥

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange.svg)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Welcome to **AMMA**, a comprehensive, modern, and highly secure "Triple-Platform" healthcare application. AMMA is designed to bridge the gap between patients, healthcare providers, and medical researchers by placing them into a unified, synergistic environment.

Built with performance, security, and exceptional user experience in mind, AMMA leverages cutting-edge web technologies to create a seamless interface for managing sensitive health data.

---

## 🌟 The Triple-Platform Architecture

AMMA deviates from single-perspective medical apps by integrating three distinct, heavily specialized access portals mapped securely to user roles:

### 1. The Family Health Vault (Patients)
A secure, localized hub empowering patients to manage their own health data alongside their dependents.
- **Family Profiles:** Track basic demographics, emergency contacts, and vital stats for entire families in one place.
- **Medical Records Cloud:** Upload, preview, and download test results (PDFs, Images). Data is securely persisted via strict **Base64 encoded Data URIs**, bypassing volatile blob URLs and ensuring download integrity across reloads.
- **Smart Appointments:** Systematically tracking historic versus future appointments with assigned doctors.
- **AI Health Predictions:** Empowers users to receive preliminary AI assessments based on localized symptoms, actively storing historical predictions for reference.
- **Trusted Doctors Workflow:** Patients retain absolute authority over their data. They securely initiate linking requests (`sendLinkRequest`) to platform doctors, ensuring doctors cannot scrape records without explicit consent.

### 2. The Doctor Portal (Healthcare Providers)
Designed for clinical efficiency, allowing practitioners to oversee patient health comprehensively.
- **Patient Roster Engine:** An isolated, dashboard-driven queue allowing doctors to review inbound linking requests. Doctors maintain explicit **Accept/Decline** capabilities over their digital patient roster.
- **Patient Records Access:** Secure, read-only oversight into the Medical Records (with reliable download functionality) of any patient holding an `active` link status.
- **Availability Management:** Tools for managing active schedules and conducting (or tracking) virtual clinical consultations.

### 3. The Research Platform (Data Scientists / Analysts)
A specialized macro-environmental analytics tool.
- **AI Researcher Chatbot:** An advanced Natural Language Processing interface allowing authorized researchers to query anonymized, global health trend data without compromising patient PII (Personally Identifiable Information).
- **Query History & Exporting:** Full audit trail tracking history and exporting tools to map macro-disease vectors systematically.

---

## 💻 Tech Stack & Key Libraries

AMMA is built on a robust, type-safe, and highly responsive modern frontend stack:

- **Core Framework:** [React 19](https://react.dev/) running on the blazing-fast [Vite](https://vitejs.dev/) bundler.
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) ensuring absolute type integrity across complex medical data structures.
- **Routing:** [React Router v7](https://reactrouter.com/) for flawless SPA navigation and nested role-based route protection.
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) with heavily utilized `persist` middleware, bridging reactive states smoothly into LocalStorage.
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) enabling utility-first rapid UI development.
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (headless accessible primitives) stylized with custom animations and [Lucide-React](https://lucide.dev/) scalable vector components.
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) synergized strictly with [Zod](https://zod.dev/) schemas.
- **Animations:** [GSAP](https://gsap.com/) and core CSS transitions for premium, micro-interactive user feedback.

---

## 🛠️ Advanced Technical Paradigms

### 1. Strict Bidirectional Linking Architecture
We resolved major security implications found in standard healthcare apps by deploying a "Two-Handshake" rule:
- **Initiation:** Only Patients can initiate a link request to a Doctor.
- **Resolution:** Doctors must explicitly accept this request from a secure Pending Queue.
- **Severance:** Both parties have the unilateral ability to sever a connection at any point (`unlinkDoctor`), immediately revoking the doctor's access to the patient's Family Health Vault.

### 2. Base64 Persistent Storage Mitigation
For localized environments, relying on generic `URL.createObjectURL()` causes catastrophic data loss (expiring Blob URLs) on page reloads, breaking Doctor download capabilities. AMMA natively intercepts file uploads, converting them synchronously into heavy **Base64 Data URIs** via `FileReader.readAsDataURL()`. This ensures absolute persistence across reloads.

### 3. Natively Persisted Dark Mode Engine
AMMA features a fully dynamic, custom-engineered dark theme engine optimized via Zustand + LocalStorage. 
- Automatically injects the `.dark` class onto `document.documentElement`.
- Supported natively by customized Tailwind variables across the Sidebar, Header, Navbar, and Dashboard Layouts.
- Respects continuous state across infinite reloads without flickering.

---

## 🚀 Getting Started

Follow these steps to spin up the local development environment:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher strictly recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/amma-healthcare-platform.git
   cd amma-healthcare-platform/app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the Vite development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Access the application:**
   Navigate your browser to `http://localhost:5173`. 
   
   *Tip: Test out cross-role functionality by utilizing the mocked accounts natively populated in the Zustand auth stores!*

---

## 📂 Project Structure Overview

```text
app/
├── public/                 # Static global assets
├── src/
│   ├── components/         # Reusable global UI (Header, Sidebar, Navbar)
│   │   └── ui/             # Granular Radix primitives (Buttons, Inputs, Dialogs)
│   ├── layouts/            # Foundational wrapper views (DashboardLayout, MainLayout)
│   ├── pages/              
│   │   ├── admin/          # System Management views
│   │   ├── doctor/         # Doctor Portal interfaces (Patients, Roster, Dashboard)
│   │   ├── patient/        # Family Health Vault (Records, Family, Predictions)
│   │   └── researcher/     # Analytics Portal (Chatbot, Queries)
│   ├── services/           # External API & AI interfacing logic (aiClient, apiClient)
│   ├── store/              # Zustand global state (index.ts bridging Auth/UI/Roles)
│   ├── types/              # Absolute TypeScript models & interface enums
│   ├── App.tsx             # Root Router Configuration
│   └── index.css           # Global Tailwind directives & Dark Mode variables
├── package.json            # Scripts & Dependency mapping
├── tailwind.config.ts      # Tailwind extension themes & animations
└── vite.config.ts          # Build optimization & path aliases
```

---

## 🤝 Contributing

We welcome community contributions! Please ensure any submitted Pull Requests adhere to the established ESLint/TypeScript configurations and that complex architecture alterations (specifically regarding Patient Data mappings) include detailed architectural reviews outlining the security implications.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---
*AMMA — Intelligent, Unified, and Secure Next-Generation Healthcare.*
