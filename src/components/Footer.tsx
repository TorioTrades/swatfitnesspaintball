import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Settings, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminPanel from './AdminPanel';
const Footer = () => {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const isMobile = useIsMobile();
  const handleAdminClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount === 1) {
      setPasswordDialogOpen(true);
      setClickCount(0);
    } else {
      setTimeout(() => setClickCount(0), 1000);
    }
  };
  const handlePasswordSubmit = () => {
    if (password === 'ADMIN123') {
      setAdminPanelOpen(true);
      setPasswordDialogOpen(false);
      setPassword('');
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel."
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
      setPassword('');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };
  const quickLinks = [{
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
    href: '#about'
  }, {
    name: 'Contact',
    href: '#contact'
  }];
  const services = ['Stag & Hen Parties', 'Corporate Events', 'Birthday Parties', 'Team Building', 'Private Groups', 'Equipment Rental'];
  return <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img src="https://i.imgur.com/AFAnlxO.png" alt="Paintball Adventure Logo" className="h-8 sm:h-10 rounded-lg object-contain cursor-pointer" onClick={handleAdminClick} />
              <div>
                
                
              </div>
            </div>
            <p className="font-military text-sm sm:text-base text-secondary-foreground/90 leading-relaxed">
              Locked. Loaded. Ready for battle! 
              These warriors are geared up to defend their team and conquer the field at SWAT Fitness Paintball Angeles City.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-accent" asChild>
                <a href="https://www.facebook.com/profile.php?id=61576594207597" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-accent" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-accent" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            {isMobile ? (
              <Collapsible open={quickLinksOpen} onOpenChange={setQuickLinksOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="font-display font-bold text-base text-secondary-foreground">Quick Links</h4>
                  <ChevronDown className={`w-4 h-4 text-secondary-foreground transition-transform duration-200 ${quickLinksOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <ul className="space-y-1.5">
                    {quickLinks.map((link, index) => <li key={index}>
                        <a href={link.href} className="font-military text-sm text-secondary-foreground/80 hover:text-accent transition-colors duration-200">
                          {link.name}
                        </a>
                      </li>)}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                <h4 className="font-display font-bold text-base sm:text-lg text-secondary-foreground mb-3 sm:mb-4">Quick Links</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {quickLinks.map((link, index) => <li key={index}>
                      <a href={link.href} className="font-military text-sm sm:text-base text-secondary-foreground/80 hover:text-accent transition-colors duration-200">
                        {link.name}
                      </a>
                    </li>)}
                </ul>
              </>
            )}
          </div>

          {/* Services */}
          

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            {isMobile ? (
              <Collapsible open={contactOpen} onOpenChange={setContactOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="font-display font-bold text-base text-secondary-foreground">Contact Us</h4>
                  <ChevronDown className={`w-4 h-4 text-secondary-foreground transition-transform duration-200 ${contactOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-military text-sm text-secondary-foreground font-semibold">09151933965</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-military text-sm text-secondary-foreground/80 break-all">swatfitnessangeles@gmail.com</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span className="font-military text-sm text-secondary-foreground/80">
                        Arzab bldg. Poinsettia Ave.<br />Brgy. Pampang, Angeles City, Philippines
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span className="font-military text-sm text-secondary-foreground/80">
                        Monday-Sunday: 8AM-5PM
                      </span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                <h4 className="font-display font-bold text-base sm:text-lg text-secondary-foreground mb-3 sm:mb-4">Contact Us</h4>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <span className="font-military text-sm sm:text-base text-secondary-foreground font-semibold">09151933965</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <span className="font-military text-sm sm:text-base text-secondary-foreground/80 break-all">swatfitnessangeles@gmail.com</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="font-military text-sm sm:text-base text-secondary-foreground/80">
                      Arzab bldg. Poinsettia Ave.<br />Brgy. Pampang, Angeles City, Philippines
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="font-military text-sm sm:text-base text-secondary-foreground/80">
                      Monday-Sunday: 8AM-5PM
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <p className="font-military text-secondary-foreground/70 text-xs sm:text-sm">© 2025 SWAT Fitness Paintball. All rights reserved.</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm">
                <a href="#" className="font-military text-secondary-foreground/70 hover:text-accent transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="font-military text-secondary-foreground/70 hover:text-accent transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="font-military text-secondary-foreground/70 hover:text-accent transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin Access */}
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display">Admin Access</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="admin-password" className="font-military text-sm text-muted-foreground">
                        Enter admin password:
                      </label>
                      <Input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress} placeholder="Enter password" className="mt-2" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                      setPasswordDialogOpen(false);
                      setPassword('');
                    }}>
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordSubmit}>
                        Access
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="flex items-center space-x-2">
                <span className="font-military text-secondary-foreground/70 text-xs sm:text-sm">Powered by</span>
                <span className="font-display font-bold text-accent text-sm sm:text-base">TORIOWEB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AdminPanel isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </footer>;
};
export default Footer;