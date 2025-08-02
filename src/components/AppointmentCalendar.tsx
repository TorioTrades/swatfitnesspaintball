import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isSameDay, parseISO, isAfter, isBefore, startOfDay, isToday } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  serviceType?: string;
  serviceDetails?: any;
  onBack?: () => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onDateTimeSelect,
  selectedDate,
  selectedTime,
  serviceType,
  serviceDetails,
  onBack,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    selectedDate ? parseISO(selectedDate) : undefined
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(selectedTime || '');
  const [bookedSlots, setBookedSlots] = useState<{[key: string]: string[]}>({});
  const [unavailableSchedules, setUnavailableSchedules] = useState<any[]>([]);

  // Helper function to format time to AM/PM
  const formatTimeToAMPM = (time24: string) => {
    if (time24.includes('-')) {
      // Handle time ranges like "08:00-12:00"
      const [start, end] = time24.split('-');
      return `${formatTimeToAMPM(start)}-${formatTimeToAMPM(end)}`;
    }
    
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Get time slots based on service type
  const getTimeSlots = () => {
    if (serviceType === 'target-range') {
      // Target Range: 30-minute intervals
      return [
        '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', // Morning
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'  // Afternoon
      ];
    } else if (serviceType === 'half-day') {
      // Half Day Rental: Only morning 8AM-12PM or afternoon 1PM-5PM
      if (serviceDetails?.schedule === 'morning') {
        return ['8:00 AM-12:00 PM'];
      } else if (serviceDetails?.schedule === 'afternoon') {
        return ['1:00 PM-5:00 PM'];
      }
      return ['8:00 AM-12:00 PM', '1:00 PM-5:00 PM'];
    } else {
      // Regular Rates and Group Packages: 2 hour slots
      return [
        '8:00 AM-10:00 AM', '10:00 AM-12:00 PM', // Morning slots
        '1:00 PM-3:00 PM', '3:00 PM-5:00 PM'  // Afternoon slots
      ];
    }
  };

  const timeSlots = getTimeSlots();

  useEffect(() => {
    // Load booked paintball sessions and unavailable schedules
    loadBookedSessions();
    loadUnavailableSchedules();

    // Set up real-time subscription for booking changes
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Reload booked sessions when any booking changes
          loadBookedSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBookedSessions = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('booking_date, booking_time, status');

      if (error) throw error;

      const bookedByDate: {[key: string]: string[]} = {};
      
      bookings?.forEach((booking: any) => {
        if (booking.status !== 'cancelled' && booking.status !== 'no_show') {
          const dateKey = booking.booking_date;
          if (!bookedByDate[dateKey]) {
            bookedByDate[dateKey] = [];
          }
          bookedByDate[dateKey].push(booking.booking_time);
        }
      });
      
      setBookedSlots(bookedByDate);
    } catch (error) {
      console.error('Error loading booked sessions:', error);
    }
  };

  const loadUnavailableSchedules = async () => {
    // TODO: Implement availability table when needed
    setUnavailableSchedules([]);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 60); // 2 months in advance
    
    // Disable past dates and dates more than 2 months ahead
    if (isBefore(date, today) || isAfter(date, maxDate)) {
      return true;
    }

    // Check if entire day is unavailable
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableSchedules.some(schedule => 
      schedule.unavailable_date === dateStr && schedule.is_full_day
    );
  };

  // Helper function to check if a time slot has passed for today
  const isTimeSlotPassed = (time: string) => {
    if (!selected || !isToday(selected)) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // For time ranges, check if current time is past the END time
    // For single times, check if current time is past the START time
    let timeToCheck = time;
    if (time.includes('-')) {
      // For time ranges, use the end time
      timeToCheck = time.split('-')[1].trim();
    }
    
    // Convert time string to 24-hour format for comparison
    const timeMatch = timeToCheck.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!timeMatch) return false;
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3];
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Only mark as passed if current time is AFTER the end time (not equal to)
    return (hour < currentHour) || (hour === currentHour && minute <= currentMinute);
  };

  const isTimeSlotAvailable = (time: string) => {
    if (!selected) return false;
    
    // Check if the time slot has already passed for today
    if (isTimeSlotPassed(time)) {
      return false;
    }
    
    const selectedDateStr = format(selected, 'yyyy-MM-dd');
    
    // Check if time is already booked
    const bookedTimes = bookedSlots[selectedDateStr] || [];
    
    if (bookedTimes.includes(time)) {
      return false;
    }

    // Special logic for Half Day Rental - check if underlying regular slots are booked
    if (serviceType === 'half-day') {
      if (time === '8:00 AM-12:00 PM') {
        // Morning half-day: check if either 8-10 AM or 10-12 PM regular slots are booked
        const morning1 = '8:00 AM-10:00 AM';
        const morning2 = '10:00 AM-12:00 PM';
        if (bookedTimes.includes(morning1) || bookedTimes.includes(morning2)) {
          console.log('Morning half-day unavailable - underlying slots booked:', { morning1: bookedTimes.includes(morning1), morning2: bookedTimes.includes(morning2) });
          return false;
        }
      } else if (time === '1:00 PM-5:00 PM') {
        // Afternoon half-day: check if either 1-3 PM or 3-5 PM regular slots are booked
        const afternoon1 = '1:00 PM-3:00 PM';
        const afternoon2 = '3:00 PM-5:00 PM';
        if (bookedTimes.includes(afternoon1) || bookedTimes.includes(afternoon2)) {
          console.log('Afternoon half-day unavailable - underlying slots booked:', { afternoon1: bookedTimes.includes(afternoon1), afternoon2: bookedTimes.includes(afternoon2) });
          return false;
        }
      }
    }

    // Special logic for Regular Rates - check if overlapping half-day slots are booked
    if (serviceType === 'regular' || serviceType === 'group') {
      // Check if morning regular slots conflict with half-day morning booking
      if ((time === '8:00 AM-10:00 AM' || time === '10:00 AM-12:00 PM') && 
          bookedTimes.includes('8:00 AM-12:00 PM')) {
        console.log(`${time} unavailable - Morning half-day is booked`);
        return false;
      }
      
      // Check if afternoon regular slots conflict with half-day afternoon booking
      if ((time === '1:00 PM-3:00 PM' || time === '3:00 PM-5:00 PM') && 
          bookedTimes.includes('1:00 PM-5:00 PM')) {
        console.log(`${time} unavailable - Afternoon half-day is booked`);
        return false;
      }
    }

    // Check if time is in unavailable schedules
    const isUnavailable = unavailableSchedules.some(schedule => 
      schedule.unavailable_date === selectedDateStr && 
      !schedule.is_full_day && 
      schedule.unavailable_time === time
    );

    return !isUnavailable;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelected(date);
    setSelectedTimeSlot(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleContinue = () => {
    if (selected && selectedTimeSlot) {
      const dateStr = format(selected, 'yyyy-MM-dd');
      onDateTimeSelect(dateStr, selectedTimeSlot);
      // Delay scroll to ensure new content is rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const getAvailableTimesCount = () => {
    if (!selected) return 0;
    return timeSlots.filter(time => isTimeSlotAvailable(time)).length;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Select Date</h3>
            </div>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>• Paintball sessions available 7 days a week</p>
              <p>• Book up to 2 months in advance</p>
              {serviceType === 'target-range' ? (
                <>
                  <p>• Morning: 8:00 AM - 12:00 PM (30-min slots)</p>
                  <p>• Afternoon: 1:00 PM - 5:00 PM (30-min slots)</p>
                </>
              ) : serviceType === 'half-day' ? (
                <>
                  <p>• Morning: 8:00 AM - 12:00 PM</p>
                  <p>• Afternoon: 1:00 PM - 5:00 PM</p>
                </>
              ) : (
                <>
                  <p>• Morning: 8:00 AM - 10:00 AM, 10:00 AM - 12:00 PM</p>
                  <p>• Afternoon: 1:00 PM - 3:00 PM, 3:00 PM - 5:00 PM</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Select Time</h3>
              </div>
              {selected && (
                <Badge variant="outline">
                  {getAvailableTimesCount()} available
                </Badge>
              )}
            </div>
            
            {!selected ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Please select a date first</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  {format(selected, 'EEEE, MMMM d, yyyy')}
                </div>
                
                <>
                  <div className="text-sm text-muted-foreground mb-2">Morning</div>
                   <div className={`grid gap-2 mb-4 ${serviceType === 'target-range' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                     {timeSlots.filter(time => 
                       serviceType === 'target-range' 
                         ? time.startsWith('8:') || time.startsWith('9:') || time.startsWith('10:') || time.startsWith('11:') || time.startsWith('12:')
                         : time.startsWith('8:') || time.startsWith('10:')
                     ).map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlot === time ? "default" : "outline"}
                        size="sm"
                        disabled={!isTimeSlotAvailable(time)}
                        onClick={() => handleTimeSelect(time)}
                        className={`${serviceType === 'target-range' ? 'h-8 text-xs' : 'h-10 text-sm'}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">Afternoon</div>
                   <div className={`grid gap-2 ${serviceType === 'target-range' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                     {timeSlots.filter(time => 
                       serviceType === 'target-range'
                         ? time.startsWith('1:') || time.startsWith('2:') || time.startsWith('3:') || time.startsWith('4:') || time.startsWith('5:')
                         : time.startsWith('1:') || time.startsWith('3:')
                     ).map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlot === time ? "default" : "outline"}
                        size="sm"
                        disabled={!isTimeSlotAvailable(time)}
                        onClick={() => handleTimeSelect(time)}
                        className={`${serviceType === 'target-range' ? 'h-8 text-xs' : 'h-10 text-sm'}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  
                  {getAvailableTimesCount() === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">All time slots are currently unavailable</p>
                      <p className="text-xs">Please select another date</p>
                    </div>
                  )}
                </>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center max-w-md mx-auto gap-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            size="lg"
            className="w-48"
          >
            Back to Half Day Rental
          </Button>
        )}
        <Button
          onClick={handleContinue}
          disabled={!selected || !selectedTimeSlot}
          size="lg"
          className="w-48"
        >
          Continue to Booking Information
        </Button>
      </div>
    </div>
  );
};