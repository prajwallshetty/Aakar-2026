# 🎭⚙️ AAKAR 2026

<p align="center">
Official Techno-Cultural Fest Website of <b>AJIET Mangalore</b>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay)

</p>

---

# 📌 About AAKAR

**AAKAR 2026** is the official **Techno-Cultural Festival of AJIET Mangalore**, bringing together innovation, creativity, and talent through:

- 💻 Technical Competitions  
- 🎭 Cultural Events  
- 🧠 Workshops & Talks  
- 🎮 Interactive Activities  
- 🌐 Online Event Management System  

This project is the **fullstack platform** powering the entire event ecosystem including **registrations, payments, scheduling, and real-time updates**.

---

# 🚀 Tech Stack

### 🖥️ Frontend
- **Next.js (App Router)**
- **Tailwind CSS**
- **React Hook Form**
- **Zod Validation**

### ⚙️ Backend
- **Next.js Server Actions / API Routes**
- **Supabase Authentication**
- **Prisma ORM**

### 🗄️ Database
- **Supabase PostgreSQL**

### 💳 Payments
- **Razorpay Integration**

### ☁️ Deployment
- **Vercel**

---

# 📂 Project Structure

```
aakar2026/
│
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
├── lib/                # Utilities, Prisma config, Supabase client
├── public/             # Static assets
└── README.md           # Documentation
```

---

# 🛠️ Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd aakar2026
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MERCH_3D_MODEL_URL=
NEXT_PUBLIC_MERCH_QR_BUCKET=merchqr
NEXT_PUBLIC_MERCH_QR_FILE_PATH=aakar2026.jpeg

AUTH_SECRET=

MAIL_USER=
MAIL_CLIENT_ID=
MAIL_CLIENT_SECRET=
MAIL_ACCESS_TOKEN=
MAIL_REFRESH_TOKEN=

DATABASE_URL=
NODE_ENV=development
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🔥 Features

✔ User Authentication (Supabase Auth)  
✔ Event Registration System  
✔ Admin Dashboard  
✔ Razorpay Payment Integration  
✔ Dynamic Event Scheduling  
✔ Live Updates & Event Tracking  
✔ Responsive Mobile UI  
✔ Secure PostgreSQL Database  
✔ Automatic Deployment with Vercel  

---

# 📈 Deployment

The project is deployed using:

- **Vercel** → Frontend + Server
- **Supabase** → Database + Authentication
- **Prisma** → Database ORM & migrations

---

# 🎯 Future Improvements

- 📱 Dedicated Mobile Experience
- 📊 Analytics Dashboard
- 🎟 QR Based Event Entry
- 📢 Real-Time Notifications
- 🤖 AI Event Recommendations

---

# 🎭 AAKAR 2026

<p align="center">
Bringing Technology, Creativity, and Culture Together
</p>

<p align="center">
🚀 Let's make <b>AAKAR 2026</b> unforgettable!
</p>
