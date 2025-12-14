import React, { useState } from "react";
import "./styles.css";

export interface CommentData {
  id: number | string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: CommentData[];
}

export interface CommentSectionProps {
  comments: CommentData[];
  onAddComment: (content: string, parentId?: number | string) => void;
  onLike?: (commentId: number | string) => void;
  onDelete?: (commentId: number | string) => void;
  currentUser?: {
    name: string;
    avatar?: string;
  };
  maxDepth?: number;
  className?: string;
}

export interface CommentProps {
  comment: CommentData;
  onReply: (content: string, parentId: number | string) => void;
  onLike?: (commentId: number | string) => void;
  onDelete?: (commentId: number | string) => void;
  depth?: number;
  maxDepth?: number;
}

export interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  buttonText?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onLike,
  onDelete,
  currentUser,
  maxDepth = 5,
  className = "",
}) => {
  const getTotalCommentCount = (comments: CommentData[]): number => {
    return comments.reduce((total, comment) => {
      return (
        total +
        1 +
        (comment.replies ? getTotalCommentCount(comment.replies) : 0)
      );
    }, 0);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Comments ({getTotalCommentCount(comments)})
      </h2>

      <CommentInput
        onSubmit={(content) => onAddComment(content)}
        placeholder="Write a comment..."
        buttonText="Post Comment"
      />

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onAddComment}
            onLike={onLike}
            onDelete={onDelete}
            maxDepth={maxDepth}
          />
        ))}
      </div>
    </div>
  );
};

export const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  depth = 0,
  maxDepth = 5,
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

  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? "ml-12 mt-4" : ""}`}>
      <div className="flex gap-3">
        {comment.avatar ? (
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(comment.author)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {comment.author}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="text-gray-700 break-words">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-2 ml-2">
            {onLike && (
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-sm font-medium transition-colors px-2 py-1 rounded ${
                  isLiked
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span>{isLiked ? "👍" : "👍"}</span>
                <span>{comment.likes}</span>
              </button>
            )}

            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded"
              >
                <span>💬</span> Reply
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors px-2 py-1 rounded"
              >
                <span>🗑️</span> Delete
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

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
  buttonText = "Post",
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-shadow"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentSection;
