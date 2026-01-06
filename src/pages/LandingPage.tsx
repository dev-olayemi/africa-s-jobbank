import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Users,
  Shield,
  TrendingUp,
  CheckCircle2,
  Star,
  ChevronRight,
  Play,
  MapPin,
  Clock,
  BadgeCheck,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import VerificationBadge from "@/components/VerificationBadge";
import heroImage from "@/assets/hero-image.jpg";

const stats = [
  { value: "50,000+", label: "Verified Jobs", icon: Briefcase },
  { value: "120,000+", label: "Job Seekers", icon: Users },
  { value: "5,000+", label: "Trusted Employers", icon: Shield },
  { value: "98%", label: "Trust Score", icon: Star },
];

const categories = [
  { name: "Retail & Sales", count: 2340, icon: "🛒", color: "from-orange to-orange-light" },
  { name: "Hospitality", count: 1890, icon: "🏨", color: "from-primary to-teal-light" },
  { name: "Logistics", count: 1560, icon: "🚚", color: "from-gold to-gold-light" },
  { name: "Customer Service", count: 1230, icon: "📞", color: "from-info to-sky-400" },
  { name: "Healthcare", count: 980, icon: "🏥", color: "from-success to-emerald-400" },
  { name: "Education", count: 870, icon: "📚", color: "from-purple-500 to-purple-400" },
];

const featuredJobs = [
  {
    id: 1,
    title: "Sales Associate",
    company: "Shoprite Nigeria",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: "₦80,000 - ₦120,000",
    posted: "2h ago",
    verified: true,
    logo: "🛒",
  },
  {
    id: 2,
    title: "Hotel Receptionist",
    company: "Transcorp Hilton",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: "₦100,000 - ₦150,000",
    posted: "4h ago",
    verified: true,
    logo: "🏨",
  },
  {
    id: 3,
    title: "Delivery Rider",
    company: "Jumia Foods",
    location: "Lagos, Nigeria",
    type: "Contract",
    salary: "₦60,000 - ₦90,000",
    posted: "1d ago",
    verified: true,
    logo: "🚴",
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Retail Manager",
    company: "Found via JobFolio",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    text: "I got my dream job within 2 weeks! The verification system gave me confidence that the jobs were real.",
  },
  {
    name: "Emmanuel Adeyemi",
    role: "Hotel Supervisor",
    company: "Hired through JobFolio",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "No more fake job postings! JobFolio's trust system is a game-changer for African job seekers.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
                Browse Jobs
              </Link>
              <Link to="/employers" className="text-sm font-medium hover:text-primary transition-colors">
                For Employers
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About Us
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden ankara-pattern dark:ankara-pattern-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Africa's Most Trusted Job Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Africa's{" "}
                <span className="gradient-text">JobBank</span>
                <br />
                Verified Jobs,{" "}
                <span className="text-accent">Real</span> Connections
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                No more fake listings. No more scams. Find verified job opportunities 
                from trusted employers across Africa. Your career journey starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="btn btn-primary btn-lg gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/jobs" className="btn btn-outline btn-lg gap-2">
                  <Play className="h-5 w-5" />
                  Browse Jobs
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 10}?w=50&h=50&fit=crop&crop=face`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`;
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">10,000+</span>
                  <span className="text-muted-foreground"> hired this month</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="African professionals finding jobs"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 animate-float">
                <div className="bg-card p-4 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Job Verified!</p>
                      <p className="text-xs text-muted-foreground">Trusted employer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 animate-float" style={{ animationDelay: "1s" }}>
                <div className="bg-card p-4 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">+234 New Jobs</p>
                      <p className="text-xs text-muted-foreground">Added today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Job Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From retail to healthcare, find opportunities that match your skills 
              and experience across Africa's fastest-growing sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${category.name}`}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">{category.count.toLocaleString()} jobs</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/jobs" className="btn btn-outline btn-primary gap-2">
              View All Categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Opportunities
              </h2>
              <p className="text-muted-foreground">
                Fresh, verified job listings added every hour
              </p>
            </div>
            <Link to="/jobs" className="btn btn-primary btn-sm gap-2 mt-4 md:mt-0">
              See All Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="job-card group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      {job.verified && <VerificationBadge type="verified" size="sm" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">{job.salary}</p>
                    <p className="text-xs text-muted-foreground">{job.type}</p>
                  </div>
                  <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold-dark dark:text-gold text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Built on Trust
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Africa Trusts JobFolio
              </h2>
              
              <p className="text-muted-foreground mb-8">
                We're not just another job board. We're building Africa's first 
                job information infrastructure — where every listing is verified, 
                every employer is vetted, and every opportunity is real.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Verified Employers", desc: "CAC & ID verification for all businesses" },
                  { title: "Anti-Scam Protection", desc: "AI-powered fraud detection system" },
                  { title: "Real Job Listings", desc: "Manual verification of all job posts" },
                  { title: "Community Reports", desc: "Flag suspicious activity instantly" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-card p-6 rounded-xl border border-border ${
                    index === 0 ? "col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-teal-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 ankara-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join over 120,000 African professionals who trust JobFolio for their 
            career growth. Start your 3-day free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-secondary btn-lg gap-2">
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/employers" className="btn btn-ghost btn-lg border-2 border-primary-foreground/30 hover:bg-primary-foreground/10">
              I'm an Employer
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Free to browse
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              3-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo size="lg" />
              <p className="text-sm text-muted-foreground mt-4">
                Africa's trusted job platform. Connecting talent with verified opportunities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
                <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
                <li><Link to="/alerts" className="hover:text-primary">Job Alerts</Link></li>
                <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/post-job" className="hover:text-primary">Post a Job</Link></li>
                <li><Link to="/talent" className="hover:text-primary">Find Talent</Link></li>
                <li><Link to="/verification" className="hover:text-primary">Verification</Link></li>
                <li><Link to="/enterprise" className="hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} JobFolio Africa. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary">Privacy</Link>
              <Link to="/terms" className="hover:text-primary">Terms</Link>
              <Link to="/help" className="hover:text-primary">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
