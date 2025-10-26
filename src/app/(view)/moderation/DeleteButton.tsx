'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  questionId: number;
  questionTitle: string;
  onDelete: (questionId: number) => Promise<{ success: boolean; message: string }>;
}

export default function DeleteButton({ questionId, questionTitle, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmMessage = `⚠️ PERMANENT DELETION

Are you sure you want to permanently delete question "${questionTitle}"?

This action cannot be undone and will remove:
- The question
- All comments  
- All votes

Click OK to confirm this destructive action.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await onDelete(questionId);
      if (!result.success) {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to delete question. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-800 hover:text-red-900 font-bold border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
      title="⚠️ Permanently delete this question - This action cannot be undone!"
    >
      {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
    </button>
  );
}