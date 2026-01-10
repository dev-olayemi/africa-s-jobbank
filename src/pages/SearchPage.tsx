import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { RoleBadge } from "@/components/RoleBadge";
import VerificationBadge from "@/components/VerificationBadge";
import { Search, MapPin, Hash, TrendingUp } from "lucide-react";

const mockJobResults = [
  {
    id: "1",
    title: "Sales Representative",
    company: "TechMart Nigeria",
    location: "Lagos",
    salary: "₦80,000 - ₦120,000",
    verified: true,
  },
  {
    id: "2",
    title: "Sales Manager",
    company: "MTN Nigeria",
    location: "Abuja",
    salary: "₦200,000 - ₦300,000",
    verified: true,
  },
];

const mockPeopleResults = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    avatar: "https://ui-avatars.com/api/?name=AO&background=0D9488&color=fff",
    role: "seeker" as const,
    location: "Lagos",
    verified: true,
  },
  {
    id: "2",
    name: "TechMart Nigeria",
    avatar: "https://ui-avatars.com/api/?name=TM&background=F97316&color=fff",
    role: "company" as const,
    location: "Lagos",
    verified: true,
  },
];

const mockHashtags = [
  { tag: "sales", count: 234 },
  { tag: "lagos", count: 189 },
  { tag: "hiring", count: 156 },
  { tag: "salesjobs", count: 89 },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<"jobs" | "people" | "hashtags">("jobs");
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs, people, or hashtags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input input-bordered w-full pl-12 pr-4"
            />
          </div>
        </form>

        {query ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Results for "<span className="font-medium text-foreground">{query}</span>"
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              {(["jobs", "people", "hashtags"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? "bg-card text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Results */}
            {activeTab === "jobs" && (
              <div className="space-y-3">
                {mockJobResults.length > 0 ? (
                  mockJobResults.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        {job.verified && <VerificationBadge size="sm" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="text-primary font-medium">{job.salary}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">Try different keywords</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "people" && (
              <div className="space-y-3">
                {mockPeopleResults.length > 0 ? (
                  mockPeopleResults.map((person) => (
                    <Link
                      key={person.id}
                      to={`/profile/${person.id}`}
                      className="block bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{person.name}</h3>
                            {person.verified && <VerificationBadge size="sm" />}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <RoleBadge role={person.role} size="sm" />
                            <span className="text-sm text-muted-foreground">{person.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No people found</h3>
                    <p className="text-muted-foreground">Try different keywords</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hashtags" && (
              <div className="space-y-2">
                {mockHashtags.length > 0 ? (
                  mockHashtags.map((item) => (
                    <div
                      key={item.tag}
                      className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Hash className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">#{item.tag}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count} posts</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Hash className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No hashtags found</h3>
                    <p className="text-muted-foreground">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Trending */
          <div>
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending
            </h2>
            <div className="flex flex-wrap gap-2">
              {["#hiring", "#lagosJobs", "#sales", "#retail", "#hospitality", "#tech"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchInput(tag.replace("#", ""));
                    setSearchParams({ q: tag.replace("#", "") });
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;