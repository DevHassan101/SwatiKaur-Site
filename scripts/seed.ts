import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../app/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('\n🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('sajdeen123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@swati.com' },
    update: {},
    create: {
      email: 'admin@swati.com',
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email    :', user.email);
  console.log('Username :', user.username);
  console.log('Password : sajdeen123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🚀 Ab login karo: http://localhost:3000/login');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });