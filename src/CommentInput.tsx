import React, { useState } from "react";
import { cn } from "./util";

export interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  buttonText?: string;
  primaryColor?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
  buttonText = "Post",
  primaryColor,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
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
    "border-gray-200 bg-gray-100 text-black dark:bg-gray-900 dark:text-white",
    "w-full rounded-md border-2 p-2 text-sm focus:outline-none focus:ring-2 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-2",
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
      <input type="text" placeholder="Your name" className={classes} />
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
            className="mx-1 inline-flex items-center px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentInput;
