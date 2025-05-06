"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SuccessModal from "@/components/SuccessModal";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordForm() {
  const { user, loading, isPasswordRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localRecovery, setLocalRecovery] = useState(false);
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
        setLocalRecovery(true);
        // 保持在此頁面，讓用戶完成密碼重設
      } else {
        // 檢查 supabase 內部狀態是否為 recovery
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          // 如果沒有 session 且不是明確的 recovery 流程，也沒有 isPasswordRecovery 狀態，可能是直接訪問此頁面，重定向到登入頁
          if (!data.session && !type && !token && !isPasswordRecovery) {
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

    if (!loading) {
      handlePasswordRecovery();
    }

    // Add entrance animation
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [searchParams, router, loading, isPasswordRecovery]);

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
      
      toast.success("Password has been reset successfully!");
      setShowSuccessModal(true);
      
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    // 完成後登出用戶，確保他們需要用新密碼登入
    supabase.auth.signOut().then(() => {
      router.push("/sign-in");
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new password for your account</p>
      </div>

      <div className={`space-y-6 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
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
              className="w-full"
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
              className="w-full"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Password Updated Successfully"
          message="Your password has been reset successfully. You will need to sign in again with your new password."
          buttonText="Go to Sign In"
          onButtonClick={handleSuccessConfirm}
        />
      </div>

      <div className="mt-6 text-center text-sm">
        Remember your password?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      </div>
    </div>
  );
} 