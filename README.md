# React Comments Component

A beautiful, fully-featured, and reusable React comment component with nested replies, likes, timestamps, and more. Built with **Tailwind CSS** for easy customization. Works seamlessly with Next.js, Create React App, Vite, and any React application.

## Features

✨ **Nested Replies** - Unlimited depth with configurable max depth  
👍 **Like System** - Built-in like functionality  
⏰ **Smart Timestamps** - Relative time display (e.g., "2h ago")  
👤 **User Avatars** - Support for avatar images with fallback initials  
🗑️ **Delete Comments** - Optional delete functionality  
📱 **Responsive Design** - Mobile-friendly out of the box  
🎨 **Tailwind CSS** - Easy to customize with Tailwind utilities  
⚡ **TypeScript Support** - Full type definitions included  
🚀 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @radiyap/react-tailwindcss-comments
```

or

```bash
yarn add @radiyap/react-tailwindcss-comments
```

**Important:** This component uses Tailwind CSS. Make sure you have Tailwind CSS installed in your project.

## Setup

### 1. Install Tailwind CSS (if not already installed)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Configure Tailwind

Add the component path to your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@radiyap/react-tailwindcss-comments/dist/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Import the CSS

Import the component's CSS in your main file:

```javascript
import '@radiyap/react-tailwindcss-comments/dist/index.css';
```

## Quick Start

```jsx
import React, { useState } from 'react';
import { CommentSection } from '@radiyap/react-tailwindcss-comments';
import '@radiyap/react-tailwindcss-comments/dist/index.css';

function App() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      content: "This is a great component!",
      timestamp: new Date().toISOString(),
      likes: 5,
      replies: []
    }
  ]);

  const handleAddComment = (content, parentId = null) => {
    const newComment = {
      id: Date.now(),
      author: "Current User",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    if (parentId) {
      setComments(prevComments => addReply(prevComments, parentId, newComment));
    } else {
      setComments(prev => [...prev, newComment]);
    }
  };

  const handleLike = (commentId) => {
    setComments(prevComments => toggleLike(prevComments, commentId));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <CommentSection 
        comments={comments}
        onAddComment={handleAddComment}
        onLike={handleLike}
      />
    </div>
  );
}

export default App;
```

## API Reference

### CommentSection Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `comments` | `CommentData[]` | Yes | - | Array of comment objects |
| `onAddComment` | `(content: string, parentId?: number \| string) => void` | Yes | - | Callback when a comment is added |
| `onLike` | `(commentId: number \| string) => void` | No | - | Callback when a comment is liked |
| `onDelete` | `(commentId: number \| string) => void` | No | - | Callback when a comment is deleted |
| `currentUser` | `{ name: string; avatar?: string }` | No | - | Current user information |
| `maxDepth` | `number` | No | `5` | Maximum nesting depth for replies |
| `className` | `string` | No | `''` | Additional Tailwind classes for the container |

### CommentData Interface

```typescript
interface CommentData {
  id: number | string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string; // ISO 8601 format
  likes: number;
  replies?: CommentData[];
}
```

## Usage Examples

### With Next.js (App Router)

```jsx
'use client';

import { useState } from 'react';
import { CommentSection } from '@radiyap/react-tailwindcss-comments';
import '@radiyap/react-tailwindcss-comments/dist/index.css';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  
  const handleAddComment = (content, parentId) => {
    // Your implementation
  };
  
  return (
    <div className="container mx-auto py-8">
      <CommentSection 
        comments={comments} 
        onAddComment={handleAddComment} 
      />
    </div>
  );
}
```

### With Next.js (Pages Router)

```jsx
import { useState } from 'react';
import { CommentSection } from '@radiyap/react-tailwindcss-comments';
import '@radiyap/react-tailwindcss-comments/dist/index.css';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  
  return (
    <div className="container mx-auto py-8">
      <CommentSection 
        comments={comments} 
        onAddComment={handleAddComment} 
      />
    </div>
  );
}
```

### Helper Functions

Here are helper functions to manage comment state:

```javascript
// Add a reply to a nested comment
const addReply = (comments, parentId, newReply) => {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return { 
        ...comment, 
        replies: [...(comment.replies || []), newReply] 
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return { 
        ...comment, 
        replies: addReply(comment.replies, parentId, newReply) 
      };
    }
    return comment;
  });
};

// Toggle like on a comment
const toggleLike = (comments, targetId) => {
  return comments.map(comment => {
    if (comment.id === targetId) {
      return { ...comment, likes: comment.likes + 1 };
    }
    if (comment.replies && comment.replies.length > 0) {
      return { 
        ...comment, 
        replies: toggleLike(comment.replies, targetId) 
      };
    }
    return comment;
  });
};

// Delete a comment
const deleteComment = (comments, targetId) => {
  return comments.filter(comment => {
    if (comment.id === targetId) return false;
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = deleteComment(comment.replies, targetId);
    }
    return true;
  });
};
```

## Customization with Tailwind

You can easily customize the component using Tailwind's utility classes:

```jsx
<CommentSection 
  comments={comments}
  onAddComment={handleAddComment}
  className="bg-gray-100 shadow-xl rounded-2xl"
/>
```

Or extend the component's styles in your own CSS:

```css
/* Custom button colors */
.bg-blue-600 {
  @apply bg-purple-600;
}

.hover\:bg-blue-700:hover {
  @apply hover:bg-purple-700;
}
```

## Styling Options

The component uses standard Tailwind classes, so you can:

1. **Override with className prop** - Pass custom Tailwind classes
2. **Modify Tailwind config** - Customize colors, spacing, etc.
3. **Use CSS layers** - Override specific styles with higher specificity

Example custom theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#your-color',
          700: '#your-darker-color',
        },
      },
    },
  },
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/chrisyap/react-tailwindcss-comments/issues).

## Changelog

### 1.0.0
- Initial release with Tailwind CSS
- Nested comments support
- Like and delete functionality
- TypeScript support