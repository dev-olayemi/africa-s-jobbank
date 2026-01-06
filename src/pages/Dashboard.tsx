import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Users,
  Bell,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";
import { JobCard, SocialPostCard } from "@/components/FeedCards";
import VerificationBadge from "@/components/VerificationBadge";

const mockJobs = [
  {
    id: 1,
    title: "Sales Associate",
    company: "Shoprite Nigeria",
    location: "Lagos",
    type: "Full-time",
    salary: "₦80,000 - ₦120,000",
    posted: "2h ago",
    verified: true,
    logo: "🛒",
    description: "Join our dynamic retail team and help customers find what they need.",
    tags: ["retail", "sales", "customer-service"],
    applicants: 45,
  },
  {
    id: 2,
    title: "Hotel Receptionist",
    company: "Transcorp Hilton",
    location: "Abuja",
    type: "Full-time",
    salary: "₦100,000 - ₦150,000",
    posted: "4h ago",
    verified: true,
    logo: "🏨",
    tags: ["hospitality", "front-desk"],
    applicants: 32,
  },
  {
    id: 3,
    title: "Delivery Rider",
    company: "Jumia Foods",
    location: "Lagos",
    type: "Contract",
    salary: "₦60,000 - ₦90,000",
    posted: "1d ago",
    verified: true,
    logo: "🚴",
    tags: ["logistics", "delivery"],
    applicants: 78,
  },
];

const mockPosts = [
  {
    id: 1,
    author: {
      name: "Chidi Okoro",
      role: "HR Manager at GTBank",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content: "We're hiring! 🎉 Looking for fresh graduates to join our customer service team. No experience needed - just passion and willingness to learn. DM me or apply through JobFolio!",
    likes: 234,
    comments: 45,
    shares: 12,
    posted: "3h ago",
    hashtags: ["hiring", "banking", "freshgraduate"],
  },
  {
    id: 2,
    author: {
      name: "Amara Eze",
      role: "Career Coach",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content: "5 things I wish I knew before my first job interview:\n\n1. Research the company (not just the role)\n2. Prepare 3 questions to ask THEM\n3. Arrive 15 mins early\n4. Bring extra copies of your CV\n5. Follow up with a thank you email\n\nWhat would you add? 👇",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    likes: 567,
    comments: 89,
    shares: 45,
    posted: "5h ago",
    hashtags: ["careertips", "interviewtips", "jobseekers"],
  },
];

const quickStats = [
  { label: "Jobs Applied", value: "12", icon: Briefcase, trend: "+3 this week" },
  { label: "Profile Views", value: "89", icon: TrendingUp, trend: "+15%" },
  { label: "Connections", value: "234", icon: Users, trend: "+8 new" },
  { label: "Job Alerts", value: "5", icon: Bell, trend: "3 new matches" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"all" | "jobs" | "social">("all");

  const feed = activeTab === "all" 
    ? [...mockJobs.slice(0, 2), ...mockPosts.slice(0, 1), ...mockJobs.slice(2), ...mockPosts.slice(1)]
    : activeTab === "jobs" 
    ? mockJobs 
    : mockPosts;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="h-20 bg-gradient-to-r from-primary to-teal-light"></div>
              <div className="px-4 pb-4">
                <div className="-mt-10 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-card object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">John Doe</h3>
                  <VerificationBadge type="verified" size="sm" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Seeking retail & hospitality roles in Lagos
                </p>
                <Link to="/profile" className="btn btn-outline btn-sm w-full">
                  View Profile
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-border">
                {quickStats.slice(0, 3).map((stat, i) => (
                  <Link
                    key={i}
                    to="#"
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="font-semibold text-primary">{stat.value}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-card rounded-xl border border-border p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Job Alerts
                </h4>
                <Link to="/alerts" className="text-xs text-primary hover:underline">
                  Manage
                </Link>
              </div>
              <div className="space-y-2">
                {["Retail", "Hospitality", "Customer Service"].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{cat}</span>
                    <span className="badge badge-primary badge-sm">
                      {Math.floor(Math.random() * 20 + 5)} new
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Quick Stats Mobile */}
            <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
              {quickStats.slice(0, 4).map((stat, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-4">
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Feed Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
              {(["all", "jobs", "social"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn btn-sm ${
                    activeTab === tab ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {tab === "all" ? "For You" : tab === "jobs" ? "Jobs" : "Updates"}
                </button>
              ))}
              <button className="btn btn-ghost btn-sm gap-1 ml-auto">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>

            {/* Create Post Prompt */}
            <div className="bg-card rounded-xl border border-border p-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link
                  to="/create"
                  className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Share an update or job opportunity...
                </Link>
              </div>
            </div>

            {/* Feed Items */}
            <div className="space-y-4">
              {feed.map((item, index) => {
                if ('title' in item) {
                  return <JobCard key={`job-${item.id}`} job={item} variant="full" />;
                }
                return <SocialPostCard key={`post-${item.id}`} post={item} />;
              })}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <button className="btn btn-outline btn-primary">
                Load More
              </button>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">AI Job Match</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your profile, we found 8 jobs with 90%+ match rate
              </p>
              <Link to="/jobs?ai=true" className="btn btn-primary btn-sm w-full">
                View Matches
              </Link>
            </div>

            {/* Trending Jobs */}
            <div className="bg-card rounded-xl border border-border p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Trending Jobs</h4>
                <Link to="/jobs" className="text-xs text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Store Manager", count: "234 openings" },
                  { title: "Waiter/Waitress", count: "189 openings" },
                  { title: "Security Guard", count: "156 openings" },
                  { title: "Cashier", count: "143 openings" },
                ].map((job, i) => (
                  <Link
                    key={i}
                    to={`/jobs?q=${job.title}`}
                    className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                  >
                    <span>{job.title}</span>
                    <span className="text-xs text-muted-foreground">{job.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">People to Follow</h4>
                <Link to="/network" className="text-xs text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "HR at Dangote",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
                  },
                  {
                    name: "Mike Adebayo",
                    role: "Recruiter at MTN",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
                  },
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                    </div>
                    <button className="btn btn-outline btn-xs">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
