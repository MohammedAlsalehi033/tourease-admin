export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
  }
  

  export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    mediaUrls: string[];
    accountStatus: string;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
  }

  
  export interface PaginatedUsersResponse {
    users: User[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    success: boolean;
  }
  
  export interface UserFilter {
    username?: string;
    email?: string;
    accountStatus?: string;
    role?: string;
  }
  