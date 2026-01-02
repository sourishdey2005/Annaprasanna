import { AppProvider } from '@/context/AppProvider';
import { AppShell } from '@/components/app/AppShell';

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
