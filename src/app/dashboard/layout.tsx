import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const metadata = {
  title: 'Dashboard | VETGL.AI',
  description: 'Veterinary AI Clinical Assistant Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userData = profile || {
    id: user.id,
    email: user.email!,
    full_name: '',
    role: 'veterinarian',
  };

  return (
    <DashboardShell user={userData}>
      {children}
    </DashboardShell>
  );
}
