# ALFALAH COMMUNITY SUPPORT CENTRE — SECURITY & PRIVACY SPECIFICATION

## 1. Threat Model & Safeguards

### 1.1 Authentication & Authorization
- **Password Hashing**: State-of-the-art Argon2id hashing algorithm with tuned memory cost and iterations.
- **Session Security**: Session tokens passed in `HttpOnly`, `SameSite=Lax`, and `Secure` (in HTTPS/production) cookies.
- **RBAC**: Strict role-based access control (`SUPER_ADMIN`, `ADMIN`, `CONTENT_EDITOR`). Endpoints check backend permissions on every request; browser-supplied roles are never trusted.
- **Account Protection**: Exponential backoff and IP rate limiting against brute-force attacks on `/auth/login`.

### 1.2 Data Privacy & Financial Information
- **Bank Details Protection**: Client bank details (Al Rayan Bank, Sort code 30-00-83, Account 01298401) are strictly confidential and treated as sensitive context. By default, they are NOT exposed in public APIs, public pages, or responses. Any future display requires explicit client approval via site settings flag.
- **Personal Data Protection**: Contact form inquiries, admin personal details, and community messages are restricted to authorized administrators and protected against public exposure.

### 1.3 Input/Output Validation & Injection Prevention
- **SQL Injection**: Parameterized SQL queries via TypeORM; no concatenated strings.
- **Cross-Site Scripting (XSS)**: Strict HTML sanitization on rich-text inputs before storage and output encoding.
- **File Upload Security**: Uploaded files validated by MIME type (magic numbers / content check), size limit (10MB), and saved with randomly generated UUID filenames to prevent path traversal and arbitrary execution.

### 1.4 HTTP Security Headers
- Helmet configured on NestJS API:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
