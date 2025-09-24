# 🎯 StreamCalendar

[🌐 Live Demo](https://stream-calendar-eight.vercel.app/) -  [GitHub Repo](https://github.com/aadishkansal/streamCalendar)

**StreamCalendar** is an intelligent scheduling platform that transforms how learners engage with YouTube educational content. Simply paste any YouTube playlist URL, and StreamCalendar automatically generates a personalized learning schedule—adapting dynamically based on your progress and consistency.

## ✨ Key Features

- **Smart Scheduling**  
  One-click import of YouTube playlists with dynamic schedule generation.

- **Progress Tracking**  
  Visual streaks and analytics dashboard to monitor learning trends.

- **Secure Authentication**  
  Email/password and Google OAuth via NextAuth.js with JWT session management.

- **Interactive Calendar**  
  Drag-and-drop schedule adjustments powered by ScheduleX.

- **Responsive Design**  
  Optimized for desktop and mobile with Tailwind CSS styling.

## 🛠️ Technology Stack

**Frontend**  
- Next.js 15.2.0 & React 19.0.0  
- TypeScript  
- Tailwind CSS & Lucide React icons  
- SWR for data fetching  

**Backend & Database**  
- Next.js API Routes (RESTful)  
- MongoDB with Mongoose ODM  
- NextAuth.js (JWT strategy)  
- Axios for HTTP requests  

**Calendar & Scheduling**  
- ScheduleX calendar engine  
- date-fns & moment.js utilities  

## 🚀 Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/aadishkansal/streamCalendar.git
   cd streamCalendar
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Environment setup**  
   Copy `.env.example` to `.env.local` and configure:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run development server**  
   ```bash
   npm run dev
   ```

5. **Open**  
   Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
streamCalendar/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── projects/      # Project management pages
│   │   ├── settings/      # User settings pages
│   │   ├── calendar/      # Calendar views
│   │   └── components/    # Reusable UI components
│   ├── model/             # Mongoose schemas
│   ├── lib/               # Utility functions
│   ├── schemas/           # Zod validation schemas
│   └── types/             # TypeScript definitions
├── emails/                # Email templates
└── public/                # Static assets
```

## 🔧 API Endpoints

- **Authentication**  
  `POST /api/auth/signin`  
  `POST /api/sign-up`  
  `GET /api/auth/session`

- **Projects**  
  `GET /api/get-projects`  
  `POST /api/project-details`

- **Playlist Management**  
  `POST /api/generate-details`  
  `POST /api/mark-video-as-completed`  
  `POST /api/unmark-video-as-completed`

- **User Management**  
  `PUT /api/changeName`  
  `DELETE /api/delete-user`  
  `POST /api/send-otp`