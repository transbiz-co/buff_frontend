"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 檢查是否為密碼重設流程
  useEffect(() => {
    const handlePasswordRecovery = async () => {
      // 檢查 URL 是否包含 type=recovery 參數或 access_token，這是 Supabase 重設密碼郵件的標誌
      const type = searchParams.get('type');
      const token = searchParams.get('access_token');
      
      if (type === 'recovery' || token) {
        console.log('ResetPasswordForm: Password recovery flow detected via URL params');
        setIsRecoveryFlow(true);
        // 保持在此頁面，讓用戶完成密碼重設
      } else {
        // 檢查 supabase 內部狀態是否為 recovery
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          // 如果沒有 session 且不是明確的 recovery 流程，可能是直接訪問此頁面，重定向到登入頁
          if (!data.session && !type && !token) {
            console.log('ResetPasswordForm: No recovery parameters and not authenticated, redirecting to sign-in');
            router.replace('/sign-in');
          } else if (data.session) {
            // 檢查是否有 Supabase 內部設置的 recovery 狀態
            const lastAuthEvent = localStorage.getItem('supabase.auth.event');
            if (lastAuthEvent && lastAuthEvent.includes('PASSWORD_RECOVERY')) {
              console.log('ResetPasswordForm: Recovery flow detected via Supabase auth event');
              setIsRecoveryFlow(true);
            }
          }
        } catch (err) {
          console.error('Error checking session:', err);
        }
      }
    };

    handlePasswordRecovery();

    // Add entrance animation
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Password has been reset successfully!");
      
      // 成功後先顯示成功訊息，然後才跳轉
      // 避免用戶被立即重定向走
      setTimeout(() => {
        // 完成後登出用戶，確保他們需要用新密碼登入
        supabase.auth.signOut().then(() => {
          router.push("/sign-in");
        });
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below
        </p>
      </div>

      {success ? (
        <div className={`text-center space-y-4 transition-all duration-300 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-xl font-medium">Password Reset Successful!</h2>
          <p className="text-muted-foreground">
            Your password has been reset. You will be redirected to the sign-in page shortly.
          </p>
          <Button 
            onClick={() => router.push("/sign-in")} 
            className="mt-4"
          >
            Go to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              required
              className={`w-full transition-all duration-200 ${
                error && password.length < 6 ? 'border-red-300 ring ring-red-200' : 'focus:border-primary/80 focus:ring-2 focus:ring-primary/20'
              }`}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              required
              className={`w-full transition-all duration-200 ${
                error && password !== confirmPassword ? 'border-red-300 ring ring-red-200' : 'focus:border-primary/80 focus:ring-2 focus:ring-primary/20'
              }`}
            />
          </div>
          
          {error && (
            <div 
              className="text-red-500 text-sm transition-all duration-300"
              style={{ animation: 'shake 0.5s ease-in-out' }}
            >
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </div>
            ) : "Reset Password"}
          </Button>
        </form>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
} 