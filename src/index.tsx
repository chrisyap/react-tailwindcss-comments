import React, { useState } from "react";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { CommentData } from "./Comment";
import "./styles.css";

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
  isAdmin?: boolean;
  primaryColor?: string;
}

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

      <CommentInput
        onSubmit={(content) => onAddComment(content)}
        placeholder="Write a comment..."
        buttonText="Post Comment"
        primaryColor={primaryColor}
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
            isAdmin={isAdmin}
            primaryColor={primaryColor}
          />
        ))}
      </div>
    </div>
  );
};
