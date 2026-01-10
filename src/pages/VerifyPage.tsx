import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { user, verifyEmail, resendVerification, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign up first");
      navigate("/signup");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newOtp.every((digit) => digit) && newOtp.length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyEmail(code);
      toast.success("Email verified successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Verification error:", error);
      // Error is already handled in auth context
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendVerification();
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 md:p-6 flex items-center justify-between border-b border-border">
        <Link to="/">
          <Logo size="md" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign up
          </Link>

          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Verify your phone
          </h1>
          <p className="text-muted-foreground mb-8">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {user?.email || "your email"}
            </span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 md:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground transition-all"
                style={{
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  borderColor: 'hsl(var(--border))'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.some((digit) => !digit) || isVerifying}
            className="btn btn-primary w-full mb-4"
          >
            {isVerifying ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>

          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                {isResending ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : null}
                Resend code
              </button>
            )}
          </p>
        </div>
      </main>
    </div>
  );
};

export default VerifyPage;
