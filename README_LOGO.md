# Dandori Scheduler Logo Setup

## Logo Requirements

Please save the Dandori logo image provided by the user as:
```
/public/dandori-logo.png
```

This logo is referenced in multiple places:
- Header navigation (app/demo/page.tsx)
- Landing page (app/page.tsx)
- Login page (app/login/page.tsx)

The logo should be:
- PNG format with transparent background
- Optimized for web (compressed)
- Suitable for display at various sizes (36px to 64px)

## Branding Updates Completed

The following files have been updated to use "Dandori Scheduler" branding:

1. **package.json** - Updated app name and description
2. **app/layout.tsx** - Updated page title and metadata
3. **app/demo/page.tsx** - Updated header logo and title
4. **app/page.tsx** - Updated all references to HVAC Scheduler
5. **app/login/page.tsx** - Updated login page branding
6. **public/manifest.json** - Updated PWA manifest
7. **prisma/seed.ts** - Updated company name and email domains
8. **.env.example** - Updated database name

## Test Credentials (After Database Setup)

- Admin: admin@dandori.jp / admin123
- Master: master@dandori.jp / master123
- Worker: takahashi@dandori.jp / worker123

## Company Information

- Company Name: 株式会社ダンドリワーク
- Email Domain: @dandori.jp
- Support Email: support@dandori-scheduler.jp