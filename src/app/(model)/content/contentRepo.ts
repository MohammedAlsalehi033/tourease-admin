import { injectable } from "tsyringe";
import { ApiService } from "@/app/services/apiService";
import {
  ContentResponse,
  ContentItem,
  ContentFilter,
  BlockContentResponse,
  ContentApiResponse,
} from "./contentModel";

@injectable()
export class ContentRepository {
  constructor(private apiService: ApiService) {}

  async getAllContent(
    page: number = 1,
    pageSize: number = 10,
    filter?: ContentFilter
  ): Promise<ContentResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      if (filter?.sortBy) {
        queryParams.append("sort", filter.sortBy);
      } else {
        queryParams.append("sort", "newest");
      }

      if (filter) {
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.search) queryParams.append("search", filter.search);
        if (filter.userId) queryParams.append("userId", filter.userId);
      }

      const url = `/questions?${queryParams.toString()}`;
      const responseData = await this.apiService.get<ContentResponse>(url);

      const contentWithModerationInfo = responseData.data.map(
        (item: ContentItem) => {
          // Determine status based on backend data or infer from votes
          let status = item.status;
          if (!status) {
            if (item.downvotes > 5) {
              status = "flagged";
            } else {
              status = "active";
            }
          }
          
          // Set accountStatus for frontend compatibility
          const updatedItem = {
            ...item,
            status,
            accountStatus: status,
            flagCount: status === "flagged" ? item.downvotes : 0
          };
          
          return updatedItem;
        }
      );

      // Filter content on frontend if backend doesn't support full filtering
      let filteredContent = contentWithModerationInfo;
      
      // Apply status filter
      if (filter?.status) {
        filteredContent = filteredContent.filter(item => item.status === filter.status);
      }
      
      // Apply search filter (search in title, description, or author name)
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredContent = filteredContent.filter(item => {
          const titleMatch = item.title?.toLowerCase().includes(searchTerm);
          const descriptionMatch = item.description?.toLowerCase().includes(searchTerm);
          const authorMatch = item.user?.username?.toLowerCase().includes(searchTerm);
          const idMatch = item.id.toString().includes(searchTerm);
          
          return titleMatch || descriptionMatch || authorMatch || idMatch;
        });
      }

      // Calculate pagination based on filtered results
      const totalFiltered = filteredContent.length;
      const totalPages = Math.ceil(totalFiltered / pageSize);
      
      // Apply pagination to filtered results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedContent = filteredContent.slice(startIndex, endIndex);

      return {
        data: paginatedContent,
        pagination: {
          total: totalFiltered,
          page: page,
          pageSize: pageSize,
          totalPages: totalPages,
        },
        success: responseData.success,
      };
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  async getContentById(id: number): Promise<ContentItem | null> {
    try {
      const responseData = await this.apiService.get<
        ContentApiResponse<ContentItem>
      >(`/commments/?id=${id}`);
      if (!responseData.success || !responseData.data) {
        return null;
      }
      const item = responseData.data;
      if (!item.status) {
        const isFlagged = item.downvotes > 5;
        item.status = isFlagged ? "flagged" : "active";
        item.flagCount = isFlagged ? item.downvotes : 0;
      }
      return item;
    } catch (error) {
      console.error("Error fetching content by ID:", error);
      throw error;
    }
  }

  async deleteQuestion(questionId: number, _adminId: string) {
    try {
      // NOTE: The request body is omitted as the apiService.delete method does not support it.
      // The backend should rely on the authenticated user's ID from the token.
      const response = await this.apiService.delete<ContentApiResponse<BlockContentResponse>>(
        `/questions/${questionId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }

  async deleteComment(commentID: number, _adminId: string) {
    try {
      // NOTE: The request body is omitted as the apiService.delete method does not support it.
      // The backend should rely on the authenticated user's ID from the token.
      const response = await this.apiService.delete<ContentApiResponse<BlockContentResponse>>(
        `/comments/${commentID}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  async unblockContent(
    contentId: number,
    adminId: string
  ): Promise<BlockContentResponse> {
    try {
      const response = await this.apiService.post<BlockContentResponse>(
        `/questions/${contentId}/unblock`,
        { adminId }
      );
      return response;
    } catch (error) {
      console.error("Error unblocking content:", error);
      throw error;
    }
  }

  async getFlaggedContent(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ContentResponse> {
    const filter: ContentFilter = {
      sortBy: "mostUpvoted",
    };
    try {
      const response = await this.getAllContent(page, pageSize, filter);
      const flaggedContent = response.data.filter((item) => item.downvotes > 2);
      return {
        data: flaggedContent,
        pagination: {
          ...response.pagination,
          total: flaggedContent.length,
          totalPages: Math.ceil(flaggedContent.length / pageSize),
        },
        success: true,
      };
    } catch (error) {
      console.error("Error fetching flagged content:", error);
      throw error;
    }
  }

  async getCommentsByQuestionId(questionId: number): Promise<ContentItem[]> {
    try {
      const responseData = await this.apiService.get<ContentApiResponse<ContentItem[]>>(
        `/commments?id=${questionId}`
      );
      
      if (!responseData.success || !responseData.data) {
        return [];
      }
      
      // Map comments with status information
      const commentsWithStatus = responseData.data.map(comment => ({
        ...comment,
        status: comment.status || 'active',
        flagCount: comment.downvotes || 0
      }));
      
      return commentsWithStatus;
    } catch (error) {
      console.error("Error fetching comments by question ID:", error);
      return [];
    }
  }
}
