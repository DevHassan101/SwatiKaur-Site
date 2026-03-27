import bcrypt from 'bcryptjs';

async function hashPassword() {
  const password = 'sajdeen123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);
  // Copy this hash and update it in your database
}

hashPassword();