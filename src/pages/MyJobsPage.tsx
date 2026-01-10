import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const MyJobsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posted" | "applied">("posted");
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canPostJobs = user?.role === 'agent' || user?.role === 'business' || user?.role === 'company';
  const isJobSeeker = user?.role === 'seeker';

  useEffect(() => {
    // Set default tab based on user role
    if (isJobSeeker) {
      setActiveTab("applied");
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (canPostJobs) {
        // Fetch posted jobs
        const jobsResponse = await api.getMyPostedJobs();
        if (jobsResponse.success && jobsResponse.data) {
          setPostedJobs(jobsResponse.data.jobs || []);
        }
      }

      // Fetch applications
      const appsResponse = await api.getApplications();
      if (appsResponse.success && appsResponse.data) {
        setApplications(appsResponse.data.applications || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const response = await api.deleteJob(jobId);
      if (response.success) {
        toast.success("Job deleted successfully");
        setPostedJobs(postedJobs.filter(job => job._id !== jobId));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete job");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { class: "badge-warning", icon: Clock, text: "Pending" },
      reviewing: { class: "badge-info", icon: Eye, text: "Reviewing" },
      accepted: { class: "badge-success", icon: CheckCircle, text: "Accepted" },
      rejected: { class: "badge-error", icon: XCircle, text: "Rejected" },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <div className={`badge ${badge.class} gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </div>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Jobs</h1>
              <p className="text-base-content/60">
                {canPostJobs 
                  ? "Manage your job postings and applications"
                  : "Track your job applications"
                }
              </p>
            </div>
            {canPostJobs && (
              <button
                onClick={() => navigate("/create/job")}
                className="btn btn-primary gap-2"
              >
                <Plus className="h-5 w-5" />
                Post New Job
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6 p-2">
            {canPostJobs && (
              <button
                onClick={() => setActiveTab("posted")}
                className={`tab tab-lg ${activeTab === "posted" ? "tab-active" : ""}`}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Posted Jobs ({postedJobs.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab("applied")}
              className={`tab tab-lg ${activeTab === "applied" ? "tab-active" : ""}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Applications ({applications.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "posted" && canPostJobs ? (
            <div className="space-y-4">
              {postedJobs.length === 0 ? (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-16 text-center">
                    <Briefcase className="h-20 w-20 text-base-content/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">No jobs posted yet</h3>
                    <p className="text-base-content/60 mb-6">
                      Start hiring talented professionals by posting your first job
                    </p>
                    <button
                      onClick={() => navigate("/create/job")}
                      className="btn btn-primary gap-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      Post Your First Job
                    </button>
                  </div>
                </div>
              ) : (
                postedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                  >
                    <div className="card-body p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-base-content/70 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.location?.city}, {job.location?.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {job.type}
                                </span>
                                {job.salary && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {job.salary.currency} {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Posted {formatDate(job.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                  {job.status}
                                </div>
                                <span className="text-sm text-base-content/60">
                                  {job.views || 0} views
                                </span>
                                <span className="text-sm text-base-content/60">
                                  {job.applications?.length || 0} applications
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="dropdown dropdown-end">
                          <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 rounded-xl shadow-lg w-52 p-2 border border-base-300 z-10">
                            <li>
                              <button onClick={() => navigate(`/jobs/${job._id}`)} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Job
                              </button>
                            </li>
                            <li>
                              <button onClick={() => navigate(`/jobs/${job._id}/edit`)} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Job
                              </button>
                            </li>
                            <li>
                              <button className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                View Applications ({job.applications?.length || 0})
                              </button>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="flex items-center gap-2 text-error"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Job
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-16 text-center">
                    <FileText className="h-20 w-20 text-base-content/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">No applications yet</h3>
                    <p className="text-base-content/60 mb-6">
                      Start applying to jobs and track your applications here
                    </p>
                    <button
                      onClick={() => navigate("/jobs")}
                      className="btn btn-primary gap-2 mx-auto"
                    >
                      <Briefcase className="h-5 w-5" />
                      Browse Jobs
                    </button>
                  </div>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                  >
                    <div className="card-body p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{app.job?.title}</h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-base-content/70 mb-3">
                            {app.job?.company || app.job?.postedBy?.companyName || "Company"}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-base-content/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied {formatDate(app.createdAt)}
                            </span>
                            {app.job?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {app.job.location.city}, {app.job.location.state}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/jobs/${app.job?._id}`)}
                          className="btn btn-ghost btn-sm gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Job
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyJobsPage;
