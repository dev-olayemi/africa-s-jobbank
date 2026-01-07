import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";

const skillOptions = [
  "Sales", "Customer Service", "Communication", "Retail", "Hospitality",
  "Driving", "Cooking", "Security", "Admin", "Marketing", "IT", "Accounting",
];

const categoryOptions = [
  "Sales & Marketing", "Hospitality", "Retail", "Logistics",
  "Customer Service", "Security", "Admin & Office", "IT & Tech",
];

const EditProfilePage = () => {
  const navigate = useNavigate();
  const userRole = "seeker"; // Mock - would come from auth context
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "Adaeze Okonkwo",
    email: "adaeze@example.com",
    phone: "+234 801 234 5678",
    bio: "Sales professional with 3 years experience.",
    location: "Lagos, Nigeria",
  });

  const [avatar, setAvatar] = useState<string | null>(
    "https://ui-avatars.com/api/?name=Adaeze+Okonkwo&background=0D9488&color=fff&size=200"
  );
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Sales", "Customer Service"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Sales & Marketing"]);

  const isVerified = false; // Mock verification status

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdFile(file);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/profile");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        {/* Verification Status */}
        <div className={`alert ${isVerified ? "alert-success" : "alert-warning"} mb-6`}>
          {isVerified ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Your profile is verified. You have a trust badge.</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <div>
                <h4 className="font-medium">Complete verification</h4>
                <p className="text-sm">Upload your ID to get a verified badge and build trust.</p>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Profile Photo</h2>
              {userRole === "seeker" && (
                <p className="text-sm text-warning">Face-card photo is required for job seekers.</p>
              )}

              <div className="flex items-center gap-4 mt-2">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      {avatar ? (
                        <img src={avatar} alt="Profile" />
                      ) : (
                        <div className="bg-base-200 w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-base-content/40" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-sm text-base-content/60">
                  <p>Upload a clear photo of your face.</p>
                  <p>JPG or PNG, max 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Basic Information</h2>

              <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Phone</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Location</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Bio</span></label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* CV Upload (Seekers only) */}
          {userRole === "seeker" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">CV / Resume</h2>

                <label className="border-2 border-dashed border-base-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-primary transition-colors">
                  <FileText className="w-10 h-10 text-base-content/40 mb-2" />
                  {cvFile ? (
                    <span className="text-sm font-medium">{cvFile.name}</span>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Upload your CV</span>
                      <span className="text-xs text-base-content/50 mt-1">PDF, DOC, max 10MB</span>
                    </>
                  )}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* ID Verification */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">ID Verification</h2>
              <p className="text-sm text-base-content/60">
                Upload a valid ID to get your verified badge.
              </p>

              <label className="border-2 border-dashed border-base-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-primary transition-colors mt-2">
                <Upload className="w-10 h-10 text-base-content/40 mb-2" />
                {idFile ? (
                  <span className="text-sm font-medium">{idFile.name}</span>
                ) : (
                  <>
                    <span className="text-sm font-medium">Upload ID Document</span>
                    <span className="text-xs text-base-content/50 mt-1">NIN, Voter's Card, Driver's License, or Passport</span>
                  </>
                )}
                <input type="file" accept="image/*,.pdf" onChange={handleIdChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Skills (Seekers only) */}
          {userRole === "seeker" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`badge cursor-pointer ${
                        selectedSkills.includes(skill) ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Job Categories (Seekers only) */}
          {userRole === "seeker" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">Job Alert Categories</h2>
                <p className="text-sm text-base-content/60">Get notified about jobs in these categories.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`badge cursor-pointer ${
                        selectedCategories.includes(cat) ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn btn-primary flex-1">
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
