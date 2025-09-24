# 🎯 StreamCalendar

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-97.7%25-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/NextAuth.js-purple?style=for-the-badge&logo=auth0" alt="NextAuth">
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-blue
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-https://github.com/aadishkansal/streamCalendar 📚 Overview

**StreamCalendar** is an intelligent scheduling platform that transforms how learners engage with YouTube educational content. Simply paste any YouTube playlist URL, and StreamCalendar automatically generates a personalized, structured learning schedule—adapting dynamically based on your progress and consistency.

🔗 **Live Application**: [stream-calendar-eight.vercel.app](https://stream-calendar-eight.vercel.app/)

## ✨ Key Features

### 🎯 **Smart Scheduling**
- **One-Click Import**: Paste any YouTube playlist URL and get instant schedule generation
- **Dynamic Algorithm**: Automatically adapts study plans based on user progress and consistency
- **Flexible Time Slots**: Customize daily learning sessions with preferred time windows

### 📊 **Progress Tracking**
- **Streak Management**: Visual streak tracking to maintain learning momentum
- **Analytics Dashboard**: Comprehensive insights into learning trends and completion rates
- **Multi-Course Support**: Manage multiple learning paths simultaneously

### 🔐 **Secure Authentication**
- **Multiple Sign-in Options**: Email/password and Google OAuth integration
- **Session Management**: Secure JWT-based authentication with NextAuth.js
- **Profile Management**: Complete user profile customization and settings

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Calendar**: Advanced calendar interface with ScheduleX integration
- **Real-time Updates**: Live progress tracking and schedule adjustments

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15.2.0 with React 19.0.0
- **Language**: TypeScript (97.7% of codebase)
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with Lucide React icons
- **State Management**: React hooks with SWR for data fetching

### **Backend & Database**
- **API**: Next.js API Routes with RESTful architecture
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT strategy
- **Email Services**: React Email with Resend integration

### **Calendar & Scheduling**
- **Calendar Engine**: ScheduleX with multiple plugins
- **Date Management**: date-fns and moment.js for date utilities
- **Interactive Features**: Drag-and-drop, resize, and event management

### **Development & Deployment**
- **Build Tool**: Next.js with Turbopack
- **Validation**: Zod schema validation
- **Form Handling**: React Hook Form with Hookform resolvers
- **Deployment**: Vercel with optimized production builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadishkansal/streamCalendar.git
   cd streamCalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
streamCalendar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── projects/          # Project management
│   │   ├── settings/          # User settings
│   │   ├── calendar/          # Calendar views
│   │   └── components/        # Reusable components
│   ├── model/                 # MongoDB schemas
│   │   ├── User.ts           # User model
│   │   ├── Project.ts        # Project model
│   │   └── Playlist.ts       # Playlist model
│   ├── lib/                   # Utility functions
│   ├── schemas/               # Zod validation schemas
│   └── types/                 # TypeScript definitions
├── emails/                    # Email templates
└── public/                    # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User authentication
- `POST /api/sign-up` - User registration
- `GET /api/auth/session` - Session management

### Projects
- `GET /api/get-projects` - Fetch user projects
- `POST /api/project-details` - Create new project
- `GET /api/schedule-project/[id]` - Get project schedule

### Playlist Management
- `POST /api/generate-details` - Process YouTube playlist
- `POST /api/mark-video-as-completed` - Update progress
- `POST /api/unmark-video-as-completed` - Revert progress

### User Management
- `PUT /api/changeName` - Update user profile
- `DELETE /api/delete-user` - Account deletion
- `POST /api/send-otp` - Password recovery

## 🎨 Features Showcase

### **Dashboard Interface**
- Clean, intuitive layout with gradient backgrounds
- Real-time credit tracking (Free: 2 projects, Premium: unlimited)
- One-click YouTube playlist import with instant processing

### **Project Management**
- Visual project cards with completion status
- Start/end date tracking with progress indicators
- Custom scheduling with preferred time slots and days

### **Calendar Integration**
- Interactive calendar with video scheduling
- Progress tracking with streak visualization
- Drag-and-drop functionality for schedule adjustments

### **User Experience**
- Smooth animations and transitions
- Mobile-responsive design
- Dark/light mode support (coming soon)

## 💎 Premium Features

### **Pricing Tiers**
- **Free Plan**: 2 projects, basic features
- **Monthly Plan**: ₹89/month, 5 users, advanced features
- **Yearly Plan**: ₹39/month, 2 users, all features

### **Premium Benefits**
- Unlimited project creation
- Advanced analytics and insights
- Priority customer support
- Enhanced scheduling algorithms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

- **Aadish Kansal** - Full Stack Developer & Project Lead
- **Naman Dubey** - Backend Developer & API Architect  
- **Aniket Sahu** - Frontend Developer & UI/UX Designer

## 🙏 Acknowledgments

- YouTube API for playlist data integration
- ScheduleX for advanced calendar functionality
- Vercel for seamless deployment
- Next.js team for the amazing framework

***

<div align="center">
  <p>Built with ❤️ by the StreamCalendar Team</p>
  <p>
    <a href="https://stream-calendar-eight.vercel.app/">🌐 Visit Website</a> - 
  </p>
</div>