import 'reflect-metadata';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import { AdminUser } from '../auth/entities/admin-user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { SiteSetting } from '../site-settings/entities/site-setting.entity';
import { HomepageSection } from '../homepage/entities/homepage-section.entity';
import { PrayerSetting } from '../prayer-times/entities/prayer-setting.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

async function seed() {
  console.log('🌱 Starting Alfalah Community database seeding...');
  await AppDataSource.initialize();

  const adminRepo = AppDataSource.getRepository(AdminUser);
  const settingsRepo = AppDataSource.getRepository(SiteSetting);
  const sectionsRepo = AppDataSource.getRepository(HomepageSection);
  const prayerRepo = AppDataSource.getRepository(PrayerSetting);
  const activityRepo = AppDataSource.getRepository(Activity);
  const announcementRepo = AppDataSource.getRepository(Announcement);

  // 1. Initial Super Admin
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@alfalahcsc.com';
  const existingAdmin = await adminRepo.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'AlfalahAdmin2026!';
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const superAdmin = adminRepo.create({
      id: uuidv4(),
      email: adminEmail,
      passwordHash,
      fullName: process.env.INITIAL_ADMIN_NAME || 'Admin Alfalah',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });
    await adminRepo.save(superAdmin);
    console.log(`✅ Super Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin ${adminEmail} already exists.`);
  }

  // 2. Approved Site Settings (English & Arabic names, charity number, address, contact email)
  const defaultSettings: Array<Partial<SiteSetting>> = [
    {
      key: 'org_name_en',
      value: 'ALFALAH COMMUNITY SUPPORT CENTRE',
      description: 'Official English name of the centre',
      isPublic: true,
    },
    {
      key: 'org_name_ar',
      value: 'مركز الفلاح الإسلامي',
      description: 'Official Arabic name of the centre',
      isPublic: true,
    },
    {
      key: 'org_charity_number',
      value: '1150221',
      description: 'Registered Charity Number (UK)',
      isPublic: true,
    },
    {
      key: 'org_address',
      value: '89 Tindal Street, Balsall Heath, Birmingham, B12 9QU, United Kingdom',
      description: 'Physical address of the centre',
      isPublic: true,
    },
    {
      key: 'org_email',
      value: 'alfalahcsc@hotmail.com',
      description: 'Official contact email',
      isPublic: true,
    },
    {
      key: 'potential_domain',
      value: 'alfalahcsc.com',
      description: 'Primary web domain',
      isPublic: false,
    },
    {
      key: 'show_bank_details',
      value: 'false',
      description: 'Security flag: Do not expose bank details publicly without explicit client confirmation',
      isPublic: false,
    },
  ];

  for (const s of defaultSettings) {
    const exists = await settingsRepo.findOne({ where: { key: s.key } });
    if (!exists) {
      await settingsRepo.save(settingsRepo.create(s));
    }
  }
  console.log('✅ Site settings seeded.');

  // 3. Prayer Settings (Balsall Heath Birmingham Coordinates)
  const existingPrayer = await prayerRepo.find();
  if (existingPrayer.length === 0) {
    await prayerRepo.save(
      prayerRepo.create({
        id: uuidv4(),
        latitude: 52.4578,
        longitude: -1.8904,
        timezone: 'Europe/London',
        calculationMethod: 'BirminghamUnified',
        fajrAngle: 18.0,
        ishaAngle: 18.0,
        asrJuristic: 'HANAFI',
        fajrIqamahOffsetMins: 20,
        dhuhrIqamahOffsetMins: 15,
        asrIqamahOffsetMins: 15,
        maghribIqamahOffsetMins: 10,
        ishaIqamahOffsetMins: 15,
      }),
    );
    console.log('✅ Prayer settings initialized for Balsall Heath Birmingham.');
  }

  // 4. Default Homepage Sections
  const defaultSections: Array<Partial<HomepageSection>> = [
    {
      sectionKey: 'hero',
      title: 'Welcome to Alfalah Community Support Centre',
      subtitle: 'Serving faith, family, and community in Balsall Heath, Birmingham',
      content: 'A dedicated centre of community development, educational programmes, daily prayers, and compassionate support for all.',
      ctaText: 'View Prayer Times',
      ctaUrl: '/prayer-times',
      isVisible: true,
      displayOrder: 1,
    },
    {
      sectionKey: 'about_intro',
      title: 'About Our Centre',
      subtitle: 'Registered Charity No. 1150221',
      content: 'ALFALAH COMMUNITY SUPPORT CENTRE (مركز الفلاح الإسلامي) is located at 89 Tindal Street, Balsall Heath, Birmingham. We are committed to fostering community cohesion, education, and spiritual growth in a welcoming environment.',
      ctaText: 'Read More About Us',
      ctaUrl: '/about',
      isVisible: true,
      displayOrder: 2,
    },
    {
      sectionKey: 'prayer_highlight',
      title: 'Daily Prayer Timetable',
      subtitle: 'Accurate times for Balsall Heath, Birmingham',
      content: 'Join us for congregation prayers, Friday Jumu’ah, and community gatherings.',
      ctaText: 'Monthly Timetable',
      ctaUrl: '/prayer-times',
      isVisible: true,
      displayOrder: 3,
    },
    {
      sectionKey: 'activities_preview',
      title: 'Community Services & Activities',
      subtitle: 'Programmes for youth, families, and community welfare',
      content: 'Discover our educational circles, youth mentorship, food bank support, and sisterhood gatherings.',
      ctaText: 'Browse All Activities',
      ctaUrl: '/activities',
      isVisible: true,
      displayOrder: 4,
    },
  ];

  for (const sec of defaultSections) {
    const exists = await sectionsRepo.findOne({ where: { sectionKey: sec.sectionKey } });
    if (!exists) {
      await sectionsRepo.save(sectionsRepo.create({ id: uuidv4(), ...sec }));
    }
  }
  console.log('✅ Homepage sections seeded.');

  // 5. Initial Published Activity
  const existingActivity = await activityRepo.find();
  if (existingActivity.length === 0) {
    await activityRepo.save(
      activityRepo.create({
        id: uuidv4(),
        title: 'Weekly Community Circle & Quran Study',
        slug: 'weekly-community-circle',
        category: 'Education',
        shortDescription: 'Weekly study circle focused on Tajweed, reflection, and community learning.',
        fullDescription: 'Open to community members of all levels. Held in the main hall of the centre.',
        scheduleInfo: 'Every Saturday after Asr prayer',
        location: 'Alfalah Centre, 89 Tindal Street, Birmingham',
        isPublished: true,
        displayOrder: 1,
      }),
    );
    console.log('✅ Initial activity seeded.');
  }

  // 6. Initial Announcement
  const existingAnnouncements = await announcementRepo.find();
  if (existingAnnouncements.length === 0) {
    await announcementRepo.save(
      announcementRepo.create({
        id: uuidv4(),
        title: 'Welcome to the New Alfalah Community Support Centre Portal',
        content: 'We are pleased to introduce our official community website. Here you will find live prayer timetables, community notices, and upcoming centre events.',
        badgeText: 'Notice',
        isPinned: true,
        isPublished: true,
      }),
    );
    console.log('✅ Initial announcement seeded.');
  }

  await AppDataSource.destroy();
  console.log('🎉 Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
