import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Image, X, Hash, AtSign, Send } from "lucide-react";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <textarea
                placeholder="Share an update, service, or opportunity..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-ghost text-lg w-full h-32 resize-none focus:outline-none p-0"
                required
              />

              {/* Image Previews */}
              {images.length > 0 && (
                <div className={`grid gap-2 mt-4 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-video">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-circle btn-sm absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {hashtags.map((tag) => (
                    <span key={tag} className="badge badge-primary gap-1">
                      #{tag}
                      <button type="button" onClick={() => removeHashtag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-base-200 mt-4">
                <div className="flex gap-1">
                  <label className="btn btn-ghost btn-sm btn-circle cursor-pointer">
                    <Image className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="dropdown dropdown-top">
                    <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                      <Hash className="w-5 h-5" />
                    </label>
                    <div tabIndex={0} className="dropdown-content z-10 p-3 shadow bg-base-100 rounded-box w-52 mb-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add hashtag"
                          value={hashtagInput}
                          onChange={(e) => setHashtagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                          className="input input-bordered input-sm flex-1"
                        />
                        <button type="button" onClick={addHashtag} className="btn btn-sm btn-primary">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm btn-circle">
                    <AtSign className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-base-content/50">{content.length}/500</span>
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
              disabled={!content.trim() || isSubmitting}
              className="btn btn-primary flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
