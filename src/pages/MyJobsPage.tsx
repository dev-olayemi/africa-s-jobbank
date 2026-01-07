import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { EmptyState } from "@/components/EmptyStates";
import {
  Plus,
  Users,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Briefcase,
  MapPin,
  X,
  FileText,
  Download,
} from "lucide-react";

const mockJobs = [
  {
    id: "1",
    title: "Sales Representative",
    location: "Lagos",
    type: "Full-time",
    posted: "Jan 3, 2026",
    applicants: 23,
    status: "active",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100",
  },
  {
    id: "2",
    title: "Store Manager",
    location: "Abuja",
    type: "Full-time",
    posted: "Dec 28, 2025",
    applicants: 15,
    status: "active",
    image: null,
  },
  {
    id: "3",
    title: "Customer Service Rep",
    location: "Lagos",
    type: "Part-time",
    posted: "Dec 15, 2025",
    applicants: 8,
    status: "closed",
    image: null,
  },
];

const mockApplicants = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    avatar: "https://ui-avatars.com/api/?name=AO&background=0D9488&color=fff",
    location: "Lagos",
    appliedDate: "Jan 5, 2026",
    hasCV: true,
  },
  {
    id: "2",
    name: "Emeka Johnson",
    avatar: "https://ui-avatars.com/api/?name=EJ&background=F97316&color=fff",
    location: "Abuja",
    appliedDate: "Jan 4, 2026",
    hasCV: true,
  },
  {
    id: "3",
    name: "Fatima Ibrahim",
    avatar: "https://ui-avatars.com/api/?name=FI&background=EAB308&color=fff",
    location: "Kano",
    appliedDate: "Jan 3, 2026",
    hasCV: false,
  },
];

const MyJobsPage = () => {
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  const openApplicants = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    setShowApplicantsModal(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Posted Jobs</h1>
            <p className="text-base-content/70">Manage your job listings</p>
          </div>
          <Link to="/jobs/create" className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Post Job
          </Link>
        </div>

        {mockJobs.length > 0 ? (
          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div key={job.id} className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-base-200 shrink-0 overflow-hidden">
                      {job.image ? (
                        <img src={job.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-base-content/30" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-base-content/60 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <MoreVertical className="w-4 h-4" />
                          </label>
                          <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-40">
                            <li>
                              <Link to={`/jobs/${job.id}`}>
                                <Eye className="w-4 h-4" /> View
                              </Link>
                            </li>
                            <li>
                              <button>
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                            </li>
                            <li>
                              <button className="text-error">
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className={`badge ${job.status === "active" ? "badge-success" : "badge-ghost"} badge-sm`}>
                            {job.status === "active" ? "Active" : "Closed"}
                          </span>
                          <span className="text-xs text-base-content/50">Posted {job.posted}</span>
                        </div>
                        <button
                          onClick={() => openApplicants(job)}
                          className="btn btn-ghost btn-sm gap-1"
                        >
                          <Users className="w-4 h-4" />
                          {job.applicants} Applicants
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-primary" />}
            title="No jobs posted yet"
            description="Create your first job listing to start receiving applications."
            action={
              <Link to="/jobs/create" className="btn btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Post Your First Job
              </Link>
            }
          />
        )}
      </div>

      {/* Applicants Modal */}
      {showApplicantsModal && selectedJob && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <button
              onClick={() => setShowApplicantsModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-lg">Applicants for {selectedJob.title}</h3>
            <p className="text-sm text-base-content/60 mb-4">{mockApplicants.length} applications</p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                  <img
                    src={applicant.avatar}
                    alt={applicant.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{applicant.name}</p>
                    <p className="text-xs text-base-content/60">{applicant.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {applicant.hasCV && (
                      <button className="btn btn-ghost btn-xs gap-1">
                        <FileText className="w-3 h-3" />
                        CV
                      </button>
                    )}
                    <Link to={`/profile/${applicant.id}`} className="btn btn-primary btn-xs">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowApplicantsModal(false)} />
        </div>
      )}
    </Layout>
  );
};

export default MyJobsPage;
