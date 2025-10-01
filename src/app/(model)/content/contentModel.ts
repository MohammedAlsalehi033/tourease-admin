// src/app/(model)/content/contentModel.ts
export interface ContentItem {
  id: number;
  userId: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  user: User;
  vote: Vote[];
  _count: ContentCount;
  status?: 'active' | 'flagged' | 'blocked'; // Added for moderation purposes
  accountStatus?: 'active' | 'flagged' | 'blocked'; // Frontend compatibility
  flagCount?: number; // Added for moderation purposes
  flagReasons?: string[]; // Added for moderation purposes
}

export interface User {
  id: string;
  username: string;
  email?: string;
  mediaUrls?: string[];
  accountStatus?: string;
  // Other user properties as needed
}

export interface Vote {
  id: number;
  userId: string;
  questionId: number;
  voteType: 'up' | 'down';
  createdAt: string;
  updatedAt: string;
}

export interface ContentCount {
  comments: number;
  answers?: number;
}

export interface ContentResponse {
  data: ContentItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  success: boolean;
}

export interface ContentFilter {
  status?: 'active' | 'flagged' | 'blocked';
  search?: string;
  userId?: string;
  sortBy?: 'newest' | 'oldest' | 'mostUpvoted' | 'mostFlagged';
}

export interface BlockContentRequest {
  contentId: number;
  reason: string;
  adminId: string;
}

export interface BlockContentResponse {
  success: boolean;
  message: string;
  data?: ContentItem;
}