import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image, Video, Smile, Hash, AtSign, X, Loader2, Upload, FileText
} from "lucide-react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= (isVideo ? 50 : 5) * 1024 * 1024;
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Max ${isVideo ? '50MB' : '5MB'}`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length + media.length > 10) {
      toast.error("Maximum 10 files allowed");
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setMediaPreview([...mediaPreview, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setMedia([...media, ...validFiles]);
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
    setMediaPreview(mediaPreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && media.length === 0) {
      toast.error("Please add some content or media");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload media first if any
      let mediaUrls: any[] = [];
      if (media.length > 0) {
        setIsUploading(true);
        const uploadResponse = await api.uploadMedia(media);
        
        if (uploadResponse.success && uploadResponse.data) {
          mediaUrls = uploadResponse.data.files.map((file: any) => ({
            url: file.url,
            type: file.type,
            publicId: file.publicId
          }));
        }
        setIsUploading(false);
      }

      // Create post
      const response = await api.createPost({
        content: content.trim(),
        media: mediaUrls,
        isPublic: true
      });

      if (response.success) {
        toast.success("Post created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const insertHashtag = () => {
    setContent(content + " #");
  };

  const insertMention = () => {
    setContent(content + " @");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create a Post</h1>
            <p className="text-base-content/60">
              Share your thoughts, updates, or achievements with your network
            </p>
          </div>

          {/* Create Post Form */}
          <form onSubmit={handleSubmit}>
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d9488&color=fff&size=128`}
                        alt={user?.fullName}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{user?.fullName}</p>
                    <p className="text-sm text-base-content/60 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Content Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, use #hashtags and @mentions..."
                  className="textarea textarea-bordered w-full min-h-[200px] text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={2000}
                />

                <div className="flex justify-between items-center text-sm text-base-content/60 mb-4">
                  <span>{content.length}/2000 characters</span>
                  <div className="flex gap-2">
                    <span className="badge badge-sm">
                      {content.match(/#\w+/g)?.length || 0} hashtags
                    </span>
                    <span className="badge badge-sm">
                      {content.match(/@\w+/g)?.length || 0} mentions
                    </span>
                  </div>
                </div>

                {/* Media Preview */}
                {mediaPreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {mediaPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        {media[index].type.startsWith('image/') ? (
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={preview}
                            className="w-full h-40 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Toolbar */}
                <div className="divider my-2"></div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-ghost btn-sm gap-2"
                      disabled={media.length >= 10}
                    >
                      <Image className="h-4 w-4" />
                      <span className="hidden sm:inline">Photo/Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={insertHashtag}
                      className="btn btn-ghost btn-sm gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span className="hidden sm:inline">Hashtag</span>
                    </button>

                    <button
                      type="button"
                      onClick={insertMention}
                      className="btn btn-ghost btn-sm gap-2"
                    >
                      <AtSign className="h-4 w-4" />
                      <span className="hidden sm:inline">Mention</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-ghost"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary gap-2"
                      disabled={isSubmitting || isUploading || (!content.trim() && media.length === 0)}
                    >
                      {isSubmitting || isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isUploading ? "Uploading..." : "Posting..."}
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Tips Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300 mt-6">
            <div className="card-body p-6">
              <h3 className="font-semibold mb-3">Tips for great posts:</h3>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use <strong>#hashtags</strong> to increase discoverability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Tag people with <strong>@mentions</strong> to engage your network
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Add images or videos to make your post more engaging
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Keep it professional and authentic
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
