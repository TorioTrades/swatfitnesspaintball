import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Calculator } from 'lucide-react';

interface RegularRatesCalculatorProps {
  onBack: () => void;
  onContinue: (data: { persons: number; total: number }) => void;
}

export const RegularRatesCalculator: React.FC<RegularRatesCalculatorProps> = ({
  onBack,
  onContinue
}) => {
  const [persons, setPersons] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('1');
  
  const entranceFee = 700;
  const bulletReload = 5;
  const total = persons * entranceFee;

  const handlePersonsChange = (value: string) => {
    setInputValue(value);
    
    if (value === '') {
      setPersons(1);
      return;
    }
    
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setPersons(num);
    }
  };

  const handleContinue = () => {
    onContinue({ persons, total });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-primary" />
            Paintball Regular Rates Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rate Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Entrance Fee per person:</span>
              <span className="font-bold text-primary">₱{entranceFee.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• 2 hours of playable field time</p>
              <p>• Includes +30 bullets</p>
              <p>• Includes: Paintball Gun, Air Tank, Vest, Mask</p>
              <p>• Bullet Reload: ₱{bulletReload.toFixed(2)} each</p>
            </div>
          </div>

          {/* Person Count Input */}
          <div className="space-y-3">
            <Label htmlFor="persons" className="text-base font-medium">
              Number of Persons
            </Label>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => persons > 1 && setPersons(prev => prev - 1)}
                  disabled={persons <= 1}
                  className="h-8 w-8"
                >
                  -
                </Button>
                <span className="min-w-[2rem] text-center font-semibold">
                  {persons}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPersons(prev => prev + 1)}
                  className="h-8 w-8"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">Total Calculation</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{persons} person{persons > 1 ? 's' : ''} × ₱{entranceFee.toLocaleString()}</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-primary">₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full"
          >
            Continue to Date & Time
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};