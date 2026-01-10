import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Users,
  Eye,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  UserPlus,
  Bell,
  FileText,
  Upload,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    isRemote: boolean;
  };
  type: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: {
    skills: string[];
    experience: {
      min: number;
      max: number;
    };
  };
  companyName: string;
  companyLogo?: string;
  media?: Array<{
    url: string;
    type: string;
  }>;
  postedBy: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
    verification?: {
      isVerified: boolean;
      isTrusted?: boolean;
    };
  };
  tags: string[];
  views: number;
  applications: number;
  createdAt: string;
  isVerified: boolean;
  isTrusted?: boolean;
}

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getJob(id!);
      if (response.success) {
        setJob(response.data.job);
      } else {
        toast.error("Job not found");
        navigate("/jobs");
      }
    } catch (error: any) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // Only job seekers can apply
    if (user?.role !== 'seeker') {
      toast.error("Only job seekers can apply for jobs");
      return;
    }

    // Check if user profile is complete
    if (!user?.cvUrl) {
      toast.error("Please upload your CV before applying");
      navigate("/profile/edit");
      return;
    }

    if (!user?.skills || user.skills.length === 0) {
      toast.error("Please complete your profile with skills before applying");
      navigate("/profile/edit");
      return;
    }

    if (!user?.location?.city || !user?.location?.state) {
      toast.error("Please add your location in profile before applying");
      navigate("/profile/edit");
      return;
    }

    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    try {
      setApplying(true);
      const response = await api.applyToJob(id!);
      if (response.success) {
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
        fetchJobDetails(); // Refresh to update application count
      } else {
        toast.error(response.message || "Failed to apply");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to apply to job");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await api.unsaveJob(id!);
        setIsSaved(false);
        toast.success("Job removed from saved");
      } else {
        await api.saveJob(id!);
        setIsSaved(true);
        toast.success("Job saved successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.unfollowUser(job!.postedBy._id);
        setIsFollowing(false);
        toast.success("Unfollowed successfully");
      } else {
        await api.followUser(job!.postedBy._id);
        setIsFollowing(true);
        toast.success("Following! You'll get updates on new jobs");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to follow");
    }
  };

  const handleConnect = async () => {
    try {
      if (isConnected) {
        await api.disconnectUser(job!.postedBy._id);
        setIsConnected(false);
        toast.success("Disconnected successfully");
      } else {
        await api.connectUser(job!.postedBy._id);
        setIsConnected(true);
        toast.success("Connection request sent!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied to clipboard!");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-error mb-4" />
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-base-content/70 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/jobs")} className="btn btn-primary">
            Browse Jobs
          </button>
        </div>
      </Layout>
    );
  }

  const formatSalary = () => {
    if (!job.salary) return "Salary not specified";
    const { min, max, currency } = job.salary;
    const symbol = currency === "NGN" ? "₦" : currency;
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}/month`;
  };

  const formatDate = (date: string) => {
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
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Job Header */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  {job.isVerified && (
                    <div className="tooltip" data-tip="Verified Job">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  {job.isTrusted && (
                    <div className="tooltip" data-tip="Trusted Employer">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-base-content/70 mb-4">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{job.companyName}</span>
                  {job.postedBy.verification?.isVerified && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {job.location.city}, {job.location.state}
                      {job.location.isRemote && " (Remote)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="capitalize">{job.type.replace("-", " ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-2 mt-3 text-primary font-semibold">
                    <DollarSign className="w-5 h-5" />
                    <span>{formatSalary()}</span>
                  </div>
                )}
              </div>

              {/* Company Logo */}
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-lg w-20 h-20">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="object-cover" />
                  ) : (
                    <span className="text-3xl">{job.companyName[0]}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Company Media/Photos */}
            {job.media && job.media.length > 0 && (
              <div className="mt-4 pt-4 border-t border-base-300">
                <h3 className="text-sm font-medium mb-2">Company Photos</h3>
                <div className="flex gap-2 overflow-x-auto">
                  {job.media.map((item, index) => (
                    <div key={index} className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={`Company ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {user?.role === 'seeker' ? (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn btn-primary flex-1"
                >
                  {applying ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Applying...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Apply Now
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="btn btn-disabled flex-1"
                >
                  <FileText className="w-4 h-4" />
                  Apply (Job Seekers Only)
                </button>
              )}
              <button 
                onClick={handleSave} 
                className={`btn ${isSaved ? 'btn-primary' : 'btn-ghost'} btn-square`}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button onClick={handleShare} className="btn btn-ghost btn-square">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-base-300 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{job.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.applications} applicant{job.applications !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-3">Job Description</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-base-content/80">{job.description}</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements.skills.length > 0 && (
          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.skills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
              
              {job.requirements.experience.min > 0 && (
                <div className="mt-4 pt-4 border-t border-base-300">
                  <p className="text-sm text-base-content/70">
                    <strong>Experience:</strong> {job.requirements.experience.min} - {job.requirements.experience.max} years
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span key={index} className="badge badge-outline">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posted By */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg mb-3">Posted By</h2>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    {job.postedBy.profilePhoto ? (
                      <img src={job.postedBy.profilePhoto} alt={job.postedBy.fullName} />
                    ) : (
                      <span>{job.postedBy.fullName[0]}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{job.postedBy.fullName}</p>
                    {job.postedBy.verification?.isVerified && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    {job.postedBy.verification?.isTrusted && (
                      <Shield className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${job.postedBy._id}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Connect and Follow Buttons */}
              {user && job.postedBy._id !== user.id && (
                <div className="flex gap-2">
                  <button
                    onClick={handleConnect}
                    className={`btn btn-sm ${isConnected ? 'btn-ghost' : 'btn-primary'} gap-1`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`btn btn-sm ${isFollowing ? 'btn-ghost' : 'btn-outline'} gap-1`}
                  >
                    <Bell className="w-4 h-4" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              )}
            </div>
            
            {isFollowing && (
              <div className="alert alert-info mt-3 text-sm">
                <Bell className="w-4 h-4" />
                <span>You'll receive updates when they post new jobs</span>
              </div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Confirm Application</h3>
              
              <div className="space-y-4">
                <div className="alert alert-info">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Your application will include:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>✓ Your profile information</li>
                      <li>✓ Your uploaded CV/Resume</li>
                      <li>✓ Your skills and experience</li>
                    </ul>
                  </div>
                </div>

                {!user?.cvUrl && (
                  <div className="alert alert-warning">
                    <Upload className="w-5 h-5" />
                    <div>
                      <p className="font-medium">CV Required</p>
                      <p className="text-sm">Please upload your CV before applying</p>
                      <button 
                        onClick={() => navigate("/profile/edit")}
                        className="btn btn-sm btn-warning mt-2"
                      >
                        Upload CV
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-action">
                <button 
                  onClick={() => setShowApplicationModal(false)} 
                  className="btn btn-ghost"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitApplication}
                  disabled={applying || !user?.cvUrl}
                  className="btn btn-primary"
                >
                  {applying ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => !applying && setShowApplicationModal(false)}></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobDetailPage;
