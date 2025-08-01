import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const AllReviews = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const reviewsPerPage = 6;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Reviews functionality not implemented yet
      setReviews([]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-military">
          View All Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Customer Reviews</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {currentReviews.map((review) => (
                <Card key={review.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-display font-semibold text-sm">
                          {review.customer_name}
                        </h4>
                        <p className="font-military text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-accent fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 w-4 h-4 text-accent/20" />
                      <p className="font-military text-sm text-muted-foreground leading-relaxed pl-3">
                        {review.review_text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {reviews.length > reviewsPerPage && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground font-military">
              Showing {currentPage * reviewsPerPage + 1} to {Math.min((currentPage + 1) * reviewsPerPage, reviews.length)} of {reviews.length} reviews
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AllReviews;