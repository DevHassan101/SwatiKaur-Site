import { redirect } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import prisma from '../../../../lib/db';
import DashboardLayout from '../../components/DashboardLayout';
import CreateBlogForm from './CreateBlogForm';

export default async function CreateBlogPage() {
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
      <CreateBlogForm />
    </DashboardLayout>
  );
}