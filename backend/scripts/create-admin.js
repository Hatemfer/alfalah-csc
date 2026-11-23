const mysql = require('mysql2/promise');
const argon2 = require('argon2');
const crypto = require('crypto');

async function run() {
  const email = (process.argv[2] || 'admin@alfalahcsc.com').toLowerCase().trim();
  const password = process.argv[3] || 'AlfalahAdmin2026!';
  const fullName = process.argv[4] || 'Alfalah Admin';
  const role = process.argv[5] || 'SUPER_ADMIN';

  console.log(`Setting up admin account for: ${email}`);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'alfalah_user',
    password: process.env.DB_PASSWORD || 'daf82cf9b697badbbaab21c8beb69bd2',
    database: process.env.DB_NAME || 'alfalah_db',
  });

  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  const [existing] = await connection.execute(
    'SELECT id FROM admin_users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    await connection.execute(
      'UPDATE admin_users SET password_hash = ?, full_name = ?, role = ?, is_active = 1, updated_at = NOW() WHERE email = ?',
      [hash, fullName, role, email]
    );
    console.log(`✅ Updated existing admin password for: ${email}`);
  } else {
    const id = crypto.randomUUID();
    await connection.execute(
      'INSERT INTO admin_users (id, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, email, hash, fullName, role]
    );
    console.log(`✅ Created new admin user: ${email} (${fullName})`);
  }

  await connection.end();
  console.log('Done!');
}

run().catch((err) => {
  console.error('Error creating admin user:', err);
  process.exit(1);
});
