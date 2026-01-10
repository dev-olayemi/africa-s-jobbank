import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import VerificationBadge from "@/components/VerificationBadge";
import { Clock, CheckCircle, XCircle, Eye, Briefcase } from "lucide-react";

const mockApplications = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Sales Representative",
    company: "TechMart Nigeria",
    companyLogo: "https://ui-avatars.com/api/?name=TM&background=0D9488&color=fff",
    verified: true,
    status: "pending",
    appliedDate: "Jan 5, 2026",
  },
  {
    id: "2",
    jobId: "2",
    jobTitle: "Customer Service Agent",
    company: "MTN Nigeria",
    companyLogo: "https://ui-avatars.com/api/?name=MTN&background=F97316&color=fff",
    verified: true,
    status: "reviewed",
    appliedDate: "Jan 3, 2026",
  },
  {
    id: "3",
    jobId: "3",
    jobTitle: "Store Cashier",
    company: "ShopRite",
    companyLogo: "https://ui-avatars.com/api/?name=SR&background=EAB308&color=fff",
    verified: true,
    status: "accepted",
    appliedDate: "Dec 28, 2025",
  },
  {
    id: "4",
    jobId: "4",
    jobTitle: "Delivery Driver",
    company: "Jumia Logistics",
    companyLogo: "https://ui-avatars.com/api/?name=JL&background=374151&color=fff",
    verified: false,
    status: "rejected",
    appliedDate: "Dec 20, 2025",
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "badge-warning" },
  reviewed: { label: "Reviewed", icon: Eye, className: "badge-info" },
  accepted: { label: "Accepted", icon: CheckCircle, className: "badge-success" },
  rejected: { label: "Rejected", icon: XCircle, className: "badge-error" },
};

const ApplicationsPage = () => {
  const [filter, setFilter] = useState("all");

  const filteredApplications = mockApplications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
            <p className="text-muted-foreground">Track your job applications</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredApplications.length > 0 ? (
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const status = statusConfig[app.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div key={app.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.companyLogo}
                      alt={app.company}
                      className="w-12 h-12 rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="font-semibold text-foreground hover:text-primary line-clamp-1"
                      >
                        {app.jobTitle}
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{app.company}</span>
                        {app.verified && <VerificationBadge size="sm" />}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`badge ${status.className} gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{app.appliedDate}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;