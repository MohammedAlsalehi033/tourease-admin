// src/app/(model)/content/contentRepo.ts
import { injectable } from 'tsyringe';
import { getApiUrl } from '../../lib/config';
import { ContentResponse, ContentItem, ContentFilter, BlockContentResponse } from './contentModel';

@injectable()
export class ContentRepository {
  private readonly apiBaseUrl = getApiUrl('/questions');

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

      // Add sort parameter based on filter
      if (filter?.sortBy) {
        queryParams.append('sort', filter.sortBy);
      } else {
        queryParams.append('sort', 'newest');
      }

      // Add other filter parameters
      if (filter) {
        if (filter.status) queryParams.append('status', filter.status);
        if (filter.search) queryParams.append('search', filter.search);
        if (filter.userId) queryParams.append('userId', filter.userId);
      }

      // Make the API request
      const response = await fetch(`${this.apiBaseUrl}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Add moderation status to items if not present in API response
      const contentWithModerationInfo = responseData.data.map((item: ContentItem) => {
        // If API doesn't provide moderation status, determine it based on available data
        if (!item.status) {
          // Check if the item has been flagged (this is hypothetical logic)
          const isFlagged = item.downvotes > 5; // Example condition
          item.status = isFlagged ? 'flagged' : 'active';
          item.flagCount = isFlagged ? item.downvotes : 0;
        }
        return item;
      });

      return {
        data: contentWithModerationInfo,
        pagination: responseData.pagination,
        success: responseData.success
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async getContentById(id: number): Promise<ContentItem | null> {
    try {
      const response = await fetch(`${getApiUrl('/commments')}/?id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      if (!responseData.success) {
        return null;
      }
      
      const item = responseData.data;
      
      if (!item.status) {
        const isFlagged = item.downvotes > 5; // Example condition
        item.status = isFlagged ? 'flagged' : 'active';
        item.flagCount = isFlagged ? item.downvotes : 0;
      }
      
      return item;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  async deleteQuestion(questionId: number, adminId: string) {
    console.log(questionId)
    try {
      const response = await fetch(`${this.apiBaseUrl}/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
        }),
      });
  
      if (!response.ok) {
         let errorBody = null;
         try {
           errorBody = await response.json();
         } catch(e) {
           // Ignore error
         }
         const errorMessage = errorBody?.message || response.statusText;
        throw new Error(`Failed to delete question (${response.status}): ${errorMessage}`);
      }
  
      if (response.status === 204) {
           return {
               success: true,
               message: 'Question deleted successfully',
           };
      }
  
      const data = await response.json();
      return {
        success: data.success ?? true,
        message: data.message || 'Question deleted successfully',
        data: data.data
      };
  
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async deleteComment(commentID: number, adminId: string) {
    try {

      //http://localhost:3000/api/comments/5
      const response = await fetch(`${getApiUrl('/comments')}/${commentID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
        }),
      });
  
      if (!response.ok) {
         let errorBody = null;
         try {
           errorBody = await response.json();
         } catch(e) {
           // Ignore error
         }
         const errorMessage = errorBody?.message || response.statusText;
        throw new Error(`Failed to delete question (${response.status}): ${errorMessage}`);
      }
  
      if (response.status === 204) {
           return {
               success: true,
               message: 'Question deleted successfully',
           };
      }
  
      const data = await response.json();
      return {
        success: data.success ?? true,
        message: data.message || 'Question deleted successfully',
        data: data.data
      };
  
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }



  async unblockContent(contentId: number, adminId: string): Promise<BlockContentResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${contentId}/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to unblock content: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || 'Content unblocked successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Error unblocking content:', error);
      throw error;
    }
  }

  async getFlaggedContent(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ContentResponse> {
    // Create a filter specifically for flagged content or highly downvoted content
    const filter: ContentFilter = {
      sortBy: 'mostUpvoted', // Ideally, you would have a 'mostDownvoted' option
    };
    
    try {
      const response = await this.getAllContent(page, pageSize, filter);
      
      // Filter out content with low downvotes (client-side filtering as fallback)
      const flaggedContent = response.data.filter(item => item.downvotes > 2);
      
      return {
        data: flaggedContent,
        pagination: {
          ...response.pagination,
          total: flaggedContent.length,
          totalPages: Math.ceil(flaggedContent.length / pageSize)
        },
        success: true
      };
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      throw error;
    }
  }
}