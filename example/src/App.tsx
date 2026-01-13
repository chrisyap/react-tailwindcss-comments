import React, { useState, useEffect } from "react";
import { CommentSection } from "@lib";
import type { CommentData } from "@lib";
import "@lib/styles.css";

type Theme = "light" | "dark" | "system";

// Helper functions (copy from your README or src/index.tsx)
const addReply = (
  comments: CommentData[],
  parentId: number | string,
  newReply: CommentData,
): CommentData[] => {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newReply],
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReply(comment.replies, parentId, newReply),
      };
    }
    return comment;
  });
};

const toggleLike = (
  comments: CommentData[],
  targetId: number | string,
): CommentData[] => {
  return comments.map((comment) => {
    if (comment.id === targetId) {
      return { ...comment, likes: comment.likes + 1 };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: toggleLike(comment.replies, targetId),
      };
    }
    return comment;
  });
};

const deleteComment = (
  comments: CommentData[],
  targetId: number | string,
): CommentData[] => {
  return comments.filter((comment) => {
    if (comment.id === targetId) return false;
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = deleteComment(comment.replies, targetId);
    }
    return true;
  });
};

const App: React.FC = () => {
  const [comments, setComments] = useState<CommentData[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "https://placehold.co/40x40/3b82f6/fff?text=SJ",
      content:
        "This is a great component! Really love the nested reply feature.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 5,
      replies: [
        {
          id: 2,
          author: "Mike Chen",
          avatar: "https://placehold.co/40x40/10b981/fff?text=MC",
          content: "I agree! The design is clean and intuitive.",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          likes: 2,
          isBlocked: true,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      author: "Alex Rivera",
      avatar: "https://placehold.co/40x40/f59e0b/fff?text=AR",
      content: "Can this be customized with different themes?",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 1,
      replies: [],
    },
  ]);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme") as Theme;
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const handleAddComment = (
    content: { message: string; author: string },
    parentId?: number | string,
  ) => {
    console.log("Adding comment:", content, "Parent ID:", parentId);
    const newComment: CommentData = {
      id: Date.now(),
      author: content.author,
      avatar: "https://placehold.co/40x40/8b5cf6/fff?text=CU",
      content: content.message,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    if (parentId) {
      setComments((prevComments) =>
        addReply(prevComments, parentId, newComment),
      );
    } else {
      setComments((prev) => [...prev, newComment]);
    }
  };

  const handleLike = (commentId: number | string) => {
    setComments((prevComments) => toggleLike(prevComments, commentId));
  };

  const handleDelete = (commentId: number | string) => {
    setComments((prevComments) => deleteComment(prevComments, commentId));
  };

  useEffect(() => {
    console.log("Current comments state:", comments);
  }, [comments]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Comment Component Local Test
          </h1>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLike={handleLike}
          onDelete={handleDelete}
          isAdmin={true}
          primaryColor="#3d6300"
        />
      </div>
    </div>
  );
};

export default App;
