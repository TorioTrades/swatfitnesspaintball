import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReviewForm from './ReviewForm';
import AllReviews from './AllReviews';
import RatingStats from './RatingStats';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  const testimonialsImages = [
    'https://i.imgur.com/47xf6ut.png',
    'https://i.imgur.com/PdTYQj2.jpeg',
    'https://i.imgur.com/2LHM4Kl.jpeg'
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Reviews functionality not implemented yet
        setReviews([]);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            WHAT OUR <span className="text-accent">CUSTOMERS</span> SAY
          </h2>
          <p className="font-military text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - see what our customers say about their paintball adventures
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonials Side */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-card rounded-lg p-8 border border-border">
                  <h3 className="font-display font-bold text-xl mb-2">No Reviews Yet</h3>
                  <p className="font-military text-muted-foreground mb-4">
                    Be the first to share your paintball experience!
                  </p>
                  <ReviewForm />
                </div>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-lg p-6 shadow-tactical hover:shadow-elevated transition-all duration-300 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-display font-bold text-lg text-card-foreground">
                        {review.customer_name}
                      </h4>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/20" />
                    <p className="font-military text-muted-foreground leading-relaxed pl-6">
                      {review.review_text}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Action Buttons - Only show if there are reviews */}
            {reviews.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ReviewForm />
                <AllReviews />
              </div>
            )}

            {/* No Ratings Yet Card - Show below reviews when no reviews exist */}
            {reviews.length === 0 && (
              <div className="bg-card rounded-lg p-6 border border-border text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">No Ratings Yet</h3>
                <p className="font-military text-muted-foreground text-sm">
                  Be the first to rate our paintball experience!
                </p>
              </div>
            )}

            {/* Rating Stats */}
            <RatingStats />
          </div>

          {/* Image & Stats Side */}
          <div className="space-y-8">
            {/* Hero Image Carousel */}
            <Carousel 
              setApi={setApi} 
              className="relative overflow-hidden rounded-lg shadow-elevated"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {testimonialsImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <img 
                      src={image} 
                      alt={`Paintball action ${index + 1}`} 
                      className="w-full h-80 object-cover" 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display font-bold text-xl mb-2">Victory Celebrations</h3>
                <p className="font-military text-white/90">Every game ends with memorable moments</p>
              </div>
            </Carousel>

            {/* Facebook Highlight */}
            <a 
              href="https://www.facebook.com/profile.php?id=61576594207597" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-[#1877F2] hover:bg-[#166FE5] rounded-lg p-6 text-center transition-colors duration-200"
            >
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Follow Us on Facebook
              </h3>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-military text-white text-lg">Visit Our Facebook Page</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;