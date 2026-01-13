import React from "react";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import {
  CommentData,
  CommentSectionProps,
  CommentProps,
  CommentInputProps,
} from "./types";
import "./styles.css";

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onLike,
  onDelete,
  currentUser,
  maxDepth = 5,
  className = "",
  isAdmin = false,
  primaryColor,
  isLoggedIn,
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
    <div className={`rounded-lg py-6 shadow-sm ${className}`}>
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Comments ({getTotalCommentCount(comments)})
      </h2>

      {isLoggedIn && (
        <CommentInput
          onSubmit={(content) => onAddComment(content)}
          placeholder="Write a comment..."
          buttonText="Post Comment"
          primaryColor={primaryColor}
        />
      )}
      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onAddComment}
            onLike={onLike}
            onDelete={onDelete}
            maxDepth={maxDepth}
            isAdmin={isAdmin}
            primaryColor={primaryColor}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
};

export type {
  CommentData,
  CommentSectionProps,
  CommentProps,
  CommentInputProps,
};
