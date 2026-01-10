import { Link } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Briefcase, Mail, Phone, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "@/components/VerificationBadge";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-teal-light relative">
            <button className="absolute bottom-4 right-4 btn btn-sm btn-circle bg-background/80 hover:bg-background">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0">
                <img
                  src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d9488&color=fff&size=256`}
                  alt={user?.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card object-cover"
                />
                <button className="absolute bottom-2 right-2 btn btn-sm btn-circle bg-primary text-primary-foreground">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Edit Button */}
              <Link to="/profile/edit" className="btn btn-primary btn-sm">
                Edit Profile
              </Link>
            </div>

            {/* Name and Title */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                {user?.verification?.email && (
                  <VerificationBadge type="verified" size="md" />
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {user?.role === 'seeker' && (user?.bio || 'Job Seeker')}
                {user?.role === 'agent' && 'Recruitment Agent'}
                {user?.role === 'business' && (user?.companyName || 'Business Owner')}
                {user?.role === 'company' && (user?.companyName || 'Company')}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user?.location?.city && user?.location?.state && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location.city}, {user.location.state}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* About */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              {user?.bio ? (
                <p className="text-muted-foreground">{user.bio}</p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Tell others about yourself</p>
                  <Link to="/profile/edit" className="btn btn-outline btn-sm">
                    Add Bio
                  </Link>
                </div>
              )}
            </div>

            {/* Skills */}
            {user?.role === 'seeker' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="badge badge-primary badge-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Add your skills to stand out</p>
                    <Link to="/profile/edit" className="btn btn-outline btn-sm">
                      Add Skills
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Experience */}
            {user?.role === 'seeker' && user?.experience && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Experience</h2>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span className="font-medium">{user.experience.level}</span>
                  <span className="text-muted-foreground">• {user.experience.years} years</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-semibold">{user?.connections?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posts</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  {user?.verification?.email ? (
                    <span className="badge badge-success badge-sm">Verified</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone</span>
                  {user?.verification?.phone ? (
                    <span className="badge badge-success badge-sm">Verified</span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Not Verified</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity</span>
                  {user?.verification?.identity ? (
                    <span className="badge badge-success badge-sm">Verified</span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Not Verified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;