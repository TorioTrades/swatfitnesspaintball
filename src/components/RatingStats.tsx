import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface RatingData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

const RatingStats = () => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('is_approved', true);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const totalReviews = data.length;
          const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
          
          const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          data.forEach(review => {
            ratingDistribution[review.rating]++;
          });

          setRatingData({
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingDistribution
          });
        } else {
          setRatingData({
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          });
        }
      } catch (error) {
        console.error('Error fetching rating stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingStats();
  }, []);

  if (loading) {
    return (
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ratingData.totalReviews === 0) {
    return null;
  }

  const getBarWidth = (count: number) => {
    return ratingData.totalReviews > 0 ? (count / ratingData.totalReviews) * 100 : 0;
  };

  return (
    <Card className="border border-border bg-gradient-subtle">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-display font-bold text-3xl text-foreground mr-2">
                {ratingData.averageRating}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(ratingData.averageRating)
                        ? 'text-accent fill-current'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm font-military text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{ratingData.totalReviews} reviews</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Excellent rating</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">
              Rating Distribution
            </h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="font-military text-xs text-muted-foreground">
                    {rating}
                  </span>
                  <Star className="w-3 h-3 text-accent fill-current" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${getBarWidth(ratingData.ratingDistribution[rating])}%` }}
                  />
                </div>
                <span className="font-military text-xs text-muted-foreground w-8 text-right">
                  {ratingData.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingStats;