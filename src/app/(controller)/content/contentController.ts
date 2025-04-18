// src/app/(controller)/content/contentController.ts
import { injectable, inject } from 'tsyringe';
import { ContentRepository } from '@/app/(model)/content/contentRepo';
import { 
  ContentResponse, 
  ContentItem, 
  ContentFilter, 
  BlockContentResponse 
} from '@/app/(model)/content/contentModel';

@injectable()
export class ContentController {
  constructor(
    @inject(ContentRepository) private contentRepository: ContentRepository
  ) {}

  async getAllQuestions(
    page: number = 1,
    pageSize: number = 10,
    filter?: ContentFilter
  ): Promise<ContentResponse> {
    return this.contentRepository.getAllContent(page, pageSize, filter);
  }

  async getContentById(id: number): Promise<ContentItem | null> {
    return this.contentRepository.getContentById(id);
  }

  async blockContent(contentId: number, reason: string, adminId: string): Promise<BlockContentResponse> {
    // Add any business logic here, e.g., validation or logging
    if (!reason) {
      reason = 'Violation of platform policies';
    }
    
    return this.contentRepository.blockContent(contentId, reason, adminId);
  }

  async unblockContent(contentId: number, adminId: string): Promise<BlockContentResponse> {
    // Add any business logic here before unblocking
    return this.contentRepository.unblockContent(contentId, adminId);
  }

  async getFlaggedContentForReview(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ContentResponse> {
    // Get only flagged content that needs admin review
    return this.contentRepository.getFlaggedContent(page, pageSize);
  }

  async getContentDashboardStats(): Promise<{
    totalItems: number;
    flaggedItems: number;
    blockedItems: number;
    recentlyFlagged: number;
  }> {
    try {
      // Get a sample of content to analyze
      const contentResponse = await this.contentRepository.getAllContent(1, 100);
      
      // Count items by status
      const flaggedItems = contentResponse.data.filter(item => 
        item.downvotes > 2 || item.status === 'flagged'
      ).length;
      
      const blockedItems = contentResponse.data.filter(item => 
        item.status === 'blocked'
      ).length;
      
      // Count items flagged in last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentlyFlagged = contentResponse.data.filter(item => {
        const updatedDate = new Date(item.updatedAt);
        return (item.downvotes > 2 || item.status === 'flagged') && 
               updatedDate >= oneDayAgo;
      }).length;
      
      return {
        totalItems: contentResponse.pagination.total,
        flaggedItems,
        blockedItems,
        recentlyFlagged
      };
    } catch (error) {
      console.error('Error fetching content stats:', error);
      return {
        totalItems: 0,
        flaggedItems: 0,
        blockedItems: 0,
        recentlyFlagged: 0
      };
    }
  }
}