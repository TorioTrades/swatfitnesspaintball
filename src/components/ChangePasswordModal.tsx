import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Get stored password or use default
    const storedPassword = localStorage.getItem('admin_password') || 'ADMIN123';
    
    // Validate current password
    if (currentPassword !== storedPassword) {
      toast({
        title: "Error",
        description: "Current password is incorrect.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Save new password
    localStorage.setItem('admin_password', newPassword);
    
    toast({
      title: "Success",
      description: "Password changed successfully!"
    });
    
    // Reset form and close modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Admin Password</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;