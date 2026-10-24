# ALFALAH COMMUNITY SUPPORT CENTRE — EXTERNAL INTEGRATIONS

## 1. Astronomical Prayer Times (Adhan Library)
- **Library**: `adhan` (v4.x)
- **Coordinates**: 52.4578° N, -1.8904° W (89 Tindal Street, Balsall Heath, Birmingham, B12 9QU)
- **Method**: Birmingham Unified / London Unified Calculation (Fajr 18°, Isha 18° or 12° high-latitude rule according to the UK Moonsighting / unified consensus).
- **Asr Juristic Method**: Hanafi (standard for the majority Birmingham community, configurable in Admin to Shafi/Standard).
- **Administrative Overrides**: Official printed monthly mosque timetables take precedence over astronomical calculations whenever entered by the admin in the CMS.

---

## 2. Qibla Direction
- **Coordinates**: Kaaba (Mecca, Saudi Arabia): 21.4225° N, 39.8262° E
- **Birmingham Bearing**: ~119.5° clockwise from True North.
- **Client sensor integration**: W3C Generic Sensor API (`AbsoluteOrientationSensor` / `deviceorientationabsolute` on mobile browsers) with graceful fallback to interactive manual compass rendering and numerical bearing display.

---

## 3. Email Delivery (SMTP / Nodemailer)
- **Provider**: Standard SMTP boundary (compatible with OVH mail, SendGrid, Amazon SES, or Mailtrap).
- **Graceful Fallback**: If SMTP credentials are not configured in local development, inquiries are recorded safely in the database and logged to the console without throwing runtime errors.

---

## 4. Maps & Location
- **Location**: 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU
- **Provider**: OpenStreetMap / Leaflet embed or Google Maps Embed URL without tracking cookies by default.
