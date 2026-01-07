import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import VerificationBadge from "@/components/VerificationBadge";
import { NoJobsFound } from "@/components/EmptyStates";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  Clock,
  Bookmark,
  ChevronDown,
  Grid3X3,
  List,
  X,
} from "lucide-react";

const mockJobs = [
  {
    id: "1",
    title: "Sales Representative",
    company: "TechMart Nigeria",
    companyLogo: "https://ui-avatars.com/api/?name=TM&background=0D9488&color=fff",
    location: "Lagos",
    type: "Full-time",
    salary: "₦80,000 - ₦120,000",
    category: "Sales",
    posted: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    title: "Restaurant Server",
    company: "Chicken Republic",
    companyLogo: "https://ui-avatars.com/api/?name=CR&background=F97316&color=fff",
    location: "Abuja",
    type: "Full-time",
    salary: "₦50,000 - ₦70,000",
    category: "Hospitality",
    posted: "1 day ago",
    verified: true,
  },
  {
    id: "3",
    title: "Delivery Driver",
    company: "Jumia Logistics",
    companyLogo: "https://ui-avatars.com/api/?name=JL&background=EAB308&color=fff",
    location: "Lagos",
    type: "Contract",
    salary: "₦60,000 - ₦90,000",
    category: "Logistics",
    posted: "3 days ago",
    verified: false,
  },
  {
    id: "4",
    title: "Customer Service Agent",
    company: "MTN Nigeria",
    companyLogo: "https://ui-avatars.com/api/?name=MTN&background=0D9488&color=fff",
    location: "Port Harcourt",
    type: "Full-time",
    salary: "₦90,000 - ₦130,000",
    category: "Customer Service",
    posted: "5 hours ago",
    verified: true,
  },
  {
    id: "5",
    title: "Store Cashier",
    company: "ShopRite",
    companyLogo: "https://ui-avatars.com/api/?name=SR&background=F97316&color=fff",
    location: "Ibadan",
    type: "Part-time",
    salary: "₦40,000 - ₦55,000",
    category: "Retail",
    posted: "1 week ago",
    verified: true,
  },
  {
    id: "6",
    title: "Security Guard",
    company: "SecureForce Ltd",
    companyLogo: "https://ui-avatars.com/api/?name=SF&background=374151&color=fff",
    location: "Lagos",
    type: "Full-time",
    salary: "₦45,000 - ₦60,000",
    category: "Security",
    posted: "4 days ago",
    verified: false,
  },
];

const categories = ["All", "Sales", "Hospitality", "Logistics", "Retail", "Customer Service", "Security", "Admin"];
const locations = ["All Nigeria", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];

const BrowseJobsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Nigeria");
  const [selectedType, setSelectedType] = useState("All Types");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Nigeria" || job.location === selectedLocation;
    const matchesType = selectedType === "All Types" || job.type === selectedType;
    return matchesSearch && matchesCategory && matchesLocation && matchesType;
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedLocation("All Nigeria");
    setSelectedType("All Types");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedLocation !== "All Nigeria" || selectedType !== "All Types" || searchQuery;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-base-content/70">Find verified opportunities across Africa</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline gap-2 md:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="badge badge-primary badge-sm">Active</span>}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="select select-bordered"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select select-bordered"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-base-200 grid grid-cols-1 gap-3 md:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="select select-bordered w-full"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select select-bordered w-full"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/70">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
            </span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-xs gap-1">
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`btn btn-ghost btn-sm ${viewMode === "grid" ? "btn-active" : ""}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`btn btn-ghost btn-sm ${viewMode === "list" ? "btn-active" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Jobs Grid/List */}
        {filteredJobs.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === "list" ? "card-side" : ""
                }`}
              >
                <div className="card-body p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/jobs/${job.id}`} className="font-semibold hover:text-primary line-clamp-1">
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-1 text-sm text-base-content/70">
                            <span>{job.company}</span>
                            {job.verified && <VerificationBadge size="sm" />}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`btn btn-ghost btn-xs ${savedJobs.includes(job.id) ? "text-warning" : ""}`}
                        >
                          <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge badge-ghost badge-sm gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="badge badge-ghost badge-sm gap-1">
                      <Briefcase className="w-3 h-3" />
                      {job.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200">
                    <span className="text-sm font-medium text-primary">{job.salary}</span>
                    <span className="text-xs text-base-content/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.posted}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoJobsFound />
        )}
      </div>
    </Layout>
  );
};

export default BrowseJobsPage;
