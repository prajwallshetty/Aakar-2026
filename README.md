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
# 🛠️ Database Configuration (Supabase/PostgreSQL)
DATABASE_URL="postgresql://<DB_USER>:<DB_PASS>@<SUPABASE_HOST>:5432/<DB_NAME>"

# 🔐 Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> # optional if needed server-side

# 🔐 App Secrets
AUTH_SECRET="<your-auth-secret>"

# ⚙️ Runtime
NODE_ENV=development
PORT=3000

# 💸 Razorpay Configuration
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>

# 🖋️ Fonts (optional)
FONTCONFIG_PATH="/helpers/fonts"

# ☁️ AWS (if you're uploading files)
AWS_REGION_=ap-south-1
AWS_ACCESS_KEY_ID_=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY_=<your-aws-secret-key>
AWS_BUCKET_NAME=aakar2025

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