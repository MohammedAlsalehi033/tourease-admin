import "reflect-metadata";
import React from 'react';
import { container } from '@/app/lib/diContainer';
import { ContentController } from '@/app/(controller)/content/contentController';
import { FaUserCircle, FaTrashAlt, FaUserSlash } from 'react-icons/fa';
import { revalidatePath } from 'next/cache';
import { UserController } from "@/app/(controller)/user/userController";

const formatDate = (dateString) => {
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
    await commentsDI.blockComment(commentId, /* adminId */);
    revalidatePath(currentPath);

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: `Failed to delete comment: ${error.message}` };
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
        return { success: false, message: `Failed to block user: ${error.message}` };
    }
}

interface PageProps {
  params: {
    id: string;
    questionId?: string;
  };
}

const Page = async ({ params }: PageProps) => {
  let comments = [];
  let error = null;
  const questionId = params.id || params.questionId || '';
  const currentPath = `/moderation/questions/${questionId}`;

  try {
    const commentsDI = container.resolve(ContentController);
    const fetchedComments = await commentsDI.getCommentsByQuestionId(questionId);
    console.log(questionId)
    comments = Array.isArray(fetchedComments) ? fetchedComments : [];
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    error = `Failed to load comments: ${err.message}`;
    comments = [];
  }

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-start pt-10 pb-10 bg-light-background dark:bg-dark-background text-light-on-surface dark:text-dark-on-surface">
      <div className="max-w-3xl w-full px-4 sm:px-6">
        <h1 className="text-headline-lg font-semibold mb-8 text-center sm:text-left text-primary dark:text-primary-light">
          Content Moderation
        </h1>

        {error && (
          <div className="card mb-6 bg-error/90 text-white p-4 rounded-lg shadow-md">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {comments.length === 0 && !error && (
          <div className="card mb-6 p-6 text-center rounded-lg shadow">
            <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">No comments to display.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="card p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FaUserCircle className="w-9 h-9 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" />
                <div className="flex-grow">
                  <p className="text-title-md font-medium leading-tight">{comment.user?.username || 'Anonymous'}</p>
                  <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant leading-tight">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>

              <p className="text-body-md mb-5 whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              <hr className="border-t border-light-outline/30 dark:border-dark-outline/30 mb-4" />

              <div className="flex space-x-3 justify-end items-center">
                <form action={blockUserAction.bind(null, comment.userId, comment.user?.username, currentPath)}>
                  <button
                    type="submit"
                    className="btn-text text-warning hover:bg-warning/10 flex items-center space-x-1.5 px-3 py-1.5 rounded"
                    title="Block User"
                  >
                    <FaUserSlash className="w-4 h-4" />
                    <span>Block User</span>
                  </button>
                </form>

                <form action={deleteCommentAction.bind(null, comment.id, currentPath)}>
                  <button
                    type="submit"
                    className="btn-text text-error hover:bg-error/10 flex items-center space-x-1.5 px-3 py-1.5 rounded"
                    title="Delete Comment"
                  >
                    <FaTrashAlt className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;