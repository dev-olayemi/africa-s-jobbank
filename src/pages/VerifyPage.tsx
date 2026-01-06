import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const VerifyPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleVerify = (code: string) => {
    // Would verify code with backend
    console.log("Verifying:", code);
    navigate("/dashboard");
  };

  const handleResend = () => {
    setIsResending(true);
    // Would resend OTP
    setTimeout(() => {
      setIsResending(false);
      setCountdown(60);
    }, 1000);
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
            <span className="font-medium text-foreground">+234 800 XXX XXXX</span>
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
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold input input-bordered focus:border-primary focus:ring-2 focus:ring-primary/50"
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.some((digit) => !digit)}
            className="btn btn-primary w-full mb-4"
          >
            Verify & Continue
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
