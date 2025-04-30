
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { userToVerify, verifyAndLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Countdown timer for resend code
  useEffect(() => {
    if (!timeLeft) return;
    
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Redirect if no user to verify
  useEffect(() => {
    if (!userToVerify) {
      navigate('/');
    }
  }, [userToVerify, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await verifyAndLogin(verificationCode);
      
      if (success) {
        toast({
          title: "Success",
          description: "Email verified successfully",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // In a real app, this would trigger an API call to resend the code
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your email",
    });
    setTimeLeft(60);
  };

  if (!userToVerify) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen w-full gradient-bg flex flex-col items-center justify-center p-4">
      <div className="auth-card w-full max-w-md p-8 animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
          
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-brand-100 p-3">
                <Mail className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-brand-900">Verify your email</h1>
            <p className="text-muted-foreground mt-2">
              We've sent a verification code to<br />
              <span className="font-medium text-foreground">{userToVerify.email}</span>
            </p>
          </div>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Enter verification code
            </label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground text-center">
              For this demo, enter <span className="font-semibold">123456</span>
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600"
            disabled={isLoading}
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Verify Email
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            {timeLeft > 0 ? (
              <span>Resend in {timeLeft}s</span>
            ) : (
              <button
                onClick={handleResendCode}
                className="text-brand-500 hover:text-brand-700 font-medium"
                type="button"
              >
                Resend code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
