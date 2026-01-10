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
          const connectedIds = (user?.connections || []).map((conn: any) => 
            conn.user?._id || conn.user || conn._id || conn
          );
          
          const filtered = (response.data.users || []).filter(
            (u: UserProfile) => 
              u.id !== user?.id && 
              !connectedIds.includes(u.id)
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
    return suggestions;
  };

  const filteredList = searchQuery
    ? getDisplayList().filter(person =>
        person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : getDisplayList();

  const isConnected = (userId: string) => {
    if (!user?.connections) return false;
    return user.connections.some((conn: any) => 
      (conn.user?._id || conn.user || conn._id || conn) === userId
    );
  };
  
  const isFollowing = (userId: string) => user?.following?.includes(userId);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Network</h1>
            <p className="text-muted-foreground">
              Connect with professionals across Africa
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setViewMode("connections")}
              className={`bg-card rounded-xl border p-6 transition-all cursor-pointer ${
                viewMode === "connections" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">
                    {user?.connections?.length || 0}
                  </p>
                  <p className="text-muted-foreground font-medium">Connections</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode("followers")}
              className={`bg-card rounded-xl border p-6 transition-all cursor-pointer ${
                viewMode === "followers" ? "border-info ring-2 ring-info/20" : "border-border hover:border-info/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-info mb-1">
                    {user?.followers?.length || 0}
                  </p>
                  <p className="text-muted-foreground font-medium">Followers</p>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <Users className="h-6 w-6 text-info" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setViewMode("following")}
              className={`bg-card rounded-xl border p-6 transition-all cursor-pointer ${
                viewMode === "following" ? "border-success ring-2 ring-success/20" : "border-border hover:border-success/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-success mb-1">
                    {user?.following?.length || 0}
                  </p>
                  <p className="text-muted-foreground font-medium">Following</p>
                </div>
                <div className="p-3 bg-success/10 rounded-xl">
                  <UserPlus className="h-6 w-6 text-success" />
                </div>
              </div>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["suggestions", "connections", "followers", "following"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`btn btn-sm whitespace-nowrap ${viewMode === mode ? "btn-primary" : "btn-ghost"}`}
              >
                {mode === "suggestions" ? "Suggestions" : 
                 mode === "connections" ? "My Connections" :
                 mode === "followers" ? "Followers" : "Following"}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search people by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-12"
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

          {/* Content */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">
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
              <div className="bg-card rounded-xl border border-border p-16 text-center">
                <Users className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {searchQuery ? "No results found" : "No one here yet"}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try a different search term"
                    : viewMode === "suggestions"
                    ? "Check back later for connection suggestions"
                    : "Start connecting with people to see them here"
                  }
                </p>
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
                      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        {/* Profile Section */}
                        <div 
                          className="flex flex-col items-center text-center mb-6 cursor-pointer group"
                          onClick={() => navigate(`/profile/${person.id}`)}
                        >
                          {person.profilePhoto ? (
                            <div className="mb-4">
                              <img 
                                src={person.profilePhoto} 
                                alt={person.fullName}
                                className="w-20 h-20 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-card object-cover group-hover:ring-offset-4 transition-all"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent mb-4 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-primary ring-offset-2 ring-offset-card group-hover:ring-offset-4 transition-all">
                              {person.fullName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          
                          <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                            {person.fullName}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground capitalize font-medium mb-2">
                            {person.role}
                          </p>
                          
                          {person.location?.city && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                              <MapPin className="h-3 w-3" />
                              <span>{person.location.city}, {person.location.country}</span>
                            </div>
                          )}
                          
                          {person.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
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