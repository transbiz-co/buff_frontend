"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import SuccessModal from "@/components/SuccessModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ForgotPasswordModal({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void 
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  // Animation control
  useEffect(() => {
    if (open) {
      // Delay content animation for smooth transition
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      // Reset state when modal closes
      setEmail("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccessModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to send. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    onClose(); // Close main modal
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          {/* Background overlay with fade effect */}
          <div 
            className="fixed inset-0 bg-black transition-opacity duration-300" 
            style={{ opacity: animateIn ? 0.5 : 0 }}
            onClick={onClose}
          />

          {/* Modal body with slide-in effect */}
          <div 
            className="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300"
            style={{ 
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
              width: 'max-content',
              maxWidth: '450px'
            }}
          >
            <div className="px-6 py-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Forgot Password</h3>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-150 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className={`transition-all duration-300 ${
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '100ms' }}>
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="name@example.com"
                      required
                      autoFocus
                      className={`w-full transition-all duration-200 ${
                        error ? 'border-red-300 ring ring-red-200' : 'focus:border-primary/80 focus:ring-2 focus:ring-primary/20'
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
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                      className="transition-all duration-150"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 transition-all duration-150 hover:shadow-md" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </div>
                      ) : "Send Reset Link"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessModalClose}
        title="Check Your Email"
        message="We've sent a password reset link to your email. Please follow the instructions to reset your password."
        buttonText="確認"
        onButtonClick={handleSuccessModalClose}
      />

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </>
  );
} 