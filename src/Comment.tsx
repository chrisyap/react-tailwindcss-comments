import React, { useState } from "react";
import { Ban, Heart, MessageCircleMore } from "lucide-react";
import CommentInput from "./CommentInput";
import { CommentProps } from "./types";
import { getInitials, getRandomNonPastelHex, formatTimestamp } from "./util";

const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  depth = 0,
  maxDepth = 5,
  isAdmin = false,
  primaryColor,
  isLoggedIn,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleReply = (content: { message: string; author: string }) => {
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

  const avatarUrl = `https://placehold.co/40x40/${getRandomNonPastelHex()}/fff?text=${getInitials(comment.author)}`;

  const canReply = depth < maxDepth && isLoggedIn;

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
