import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock, Users, Bookmark, BookmarkCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await api.getJobs({ limit: 20 });
      if (response.success && response.data) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.getSavedJobs();
      if (response.success && response.data) {
        const saved = new Set<string>(response.data.jobs.map((job: any) => job._id));
        setSavedJobs(saved);
      }
    } catch (error) {
      // Silently fail - user might not have any saved jobs
    }
  };

  const handleSaveJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (savedJobs.has(jobId)) {
        await api.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success("Job removed from saved");
      } else {
        await api.saveJob(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
        toast.success("Job saved successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = now.getTime() - posted.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find Jobs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover opportunities across Africa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            <button className="btn btn-primary gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="text-muted-foreground mt-4">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs available yet</h3>
            <p className="text-muted-foreground">
              Check back soon for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-card rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Job Image - Hidden on mobile for cleaner look */}
                  {job.media && job.media.length > 0 ? (
                    <div className="hidden sm:block sm:w-40 md:w-48 sm:h-40 md:h-48 flex-shrink-0">
                      <img 
                        src={job.media[0].url} 
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : job.companyLogo ? (
                    <div className="hidden sm:flex sm:w-40 md:w-48 sm:h-40 md:h-48 flex-shrink-0 bg-muted items-center justify-center">
                      <img 
                        src={job.companyLogo} 
                        alt={job.companyName}
                        className="w-24 md:w-32 h-24 md:h-32 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="hidden sm:flex sm:w-40 md:w-48 sm:h-40 md:h-48 flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center">
                      <div className="text-4xl md:text-6xl font-bold text-primary/40">
                        {job.companyName?.[0] || 'J'}
                      </div>
                    </div>
                  )}

                  {/* Job Content */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate">{job.title}</h3>
                        <p className="text-muted-foreground text-sm sm:text-base">{job.companyName}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={(e) => handleSaveJob(job._id, e)}
                          className={`btn btn-sm ${savedJobs.has(job._id) ? 'btn-primary' : 'btn-ghost'} btn-square`}
                          title={savedJobs.has(job._id) ? "Saved" : "Save job"}
                        >
                          {savedJobs.has(job._id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/jobs/${job._id}`);
                          }}
                          className="btn btn-primary btn-sm flex-1 sm:flex-none"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {job.location?.city}, {job.location?.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                        {job.type}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {job.salary.currency} {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatTimeAgo(job.createdAt)}
                      </div>
                      {job.applications > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          {job.applications} applicant{job.applications !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobsPage;