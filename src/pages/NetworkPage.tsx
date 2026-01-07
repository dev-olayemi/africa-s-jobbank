import { useState, useEffect } from "react";
import { Users, UserPlus, UserCheck, UserMinus, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
  verification?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  connections?: string[];
  followers?: string[];
  following?: string[];
}

const NetworkPage = () => {
  const { user, refreshUser } = useAuth();
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectingUsers, setConnectingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.searchUsers({ limit: 20 });
      if (response.success && response.data) {
        // Filter out current user and already connected users
        const filtered = (response.data.users || []).filter(
          (u: UserProfile) => 
            u.id !== user?.id && 
            !user?.connections?.includes(u.id)
        );
        setSuggestions(filtered);
      }
    } catch (error) {
      toast.error("Failed to load network");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUsers(prev => new Set(prev).add(userId));
      // Toggle connection: if already connected, disconnect
      if (isConnected(userId)) {
        const response = await api.disconnectUser(userId);
        if (response.success) {
          toast.success("Disconnected");
          await refreshUser();
        }
      } else {
        const response = await api.connectUser(userId);
        if (response.success) {
          toast.success("Connected successfully!");
          await refreshUser();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update connection");
    } finally {
      setConnectingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      setConnectingUsers(prev => new Set(prev).add(userId));
      const response = await api.followUser(userId);
      
      if (response.success) {
        toast.success(response.data?.following ? "Following!" : "Unfollowed");
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to follow");
    } finally {
      setConnectingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const filteredSuggestions = searchQuery
    ? suggestions.filter(person =>
        person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestions;

  const isConnected = (userId: string) => user?.connections?.includes(userId);
  const isFollowing = (userId: string) => user?.following?.includes(userId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Network</h1>
          <p className="text-muted-foreground">
            Connect with professionals across Africa
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.connections?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Connections</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.followers?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.following?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* People Suggestions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleConnect(person.id)}
                            disabled={loading}
                            className={`btn btn-sm flex-1 gap-2 ${connected ? "btn-ghost btn-outline" : "btn-primary"}`}
                            title={connected ? "Disconnect" : "Connect"}
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : connected ? (
                              <>
                                <UserMinus className="h-4 w-4" />
                                Disconnect
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4" />
                                Connect
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleFollow(person.id)}
                            disabled={loading}
                            className={`btn btn-sm ${following ? "btn-outline btn-active" : "btn-ghost btn-outline"}`}
                            title={following ? "Unfollow" : "Follow"}
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : following ? (
                              <>
                                <UserMinus className="h-4 w-4" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4" />
                                Follow
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-2">
                        <Link to={`/profile/${person.id}`} className="text-sm text-primary hover:underline">
                          View profile
                        </Link>
                      </div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                          {person.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                      <h3 className="font-semibold mb-1">{person.fullName}</h3>
                      <p className="text-sm text-muted-foreground mb-1 capitalize">
                        {person.role}
                      </p>
                      {person.location?.city && (
                        <p className="text-xs text-muted-foreground mb-4">
                          {person.location.city}, {person.location.country}
                        </p>
                      )}
                      {person.bio && (
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                          {person.bio}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnect(person.id)}
                          disabled={loading || connected}
                          className={`btn btn-sm flex-1 gap-2 ${
                            connected ? "btn-success" : "btn-primary"
                          }`}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : connected ? (
                            <>
                              <UserCheck className="h-4 w-4" />
                              Connected
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Connect
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleFollow(person.id)}
                          disabled={loading}
                          className={`btn btn-sm btn-outline gap-2 ${
                            following ? "btn-active" : ""
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
    </Layout>
  );
};

export default NetworkPage;