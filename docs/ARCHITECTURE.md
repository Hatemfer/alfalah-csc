# ALFALAH COMMUNITY SUPPORT CENTRE — SYSTEM ARCHITECTURE

## 1. Architectural Principles
The Alfalah Community Support Centre system is architected as an enterprise-grade monorepo designed for high reliability, strict security, seamless local development, and straightforward VPS/OVH hosting.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                      Client Browser                    │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    HTTPS / Reverse Proxy (Nginx)
                                                │
                        ┌───────────────────────┴───────────────────────┐
                        │                                               │
                        ▼                                               ▼
            ┌────────────────────────┐                     ┌────────────────────────┐
            │   Public Website       │                     │    Admin CMS (/admin)  │
            │   Next.js App Router   │                     │    Next.js + MUI       │
            └───────────┬────────────┘                     └───────────┬────────────┘
                        │                                               │
                        │ SSR / Client Fetches                          │ Protected REST / Cookies
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                                 ┌─────────────────────────────┐
                                 │       NestJS Backend        │
                                 │     Base Path: /api/v1      │
                                 └──────────────┬──────────────┘
                                                │
                         ┌──────────────────────┼──────────────────────┐
                         ▼                      ▼                      ▼
               ┌──────────────────┐   ┌───────────────────┐  ┌──────────────────┐
               │  MySQL / MariaDB │   │ Local/VPS Storage │   │ Prayer Engine    │
               │  TypeORM Model   │   │  Uploaded Media   │   │  Adhan Astrom.   │
               └──────────────────┘   └───────────────────┘  └──────────────────┘
```

## 2. Layered Structure

### 2.1 Monorepo Layout
```
alfalah-community/
├── frontend/                     # Next.js App Router (Public Site + Admin CMS)
│   ├── app/
│   │   ├── (public)/             # Public pages (Home, About, Activities, Events, etc.)
│   │   ├── admin/                # Secure CMS dashboard
│   │   ├── layout.tsx            # Root layout, theme provider, metadata
│   │   └── globals.css           # Global tokens & CSS variables
│   ├── components/               # Shared & public UI components
│   ├── features/                 # Modular feature sets (prayer times, compass, contact)
│   ├── lib/                      # Utilities, API client, date helpers
│   └── public/                   # Static assets, logos, icons
├── backend/                      # NestJS REST API
│   ├── src/
│   │   ├── auth/                 # Argon2id password hashing, JWT sessions, guards
│   │   ├── admins/               # Admin accounts & RBAC management
│   │   ├── pages/                # CMS page & content blocks management
│   │   ├── site-settings/        # Configurable organisation metadata & branding
│   │   ├── activities/           # Community programmes & services
│   │   ├── events/               # Event scheduling, recurring logic, categories
│   │   ├── announcements/        # Urgent notices, banners, pinned alerts
│   │   ├── gallery/              # Photo/video albums and metadata
│   │   ├── media/                # Safe file upload, MIME validation, storage
│   │   ├── prayer-times/         # Astronomical calculations & official overrides
│   │   ├── contact/              # Inquiries, validation, anti-abuse, notifications
│   │   ├── audit/                # Comprehensive administrative audit logging
│   │   └── common/               # Filters, interceptors, pipes, decorators
│   ├── test/                     # Unit, integration, and E2E test suites
│   └── uploads/                  # Persistent media storage
├── infrastructure/               # VPS deployment scripts, Nginx configs, systemd units
└── docs/                         # Comprehensive engineering & operations manuals
```

## 3. Technology Stack Justification
1. **Next.js (App Router)**: Offers Server-Side Rendering (SSR) for blazing-fast SEO, static generation for public pages, and interactive client components for dynamic widgets (Qibla compass, countdowns, filters).
2. **Material-UI (MUI)**: Standardized, robust component framework for `/admin` ensuring accessible tables, complex form validation, modal dialogues, and responsive dashboards for non-technical staff.
3. **Vanilla CSS Design System**: Lightweight, zero-runtime CSS tokens for the public site, perfectly honoring Islamic geometric harmony, emerald tones, warm creams, and dark modes without framework bloat.
4. **NestJS**: Structured enterprise TypeScript backend with dependency injection, DTO validation pipes, role guards, and modular architecture.
5. **TypeORM with MySQL/MariaDB**: Schema migration control, explicit relational constraints, transactions, and robust data integrity.
6. **Adhan Astronomical Engine**: Precise prayer timetable calculation based on exact geographical coordinates (Balsall Heath, Birmingham: 52.4578° N, 1.8904° W), coupled with administrative override capabilities for official mosque timetables.
