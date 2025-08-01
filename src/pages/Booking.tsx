import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/components/CustomerForm';
import { AppointmentCalendar } from '@/components/AppointmentCalendar';
import { BookingConfirmation } from '@/components/BookingConfirmation';
import { ServiceSelection } from '@/components/ServiceSelection';
import { RegularRatesCalculator } from '@/components/RegularRatesCalculator';
import { TargetRangeCalculator } from '@/components/TargetRangeCalculator';
import { useNavigate, useLocation } from 'react-router-dom';

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
}

const calculateServicePrice = (service: string, serviceDetails?: any) => {
  if (!service) return 0;

  // For calculator services
  if (service === 'regular' || service === 'target-range') {
    return serviceDetails?.total || 0;
  }

  // Extract price from service string for fixed packages
  const priceMatch = service.match(/P\s*([\d,]+)/);
  if (priceMatch) {
    return parseInt(priceMatch[1].replace(',', ''));
  }

  // Default prices for group packages
  if (service.includes('10 Players')) return 7000;
  if (service.includes('15 Players')) return 10500;
  if (service.includes('20 Players')) return 14000;

  return 0;
};

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state;
  
  const [currentStep, setCurrentStep] = useState(navigationState?.step || 1);
  const [showRegularRatesCalculator, setShowRegularRatesCalculator] = useState(false);
  const [showTargetRangeCalculator, setShowTargetRangeCalculator] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    service: navigationState?.service,
    serviceDetails: navigationState?.serviceDetails,
    groupSize: navigationState?.groupSize,
    ...navigationState
  });

  const handleStepComplete = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (showRegularRatesCalculator) {
      setShowRegularRatesCalculator(false);
    } else if (showTargetRangeCalculator) {
      setShowTargetRangeCalculator(false);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRegularRatesSelect = () => {
    setShowRegularRatesCalculator(true);
  };

  const handleTargetRangeSelect = () => {
    setShowTargetRangeCalculator(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegularRatesContinue = (data: { persons: number; total: number }) => {
    setBookingData(prev => ({ 
      ...prev, 
      service: 'regular', 
      serviceDetails: data,
      groupSize: data.persons 
    }));
    setShowRegularRatesCalculator(false);
    setCurrentStep(2);
  };

  const handleTargetRangeContinue = (data: { persons: number; total: number }) => {
    setBookingData(prev => ({ 
      ...prev, 
      service: 'target-range', 
      serviceDetails: data,
      groupSize: data.persons 
    }));
    setShowTargetRangeCalculator(false);
    setCurrentStep(2);
  };

  const handleClose = () => {
    navigate('/');
  };

  const renderStep = () => {
    if (showRegularRatesCalculator) {
      return (
        <RegularRatesCalculator
          onBack={() => setShowRegularRatesCalculator(false)}
          onContinue={handleRegularRatesContinue}
        />
      );
    }

    if (showTargetRangeCalculator) {
      return (
        <TargetRangeCalculator
          onBack={() => setShowTargetRangeCalculator(false)}
          onContinue={handleTargetRangeContinue}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            onServiceSelect={(service, details) => handleStepComplete({ service, serviceDetails: details })}
            onRegularRatesSelect={handleRegularRatesSelect}
            onTargetRangeSelect={handleTargetRangeSelect}
            selectedService={bookingData.service}
          />
        );
      case 2:
        return (
          <AppointmentCalendar
            onDateTimeSelect={(date, time) => handleStepComplete({ bookingDate: date, bookingTime: time })}
            selectedDate={bookingData.bookingDate}
            selectedTime={bookingData.bookingTime}
            serviceType={bookingData.service}
            serviceDetails={bookingData.serviceDetails}
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            Book Your Paintball Session
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isActive 
                        ? 'border-primary text-primary' 
                        : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden xs:block ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-2 sm:mx-4 ${
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>


        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-center">{getStepTitle()}</h2>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default Booking;