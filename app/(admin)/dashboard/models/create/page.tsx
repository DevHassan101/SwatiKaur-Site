import { redirect } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import DashboardLayout from '../../components/DashboardLayout';
import CreateModelForm from './CreateModelForm';
import prisma from '../../../../lib/db';

export default async function CreateModelPage() {
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
      <CreateModelForm />
    </DashboardLayout>
  );
}