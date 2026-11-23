const mysql = require('mysql2/promise');
const crypto = require('crypto');

const REAL_ACTIVITIES = [
  {
    title: 'Youth Electronics & STEM Robotics Lab',
    slug: 'youth-stem-lab',
    category: 'Youth & STEM Robotics',
    shortDescription: 'A pioneering hands-on technical workshop where young Muslims build electronic circuits, solder components, program microcontrollers, and construct robotics in a supportive Islamic environment.',
    fullDescription: 'Solderless breadboards, LED circuits, resistors, and sensors.\nIntroduction to microcontroller coding and computing logic.\nTeamwork engineering challenges and mechanical problem solving.\nAll tools, safety equipment, and electronics kits provided.',
    scheduleInfo: 'Every Saturday: 10:00 AM – 12:00 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/youth-electronics-workbench.jpg',
    displayOrder: 1,
    isPublished: 1,
  },
  {
    title: 'Accredited First Aid & CPR Training',
    slug: 'first-aid-training',
    category: 'First Aid & Emergency Training',
    shortDescription: 'Fully funded, certified emergency first aid course covering life-saving CPR, AED automated defibrillator use, recovery position, choking relief, and emergency wound care for our community.',
    fullDescription: 'Official accredited First Aid & CPR certificate awarded upon completion.\nHands-on practical training with CPR mannequins and live AED trainers.\nVital emergency skills for parents, sports coaches, carers, and youth.\n100% Free of charge — fully funded for Balsall Heath community members.',
    scheduleInfo: 'Monthly Saturday Intensive: 10:00 AM – 3:30 PM',
    location: 'Alfalah Community Hall, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/first-aid-training.jpg',
    displayOrder: 2,
    isPublished: 1,
  },
  {
    title: 'Certified Community Safeguarding Training',
    slug: 'safeguarding-training',
    category: 'Community Safeguarding & Welfare',
    shortDescription: 'Comprehensive accredited safeguarding course ensuring safe spaces for our children and vulnerable adults. Learn indicators of harm, disclosure handling, and UK regulatory compliance.',
    fullDescription: 'Official accredited Safeguarding Awareness Certificate issued.\nRecognising signs of abuse, emotional neglect, and online safety risks.\nClear reporting protocols and safe practice in faith institutions.\n100% Free of charge — supporting volunteer leaders and local families.',
    scheduleInfo: 'Bi-Monthly Sunday: 1:30 PM – 4:30 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/safeguarding-training.jpg',
    displayOrder: 3,
    isPublished: 1,
  },
  {
    title: 'Sakeena Learning Hub (Quran & Tajweed Madrasah)',
    slug: 'sakeena-madrasah',
    category: 'Quran & Tajweed',
    shortDescription: 'Accredited after-school Madrasah covering Noorani Qaida, precise Quranic Tajweed, Juz Amma memorisation, daily Duas, and foundational Islamic manners (Adab).',
    fullDescription: 'Individual progress tracking with structured reading levels.\nQualified male and female teachers with sanad recitation.\nInteractive whiteboards and multimedia learning tools.\nSafe, caring, DBS-verified educational environment.',
    scheduleInfo: 'Monday, Tuesday & Wednesday: 5:00 PM – 7:00 PM',
    location: 'Sakeena Hub Classrooms, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/sakeena-learning-hub.jpg',
    displayOrder: 4,
    isPublished: 1,
  },
  {
    title: 'Weekly Tafsir with Sheikh Jamal Al-Jabarti',
    slug: 'weekly-tafsir',
    category: 'Islamic Studies & Tafsir',
    shortDescription: 'An in-depth, verse-by-verse exploration of the Holy Quran, translating classical scholarship into practical reflections for contemporary daily life in Britain.',
    fullDescription: 'Delivered in Arabic with English commentary and live Q&A.\nDedicated seating and audio for both brothers and sisters.\nWarm community tea and hospitality following the lecture.\nFree admission — all brothers, sisters, and university students welcome.',
    scheduleInfo: 'Every Saturday: After Maghrib Prayer',
    location: 'Main Prayer Hall, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/poster-tafsir-sheikh-jamal.jpg',
    displayOrder: 5,
    isPublished: 1,
  },
  {
    title: 'Handmade Crafts & Creative Workshop',
    slug: 'handmade-crafts',
    category: 'Handmade & Arts',
    shortDescription: 'Hands-on creative workshop combining traditional Islamic calligraphy, woodworking, sewing, and model making to foster patience, creative focus, and craftsmanship.',
    fullDescription: 'Arabic calligraphy and geometric Islamic patterns.\nWoodworking and artisanal handmade crafting skills.\nScreen-free, productive Sunday morning activity.\nStudents take home their handmade completed projects.',
    scheduleInfo: 'Every Sunday: 11:00 AM – 1:00 PM',
    location: 'Creative Workshop Room, 89 Tindal St, Birmingham',
    imageUrl: '/images/real/youth-stem-workshop.jpg',
    displayOrder: 6,
    isPublished: 1,
  },
  {
    title: 'Sisters’ Weekly Halaqah & Family Circle',
    slug: 'sisters-halaqah',
    category: 'Sisters Circle',
    shortDescription: 'A nurturing, private gathering in the secondary hall for sisters to study practical Fiqh of worship, family life, mother-and-toddler socialisation, and mutual community sisterhood.',
    fullDescription: 'Separate entrance, dedicated Wudu, and private hall.\nFamily counselling and pre-marital Islamic guidance.\nSupport network for new Muslim sisters and young mothers.\nLight refreshments and tea served in a warm atmosphere.',
    scheduleInfo: 'Every Sunday: 10:30 AM – 12:30 PM',
    location: 'Secondary Hall (Private Sisters’ Wing), 89 Tindal St, Birmingham',
    imageUrl: '/images/real/secondary-hall-sisters.jpg',
    displayOrder: 7,
    isPublished: 1,
  },
];

