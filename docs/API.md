# ALFALAH COMMUNITY SUPPORT CENTRE — API DOCUMENTATION

## 1. Base URL & Protocol
- **Development**: `http://localhost:4000/api/v1`
- **Interactive Swagger UI**: `http://localhost:4000/api/v1/docs`
- **Production Target**: `https://alfalahcsc.com/api/v1` (or `https://api.alfalahcsc.com/api/v1`)

---

## 2. Public Endpoints (Unauthenticated)

### 2.1 Site Settings & Navigation
- `GET /site-settings`: Returns public organisation metadata (Name, Address, Charity Number, Email, Socials, Theme Defaults). Sensitive bank credentials are NEVER exposed.
- `GET /homepage`: Returns configured, published homepage blocks (Hero, About Summary, Feature Sections).

### 2.2 Prayer Times & Qibla
- `GET /prayer-times/today`: Today's calculated timetable (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) with Iqamah times, active overrides, and next-prayer countdown.
- `GET /prayer-times/monthly?year=2026&month=10`: Full monthly prayer timetable.
- `GET /prayer-times/qibla`: Kaaba astronomical direction coordinates (Kaaba bearing ~119.5° from Birmingham).

### 2.3 Community Activities & Services
- `GET /activities`: List published activities with category filters.
- `GET /activities/:slug`: Detailed view for a specific activity.

### 2.4 Events & Courses
- `GET /events`: List upcoming published events with category and date filtering.
- `GET /events/:slug`: Detailed view for a single event.

### 2.5 Announcements
- `GET /announcements`: Active published announcements and pinned notices.

### 2.6 Contact Inquiries
- `POST /contact`: Submit community contact inquiry. Protected by rate limiting and strict DTO validation.

---

## 3. Administrative Endpoints (Protected by JWT Cookie / Bearer Token)

### 3.1 Authentication
- `POST /auth/login`: Administrator credentials authentication, issues secure HttpOnly cookie and JWT token.
- `POST /auth/logout`: Revokes session, clears cookies.
- `GET /auth/me`: Returns current authenticated admin profile.

### 3.2 Content Management (CRUD)
- `GET/POST/PUT/DELETE /admin/activities`
- `GET/POST/PUT/DELETE /admin/events`
- `GET/POST/PUT/DELETE /admin/announcements`
- `GET/POST/PUT/DELETE /admin/homepage-sections`
- `GET/PUT /admin/site-settings`
- `GET/PUT /admin/prayer-settings`
- `GET/POST/PUT/DELETE /admin/prayer-overrides`
- `GET/POST/DELETE /admin/media` (File upload with MIME verification)
- `GET /admin/contact-messages` (Protected inquiry inbox)
- `GET /admin/audit-logs` (Administrative action tracking)
