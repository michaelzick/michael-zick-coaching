import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from '@/lib/icons';
import { useAuth } from '@/hooks/use-auth';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading, isProfileLoading } = useAuth();

  if (isLoading || (user && isProfileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium uppercase tracking-[0.05em]">Loading Admin</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
