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
          if (!item.status) {
            const isFlagged = item.downvotes > 5;
            item.status = isFlagged ? "flagged" : "active";
            item.flagCount = isFlagged ? item.downvotes : 0;
          }
          return item;
        }
      );

      return {
        data: contentWithModerationInfo,
        pagination: responseData.pagination,
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

  async deleteQuestion(questionId: number, adminId: string) {
    try {
      // NOTE: The request body is omitted as the apiService.delete method does not support it.
      // The backend should rely on the authenticated user's ID from the token.
      const response = await this.apiService.delete<ContentApiResponse<any>>(
        `/questions/${questionId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }

  async deleteComment(commentID: number, adminId: string) {
    try {
      // NOTE: The request body is omitted as the apiService.delete method does not support it.
      // The backend should rely on the authenticated user's ID from the token.
      const response = await this.apiService.delete<ContentApiResponse<any>>(
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
}
