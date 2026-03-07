# AAKAR 2025 🎭⚙️  

**Official Techno-Cultural Fest of AJIET Mangalore**

## 📌 Overview  
**AAKAR 2025** is the official techno-cultural fest of **AJIET Mangalore**, featuring a vibrant mix of **technical competitions**, **cultural performances**, **workshops**, and **interactive online experiences**.

This repository contains the **fullstack Next.js code**base for the event's website, management system, and real-time updates.

## 🚀 Tech Stack  

### 🖥️ Fullstack (Next.js App Router)  
- **Framework:** Next.js (App Router)  
- **Styling:** Tailwind CSS  
- **Forms & Validation:** React Hook Form + Zod  
- **Database ORM:** Prisma  
- **Database:** Supabase (PostgreSQL)  
- **Authentication:** Supabase Auth  
- **Deployment:** Vercel  
- **Payments:** Razorpay Integration  
- **State Management:** Context API / Local Storage  

## 📂 Folder Structure  

```
📂 aakar2025/
│── 📂 app/              # App Router pages and layout
│── 📂 components/       # Reusable UI components
│── 📂 lib/              # Utilities, Prisma config, Supabase client
│── 📂 public/           # Static files (images, videos, etc.)
│── 📄 README.md         # Project overview

```

## 🛠️ Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/gaureshpai/aakar2025.git
cd aakar2025
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Set Up Environment Variables  
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcde12345.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...FAKE_KEY...eXAiOiJKV1Q
AUTH_SECRET="randomlyGeneratedSecretKey=="
MAIL_USER=test@example.com
MAIL_CLIENT_ID=1234567890-fakeclientid.apps.googleusercontent.com
MAIL_CLIENT_SECRET=FAKE_CLIENT_SECRET_123456
MAIL_ACCESS_TOKEN=ya29.fakeAccessToken123456789
MAIL_REFRESH_TOKEN=1//fakeRefreshToken123456789
NODE_ENV="development"
DATABASE_URL="postgresql://user:password@db.example.com/dbname?sslmode=require"
```

### 4️⃣ Run the Development Server  
```bash
npm run dev
```
Visit `http://localhost:3000` to view the site.

## 🔥 Features  

✅ **User Registration & Login** (Supabase Auth)  
✅ **Admin Dashboard**  
✅ **Event Registrations**  
✅ **Payment Gateway (Razorpay)**  
✅ **Dynamic Event Schedules**  
✅ **Live Event Updates & Tracking**  
✅ **Responsive UI & Mobile Optimized**  
✅ **Secure Database with Supabase**  
✅ **Deployed on Vercel**  

## 📈 Deployment  

✅ Automatic deployment via **Vercel**  
✅ Supabase handles database + authentication  
✅ Prisma schema migrations for structured DB updates  

## 🤝 Contributors  

<div align="center">
  <a href="https://github.com/gaureshpai/aakar2025/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=gaureshpai/aakar2025" />
  </a>
</div>  

🚀 **Let’s make AAKAR 2025 unforgettable!** 🎭⚙️  