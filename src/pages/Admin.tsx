import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, RefreshCw, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminBookings, AdminBookingsRef } from '@/components/AdminBookings';
import { AdminStats, AdminStatsRef } from '@/components/AdminStats';
import AdminLogin from '@/components/AdminLogin';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const adminStatsRef = useRef<AdminStatsRef>(null);
  const adminBookingsRef = useRef<AdminBookingsRef>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  const handleRefresh = () => {
    adminStatsRef.current?.refresh();
    adminBookingsRef.current?.refresh();
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-1 self-start h-8 px-2 text-xs"
              size="sm"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </Button>
            
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="text-center sm:text-left">
                <h1 className="text-sm sm:text-lg font-bold leading-tight">
                  Booking Dashboard
                </h1>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Manage customer bookings
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="h-8 px-2 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPasswordModalOpen(true)}
                className="h-8 px-2 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Change Password</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-xs"
              >
                <LogOut className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-2 sm:px-4 py-2 sm:py-6 space-y-3 sm:space-y-6">
        <div className="w-full">
          <AdminBookings ref={adminBookingsRef} />
        </div>
      </div>
      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Admin;