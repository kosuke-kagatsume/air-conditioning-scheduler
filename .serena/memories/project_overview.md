# Air Conditioning Scheduler Project Overview

## Project Purpose
An air conditioning schedule management system for managing HVAC installation work schedules at construction sites. The system allows for scheduling, worker management, and event tracking.

## Tech Stack
- **Framework**: Next.js 14.1.0 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns v4.1.0
- **Deployment**: Vercel
- **Node Version**: 20+

## Project Structure
```
air-conditioning-scheduler/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication API
│   │   └── events/       # Events management API
│   ├── demo/             # Demo page
│   ├── login/            # Login page
│   ├── workers/          # Worker management page
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Common layout
├── components/            # React components
│   ├── Calendar/         # Calendar-related components
│   ├── CalendarView.tsx  # Calendar view component
│   ├── EventCreateModal.tsx
│   ├── EventDetailModal.tsx
│   ├── EventModal.tsx
│   ├── MobileScheduleView.tsx
│   ├── NotificationCenter.tsx
│   └── TimeTreeCalendar.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                  # Utility libraries
│   └── mockData.ts      # Mock data for testing
├── types/               # TypeScript type definitions
│   └── index.ts        # Main type definitions
└── public/             # Static files

## URLs
- **Production**: https://air-conditioning-scheduler.vercel.app/
- **GitHub**: https://github.com/daiokawa/air-conditioning-scheduler
- **Local Development**: http://localhost:3000

## Key Features
1. **Home Page (/)**: Dashboard with schedule overview
2. **Login (/login)**: User authentication
3. **Workers Management (/workers)**: Worker management and schedule assignment
4. **Demo (/demo)**: Feature demonstration with sample data
5. **API Endpoints**:
   - `/api/auth`: Authentication handling
   - `/api/events`: Event management

## Development Notes
- Using Next.js App Router (not Pages Router)
- Server Components and Client Components distinction is important
- TypeScript strict mode is enabled
- Path alias configured: `@/*` maps to project root
- Cache disabled in vercel.json (for development phase)