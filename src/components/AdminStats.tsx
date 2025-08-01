import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export interface AdminStatsRef {
  refresh: () => void;
}

export const AdminStats = forwardRef<AdminStatsRef>((_, ref) => {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchStats,
  }));

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch booking stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');

      if (bookingsError) throw bookingsError;

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookings?.filter(booking => 
        booking.booking_date === today
      ).length || 0;

      const pendingBookings = bookings?.filter(booking => 
        booking.status === 'confirmed' // Show confirmed bookings as active
      ).length || 0;

      const confirmedBookings = bookings?.filter(booking => 
        booking.status === 'confirmed'
      ).length || 0;

      setStats({
        totalBookings: bookings?.length || 0,
        todayBookings,
        pendingBookings,
        confirmedBookings,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Pending Payment',
      value: stats.pendingBookings,
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return null;
});