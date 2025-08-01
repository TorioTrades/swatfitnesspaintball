import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { CustomerForm } from './CustomerForm';
import { AppointmentCalendar } from './AppointmentCalendar';
import { BookingConfirmation } from './BookingConfirmation';
import { ServiceSelection } from './ServiceSelection';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BookingData {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  serviceDetails?: any;
  bookingDate: string;
  bookingTime: string;
  groupSize: number;
  specialRequests?: string;
  emergencyContact?: string;
  experience?: string;
  receiptFile?: File;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: string;
  remainingBalance?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});

  const handleStepComplete = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setBookingData({});
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            onServiceSelect={(service, details) => handleStepComplete({ service, serviceDetails: details })}
            onRegularRatesSelect={() => {}} // Not used in modal
            onTargetRangeSelect={() => {}} // Not used in modal
            selectedService={bookingData.service}
          />
        );
      case 2:
        return (
          <AppointmentCalendar
            onDateTimeSelect={(date, time) => handleStepComplete({ bookingDate: date, bookingTime: time })}
            selectedDate={bookingData.bookingDate}
            selectedTime={bookingData.bookingTime}
          />
        );
      case 3:
        return (
          <CustomerForm
            onSubmit={handleStepComplete}
            onBack={handleBack}
            initialData={bookingData}
          />
        );
      case 4:
        return (
          <BookingConfirmation
            bookingData={bookingData as BookingData}
            onClose={handleClose}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select Service';
      case 2:
        return 'Select Date & Time';
      case 3:
        return 'Booking Information';
      case 4:
        return 'Confirmation';
      default:
        return '';
    }
  };

  const steps = [
    { number: 1, title: 'Service', icon: Calendar },
    { number: 2, title: 'Date & Time', icon: Clock },
    { number: 3, title: 'Details', icon: User },
    { number: 4, title: 'Confirmation', icon: CheckCircle },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Book Your Paintball Session
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isActive 
                        ? 'border-primary text-primary' 
                        : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-center">{getStepTitle()}</h3>
        </div>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};