import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Briefcase,
  MapPin,
  Banknote,
  Image,
  X,
  Plus,
  Hash,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const categories = [
  "Sales & Marketing",
  "Hospitality",
  "Retail",
  "Logistics",
  "Customer Service",
  "Security",
  "Admin & Office",
  "IT & Tech",
  "Healthcare",
  "Education",
  "Other",
];

const locations = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Kaduna",
  "Enugu",
  "Benin City",
  "Other",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
  });
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const isVerified = true; // Mock verification status

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/my-jobs");
  };

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.location &&
    formData.type &&
    formData.description;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Post a Job</h1>
        <p className="text-base-content/70 mb-6">Create a new job listing for job seekers</p>

        {!isVerified && (
          <div className="alert alert-warning mb-6">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h4 className="font-medium">Verification Required</h4>
              <p className="text-sm">Complete your verification to build trust with job seekers.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Basic Information</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Job Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Sales Representative"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Type</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select type</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="select select-bordered"
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Salary Min (₦)</span>
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    placeholder="e.g., 50000"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Salary Max (₦)</span>
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    placeholder="e.g., 100000"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Job Description</h2>

              <div className="form-control">
                <textarea
                  name="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Requirements</span>
                </label>
                <div className="space-y-2">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., Minimum SSCE qualification"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="input input-bordered input-sm flex-1"
                      />
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="btn btn-ghost btn-sm gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add requirement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Media (Optional)</h2>
              <p className="text-sm text-base-content/60 mb-2">Add images of your workplace or team</p>

              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-circle btn-xs absolute -top-2 -right-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-base-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Image className="w-6 h-6 text-base-content/40" />
                    <span className="text-xs text-base-content/40 mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Hashtags Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Hashtags (Optional)</h2>

              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag) => (
                  <span key={tag} className="badge badge-primary gap-1">
                    #{tag}
                    <button type="button" onClick={() => removeHashtag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Add hashtag"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                    className="input input-bordered input-sm w-full pl-9"
                  />
                </div>
                <button type="button" onClick={addHashtag} className="btn btn-sm btn-ghost">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateJobPage;
