import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Briefcase, Mail, Phone, Calendar, 
  UserPlus, UserMinus, UserCheck, Loader2, 
  ArrowLeft, Shield, Star
} from "lucide-react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  profilePhoto?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  companyName?: string;
  skills?: string[];
  experience?: {
    level: string;
    years: number;
  };
  verification?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  connections?: string[];
  followers?: string[];
  following?: string[];
  createdAt: string;
}

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserProfile(userId!);
      if (response.success && response.data) {
        setProfile(response.data.user);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile");
      navigate("/network");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profile) return;
    
    try {
      setIsActionLoading(true);
      const response = await api.connectUser(profile.id);
      
      if (response.success) {
        if (response.message?.includes('already')) {
          toast.info("You're already connected with this user");
        } else {
          toast.success("Connected successfully!");
        }
        await refreshUser();
        await fetchUserProfile();
      }
    } catch (error: any) {
      const message = error.message || "Unable to connect. Please try again.";
      toast.error(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!profile) return;
    
    try {
      setIsActionLoading(true);
      const response = await api.disconnectUser(profile.id);
      
      if (response.success) {
        toast.success("Disconnected");
        await refreshUser();
        await fetchUserProfile();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      setIsActionLoading(true);
      const response = await api.followUser(profile.id);
      
      if (response.success) {
        toast.success(response.data?.following ? "Following!" : "Unfollowed");
        await refreshUser();
        await fetchUserProfile();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to follow");
    } finally {
      setIsActionLoading(false);
    }
  };

  const isConnected = profile && currentUser?.connections?.includes(profile.id);
  const isFollowing = profile && currentUser?.following?.includes(profile.id);
  const isOwnProfile = profile?.id === currentUser?.id;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <button onClick={() => navigate("/network")} className="btn btn-primary">
            Back to Network
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Profile Header Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300 mb-6">
          <div className="card-body p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {profile.profilePhoto ? (
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                      <img src={profile.profilePhoto} alt={profile.fullName} />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-5xl font-bold ring ring-primary ring-offset-base-100 ring-offset-4">
                    {profile.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      {profile.fullName}
                      {profile.verification?.identity && (
                        <div className="tooltip" data-tip="Verified">
                          <Shield className="h-5 w-5 text-blue-500 fill-blue-500" />
                        </div>
                      )}
                    </h1>
                    <p className="text-lg text-base-content/70 capitalize mb-2">
                      {profile.role}
                      {profile.companyName && ` at ${profile.companyName}`}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-2xl font-bold">{profile.connections?.length || 0}</p>
                    <p className="text-sm text-base-content/60">Connections</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.followers?.length || 0}</p>
                    <p className="text-sm text-base-content/60">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.following?.length || 0}</p>
                    <p className="text-sm text-base-content/60">Following</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-3">
                    {isConnected ? (
                      <button
                        onClick={handleDisconnect}
                        disabled={isActionLoading}
                        className="btn btn-outline gap-2"
                      >
                        {isActionLoading ? (
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
                        onClick={handleConnect}
                        disabled={isActionLoading}
                        className="btn btn-primary gap-2"
                      >
                        {isActionLoading ? (
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
                      onClick={handleFollow}
                      disabled={isActionLoading}
                      className={`btn gap-2 ${isFollowing ? "btn-success" : "btn-ghost"}`}
                    >
                      {isActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.bio && (
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-3">About</h2>
                  <p className="text-base-content/80 whitespace-pre-wrap">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="badge badge-lg badge-primary gap-2">
                        <Star className="h-3 w-3" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experience && (
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-3">Experience</h2>
                  <div className="space-y-2">
                    <p className="text-base-content/80">
                      <span className="font-semibold">Level:</span>{" "}
                      <span className="capitalize">{profile.experience.level}</span>
                    </p>
                    <p className="text-base-content/80">
                      <span className="font-semibold">Years:</span>{" "}
                      {profile.experience.years} years
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl mb-3">Contact Info</h2>
                <div className="space-y-3">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-base-content/60" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-base-content/60" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location?.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-base-content/60" />
                      <span className="text-sm">
                        {profile.location.city}, {profile.location.state}, {profile.location.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-base-content/60" />
                    <span className="text-sm">
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            {profile.verification && (
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-3">Verification</h2>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email</span>
                      {profile.verification.email ? (
                        <div className="badge badge-success gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="badge badge-ghost">Not verified</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone</span>
                      {profile.verification.phone ? (
                        <div className="badge badge-success gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="badge badge-ghost">Not verified</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Identity</span>
                      {profile.verification.identity ? (
                        <div className="badge badge-success gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="badge badge-ghost">Not verified</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
