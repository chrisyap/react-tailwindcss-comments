import React, { useState } from "react";
import { Ban, Heart, MessageCircleMore } from "lucide-react";
import CommentInput from "./CommentInput";

export interface CommentData {
  id: number | string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  isBlocked?: boolean;
  replies?: CommentData[];
}

export interface CommentProps {
  comment: CommentData;
  onReply: (content: string, parentId: number | string) => void;
  onLike?: (commentId: number | string) => void;
  onDelete?: (commentId: number | string) => void;
  depth?: number;
  maxDepth?: number;
  isAdmin?: boolean;
  primaryColor?: string;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  depth = 0,
  maxDepth = 5,
  isAdmin = false,
  primaryColor,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setShowReplyInput(false);
  };

  const handleLike = () => {
    if (!isLiked && onLike) {
      onLike(comment.id);
      setIsLiked(true);
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this comment?")
    ) {
      onDelete(comment.id);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toHex = (c: number): string => {
    return c.toString(16).padStart(2, "0");
  };

  const getRandomNonPastelHex = (): string => {
    let r: number, g: number, b: number;

    const MAX_BRIGHTNESS_FOR_DEEP = 100; // If max component is below this, it's deep/dark.
    const MIN_SATURATION_DIFFERENCE = 80; // If max - min is above this, it's saturated.

    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);

      const max: number = Math.max(r, g, b);
      const min: number = Math.min(r, g, b);

      const isDeep: boolean = max < MAX_BRIGHTNESS_FOR_DEEP;

      const isSaturated: boolean = max - min > MIN_SATURATION_DIFFERENCE;

      if (isDeep || isSaturated) {
        break;
      }
    } while (true); // Loop until a non-pastel color is generated

    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const avatarUrl = `https://placehold.co/40x40/${getRandomNonPastelHex()}/fff?text=${getInitials(comment.author)}`;

  const canReply = depth < maxDepth;

  if (comment?.isBlocked) {
    return (
      <div className={`${depth > 0 ? "ml-2 mt-4" : ""}`}>
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={comment.author}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="mx-1">
              <p className="italic text-gray-500">
                This comment is unavailable or deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${depth > 0 ? "ml-2 mt-4" : ""}`}>
      <div className="flex gap-3">
        <img
          src={avatarUrl}
          alt={comment.author}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {comment.author}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="break-words text-gray-900 dark:text-gray-100">
              {comment.content}
            </p>
          </div>

          <div className="ml-2 mt-2 flex items-center gap-4">
            {onLike && (
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 rounded px-2 py-1 text-sm font-medium transition-colors dark:text-gray-400 ${
                  isLiked
                    ? "text-blue-500"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-blue-600" : ""}`}
                />
                <span>{comment.likes}</span>
              </button>
            )}

            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-blue-950"
              >
                <MessageCircleMore className="h-4 w-4" /> Reply
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950"
              >
                <Ban className="h-4 w-4" /> Block
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                onSubmit={handleReply}
                onCancel={() => setShowReplyInput(false)}
                placeholder="Write a reply..."
                autoFocus
                buttonText="Reply"
                primaryColor={primaryColor}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
