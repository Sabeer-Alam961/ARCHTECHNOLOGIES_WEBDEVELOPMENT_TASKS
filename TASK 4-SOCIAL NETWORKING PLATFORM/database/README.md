# Social Networking Platform Database Design

This folder contains the Mongoose schemas for the Social Networking Platform.

## 1. Directory Structure

- \`models/User.js\`: Stores user data, friends, and privacy settings.
- \`models/Post.js\`: Stores posts, likes, and content.
- \`models/Comment.js\`: Stores comments on posts.
- \`models/Notification.js\`: Stores user notifications (likes, friend requests).
- \`models/FriendRequest.js\`: Manages friend request states (pending, accepted).

## 2. Relationships Explained

We use **References** (Normalization) instead of Embedding for most data to keep documents small and scalable.

*   **User -> Friends**: A User document has a \`friends\` array containing IDs of other Users.
*   **Post -> User**: Each Post refers to an \`author\` (User ID).
*   **Post -> Comments**: Comments are stored in their own collection, referencing the \`post\` ID. This is better for performance if a post has thousands of comments.
*   **Friend Request**: Links two Users (\`sender\` and \`receiver\`).

## 3. Indexing Strategies

Indexing makes searching fast. Without indexes, MongoDB has to scan every document.

*   **User**: Indexed on \`username\` and \`email\` because we usually search by these (e.g., login).
*   **Post**: Indexed on \`author\` (to show a user's profile posts) and \`createdAt\` (to show the news feed).
*   **FriendRequest**: Indexed on \`receiver\` to quickly show "You have new friend requests".
*   **Notification**: Indexed on \`recipient\` to show alerts.

## 4. Performance & Consistency Tips

1.  **Pagination**: Always use \`.limit()\` and \`.skip()\` (or cursor-based pagination) when fetching posts or comments. Never fetch *all* posts at once.
2.  **Population**: Use \`.populate('author')\` carefully. Only populate the fields you need (e.g., \`.populate('author', 'username profile.avatar')\`).
3.  **Lean Queries**: Use \`.lean()\` for read-only operations (e.g., displaying the feed) to make queries faster.
4.  **Count Documents**: Use \`.countDocuments()\` instead of fetching an array and checking \`.length\`.

## 5. Example Documents

### User Document
\`\`\`json
{
  "_id": "609c1...",
  "username": "john_doe",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Loves coding!",
    "avatar": "https://example.com/me.jpg"
  },
  "friends": ["609c2...", "609c3..."],
  "privacySettings": {
    "isPrivate": false,
    "allowFriendRequests": true
  }
}
\`\`\`

### Post Document
\`\`\`json
{
  "_id": "709d1...",
  "author": "609c1...",
  "content": {
    "text": "Hello world! This is my first post.",
    "image": ""
  },
  "likes": ["609c2...", "609c4..."],
  "privacy": "public",
  "createdAt": "2024-01-01T12:00:00Z"
}
\`\`\`
