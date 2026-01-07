import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { RoleBadge } from "@/components/RoleBadge";
import VerificationBadge from "@/components/VerificationBadge";
import { NoConnections } from "@/components/EmptyStates";
import { UserPlus, UserMinus, Search } from "lucide-react";

const mockFollowers = [
  {
    id: "1",
    name: "Emeka Johnson",
    avatar: "https://ui-avatars.com/api/?name=EJ&background=0D9488&color=fff",
    role: "seeker" as const,
    verified: true,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Fatima Ibrahim",
    avatar: "https://ui-avatars.com/api/?name=FI&background=F97316&color=fff",
    role: "seeker" as const,
    verified: false,
    isFollowing: false,
  },
];

const mockFollowing = [
  {
    id: "3",
    name: "TechMart Nigeria",
    avatar: "https://ui-avatars.com/api/?name=TM&background=0D9488&color=fff",
    role: "company" as const,
    verified: true,
    isFollowing: true,
  },
  {
    id: "4",
    name: "HR Solutions Ltd",
    avatar: "https://ui-avatars.com/api/?name=HR&background=EAB308&color=fff",
    role: "agent" as const,
    verified: true,
    isFollowing: true,
  },
];

const mockSuggestions = [
  {
    id: "5",
    name: "Shoprite Nigeria",
    avatar: "https://ui-avatars.com/api/?name=SR&background=F97316&color=fff",
    role: "company" as const,
    verified: true,
    reason: "Popular employer in Retail",
  },
  {
    id: "6",
    name: "Chinedu Eze",
    avatar: "https://ui-avatars.com/api/?name=CE&background=0D9488&color=fff",
    role: "agent" as const,
    verified: true,
    reason: "Top recruiter in Lagos",
  },
];

const NetworkPage = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("following");
  const [searchQuery, setSearchQuery] = useState("");
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string, currentState: boolean) => {
    setFollowingState((prev) => ({ ...prev, [id]: !currentState }));
  };

  const currentList = activeTab === "followers" ? mockFollowers : mockFollowing;

  const filteredList = currentList.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Network</h1>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-200 mb-6">
          <button
            onClick={() => setActiveTab("following")}
            className={`tab flex-1 ${activeTab === "following" ? "tab-active" : ""}`}
          >
            Following ({mockFollowing.length})
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`tab flex-1 ${activeTab === "followers" ? "tab-active" : ""}`}
          >
            Followers ({mockFollowers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered input-sm w-full pl-9"
          />
        </div>

        {/* List */}
        {filteredList.length > 0 ? (
          <div className="space-y-3">
            {filteredList.map((person) => {
              const isFollowing = followingState[person.id] ?? person.isFollowing;

              return (
                <div key={person.id} className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <Link to={`/profile/${person.id}`}>
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${person.id}`} className="font-medium hover:text-primary flex items-center gap-1">
                      {person.name}
                      {person.verified && <VerificationBadge size="sm" />}
                    </Link>
                    <RoleBadge role={person.role} size="sm" />
                  </div>
                  <button
                    onClick={() => toggleFollow(person.id, isFollowing)}
                    className={`btn btn-sm gap-1 ${isFollowing ? "btn-ghost" : "btn-primary"}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <NoConnections />
        )}

        {/* Suggestions */}
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Suggested for you</h2>
          <div className="space-y-3">
            {mockSuggestions.map((person) => (
              <div key={person.id} className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                <Link to={`/profile/${person.id}`}>
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-full"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${person.id}`} className="font-medium hover:text-primary flex items-center gap-1">
                    {person.name}
                    {person.verified && <VerificationBadge size="sm" />}
                  </Link>
                  <p className="text-xs text-base-content/60">{person.reason}</p>
                </div>
                <button className="btn btn-primary btn-sm gap-1">
                  <UserPlus className="w-4 h-4" />
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NetworkPage;
