'use client';

import { useApp } from '@/context/AppProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/app/layout';
import Dashboard from '@/components/app/dashboard';
import ScannerView from '@/components/app/scanner-view';
import HistoryView from '@/components/app/history-view';
import { Home, Scan, History, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AppShell() {
  const { isLoading, error } = useApp();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-8 p-4 md:p-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="flex justify-center border-b sticky top-16 md:top-0 bg-background/95 backdrop-blur-sm z-10">
          <TabsList className="grid w-full max-w-lg grid-cols-3 m-4">
            <TabsTrigger value="dashboard">
              <Home className="mr-2 h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="scan">
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard" className="mt-0">
          <Dashboard />
        </TabsContent>
        <TabsContent value="scan" className="mt-0">
          <ScannerView />
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          <HistoryView />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
