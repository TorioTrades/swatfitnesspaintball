import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Navigation } from 'lucide-react';
const Locations = () => {
  const featuredLocations = [{
    name: "London Combat Zone",
    region: "London",
    games: "12 Scenarios",
    distance: "15 min from city center"
  }, {
    name: "Manchester Tactical",
    region: "Manchester",
    games: "8 Scenarios",
    distance: "20 min from city center"
  }, {
    name: "Birmingham Battlefield",
    region: "Birmingham",
    games: "10 Scenarios",
    distance: "18 min from city center"
  }, {
    name: "Leeds Forest Arena",
    region: "Leeds",
    games: "15 Scenarios",
    distance: "25 min from city center"
  }, {
    name: "Glasgow Warriors",
    region: "Glasgow",
    games: "9 Scenarios",
    distance: "30 min from city center"
  }, {
    name: "Cardiff Combat Park",
    region: "Cardiff",
    games: "11 Scenarios",
    distance: "22 min from city center"
  }];
  return <section id="locations" className="py-10 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            FIRST <span className="text-accent">MAGFED</span> PAINTBALL <span className="text-accent">FIELD</span> IN LUZON
          </h2>
          
          
          {/* Location Finder */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              
              
            </div>
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full mt-4 animate-pulse hover:animate-none"
              style={{
                animation: 'pulse-scale 1.2s ease-in-out infinite'
              }}
              onClick={() => window.open('https://maps.app.goo.gl/bunwf2DQv34UdQyWA', '_blank')}
            >
              <Navigation className="w-5 h-5 mr-2" />
              Get Direction
            </Button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-gradient-tactical rounded-lg p-4 text-center max-w-6xl mx-auto">
          <div className="bg-primary/10 rounded-lg p-4 border-2 border-dashed border-primary/30 relative">
            <img src="https://i.imgur.com/SBGmjOB.png" alt="SWAT Fitness Paintball Location Map" className="w-full h-auto object-contain rounded-lg hidden md:block" />
            <img src="https://i.imgur.com/RVFiKEt.png" alt="SWAT Fitness Paintball Location Map Mobile" className="w-full h-auto object-contain rounded-lg block md:hidden" />
            <div className="absolute inset-0 flex items-center justify-center">
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Locations;