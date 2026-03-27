import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  console.log('Login page: Checking session...');
  
  const session = await getSession();
  
  console.log('Login page: Session result:', session);
  
  if (session) {
    console.log('Login page: User already logged in, redirecting to dashboard');
    redirect('/dashboard');
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <LoginForm />
    </div>
  );
}