import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Target, CheckCircle, Package } from 'lucide-react';

interface PackageDetails {
  key: string;
  people: string;
  total: string;
  price: string;
  groupSize: number;
}

const PackageConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const packageDetails = location.state?.packageDetails as PackageDetails;

  if (!packageDetails) {
    navigate('/booking');
    return null;
  }

  const { groupSize, price, total, people } = packageDetails;
  const totalBullets = groupSize * 30;
  const freePersonDiscount = groupSize >= 10 ? 700 : 0; // ₱700 per person entrance fee
  const basePrice = parseInt(price.replace('₱', '').replace(',', ''));
  const finalTotal = basePrice;

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
            Package Confirmation
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Package Selected!</h2>
          <p className="text-muted-foreground">Review your paintball package details</p>
        </div>

        <div className="grid gap-6">
          {/* Package Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                {total}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">{people}</span>
                <Badge variant="outline" className="text-primary border-primary">
                  Group Package
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary">{price}</div>
            </CardContent>
          </Card>

          {/* Equipment Included */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Equipment Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span>Paintball Gun</span>
                  <span className="font-semibold">{groupSize}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Air Tank</span>
                  <span className="font-semibold">{groupSize}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Vest</span>
                  <span className="font-semibold">{groupSize}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Mask</span>
                  <span className="font-semibold">{groupSize}x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bullets & Extras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Bullets & Extras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Field Play Duration</span>
                  <span className="font-semibold text-lg">2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Bullets Included</span>
                  <span className="font-semibold text-lg">{totalBullets} bullets</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ({groupSize} players × 30 bullets each)
                </div>
                {freePersonDiscount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-800 font-medium">1 Person Free Discount</span>
                    <span className="font-bold text-green-600">-₱{freePersonDiscount}</span>
                  </div>
                )}
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
                  <span>Package Price</span>
                  <span>{price}</span>
                </div>
                {freePersonDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (1 Person Free)</span>
                    <span>-₱{freePersonDiscount}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₱{finalTotal.toLocaleString()}</span>
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
              Change Package
            </Button>
            <Button
              onClick={() => {
                navigate('/booking', { 
                  state: { 
                    step: 2,
                    service: 'group',
                    serviceDetails: {
                      ...packageDetails,
                      finalTotal: finalTotal,
                      calculatedPrice: `₱${finalTotal.toLocaleString()}`
                    },
                    groupSize: packageDetails.groupSize
                  } 
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              size="lg"
              className="min-w-48"
            >
              Continue to Date & Time
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageConfirmation;