import { redirect } from 'next/navigation';
import { getSession } from '../../../../../lib/auth';
import prisma from '../../../../../lib/db';
import DashboardLayout from '../../../components/DashboardLayout';
import EditModelForm from './EditModelForm';

export default async function EditModelPage() {
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
      <EditModelForm />
    </DashboardLayout>
  );
}