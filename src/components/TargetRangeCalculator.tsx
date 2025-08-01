import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, Target } from 'lucide-react';

interface TargetRangeCalculatorProps {
  onBack: () => void;
  onContinue: (data: { persons: number; total: number }) => void;
}

export const TargetRangeCalculator: React.FC<TargetRangeCalculatorProps> = ({
  onBack,
  onContinue
}) => {
  const [persons, setPersons] = useState<number>(1);
  
  const entranceFee = 250;
  const total = persons * entranceFee;

  const handleContinue = () => {
    onContinue({ persons, total });
    // Delay scroll to ensure new content is rendered
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
            <Target className="w-5 h-5 mr-2 text-primary" />
            Target Range Calculator
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
              <p>• Includes +10 bullets</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Badge variant="outline" className="text-accent border-accent">
                  Good for 30 minutes only!
                </Badge>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Inclusions:</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Paintball Gun</li>
                <li>• Air Tank</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Exclusions:</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Vest</li>
                <li>• Mask</li>
              </ul>
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