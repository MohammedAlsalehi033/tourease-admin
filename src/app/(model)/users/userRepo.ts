// src/repositories/productRepository.ts
import { injectable } from 'tsyringe';
import { PaginatedUsersResponse, User, UserFilter } from './userModel';

@injectable()
export class UserRepository {
    private readonly baseApiUrl = 'http://localhost:3000/api';

    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await fetch(`${this.baseApiUrl}/users/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch user: ${response.statusText} (${response.status})`);
            }

            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }

    async getAllUsers(
        page: number = 1,
        pageSize: number = 10,
        filter?: UserFilter
    ): Promise<PaginatedUsersResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
            });

            if (filter) {
                if (filter.username) queryParams.append('username', filter.username);
                if (filter.email) queryParams.append('email', filter.email);
                if (filter.accountStatus) queryParams.append('accountStatus', filter.accountStatus);
                if (filter.role) queryParams.append('role', filter.role);
            }

            const response = await fetch(`${this.baseApiUrl}/getAllUsers?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.statusText} (${response.status})`);
            }

            const result = await response.json();

            if (!result.success) {
                 throw new Error(`API Error fetching users: ${result.message || 'Unknown error'}`);
            }

            return {
                users: result.data,
                pagination: result.pagination,
                success: result.success
            };
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    async blockUser(id: string): Promise<{ success: boolean; message?: string; data?: User }> {
        try {
            const response = await fetch(`${this.baseApiUrl}/users/${id}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                 const errorData = await response.text();
                throw new Error(`Failed to block user: ${response.statusText} (${response.status}) - ${errorData}`);
            }

            const result = await response.json();

             if (!result.success) {
                  throw new Error(`API Error blocking user: ${result.message || 'Unknown error'}`);
             }

            return result;
        } catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    }
}