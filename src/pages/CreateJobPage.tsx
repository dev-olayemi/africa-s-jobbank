import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Image,
  X,
  Plus,
  Hash,
  AlertCircle,
} from "lucide-react";

const categories = [
  { label: "Sales & Marketing", value: "marketing-media" },
  { label: "Hospitality & Food", value: "hospitality-food" },
  { label: "Retail", value: "retail-sales" },
  { label: "Logistics & Transport", value: "logistics-transport" },
  { label: "Customer Service", value: "customer-service" },
  { label: "Security & Cleaning", value: "security-cleaning" },
  { label: "Admin & Office", value: "admin-office" },
  { label: "IT & Tech", value: "technology-digital" },
  { label: "Healthcare & Beauty", value: "healthcare-beauty" },
  { label: "Education & Training", value: "education-training" },
  { label: "Construction & Trades", value: "construction-trades" },
  { label: "Finance & Accounting", value: "finance-accounting" },
  { label: "Agriculture & Farming", value: "agriculture-farming" },
  { label: "Manufacturing & Production", value: "manufacturing-production" },
  { label: "Other", value: "other" },
];

const jobTypes = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    state: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
  });
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
      
      // Create preview URLs
      const previews = newFiles.map((file) => URL.createObjectURL(file));
      setImages([...images, ...previews]);
      setImageFiles([...imageFiles, ...newFiles]);
      
      toast.success(`${newFiles.length} image(s) added`);
    } catch (error) {
      toast.error("Failed to add images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the blob URL to free memory
    URL.revokeObjectURL(images[index]);
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload images first if any
      let uploadedMedia: Array<{ url: string; type: string }> = [];
      if (imageFiles.length > 0) {
        toast.info("Uploading images...");
        
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('image', file);
          
          try {
            const response = await api.uploadJobImage(formData);
            if (response.success && response.data) {
              uploadedMedia.push({
                url: response.data.url,
                type: 'image'
              });
            }
          } catch (error) {
            console.error('Failed to upload image:', error);
            // Continue with other images
          }
        }
      }

      // Prepare job data
      const jobData: any = {
        title: formData.title,
        category: formData.category,
        location: {
          city: formData.city,
          state: formData.state,
          country: 'Nigeria',
          isRemote: false
        },
        type: formData.type,
        description: formData.description,
        companyName: formData.companyName,
        requirements: {
          skills: requirements.filter(r => r.trim()),
          experience: {
            min: 0,
            max: 10
          }
        },
        tags: hashtags,
        media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
      };

      // Add salary if provided
      if (formData.salaryMin && formData.salaryMax) {
        jobData.salary = {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax),
          currency: 'NGN'
        };
      }

      // Add optional company details if provided
      if (formData.companyEmail) {
        jobData.applicationEmail = formData.companyEmail;
      }
      if (formData.companyPhone) {
        jobData.applicationPhone = formData.companyPhone;
      }
      if (formData.companyAddress) {
        jobData.location.address = formData.companyAddress;
      }

      console.log('Submitting job data:', jobData);

      const response = await api.createJob(jobData);
      
      console.log('Job creation response:', response);
      
      if (response.success) {
        toast.success("Job posted successfully!");
        navigate("/my-jobs");
      } else {
        toast.error(response.message || "Failed to post job");
      }
    } catch (error: any) {
      console.error('Job posting error:', error);
      toast.error(error.message || "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.city &&
    formData.state &&
    formData.type &&
    formData.description &&
    formData.description.length >= 50 &&
    formData.companyName;

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
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g., Lagos"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g., Lagos State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
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

          {/* Company Details Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Company Details</h2>
              <p className="text-sm text-base-content/60 mb-2">
                Add company information for this job posting
              </p>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company Name</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g., ABC Corporation"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Enter the company name or search for existing companies
                  </span>
                </label>
              </div>

              {/* Optional Company Details - Collapsible */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={showCompanyDetails}
                    onChange={(e) => setShowCompanyDetails(e.target.checked)}
                  />
                  <span className="label-text">Add additional company details (optional)</span>
                </label>
              </div>

              {showCompanyDetails && (
                <div className="space-y-4 mt-2 pl-4 border-l-2 border-base-300">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Email</span>
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      placeholder="e.g., hr@company.com"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Phone</span>
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      placeholder="e.g., +234 800 000 0000"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Address</span>
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      placeholder="e.g., 123 Main Street, Lagos"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm"
                    />
                  </div>

                  <div className="alert alert-info text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>These details can be added later from your profile settings</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Job Description</h2>

              <div className="form-control">
                <textarea
                  name="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great... (minimum 50 characters)"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32"
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {formData.description.length}/50 characters minimum
                  </span>
                </label>
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
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
