import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Loader2, Save, X } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ProfileEditPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: {
      city: user?.location?.city || "",
      state: user?.location?.state || "",
      country: user?.location?.country || "Nigeria",
    },
    skills: user?.skills?.join(", ") || "",
    experience: {
      level: user?.experience?.level || "entry",
      years: user?.experience?.years || 0,
    },
    companyName: user?.companyName || "",
    companySize: user?.companySize || "",
    industry: user?.industry || "",
  });

  const [previewPhoto, setPreviewPhoto] = useState(user?.profilePhoto || "");
  const [previewBanner, setPreviewBanner] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: {
          city: user.location?.city || "",
          state: user.location?.state || "",
          country: user.location?.country || "Nigeria",
        },
        skills: user.skills?.join(", ") || "",
        experience: {
          level: user.experience?.level || "entry",
          years: user.experience?.years || 0,
        },
        companyName: user.companyName || "",
        companySize: user.companySize || "",
        industry: user.industry || "",
      });
      setPreviewPhoto(user.profilePhoto || "");
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsUploading(true);
      const response = await api.uploadProfilePhoto(file);
      
      if (response.success && response.data) {
        // Update profile with new photo URL
        await api.updateProfile({ profilePhoto: response.data.url });
        await refreshUser();
        toast.success("Profile photo updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile photo");
      setPreviewPhoto(user?.profilePhoto || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV size should be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const response = await api.uploadCV(file);
      
      if (response.success && response.data) {
        await api.updateProfile({ cvUrl: response.data.url });
        await refreshUser();
        toast.success("CV uploaded successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload CV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      // Prepare update data
      const updates: any = {
        fullName: formData.fullName,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
      };

      // Add skills as array
      if (formData.skills) {
        updates.skills = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      }

      // Add company fields for business/company roles
      if (user?.role === "business" || user?.role === "company") {
        updates.companyName = formData.companyName;
        updates.companySize = formData.companySize;
        updates.industry = formData.industry;
      }

      const response = await api.updateProfile(updates);
      
      if (response.success) {
        await refreshUser();
        toast.success("Profile updated successfully");
        navigate("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <button
            onClick={() => navigate("/profile")}
            className="btn btn-ghost btn-sm gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Profile" />
                      ) : (
                        <div className="bg-base-300 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-base-content/50" />
                        </div>
                      )}
                    </div>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={profilePhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                  <p className="text-sm text-base-content/60 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Lagos"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Lagos State"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          {user?.role === "seeker" && (
            <>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title text-lg mb-4">Professional Information</h2>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Skills</span>
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="JavaScript, React, Node.js (comma separated)"
                      />
                      <label className="label">
                        <span className="label-text-alt">Separate skills with commas</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Experience Level</span>
                        </label>
                        <select
                          name="experience.level"
                          value={formData.experience.level}
                          onChange={handleInputChange}
                          className="select select-bordered"
                        >
                          <option value="entry">Entry Level</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="senior">Senior</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Years of Experience</span>
                        </label>
                        <input
                          type="number"
                          name="experience.years"
                          value={formData.experience.years}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Upload */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title text-lg mb-4">CV/Resume</h2>
                  <div className="flex items-center gap-4">
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      disabled={isUploading}
                      className="btn btn-outline btn-sm gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {user?.cvUrl ? "Update CV" : "Upload CV"}
                    </button>
                    {user?.cvUrl && (
                      <a
                        href={user.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View current CV
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-base-content/60 mt-2">
                    PDF only. Max size 10MB.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Company Information */}
          {(user?.role === "business" || user?.role === "company") && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Company Information</h2>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Name</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Company Size</span>
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        className="select select-bordered"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501+">501+ employees</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Industry</span>
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Technology, Finance, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfileEditPage;