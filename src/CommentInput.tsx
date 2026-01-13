import React, { useState } from "react";
import { CommentInputProps } from "./types";
import { cn } from "./util";

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
  buttonText = "Post",
  primaryColor,
}) => {
  const [value, setValue] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit({ message: value.trim(), author: author.trim() || "Anonymous" });
    setValue("");
  };

  React.useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        primaryColor,
      );
    }
  }, [primaryColor]);

  const classes = cn(
    primaryColor
      ? "focus:border-[color:var(--primary-color)] focus:ring-[color:var(--primary-color)] dark:focus:border-[color:var(--primary-color)] dark:focus:ring-[color:var(--primary-color)]"
      : "focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500",
    "border-stone-200 bg-stone-100 text-black dark:bg-stone-900 dark:text-white",
    "w-full rounded-md border-2 p-2 text-sm focus:outline-none focus:ring-2 dark:border-stone-800 dark:focus:outline-none dark:focus:ring-2",
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className={classes}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        rows={4}
      />
      <input
        type="text"
        placeholder="Your name"
        className={classes}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <div className="mt-2 flex items-center">
        <button
          type="submit"
          className={cn(
            primaryColor
              ? "hover:bg-[color:var(--primary-color)]/90 bg-[color:var(--primary-color)]"
              : "bg-blue-600 hover:bg-blue-700",
            "mt-1 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors",
          )}
        >
          {buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mx-1 inline-flex items-center px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentInput;
