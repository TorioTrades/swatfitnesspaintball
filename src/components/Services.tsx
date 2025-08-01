import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Building, PartyPopper, Heart, ChevronDown, ChevronUp, Baby, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Services = () => {
  const navigate = useNavigate();
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleServicePricing = (index: number) => {
    setExpandedServices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, index]));
          }
        },
        {
          threshold: 0.1,
          rootMargin: '-50px 0px'
        }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);
  const services = [{
    icon: PartyPopper,
    title: "Team Building",
    description: "Build stronger teams through tactical paintball challenges.",
    color: "text-accent"
  }, {
    icon: Building,
    title: "Birthday Party",
    description: "Celebrate with exciting paintball adventures.",
    color: "text-primary"
  }, {
    icon: Heart,
    title: "Reunions",
    description: "Bring friends and family together for paintball fun.",
    color: "text-accent-glow"
  }, {
    icon: Baby,
    title: "Gender Reveal",
    description: "Make your big announcement with colorful paintball.",
    color: "text-primary"
  }, {
    icon: Camera,
    title: "Prenup Photography",
    description: "Capture adventurous moments for your love story.",
    color: "text-accent"
  }, {
    icon: Heart,
    title: "Marriage Proposal",
    description: "Pop the question in the most thrilling way.",
    color: "text-accent-glow"
  }];
  return <section id="events" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            PAINTBALL <span className="text-accent">EXPERIENCES</span>
          </h2>
          <p className="font-military text-xl text-muted-foreground max-w-2xl mx-auto">
            Whatever the occasion, we deliver adrenaline-packed adventures tailored to your group
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
          const IconComponent = service.icon;
            return <div 
              key={index} 
              ref={el => cardRefs.current[index] = el}
              className={`group bg-card rounded-lg p-6 shadow-tactical hover:shadow-elevated transition-all duration-700 transform hover:scale-105 border border-border flex flex-col lg:h-full ${
                visibleCards.has(index) 
                  ? 'opacity-100 translate-y-0 animate-fade-in' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
                
                
                <h3 className="font-display font-bold text-xl text-card-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="font-military text-muted-foreground mb-4 leading-relaxed text-sm md:text-base flex-grow">
                  {service.description}
                </p>
                
                <div className="mb-4">
                  <button 
                    onClick={() => toggleServicePricing(index)}
                    className="flex flex-col items-center w-full text-center font-military text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>PRICING</span>
                    <div className="mt-1">
                      {expandedServices[index] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  
                  {expandedServices[index] && (
                    <div className="mt-4 space-y-3 bg-muted/30 rounded-lg p-4">
                      <div className="text-center">
                        <span className="font-military font-semibold text-foreground">Maximum 20 PAX</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-military text-sm text-muted-foreground">Morning (8AM - 12NN)</span>
                          <span className="font-military font-semibold text-accent">₱18,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-military text-sm text-muted-foreground">Afternoon (1PM - 5PM)</span>
                          <span className="font-military font-semibold text-accent">₱20,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-military text-sm text-muted-foreground">Additional PAX</span>
                          <span className="font-military font-semibold text-primary">₱500.00</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-2 space-y-1">
                        <div className="flex items-center text-xs font-military text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                          <span>1,200 pcs. free bullets included</span>
                        </div>
                        <div className="flex items-center text-xs font-military text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                          <span>Free air tank refill</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button variant="tactical" size="sm" className="w-full mt-auto" onClick={() => {
                  navigate('/booking');
                  // Scroll to top after navigation completes
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 300);
                }}>
                  Book Now
                </Button>
              </div>;
        })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-tactical rounded-lg p-8 text-center">
          <h3 className="font-display font-bold text-2xl text-primary-foreground mb-4">
            Ready to Plan Your Perfect Event?
          </h3>
          <p className="font-military text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Our expert team will help you design the ultimate paintball experience for your group
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => {
              navigate('/booking');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 300);
            }}>
              Book Your Session
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="tel:09151933965">Call 09151933965</a>
            </Button>
          </div>
        </div>
      </div>

    </section>;
};
export default Services;