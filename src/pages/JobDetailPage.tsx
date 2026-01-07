import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { RoleBadge } from "@/components/RoleBadge";
import VerificationBadge from "@/components/VerificationBadge";
import {
  MapPin,
  Clock,
  Banknote,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  Flag,
  CheckCircle,
  Building2,
  Users,
  Calendar,
  X,
} from "lucide-react";

const mockJob = {
  id: "1",
  title: "Sales Representative",
  company: "TechMart Nigeria",
  companyLogo: "https://ui-avatars.com/api/?name=TechMart&background=0D9488&color=fff",
  location: "Lagos, Nigeria",
  type: "Full-time",
  salary: "₦80,000 - ₦120,000/month",
  category: "Sales & Marketing",
  posted: "2 days ago",
  deadline: "Dec 31, 2025",
  applicants: 47,
  verified: true,
  role: "company" as const,
  description: `We are looking for a motivated Sales Representative to join our growing team. You will be responsible for selling our electronics products to retail customers and building lasting relationships.

This is an excellent opportunity for someone starting their career in sales who wants to grow with a dynamic company.`,
  requirements: [
    "Minimum SSCE/OND qualification",
    "Strong communication skills",
    "Customer-focused attitude",
    "Ability to work weekends",
    "Experience in retail is a plus",
  ],
  benefits: [
    "Competitive base salary + commission",
    "Health insurance after 6 months",
    "Training provided",
    "Growth opportunities",
  ],
  images: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
    "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600",
  ],
};

const relatedJobs = [
  { id: "2", title: "Store Attendant", company: "ShopRite", location: "Abuja", salary: "₦60,000/month" },
  { id: "3", title: "Customer Service Rep", company: "MTN Nigeria", location: "Lagos", salary: "₦90,000/month" },
  { id: "4", title: "Marketing Assistant", company: "Jumia", location: "Lagos", salary: "₦75,000/month" },
];

const JobDetailPage = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setShowApplyModal(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link to="/jobs" className="btn btn-ghost btn-sm gap-2 mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-lg">
          {/* Image Gallery */}
          {mockJob.images.length > 0 && (
            <figure className="relative h-48 md:h-64 bg-base-200">
              <img
                src={mockJob.images[currentImage]}
                alt={mockJob.title}
                className="w-full h-full object-cover"
              />
              {mockJob.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : mockJob.images.length - 1))}
                    className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev < mockJob.images.length - 1 ? prev + 1 : 0))}
                    className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {mockJob.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentImage ? "bg-primary" : "bg-base-100/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </figure>
          )}

          <div className="card-body">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <img
                src={mockJob.companyLogo}
                alt={mockJob.company}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{mockJob.title}</h1>
                  {mockJob.verified && <VerificationBadge />}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base-content/70">
                  <span className="font-medium">{mockJob.company}</span>
                  <RoleBadge role={mockJob.role} size="sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`btn btn-ghost btn-sm ${saved ? "text-warning" : ""}`}
                >
                  <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-base-200 my-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                {mockJob.location}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-primary" />
                {mockJob.type}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Banknote className="w-4 h-4 text-primary" />
                {mockJob.salary}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                Posted {mockJob.posted}
              </div>
            </div>

            {/* Stats */}
            <div className="stats stats-vertical md:stats-horizontal shadow-sm bg-base-200/50 mb-4">
              <div className="stat py-3">
                <div className="stat-figure text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Applicants</div>
                <div className="stat-value text-lg">{mockJob.applicants}</div>
              </div>
              <div className="stat py-3">
                <div className="stat-figure text-warning">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Deadline</div>
                <div className="stat-value text-lg">{mockJob.deadline}</div>
              </div>
              <div className="stat py-3">
                <div className="stat-figure text-accent">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Category</div>
                <div className="stat-value text-sm">{mockJob.category}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">About this role</h2>
                <p className="text-base-content/80 whitespace-pre-line">{mockJob.description}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Requirements</h2>
                <ul className="space-y-1">
                  {mockJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-base-content/80">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Benefits</h2>
                <ul className="space-y-1">
                  {mockJob.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-base-content/80">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="card-actions justify-between items-center mt-6 pt-4 border-t border-base-200">
              <button
                onClick={() => setShowReportModal(true)}
                className="btn btn-ghost btn-sm text-error gap-2"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={applied}
                className="btn btn-primary"
              >
                {applied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Similar Jobs</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-4">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-base-content/70">{job.company}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-base-content/60">{job.location}</span>
                    <span className="text-primary font-medium">{job.salary}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button onClick={() => setShowApplyModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-lg">Confirm Application</h3>
            <p className="py-4">
              You are about to apply for <strong>{mockJob.title}</strong> at <strong>{mockJob.company}</strong>.
            </p>
            <div className="alert alert-info text-sm mb-4">
              <CheckCircle className="w-4 h-4" />
              Your profile and CV will be shared with the employer.
            </div>
            <div className="modal-action">
              <button onClick={() => setShowApplyModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleApply} className="btn btn-primary">Confirm Apply</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowApplyModal(false)} />
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button onClick={() => setShowReportModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-lg">Report this job</h3>
            <p className="py-2 text-sm text-base-content/70">Help us keep JobFolio safe. Select a reason:</p>
            <div className="form-control gap-2 py-4">
              {["Fake or scam listing", "Inappropriate content", "Wrong information", "Other"].map((reason) => (
                <label key={reason} className="label cursor-pointer justify-start gap-3">
                  <input type="radio" name="report-reason" className="radio radio-sm radio-primary" />
                  <span className="label-text">{reason}</span>
                </label>
              ))}
            </div>
            <textarea className="textarea textarea-bordered w-full" placeholder="Additional details (optional)" rows={3} />
            <div className="modal-action">
              <button onClick={() => setShowReportModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={() => setShowReportModal(false)} className="btn btn-error">Submit Report</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowReportModal(false)} />
        </div>
      )}
    </Layout>
  );
};

export default JobDetailPage;
