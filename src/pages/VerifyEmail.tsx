
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { userToVerify, verifyAndLogin } = useAuth();
  const { toast: toastUI } = useToast();
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
      toastUI({
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
        toast.success("Email verified successfully");
        navigate('/dashboard');
      } else {
        toastUI({
          title: "Verification failed",
          description: "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toastUI({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userToVerify) return;
    
    setTimeLeft(60);
    toast.promise(
      import('../utils/emailService').then(module => {
        return module.emailService.sendVerificationEmail(
          userToVerify.email,
          "123456"
        );
      }),
      {
        loading: 'Sending new verification code...',
        success: 'A new verification code has been sent to your email',
        error: 'Failed to send verification code',
      }
    );
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
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md border border-muted mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  For this demo, enter <span className="font-semibold">123456</span> as your verification code.
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Check the browser console to see the verification email details.
                </p>
              </div>
            </div>
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
