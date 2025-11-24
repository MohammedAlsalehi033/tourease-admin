import "reflect-metadata";
import React from 'react';
import { container } from '@/app/lib/diContainer';
import { ContentController } from '@/app/(controller)/content/contentController';
import { FaTrashAlt, FaUserSlash, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { revalidatePath } from 'next/cache';
import { UserController } from "@/app/(controller)/user/userController";
import { ModerationClient } from './ModerationClient';

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

async function deleteCommentAction(commentId: number, currentPath: string) {
  'use server';
  try {
    const commentsDI = container.resolve(ContentController);
    await commentsDI.blockComment(commentId);
    revalidatePath(currentPath);

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: `Failed to delete comment: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function blockUserAction(userId: string, username: string | undefined, currentPath: string) {
    'use server';
    try {
        const commentsDI = container.resolve(UserController);
        const user = await commentsDI.blockUser(userId);
      
        revalidatePath(currentPath);
        return { success: true, message: 'User blocked successfully' };
    } catch (error) {
        console.error('Error blocking user:', error);
        return { success: false, message: `Failed to block user: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

type RouteParams = {
  id: string;
  questionId?: string;
};

const Page = async ({ params }: { params: Promise<RouteParams> }) => {
  const resolvedParams = await params;
  let comments: any[] = [];
  let error: string | null = null;
  let isLoading = true;
  const questionId = resolvedParams.id || resolvedParams.questionId || '';
  const currentPath = `/moderation/questions/${questionId}`;

  try {
    const commentsDI = container.resolve(ContentController);
    const fetchedComments = await commentsDI.getCommentsByQuestionId(parseInt(questionId));
    console.log(questionId)
    comments = Array.isArray(fetchedComments) ? fetchedComments : [];
    isLoading = false;
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    error = `Failed to load comments: ${err instanceof Error ? err.message : 'Unknown error'}`;
    comments = [];
    isLoading = false;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-start pt-10 pb-10 bg-light-background dark:bg-dark-background text-light-on-surface dark:text-dark-on-surface">
      <div className="w-full px-4 sm:px-6">
        <h1 className="text-headline-lg font-semibold mb-8 text-center sm:text-left text-primary dark:text-primary-light">
          Content Moderation
        </h1>

        {/* Loading State */}
        {isLoading && (
          <div className="card mb-6 p-8 text-center rounded-lg shadow">
            <div className="flex flex-col items-center space-y-4">
              <FaSpinner className="w-8 h-8 animate-spin text-primary dark:text-primary-light" />
              <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Loading comments...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card mb-6 bg-error/90 text-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {comments.length === 0 && !error && !isLoading && (
          <div className="card mb-6 p-6 text-center rounded-lg shadow">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
                No comments to display.
              </p>
              <p className="text-body-sm text-light-on-surface-variant/70 dark:text-dark-on-surface-variant/70">
                Question ID: {questionId}
              </p>
            </div>
          </div>
        )}

        {/* Comments List with Client Component */}
        {!isLoading && !error && comments.length > 0 && (
          <ModerationClient
            comments={comments}
            currentPath={currentPath}
            deleteCommentAction={deleteCommentAction}
            blockUserAction={blockUserAction}
          />
        )}
      </div>
    </div>
  );
};

export default Page;