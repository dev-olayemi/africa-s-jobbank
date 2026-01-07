import { useState, useEffect } from "react";
import { Users, UserPlus, UserMinus, Search, Loader2, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  bio?: string;
  connections?: string[];
  followers?: string[];
  following?: string[];
}

type ViewMode = "suggestions" | "connections" | "followers" | "following";

const NetworkPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("suggestions");
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningUsers, setActioningUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      if (viewMode === "suggestions") {
        const response = await api.searchUsers({ limit: 50 });
        if (response.success && response.data) {
          const filtered = (response.data.users || []).filter(
            (u: UserProfile) => 
              u.id !== user?.id && 
              !user?.connections?.includes(u.id)
          );
          setSuggestions(filtered);
        }
      } else if (viewMode === "connections" && user?.id) {
        const response = await api.getUserConnections(user.id);
        if (response.success && response.data) {
          setConnections(response.data.connections || []);
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      setActioningUsers(prev => new Set(prev).add(userId));
      const response = await api.connectUser(userId);
      
      if (response.success) {
        if (response.message?.includes('already')) {
          toast.info("You're already connected!");
        } else {
          toast.success("Connected successfully!");
        }
        await refreshUser();
        setSuggestions(prev => prev.filter(u => u.id !== userId));
      }
    } catch (error: any) {
      const message = error.message || "Unable to connect. Please try again.";
      toast.error(message);
    } finally {
      setActioningUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleDisconnect = async (userId: string) => {
    try {
      setActioningUsers(prev => new Set(prev).add(userId));
      const response = await api.disconnectUser(userId);
      
      if (response.success) {
        toast.success("Disconnected");
        await refreshUser();
        setConnections(prev => prev.filter(u => u.id !== userId));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect");
    } finally {
      setActioningUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      setActioningUsers(prev => new Set(prev).add(userId));
      const response = await api.followUser(userId);
      
      if (response.success) {
        toast.success(response.data?.following ? "Following!" : "Unfollowed");
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed");
    } finally {
      setActioningUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getDisplayList = () => {
    if (viewMode === "connections") return connections;
    if (viewMode === "suggestions") return suggestions;
    // For followers/following, we'd need to fetch those lists
    return suggestions;
  };

  const filteredList = searchQuery
    ? getDisplayList().filter(person =>
        person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : getDisplayList();

  const isConnected = (userId: string) => user?.connections?.includes(userId);
  const isFollowing = (userId: string) => user?.following?.includes(userId);

  return (
    <Layout>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Network</h1>
            <p className="text-base-content/60 text-lg">
              Connect with professionals across Africa
            </p>
          </div>

          {/* Stats Cards - Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setViewMode("connections")}
              className={`card bg-base-100 card-clean transition-all cursor-pointer border-2 ${
                viewMode === "connections" ? "border-primary" : "border-transparent"
              }`}
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary mb-1">
                      {user?.connections?.length || 0}
                    </p>
                    <p className="text-base-content/70 font-medium">Connections</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode("followers")}
              className={`card bg-base-100 card-clean transition-all cursor-pointer border-2 ${
                viewMode === "followers" ? "border-blue-500" : "border-transparent"
              }`}
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-blue-500 mb-1">
                      {user?.followers?.length || 0}
                    </p>
                    <p className="text-base-content/70 font-medium">Followers</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-2xl">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode("following")}
              className={`card bg-base-100 card-clean transition-all cursor-pointer border-2 ${
                viewMode === "following" ? "border-green-500" : "border-transparent"
              }`}
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-green-500 mb-1">
                      {user?.following?.length || 0}
                    </p>
                    <p className="text-base-content/70 font-medium">Following</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-2xl">
                    <UserPlus className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="tabs tabs-boxed bg-base-100 mb-6 p-2 border border-base-300">
            <button
              onClick={() => setViewMode("suggestions")}
              className={`tab tab-lg ${viewMode === "suggestions" ? "tab-active" : ""}`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setViewMode("connections")}
              className={`tab tab-lg ${viewMode === "connections" ? "tab-active" : ""}`}
            >
              My Connections
            </button>
            <button
              onClick={() => setViewMode("followers")}
              className={`tab tab-lg ${viewMode === "followers" ? "tab-active" : ""}`}
            >
              Followers
            </button>
            <button
              onClick={() => setViewMode("following")}
              className={`tab tab-lg ${viewMode === "following" ? "tab-active" : ""}`}
            >
              Following
            </button>
          </div>

          {/* Search Bar */}
          <div className="card bg-base-100 card-clean mb-8">
            <div className="card-body p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search people by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-12 input-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {viewMode === "suggestions" && "People You May Know"}
              {viewMode === "connections" && "Your Connections"}
              {viewMode === "followers" && "Your Followers"}
              {viewMode === "following" && "People You Follow"}
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            ) : filteredList.length === 0 ? (
              <div className="card bg-base-100 card-clean">
                <div className="card-body p-16 text-center">
                  <Users className="h-24 w-24 text-base-content/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-3">
                    {searchQuery ? "No results found" : "No one here yet"}
                  </h3>
                  <p className="text-base-content/60 text-lg">
                    {searchQuery 
                      ? "Try a different search term"
                      : viewMode === "suggestions"
                      ? "Check back later for connection suggestions"
                      : "Start connecting with people to see them here"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((person) => {
                  const connected = isConnected(person.id);
                  const following = isFollowing(person.id);
                  const loading = actioningUsers.has(person.id);

                  return (
                    <div
                      key={person.id}
                      className="card-clean"
                    >
                      <div className="card-body p-6">
                        {/* Profile Section - Clickable */}
                        <div 
                          className="flex flex-col items-center text-center mb-6 cursor-pointer group"
                          onClick={() => navigate(`/profile/${person.id}`)}
                        >
                          {person.profilePhoto ? (
                            <div className="avatar mb-4">
                              <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-offset-4 transition-all">
                                <img src={person.profilePhoto} alt={person.fullName} />
                              </div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent mb-4 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-offset-4 transition-all">
                              {person.fullName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          
                          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                            {person.fullName}
                          </h3>
                          
                          <p className="text-sm text-base-content/70 capitalize font-medium mb-2">
                            {person.role}
                          </p>
                          
                          {person.location?.city && (
                            <div className="flex items-center gap-1 text-xs text-base-content/60 mb-3">
                              <MapPin className="h-3 w-3" />
                              <span>{person.location.city}, {person.location.country}</span>
                            </div>
                          )}
                          
                          {person.bio && (
                            <p className="text-sm text-base-content/70 line-clamp-2">
                              {person.bio}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {viewMode === "connections" || connected ? (
                            <button
                              onClick={() => handleDisconnect(person.id)}
                              disabled={loading}
                              className="btn btn-error btn-outline flex-1 gap-2"
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserMinus className="h-4 w-4" />
                                  Disconnect
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(person.id)}
                              disabled={loading}
                              className="btn btn-primary flex-1 gap-2"
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" />
                                  Connect
                                </>
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleFollow(person.id)}
                            disabled={loading}
                            className={`btn btn-sm ${
                              following ? "btn-success" : "btn-ghost"
                            }`}
                            title={following ? "Unfollow" : "Follow"}
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : following ? (
                              <UserMinus className="h-4 w-4" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NetworkPage;
