import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, Target, CheckCircle, Package, Users, Plus, Minus, PartyPopper } from 'lucide-react';

interface HalfDayDetails {
  schedule: string;
  name: string;
  time: string;
  price: string;
}

const HalfDayConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const halfDayDetails = location.state?.halfDayDetails as HalfDayDetails;
  
  const [additionalPersons, setAdditionalPersons] = useState(0);
  const [eventType, setEventType] = useState('');

  if (!halfDayDetails) {
    navigate('/booking');
    return null;
  }

  const { schedule, name, time, price } = halfDayDetails;
  const basePrice = parseInt(price.replace('₱', '').replace(',', ''));
  const maxPersons = 20;
  const additionalPersonCost = 500;
  const freeBullets = 1200;
  
  const totalAmount = basePrice + (additionalPersons * additionalPersonCost);
  const totalPersons = maxPersons + additionalPersons;

  const addPerson = () => {
    setAdditionalPersons(prev => prev + 1);
  };

  const removePerson = () => {
    setAdditionalPersons(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/booking')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            Half Day Rental Confirmation
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Half Day Schedule Selected!</h2>
          <p className="text-muted-foreground">Review your half day rental details</p>
        </div>

        <div className="grid gap-6">
          {/* Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                {name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">{time}</span>
                <Badge variant="outline" className="text-primary border-primary">
                  Half Day Rental
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary">{price}</div>
            </CardContent>
          </Card>

          {/* Event Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PartyPopper className="w-5 h-5 mr-2 text-primary" />
                Event Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground mb-4">
                  What type of event will you be hosting?
                </p>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="team-building">Team Building</SelectItem>
                    <SelectItem value="birthday-party">Birthday Party</SelectItem>
                    <SelectItem value="reunions">Reunions</SelectItem>
                    <SelectItem value="gender-reveal">Gender Reveal</SelectItem>
                    <SelectItem value="prenup-photography">Prenup Photography</SelectItem>
                    <SelectItem value="marriage-proposal">Marriage Proposal</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Field Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Field & Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Field Play Duration</span>
                  <span className="font-semibold text-lg">4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Schedule</span>
                  <span className="font-semibold">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Persons</span>
                  <span className="font-semibold">{totalPersons} persons</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment & Bullets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Inclusions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Free Bullets</span>
                  <span className="font-semibold text-lg">{freeBullets.toLocaleString()} pcs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Air Tank Refill</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-sm">
                    <p className="font-medium mb-1">Equipment Included:</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Paintball Guns</li>
                      <li>• Air Tanks</li>
                      <li>• Vests</li>
                      <li>• Masks</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Additional Info:</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Max {maxPersons} persons</li>
                      <li>• 4-hour field access</li>
                      <li>• Free air tank refill</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Person Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Additional Person Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Additional Person Cost</span>
                  <span className="font-bold text-lg text-primary">₱{additionalPersonCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Current Additional Persons:</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={removePerson}
                      disabled={additionalPersons === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-bold text-lg min-w-8 text-center">{additionalPersons}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addPerson}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the + and - buttons to add or remove additional persons. Each additional person costs ₱{additionalPersonCost}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Half Day Rental ({name})</span>
                  <span>{price}</span>
                </div>
                {additionalPersons > 0 && (
                  <div className="flex justify-between">
                    <span>Additional Persons ({additionalPersons})</span>
                    <span>₱{(additionalPersons * additionalPersonCost).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₱{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/booking')}
              size="lg"
            >
              Change Service
            </Button>
            <Button
              onClick={() => {
                navigate('/booking', { 
                  state: { 
                    step: 2,
                    service: 'half-day',
                    serviceDetails: {
                      ...halfDayDetails,
                      totalPersons,
                      additionalPersons,
                      totalAmount,
                      eventType
                    },
                    groupSize: totalPersons
                  } 
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              size="lg"
              className="min-w-48"
              disabled={!eventType}
            >
              Continue to Date & Time
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalfDayConfirmation;