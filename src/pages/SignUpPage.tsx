import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle2,
  Shield,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

type UserRole = "seeker" | "agent" | "business" | "company";

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: typeof User;
  features: string[];
  verification: string;
}

const roles: RoleOption[] = [
  {
    id: "seeker",
    title: "Job Seeker",
    description: "Find verified job opportunities across Africa",
    icon: User,
    features: ["Browse unlimited jobs", "3-day free trial", "Job alerts", "Apply with one click"],
    verification: "Face photo + CV upload required",
  },
  {
    id: "agent",
    title: "Agent / Recruiter",
    description: "Connect talent with opportunities",
    icon: Users,
    features: ["Post jobs for clients", "Access talent pool", "Commission tracking", "Verified badge"],
    verification: "ID verification required",
  },
  {
    id: "business",
    title: "Business / SME",
    description: "Hire staff for your shop, restaurant, or business",
    icon: Building2,
    features: ["Post jobs directly", "View applicants", "Quick hiring", "Local talent access"],
    verification: "Business ID upload required",
  },
  {
    id: "company",
    title: "Company",
    description: "Enterprise hiring with full verification",
    icon: Briefcase,
    features: ["Unlimited job posts", "Applicant tracking", "Company profile", "Premium support"],
    verification: "CAC verification required",
  },
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cvFile: null as File | null,
    photoFile: null as File | null,
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cv" | "photo") => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        [type === "cv" ? "cvFile" : "photoFile"]: file,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would normally submit to backend
    navigate("/verify");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Already have an account? <span className="text-primary">Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-sm text-muted-foreground">
              Step {step} of 3:{" "}
              {step === 1 ? "Choose your role" : step === 2 ? "Create account" : "Verify identity"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  How will you use JobFolio?
                </h1>
                <p className="text-muted-foreground">
                  Select your role to personalize your experience
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-6 bg-card rounded-xl border-2 text-left transition-all duration-200 hover:border-primary hover:shadow-lg group ${
                      selectedRole === role.id ? "border-primary shadow-lg" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{role.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {role.description}
                        </p>
                        <ul className="space-y-1">
                          {role.features.slice(0, 2).map((feature, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {role.verification}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <div className="animate-fade-in max-w-lg mx-auto">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to role selection
              </button>

              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Create your account
                </h1>
                <p className="text-muted-foreground">
                  {selectedRole === "seeker"
                    ? "Start your job search journey"
                    : selectedRole === "agent"
                    ? "Connect talent with opportunities"
                    : selectedRole === "business"
                    ? "Find the right staff for your business"
                    : "Build your dream team"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Confirm</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Job Seeker specific fields */}
                {selectedRole === "seeker" && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium">Required Documents</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Photo Upload */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Face Photo</span>
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                          {formData.photoFile ? (
                            <div className="text-center">
                              <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                              <span className="text-xs text-muted-foreground">Photo uploaded</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <span className="text-xs text-muted-foreground">Upload photo</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "photo")}
                          />
                        </label>
                      </div>

                      {/* CV Upload */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">CV / Resume</span>
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                          {formData.cvFile ? (
                            <div className="text-center">
                              <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                              <span className="text-xs text-muted-foreground">CV uploaded</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <span className="text-xs text-muted-foreground">Upload CV</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "cv")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" className="btn btn-primary w-full gap-2">
                    Continue to Verification
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
