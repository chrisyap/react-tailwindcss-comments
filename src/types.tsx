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
  onReply: (
    content: { message: string; author: string },
    parentId: number | string,
  ) => void;
  onLike?: (commentId: number | string) => void;
  onDelete?: (commentId: number | string) => void;
  depth?: number;
  maxDepth?: number;
  isAdmin?: boolean;
  primaryColor?: string;
}

export interface CommentInputProps {
  onSubmit: ({ message, author }: { message: string; author: string }) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  buttonText?: string;
  primaryColor?: string;
}

export interface CommentSectionProps {
  comments: CommentData[];
  onAddComment: (
    content: { message: string; author: string },
    parentId?: number | string,
  ) => void;
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
  isLoggedIn?: boolean;
}
