import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigation = [{
    name: 'Home',
    href: '#'
  }, {
    name: 'Locations',
    href: '#locations'
  }, {
    name: 'Events',
    href: '#events'
  }, {
    name: 'Booking',
    href: '#booking'
  }, {
    name: 'About',
    href: '#why-choose-us'
  }, {
    name: 'Contact',
    href: '#footer'
  }];

  const handleNavClick = (href: string) => {
    if (href === '#booking') {
      navigate('/booking');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else if (href === '#why-choose-us') {
      const element = document.querySelector('[data-section="why-choose-us"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '#footer') {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  return <header className="sticky top-0 z-50 bg-background/40 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://i.imgur.com/AFAnlxO.png" 
              alt="Paintball Adventure Logo" 
              className="h-10 rounded-lg object-contain cursor-pointer" 
              onDoubleClick={() => navigate('/admin')}
            />
            <div className="hidden sm:block">
              
              
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map(item => <button 
                key={item.name} 
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-accent font-military font-medium transition-colors duration-200 hover:scale-105 transform cursor-pointer"
              >
                {item.name}
              </button>)}
          </nav>

          {/* Contact & CTA */}
          <div className="flex items-center space-x-4">
            <Button variant="hero" size="default" className="hidden sm:inline-flex" onClick={() => navigate('/booking')}>
              Book Now
            </Button>
            
            {/* Mobile menu button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground hover:text-accent transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <div className="lg:hidden py-4 border-t border-border bg-card/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {navigation.map(item => <button 
                key={item.name} 
                onClick={() => {
                  handleNavClick(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-foreground hover:text-accent font-military font-medium transition-colors text-left"
              >
                {item.name}
              </button>)}
              <div className="flex items-center space-x-2 px-3 py-2 text-primary">
                <Phone size={16} />
                <span className="font-military font-semibold">09151933965</span>
              </div>
              <div className="px-3">
                <Button variant="hero" size="lg" className="w-full" onClick={() => {
                  navigate('/booking');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 300);
                }}>
                  Book Your Adventure
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;