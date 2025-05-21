import { Suspense } from 'react';
import Link from 'next/link';
import { container } from "@/app/lib/diContainer";
import { ContentController } from '@/app/(controller)/content/contentController';
import { revalidatePath } from 'next/cache';



async function deleteCommentAction(questionId: number) {
  'use server';
  try {
    const commentsDI = container.resolve(ContentController);
    await commentsDI.blockQuestion(questionId, /* adminId */);
    revalidatePath("/")
    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: `Failed to delete comment: ${error.message}` };
  }
}


async function ContentTable({ accountStatus, search }) {
  const contentController = container.resolve(ContentController);
  const response = await contentController.getAllQuestions(1, 10, { accountStatus, search }); // Adjust page size as needed
  
  const transformedContent = response.data.map(item => {
    const contentaccountStatus = item.accountStatus || (item.downvotes > 2 ? 'flagged' : 'active');
    
    return {
      id: item.id,
      title: item.title || 'Untitled Question',
      description: item.description || 'No description provided',
      contentType: 'question', // Assuming questions only for now
      accountStatus: contentaccountStatus,
      flagCount: item.downvotes || 0,
      createdAt: item.createdAt.split('T')[0],
      updatedAt: item.updatedAt.split('T')[0],
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      author: {
        id: item.userId,
        name: item.user?.username?.split('@')[0] || 'Anonymous',
        avatar: item.user?.mediaUrls?.[0] || null
      },
      commentCount: item._count?.comments || 0
    };
  });
  
  let filteredContent = transformedContent;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredContent = transformedContent.filter(item => 
      item.id.toString().includes(searchLower) ||
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.author.name.toLowerCase().includes(searchLower)
    );
  }
  
  // Render the table with filtered data
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Votes</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">accountStatus</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredContent.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div className="font-medium">{item.title}</div>
                <div className="text-gray-500 dark:text-gray-400 truncate max-w-md">
                  {item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.commentCount} comments
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.author.avatar ? (
                    <img src={item.author.avatar} alt={item.author.name} className="h-8 w-8 rounded-full mr-2" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-300">{item.author.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-900 dark:text-white">{item.author.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                  <span className="text-green-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                    </svg>
                    {item.upvotes}
                  </span>
                  <span className="text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    {item.downvotes}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.accountStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  item.accountStatus === 'flagged' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.accountStatus === 'active' ? 'Active' : 
                   item.accountStatus === 'flagged' ? 'Flagged' : 'Blocked'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link 
                    href={`/moderation/questions/${item.id}`}
                    className="text-primary hover:text-primary-light"
                  >
                    View
                  </Link>
                  
                  {item.accountStatus !== 'blocked' ? (
                    <form action={deleteCommentAction.bind(null, item.id,)}>
                      <button
                        className="text-red-600 hover:text-red-900"
                        data-content-id={item.id}
                        data-action="block"
                      >
                        delete
                      </button>
                    </form>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-900"
                      data-content-id={item.id}
                      data-action="unblock"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContentTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Votes</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">accountStatus</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-2"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Filter Component specifically for content moderation
function ContentFilterSection() {
  return (
    <form action="/moderation" method="GET">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="accountStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            accountStatus
          </label>
          <select
            id="accountStatus"
            name="accountStatus"
            className="input w-full"
            defaultValue=""
          >
            <option value="">All accountStatuses</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search by title, content or author"
            className="input w-full"
          />
        </div>
        
        <div className="flex items-end">
          <button type="submit" className="btn-primary h-10">
            Apply Filters
          </button>
          <button type="reset" className="btn-outlined ml-2 h-10">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ContentModeration({ searchParams }) {
  const accountStatus = searchParams?.accountStatus || '';
  const search = searchParams?.search || '';
  
  return (
    <div className="px-6 py-8 ml-64">
      <div className="mb-6">
        <h1 className="text-headline-lg font-semibold mb-2">Content Moderation</h1>
        <p className="text-body-md text-gray-600 dark:text-gray-400">
          Review and moderate user-generated content to maintain platform safety and quality
        </p>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-headline-sm font-semibold">Search & Filter</h2>
        </div>
        <div className="p-4">
          <ContentFilterSection />
        </div>
      </div>
      
      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-headline-sm font-semibold">Questions</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {accountStatus === 'flagged' && <span className="font-medium text-red-500">Flagged content requires review</span>}
          </div>
        </div>
        
        <div className="p-4">
          <Suspense fallback={<ContentTableSkeleton />}>
            <ContentTable accountStatus={accountStatus} search={search} />
          </Suspense>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing questions requiring moderation
            </div>
            
            <div className="flex space-x-2">
              <button className="btn-outlined text-sm py-1 px-3 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="btn-outlined text-sm py-1 px-3">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}