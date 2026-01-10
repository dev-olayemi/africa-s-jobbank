import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Users,
  Bell,
  Filter,
  Sparkles,
  Loader2,
  User,
} from "lucide-react";
import Layout from "@/components/Layout";
import { JobCard } from "@/components/FeedCards";
import PostCard from "@/components/PostCard";
import VerificationBadge from "@/components/VerificationBadge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "jobs" | "social">("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    jobsApplied: 0,
    profileViews: 0,
    connections: 0,
    jobAlerts: 0,
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch jobs
        const jobsResponse = await api.getJobs({ limit: 10 });
        if (jobsResponse.success && jobsResponse.data) {
          setJobs(jobsResponse.data.jobs || []);
        }

        // Fetch posts with smart feed
        const postsResponse = await api.getPosts({ limit: 10, type: 'feed' });
        if (postsResponse.success && postsResponse.data) {
          setPosts(postsResponse.data.posts || []);
        }

        // Fetch user stats (applications, connections, etc.)
        // This would come from your API endpoints
        setStats({
          jobsApplied: 0, // TODO: Fetch from applications API
          profileViews: 0, // TODO: Implement profile views tracking
          connections: user?.connections?.length || 0,
          jobAlerts: 0, // TODO: Implement job alerts
        });

      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const quickStats = [
    { label: "Jobs Applied", value: stats.jobsApplied.toString(), icon: Briefcase, trend: "Track applications" },
    { label: "Profile Views", value: stats.profileViews.toString(), icon: TrendingUp, trend: "Increase visibility" },
    { label: "Connections", value: stats.connections.toString(), icon: Users, trend: "Grow network" },
    { label: "Job Alerts", value: stats.jobAlerts.toString(), icon: Bell, trend: "Set preferences" },
  ];

  const feed = activeTab === "all" 
    ? [...jobs.slice(0, 3), ...posts.slice(0, 2), ...jobs.slice(3)]
    : activeTab === "jobs" 
    ? jobs 
    : posts;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                    src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d9488&color=fff&size=128`}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-card object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{user?.fullName || 'User'}</h3>
                  {user?.verification?.email && (
                    <VerificationBadge type="verified" size="sm" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {user?.role === 'seeker' && (user?.bio || 'Job Seeker')}
                  {user?.role === 'agent' && 'Recruitment Agent'}
                  {user?.role === 'business' && (user?.companyName || 'Business Owner')}
                  {user?.role === 'company' && (user?.companyName || 'Company')}
                </p>
                {user?.location?.city && user?.location?.state && (
                  <p className="text-xs text-muted-foreground mb-4">
                    📍 {user.location.city}, {user.location.state}
                  </p>
                )}
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

            {/* Job Alerts - Hide until implemented */}
            {false && (
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
                <p className="text-sm text-muted-foreground">
                  Set up job alerts to get notified about new opportunities
                </p>
              </div>
            )}
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
                  src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d9488&color=fff&size=128`}
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
              {feed.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'jobs' ? (
                      <Briefcase className="h-8 w-8 text-primary" />
                    ) : (
                      <Users className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {activeTab === 'jobs' ? 'No jobs yet' : 'No posts yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'jobs' 
                      ? 'Be the first to post a job opportunity!' 
                      : 'Start sharing updates and connect with others!'}
                  </p>
                  <Link 
                    to={activeTab === 'jobs' ? '/create/job' : '/create/post'} 
                    className="btn btn-primary"
                  >
                    {activeTab === 'jobs' ? 'Post a Job' : 'Create Post'}
                  </Link>
                </div>
              ) : (
                feed.map((item, index) => {
                  if ('title' in item) {
                    return <JobCard key={`job-${item._id || index}`} job={item} variant="full" />;
                  }
                  return (
                    <PostCard 
                      key={`post-${item._id || index}`} 
                      post={item}
                      onDelete={() => setPosts(posts.filter(p => p._id !== item._id))}
                      onUpdate={() => {
                        // Refresh posts
                        api.getPosts({ limit: 10, type: 'feed' }).then(res => {
                          if (res.success && res.data) {
                            setPosts(res.data.posts || []);
                          }
                        });
                      }}
                    />
                  );
                })
              )}
            </div>

            {/* Load More */}
            {feed.length > 0 && (
              <div className="text-center py-8">
                <button className="btn btn-outline btn-primary">
                  Load More
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            {/* AI Recommendations - Hide until implemented */}
            {false && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">AI Job Match</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your profile to get AI-powered job recommendations
                </p>
                <Link to="/profile" className="btn btn-primary btn-sm w-full">
                  Complete Profile
                </Link>
              </div>
            )}

            {/* Welcome Card */}
            <div className="bg-card rounded-xl border border-border p-4 mb-4">
              <h4 className="font-semibold mb-2">Welcome to JOBFOLIO! 👋</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Start exploring jobs and connecting with professionals across Africa
              </p>
              <Link to="/jobs" className="btn btn-primary btn-sm w-full">
                Browse Jobs
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span>Complete your profile</span>
                </Link>
                <Link 
                  to="/jobs" 
                  className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Browse all jobs</span>
                </Link>
                <Link 
                  to="/network" 
                  className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <span>Grow your network</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
