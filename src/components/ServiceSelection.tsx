import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Target, CheckCircle } from 'lucide-react';
interface ServiceSelectionProps {
  onServiceSelect: (service: string, details?: any) => void;
  onRegularRatesSelect: () => void;
  onTargetRangeSelect: () => void;
  selectedService?: string;
}
export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  onServiceSelect,
  onRegularRatesSelect,
  onTargetRangeSelect,
  selectedService
}) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(selectedService || '');
  const [selectedGroupPackage, setSelectedGroupPackage] = useState<string>('');
  const [selectedHalfDay, setSelectedHalfDay] = useState<string>('');
  const handleServiceSelect = (service: string, details?: any) => {
    setSelected(service);
    if (service !== 'group') {
      setSelectedGroupPackage('');
      setSelectedHalfDay('');
    }
    onServiceSelect(service, details);
  };
  const handleGroupPackageSelect = (packageType: string) => {
    setSelectedGroupPackage(packageType);
    const packages = {
      'group-10': {
        key: 'group-10',
        name: 'Group of 10',
        price: '₱6,300',
        people: '9+1 Free',
        total: 'Group of 10',
        groupSize: 10
      },
      'group-15': {
        key: 'group-15',
        name: 'Group of 15',
        price: '₱9,800',
        people: '14+1 Free',
        total: 'Group of 15',
        groupSize: 15
      },
      'group-20': {
        key: 'group-20',
        name: 'Group of 20',
        price: '₱13,300',
        people: '19+1 Free',
        total: 'Group of 20',
        groupSize: 20
      }
    };
    const selectedPackage = packages[packageType as keyof typeof packages];
    navigate('/package-confirmation', {
      state: {
        packageDetails: selectedPackage
      }
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleHalfDaySelect = (schedule: string) => {
    setSelectedHalfDay(schedule);
    const schedules = {
      'morning': {
        schedule: 'morning',
        name: 'Morning Schedule',
        time: '8AM to 12 NN',
        price: '₱18,000'
      },
      'afternoon': {
        schedule: 'afternoon',
        name: 'Afternoon Schedule',
        time: '1PM - 5PM',
        price: '₱20,000'
      }
    };
    const selectedSchedule = schedules[schedule as keyof typeof schedules];
    navigate('/half-day-confirmation', {
      state: {
        halfDayDetails: selectedSchedule
      }
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <div className="space-y-6">
      {/* Paintball Regular Rates */}
      <Card className={`cursor-pointer transition-all hover:shadow-md ${selected === 'regular' ? 'ring-2 ring-primary border-primary' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Paintball Regular Rates
            </div>
            {selected === 'regular' && <CheckCircle className="w-5 h-5 text-primary" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Entrance Fee:</span>
              <span className="font-bold text-xl text-primary">₱700 per person</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>This includes +30 bullets</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Inclusion:</p>
              <p className="text-sm text-muted-foreground">Paintball Gun, Air Tank, Vest, Mask</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Bullet Reload:</span>
              <span className="font-semibold text-accent">₱5.00</span>
            </div>
            <Button onClick={onRegularRatesSelect} className="w-full mt-4" size="lg">
              Select Regular Rates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paintball Group */}
      <Card className={`${selected === 'group' || selected === 'half-day' ? 'ring-2 ring-primary border-primary' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Paintball Group
            </div>
            {(selected === 'group' || selected === 'half-day') && <CheckCircle className="w-5 h-5 text-primary" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Group Packages */}
          <div className="space-y-3">
            <h4 className="font-medium">Group Packages</h4>
            <div className="grid gap-3">
              {[{
              key: 'group-10',
              people: '9+1 Free',
              total: 'Group of 10',
              price: '₱6,300'
            }, {
              key: 'group-15',
              people: '14+1 Free',
              total: 'Group of 15',
              price: '₱9,800'
            }, {
              key: 'group-20',
              people: '19+1 Free',
              total: 'Group of 20',
              price: '₱13,300'
            }].map(pkg => <Button key={pkg.key} variant={selectedGroupPackage === pkg.key ? "default" : "outline"} className="h-auto p-4 flex justify-between items-center w-full" onClick={() => handleGroupPackageSelect(pkg.key)}>
                  <div className="text-left">
                    <div className="font-medium">{pkg.people} = {pkg.total}</div>
                  </div>
                  <div className="font-bold text-lg">{pkg.price}</div>
                </Button>)}
            </div>
          </div>

          {/* Half Day Rental */}
          <div className="space-y-3 pt-4 border-t">
            <div>
              <h4 className="font-medium">Half Day Rental</h4>
              <p className="text-sm text-muted-foreground">Maximum of 20 persons</p>
            </div>
            <div className="grid gap-3">
              <Button variant={selectedHalfDay === 'morning' ? "default" : "outline"} className="h-auto p-4 flex justify-between items-center w-full" onClick={() => handleHalfDaySelect('morning')}>
                <div className="text-left">
                  <div className="font-medium">Morning Schedule</div>
                  <div className="text-sm opacity-80">8AM to 12 NN</div>
                </div>
                <div className="font-bold text-lg">₱18,000</div>
              </Button>
              <Button variant={selectedHalfDay === 'afternoon' ? "default" : "outline"} className="h-auto p-4 flex justify-between items-center w-full" onClick={() => handleHalfDaySelect('afternoon')}>
                <div className="text-left">
                  <div className="font-medium">Afternoon Schedule</div>
                  <div className="text-sm opacity-80">1PM - 5PM</div>
                </div>
                <div className="font-bold text-lg">₱20,000</div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Range */}
      <Card className={`cursor-pointer transition-all hover:shadow-md ${selected === 'target-range' ? 'ring-2 ring-primary border-primary' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Target Range
            </div>
            {selected === 'target-range' && <CheckCircle className="w-5 h-5 text-primary" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Entrance Fee:</span>
              <span className="font-bold text-xl text-primary">₱250.00</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>+10 bullets</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Inclusion:</p>
              <p className="text-sm text-muted-foreground">Paintball Gun & Air Tank</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Exclusion:</p>
              <p className="text-sm text-muted-foreground">Vest & Mask</p>
            </div>
            <Button onClick={onTargetRangeSelect} className="w-full mt-4" size="lg">
              Select Target Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        
      </div>
    </div>;
};