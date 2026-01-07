import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { RoleBadge } from "@/components/RoleBadge";
import VerificationBadge from "@/components/VerificationBadge";
import { JobCard, SocialPostCard } from "@/components/FeedCards";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Settings,
  UserPlus,
  UserMinus,
  MessageSquare,
  Briefcase,
  FileText,
} from "lucide-react";

const mockUser = {
  id: "1",
  name: "Adaeze Okonkwo",
  username: "@adaeze_okonkwo",
  avatar: "https://ui-avatars.com/api/?name=Adaeze+Okonkwo&background=0D9488&color=fff&size=200",
  coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=300&fit=crop",
  role: "seeker" as const,
  verified: true,
  bio: "Sales professional with 3 years experience in retail and hospitality. Looking for new opportunities in Lagos.",
  location: "Lagos, Nigeria",
  joinedDate: "March 2024",
  website: "",
  followers: 234,
  following: 189,
  skills: ["Sales", "Customer Service", "Communication", "Retail"],
  categories: ["Sales & Marketing", "Hospitality", "Retail"],
  isOwnProfile: true,
};

const mockPosts = [
  {
    id: 1,
    author: { name: "Adaeze Okonkwo", role: "Job Seeker", avatar: mockUser.avatar, verified: true },
    content: "Excited to share that I just completed my customer service certification! Ready for new challenges.",
    likes: 45,
    comments: 12,
    shares: 3,
    posted: "2 hours ago",
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-accent relative">
          {mockUser.coverImage && (
            <img src={mockUser.coverImage} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-base-100 px-4 pb-4 relative">
          {/* Avatar */}
          <div className="absolute -top-12 md:-top-16 left-4">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-base-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-3 gap-2">
            {mockUser.isOwnProfile ? (
              <Link to="/profile/edit" className="btn btn-outline btn-sm gap-2">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm btn-circle">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`btn btn-sm gap-2 ${isFollowing ? "btn-ghost" : "btn-primary"}`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 md:mt-12">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{mockUser.name}</h1>
              {mockUser.verified && <VerificationBadge />}
              <RoleBadge role={mockUser.role} size="sm" />
            </div>
            <p className="text-base-content/60 text-sm">{mockUser.username}</p>

            {mockUser.bio && (
              <p className="mt-3 text-base-content/80">{mockUser.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-base-content/60">
              {mockUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mockUser.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {mockUser.joinedDate}
              </span>
              {mockUser.website && (
                <a href={mockUser.website} className="flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4">
              <Link to="/network" className="hover:underline">
                <span className="font-semibold">{mockUser.followers}</span>{" "}
                <span className="text-base-content/60">Followers</span>
              </Link>
              <Link to="/network" className="hover:underline">
                <span className="font-semibold">{mockUser.following}</span>{" "}
                <span className="text-base-content/60">Following</span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered mt-6 -mb-4">
            <button
              onClick={() => setActiveTab("posts")}
              className={`tab ${activeTab === "posts" ? "tab-active" : ""}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
            >
              About
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === "posts" ? (
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Skills */}
              {mockUser.skills.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mockUser.skills.map((skill) => (
                        <span key={skill} className="badge badge-ghost">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Job Preferences */}
              {mockUser.categories.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Job Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mockUser.categories.map((cat) => (
                        <span key={cat} className="badge badge-primary badge-outline">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
