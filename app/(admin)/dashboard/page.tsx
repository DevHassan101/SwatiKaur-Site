import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import DashboardLayout from './components/DashboardLayout';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // User fetch karna
  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) }
  });

  if (!user) {
    redirect('/login');
  }

  const modelCount = await prisma.model.count();
  const blogCount = await prisma.blog.count();

  return (
    <DashboardLayout user={user}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.05) 0%, rgba(196, 0, 0, 0.05) 100%)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(157, 0, 255, 0.1)',
        border: '1px solid rgba(157, 0, 255, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px'
        }}>
          Welcome back, {user.username}! 
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px'
        }}>
          Here&apos;s what&apos;s happening with your dashboard today.
        </p>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          {/* Total Models Card */}
          <div style={{
            background: 'linear-gradient(135deg, #9D00FF 0%, #7a00cc 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(157, 0, 255, 0.3)'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0', fontWeight: '500' }}>
              Total Models
            </p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
              {modelCount}
            </p>
          </div>

          {/* Total Blogs Card */}
          <div style={{
            background: 'linear-gradient(135deg, #c40000 0%, #ff3333 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(196, 0, 0, 0.3)'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0', fontWeight: '500' }}>
              Total Blogs
            </p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>
              {blogCount}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}