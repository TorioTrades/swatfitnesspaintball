import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    setIsLoading(true);
    
    // Get stored password or use default
    const storedPassword = localStorage.getItem('admin_password') || 'ADMIN123';
    
    if (password === storedPassword) {
      localStorage.setItem('admin_session', 'true');
      onLogin();
      toast({
        title: "Success",
        description: "Welcome to the admin dashboard!"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
    setPassword('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <p className="text-muted-foreground">Enter password to access the dashboard</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={!password.trim() || isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;