async function run() {
  console.log('Syncing real activities into database...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'alfalah_user',
    password: process.env.DB_PASSWORD || 'daf82cf9b697badbbaab21c8beb69bd2',
    database: process.env.DB_NAME || 'alfalah_db',
  });

  // 1. Delete old placeholder/dummy seed content
  await connection.execute(
    "DELETE FROM activities WHERE slug = 'weekly-community-circle'"
  );
  console.log('✅ Removed placeholder activity "weekly-community-circle"');

  // 2. Insert or update the real activities
  for (const act of REAL_ACTIVITIES) {
    const [existing] = await connection.execute(
      'SELECT id FROM activities WHERE slug = ?',
      [act.slug]
    );

    if (existing.length > 0) {
      await connection.execute(
        `UPDATE activities SET 
          title = ?, 
          category = ?, 
          short_description = ?, 
          full_description = ?, 
          schedule_info = ?, 
          location = ?, 
          image_url = ?, 
          display_order = ?, 
          is_published = ?, 
          updated_at = NOW() 
        WHERE slug = ?`,
        [
          act.title,
          act.category,
          act.shortDescription,
          act.fullDescription,
          act.scheduleInfo,
          act.location,
          act.imageUrl,
          act.displayOrder,
          act.isPublished,
          act.slug,
        ]
      );
      console.log(`✅ Updated existing activity: ${act.title}`);
    } else {
      const id = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO activities (
          id, title, slug, category, short_description, full_description, 
          schedule_info, location, image_url, display_order, is_published, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id,
          act.title,
          act.slug,
          act.category,
          act.shortDescription,
          act.fullDescription,
          act.scheduleInfo,
          act.location,
          act.imageUrl,
          act.displayOrder,
          act.isPublished,
        ]
      );
      console.log(`✅ Inserted real activity: ${act.title}`);
    }
  }

  const [count] = await connection.execute('SELECT COUNT(*) as total FROM activities');
  console.log(`Total live activities in database: ${count[0].total}`);

  await connection.end();
  console.log('Sync complete!');
}

run().catch((err) => {
  console.error('Error syncing activities:', err);
  process.exit(1);
});
