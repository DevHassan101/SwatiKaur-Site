'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '../lib/db';
import { createToken } from '../lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { error: 'Invalid email or password' };
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}