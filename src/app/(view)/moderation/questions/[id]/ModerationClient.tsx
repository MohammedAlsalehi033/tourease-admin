'use client';

import React, { useState, useTransition } from 'react';
import { FaTrashAlt, FaUserSlash, FaSpinner, FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  user?: {
    username: string;
  };
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ModerationClientProps {
  comments: Comment[];
  currentPath: string;
  deleteCommentAction: (commentId: number, currentPath: string) => Promise<{ success: boolean; message: string }>;
  blockUserAction: (userId: string, username: string | undefined, currentPath: string) => Promise<{ success: boolean; message: string }>;
}

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

export const ModerationClient: React.FC<ModerationClientProps> = ({
  comments,
  currentPath,
  deleteCommentAction,
  blockUserAction,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [deletedComments, setDeletedComments] = useState<Set<number>>(new Set());
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };

  const handleDeleteComment = async (commentId: number) => {
    const loadingKey = `delete-${commentId}`;
    
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    setLoading(loadingKey, true);
    
    // Optimistic update
    setDeletedComments(prev => new Set([...prev, commentId]));

    try {
      const result = await deleteCommentAction(commentId, currentPath);
      
      if (result.success) {
        addToast({
          type: 'success',
          message: 'Comment deleted successfully',
          duration: 3000,
        });
      } else {
        // Revert optimistic update on failure
        setDeletedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        addToast({
          type: 'error',
          message: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setDeletedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      addToast({
        type: 'error',
        message: 'Failed to delete comment. Please try again.',
        duration: 5000,
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const handleBlockUser = async (userId: string, username: string | undefined) => {
    const loadingKey = `block-${userId}`;
    
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to block user "${username || 'Unknown'}"? This will prevent them from posting comments.`)) {
      return;
    }

    setLoading(loadingKey, true);
    
    // Optimistic update
    setBlockedUsers(prev => new Set([...prev, userId]));

    try {
      const result = await blockUserAction(userId, username, currentPath);
      
      if (result.success) {
        addToast({
          type: 'success',
          message: `User "${username || 'Unknown'}" has been blocked successfully`,
          duration: 4000,
        });
      } else {
        // Revert optimistic update on failure
        setBlockedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        addToast({
          type: 'error',
          message: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setBlockedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      addToast({
        type: 'error',
        message: 'Failed to block user. Please try again.',
        duration: 5000,
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const filteredComments = comments.filter(comment => !deletedComments.has(comment.id));

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center space-x-3 p-4 rounded-lg shadow-lg max-w-sm
              transform transition-all duration-300 ease-in-out
              ${toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : toast.type === 'error' 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
              }
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <FaCheck className="w-5 h-5" />}
              {toast.type === 'error' && <FaExclamationTriangle className="w-5 h-5" />}
              {toast.type === 'info' && <FaExclamationTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {filteredComments.map((comment) => {
          const isDeleted = deletedComments.has(comment.id);
          const isUserBlocked = blockedUsers.has(comment.userId);
          const isDeleting = loadingStates[`delete-${comment.id}`];
          const isBlocking = loadingStates[`block-${comment.userId}`];

          return (
            <div 
              key={comment.id} 
              className={`
                card p-5 rounded-xl shadow-md transition-all duration-300
                ${isDeleted ? 'opacity-50 scale-95' : 'hover:shadow-lg'}
                ${isUserBlocked ? 'border-l-4 border-orange-500' : ''}
              `}
            >
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-300">
                    {comment.user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <p className="text-title-md font-medium leading-tight">
                      {comment.user?.username || 'Anonymous'}
                    </p>
                    {isUserBlocked && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
                        Blocked
                      </span>
                    )}
                  </div>
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
                <button
                  onClick={() => handleBlockUser(comment.userId, comment.user?.username)}
                  disabled={isBlocking || isUserBlocked}
                  className={`
                    btn-text flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all duration-200
                    ${isUserBlocked 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : isBlocking
                      ? 'text-warning/70 cursor-wait'
                      : 'text-warning hover:bg-warning/10'
                    }
                  `}
                  title={isUserBlocked ? "User already blocked" : "Block User"}
                >
                  {isBlocking ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaUserSlash className="w-4 h-4" />
                  )}
                  <span>{isBlocking ? 'Blocking...' : isUserBlocked ? 'Blocked' : 'Block User'}</span>
                </button>

                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={isDeleting || isDeleted}
                  className={`
                    btn-text flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all duration-200
                    ${isDeleted 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : isDeleting
                      ? 'text-error/70 cursor-wait'
                      : 'text-error hover:bg-error/10'
                    }
                  `}
                  title={isDeleted ? "Comment deleted" : "Delete Comment"}
                >
                  {isDeleting ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrashAlt className="w-4 h-4" />
                  )}
                  <span>{isDeleting ? 'Deleting...' : isDeleted ? 'Deleted' : 'Delete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
