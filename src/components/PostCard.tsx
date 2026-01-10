import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit,
  Archive,
  Eye,
  Flag,
  Bookmark,
  Link as LinkIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface PostAuthor {
  _id: string;
  fullName: string;
  profilePhoto?: string;
  role: string;
  companyName?: string;
  verification?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
}

interface PostMedia {
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
  content: string;
  media?: PostMedia[];
  hashtags?: string[];
  likes?: any[];
  comments?: any[];
  shares?: any[];
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const PostCard = ({ post, onDelete, onUpdate }: PostCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnPost = user?.id === post.author._id;

  const handleLike = async () => {
    try {
      const response = await api.likePost(post._id);
      if (response.success) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to like post");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.commentOnPost(post._id, commentText);
      if (response.success) {
        setCommentsCount(response.data.commentsCount);
        setCommentText("");
        toast.success("Comment added");
        if (onUpdate) onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await api.deletePost(post._id);
      if (response.success) {
        toast.success("Post deleted");
        if (onDelete) onDelete();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300 mb-4">
      <div className="card-body p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="avatar cursor-pointer"
              onClick={() => navigate(`/profile/${post.author._id}`)}
            >
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    post.author.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.author.fullName
                    )}&background=0d9488&color=fff&size=128`
                  }
                  alt={post.author.fullName}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="font-semibold hover:text-primary cursor-pointer"
                  onClick={() => navigate(`/profile/${post.author._id}`)}
                >
                  {post.author.fullName}
                </h3>
                {post.author.verification?.identity && (
                  <div className="badge badge-primary badge-sm">✓</div>
                )}
              </div>
              <p className="text-sm text-base-content/60 capitalize">
                {post.author.role}
                {post.author.companyName && ` at ${post.author.companyName}`}
              </p>
              <p className="text-xs text-base-content/50">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Post Menu */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm bg-base-100 rounded-xl shadow-lg w-56 p-2 border border-base-300 z-10"
            >
              {isOwnPost ? (
                <>
                  <li>
                    <button className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Post
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Interactions
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Archive Post
                    </button>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Post
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      Save Post
                    </button>
                  </li>
                  <li>
                    <button onClick={handleShare} className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Copy Link
                    </button>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button className="flex items-center gap-2 text-warning">
                      <Flag className="h-4 w-4" />
                      Report Post
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-base whitespace-pre-wrap break-words">
            {post.content.split(/(\s+)/).map((word, index) => {
              if (word.startsWith("#")) {
                return (
                  <span key={index} className="text-primary font-medium cursor-pointer hover:underline">
                    {word}
                  </span>
                );
              }
              if (word.startsWith("@")) {
                return (
                  <span key={index} className="text-secondary font-medium cursor-pointer hover:underline">
                    {word}
                  </span>
                );
              }
              return <span key={index}>{word}</span>;
            })}
          </p>
        </div>

        {/* Post Media */}
        {post.media && post.media.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${
              post.media.length === 1
                ? "grid-cols-1"
                : post.media.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {post.media.map((item, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-base-content/60 mb-3 pb-3 border-b border-base-300">
          <div className="flex items-center gap-4">
            <span>{likesCount} likes</span>
            <span>{commentsCount} comments</span>
            <span>{post.shares?.length || 0} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around mb-3">
          <button
            onClick={handleLike}
            className={`btn btn-ghost btn-sm gap-2 flex-1 ${
              isLiked ? "text-error" : ""
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-ghost btn-sm gap-2 flex-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <button onClick={handleShare} className="btn btn-ghost btn-sm gap-2 flex-1">
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="pt-3 border-t border-base-300">
            <div className="flex gap-2 mb-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    src={
                      user?.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullName || "User"
                      )}&background=0d9488&color=fff&size=128`
                    }
                    alt={user?.fullName}
                  />
                </div>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="input input-bordered input-sm flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={isSubmitting || !commentText.trim()}
                  className="btn btn-primary btn-sm"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.slice(0, 3).map((comment: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={
                            comment.user?.profilePhoto ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              comment.user?.fullName || "User"
                            )}&background=0d9488&color=fff&size=128`
                          }
                          alt={comment.user?.fullName}
                        />
                      </div>
                    </div>
                    <div className="flex-1 bg-base-200 rounded-lg p-3">
                      <p className="font-semibold text-sm">
                        {comment.user?.fullName}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {post.comments.length > 3 && (
                  <button className="text-sm text-primary hover:underline">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
