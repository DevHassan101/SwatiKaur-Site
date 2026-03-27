import { redirect } from 'next/navigation';
import { getSession } from '../../../../app/lib/auth';
import DashboardLayout from '../components/DashboardLayout';
import ModelsContent from './ModelsContent';
import prisma from '../../../../app/lib/db';

export default async function ModelsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout user={user}>
      <ModelsContent />
    </DashboardLayout>
  );
}