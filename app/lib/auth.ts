import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET || 'your-super-secret-key';

export async function createToken(payload: { userId: number; email: string }) {
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d'
  });
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, secret) as { userId: number; email: string };
    return payload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}