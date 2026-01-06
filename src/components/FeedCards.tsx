import { Link } from "react-router-dom";
import { MapPin, Clock, Bookmark, BadgeCheck, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    verified: boolean;
    logo: string;
    description?: string;
    tags?: string[];
    applicants?: number;
  };
  variant?: "compact" | "full";
}

const JobCard = ({ job, variant = "compact" }: JobCardProps) => {
  return (
    <div className="job-card group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={`/jobs/${job.id}`}
                  className="font-semibold text-base md:text-lg truncate group-hover:text-primary transition-colors"
                >
                  {job.title}
                </Link>
                {job.verified && <VerificationBadge type="verified" size="sm" />}
              </div>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <button className="btn btn-ghost btn-circle btn-sm flex-shrink-0">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.posted}
            </span>
            <span className="badge badge-outline badge-sm">{job.type}</span>
          </div>

          {variant === "full" && job.description && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {job.description}
            </p>
          )}

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {job.tags.map((tag, i) => (
                <span key={i} className="badge badge-ghost badge-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{job.salary}</p>
          {job.applicants && (
            <p className="text-xs text-muted-foreground">{job.applicants} applicants</p>
          )}
        </div>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

interface SocialPostCardProps {
  post: {
    id: number;
    author: {
      name: string;
      role: string;
      avatar: string;
      verified: boolean;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    posted: string;
    hashtags?: string[];
  };
}

const SocialPostCard = ({ post }: SocialPostCardProps) => {
  return (
    <div className="feed-card">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Link to={`/profile/${post.id}`}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${post.id}`} className="font-semibold hover:text-primary transition-colors truncate">
              {post.author.name}
            </Link>
            {post.author.verified && <VerificationBadge type="verified" size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {post.author.role} • {post.posted}
          </p>
        </div>
        <button className="btn btn-ghost btn-circle btn-sm">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm md:text-base mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.hashtags.map((tag, i) => (
            <Link key={i} to={`/search?q=${tag}`} className="text-primary text-sm hover:underline">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 -mx-4 md:mx-0">
          <img src={post.image} alt="" className="w-full h-auto" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button className="btn btn-ghost btn-sm gap-1.5">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes}</span>
        </button>
        <button className="btn btn-ghost btn-sm gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comments}</span>
        </button>
        <button className="btn btn-ghost btn-sm gap-1.5">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">{post.shares}</span>
        </button>
      </div>
    </div>
  );
};

export { JobCard, SocialPostCard };
