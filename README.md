# 🌿 Echo Zen Companion

A beautiful, gamified **mental wellness platform** with AI-powered support, mindfulness tools, and Supabase integration — built using **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
Designed with a clean, calm, and modern aesthetic to promote focus and emotional balance.

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **🤖 AI Wellness Assistant** – Chat with an empathetic AI for mindfulness and reflection  
- **🧘 Guided Meditations** – Access curated mindfulness exercises and breathing sessions  
- **📝 Daily Reflections** – Track emotions and thoughts over time  
- **✅ Habit Builder** – Set and maintain healthy habits with visual progress  
- **🔐 Supabase Auth** – Secure authentication and user data storage  
- **💾 Cloud Sync** – Store user progress and reflections in Supabase  
- **🎨 Minimal UI** – Calm, dark-themed, glassmorphic design  

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+  
- npm or Bun installed  
- Supabase project with API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/echo-zen-companion.git
   cd echo-zen-companion
Install dependencies

bash
Copy code
npm install
or

bash
Copy code
bun install
Set up environment variables

Create a .env file in the root directory:

env
Copy code
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
Run the application

bash
Copy code
npm run dev
Open your browser at 👉 http://localhost:5173

🎨 Tech Stack
Frontend
React (TypeScript) – Component-based UI

Vite – Lightning-fast build tool

Tailwind CSS – Utility-first styling

Shadcn/UI – Accessible, modern components

Framer Motion – Smooth animations and transitions

Backend
Supabase – Authentication & database platform

PostgreSQL – Managed database (via Supabase)

📁 Project Structure
php
Copy code
echo-zen-companion/
├── public/                  # Static assets
├── src/                     # Application source
│   ├── components/          # UI components
│   ├── pages/               # App pages/views
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   └── main.tsx             # App entry point
├── supabase/                # Backend integration setup
├── .env                     # Environment variables
├── package.json             # Project dependencies and scripts
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind setup
🔐 Environment Variables
Variable	Description	Required
VITE_SUPABASE_URL	Supabase project URL	✅
VITE_SUPABASE_ANON_KEY	Supabase anonymous key	✅

📝 Available Scripts
bash
Copy code
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint checks
🌐 Deployment
You can deploy this app easily to:

Vercel (recommended)

Netlify

Railway

Render

Make sure to set your .env variables in your hosting provider’s dashboard.

🎨 Design Philosophy
Echo Zen Companion focuses on mindful minimalism:

Dark, glassmorphic aesthetic

Soft gradients & smooth transitions

Clean typography with Inter and Poppins

Fluid motion through Framer Motion animations

Centered UX around calm and clarity

🤝 Contributing
Contributions are welcome!
Please fork the repository and submit a pull request with a clear description of your changes.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

📞 Support
If you encounter issues or want to suggest features, please open an issue on GitHub.

Built with ❤️ to help people live more mindfully.
