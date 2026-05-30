# 🎭⚙️ AAKAR 2026: THE CYBERNETIC ODYSSEY

<p align="center">
  <b>The official digital gateway to AJIET's flagship Techno-Cultural Fest.</b><br>
  Experience the convergence of innovation, creativity, and elite competition.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/System-ONLINE-00ffff?style=for-the-badge&logo=opsgenie" alt="System Status">
  <img src="https://img.shields.io/badge/Next.js-16.1_--_Beta-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Auth.js-V5_BETA-FF0066?style=for-the-badge&logo=next.js" alt="Auth.js">
  <img src="https://img.shields.io/badge/Tailwind-V4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
</p>

---

## ◈ PROJECT MANIFESTO

**AAKAR 2026** is not just a fest; it's a high-performance digital ecosystem designed to handle thousands of registrations, secure deep-link payments, and automated participant management. Built with a "Cyber-Anime" aesthetic, the platform provides a seamless, immersive experience for participants and administrators alike.

## ◈ COLLABORATORS

<div align="center">
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/prajwallshetty">
        <img src="https://github.com/prajwallshetty.png" width="100px;" alt="Prajwal Shetty"/><br />
        <sub><b>Prajwal Shetty</b></sub>
      </a><br />
      <sub>Lead Architect / Fullstack</sub>
    </td>
    <td align="center">
      <a href="https://github.com/kishanBhandary">
        <img src="https://github.com/kishanBhandary.png" width="100px;" alt="Kishan Bhandary"/><br />
        <sub><b>Kishan Bhandary</b></sub>
      </a><br />
      <sub>Software Engineer</sub>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://github.com/Pahimauchil.png" width="100px;" alt="Pahima Uchil"/><br />
        <sub><b>Pahima R Uchil</b></sub>
      </a><br />
      <sub>Software Engineer</sub>
    </td>
  </tr>
</table>
</div>

---

## 🚀 CORE SYSTEMS

### 🖥️ Frontend Framework
- **Next.js 16 (Turbopack)**: State-of-the-art fast builds and routing.
- **Tailwind CSS V4**: Modern utility-first styling with enhanced CSS variables.
- **Framer Motion**: Premium micro-interactions and anime-style transitions.
- **Background Beams (Aceternity)**: Immersive global UI effects.

### ⚙️ Backend Architecture
- **Auth.js V5 (Beta)**: Secure, edge-compatible authentication.
- **Prisma ORM**: Type-safe database management.
- **Supabase**: Powering our PostgreSQL core and file storage.
- **Razorpay**: Integrated deep-link payments for mobile apps (GPay, PhonePe).

---

## 📂 DIRECTORY STRUCTURE

```bash
aakar2026/
├── app/
│   ├── (Admin)/      # Protected Admin Portal & CRUD Operations
│   ├── (Users)/      # Public Landing, Registration, & Events
│   └── api/          # Secure REST Endpoints & Webhooks
├── backend/          # Database Clients & Email Logic
├── components/       # Custom "Cyber-Anime" UI Library
├── public/           # Static Assets & Dynamic Media
└── prisma/           # Schema Definitions
```

---

## 🛠️ OPERATIONAL SETUP

### 1. Initialize Uplink
```bash
git clone https://github.com/prajwallshetty/Aakar-26.git
cd Aakar-26
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_..."
ADMIN_EMAIL=""
# ... See auth.config.ts for full manifest
```

### 3. Synchronize Database
```bash
npx prisma generate
```

### 4. Deploy Local Terminal
```bash
npm run dev
```

---

## 🔥 MISSION CAPABILITIES

- **Elite Pass Ecosystem**: Premium priority access and merch integration.
- **Real-Time Statistics**: Live dashboards for college and event performance.
- **Automated Certification**: Dynamic PDF generation for all participants.
- **Deep-Link Payments**: Redirecting directly to mobile payment apps (GPay/PhonePe).
- **Cyber-System Design**: Custom fonts (Orbitron, Share Tech Mono) and high-fidelity overlays.

---

<p align="center">
  <b>AAKAR 2026 // ADAPT. EVOLVE. CONQUER.</b><br>
  Built with ❤️ by the AAKAR Dev Team AJIET
</p>
