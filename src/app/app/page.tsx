import { AppProvider } from '@/context/AppProvider';
import { AppShell } from '@/components/app/AppShell';

export default function AppPage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
