# ALFALAH COMMUNITY SUPPORT CENTRE — TESTING & QA SPECIFICATION

## 1. Quality Gates
Before any deployment or client demonstration:
- **TypeScript Strict Compilation**: `npm run typecheck` passes with zero errors.
- **Linting & Code Style**: `npm run lint` passes without warnings.
- **Unit & Integration Tests**: `npm run test` executes backend services, DTO validations, auth guards, and frontend component tests.
- **Production Builds**: `npm run build` succeeds cleanly for both frontend and backend.

## 2. Testing Scenarios Covered
1. **Authentication**:
   - Secure login issues valid JWT session cookies.
   - Wrong passwords rejected without exposing user enumeration.
   - Protected routes (`/admin`, `/api/v1/admin/*`) reject unauthorized requests.
2. **Prayer Time Calculation**:
   - Astronomical calculations accurately match Birmingham coordinates.
   - Active daily overrides take precedence over calculated times.
3. **Contact Submission**:
   - Valid submissions persisted to database.
   - Invalid emails or empty messages rejected with clear 400 validation errors.
   - Rate limiting triggers when thresholds are exceeded.
4. **Media Uploads**:
   - Only permitted MIME types (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) accepted.
   - Dangerous executable scripts rejected.
