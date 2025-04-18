// src/repositories/productRepository.ts
import { injectable } from 'tsyringe';
import { PaginatedUsersResponse, Product, User, UserFilter } from './userModel';

@injectable()
export class ProductRepository {
  private products: Product[] = [ // Simulate a database
    { id: '1', name: 'Awesome Gadget', price: 99.99, description: 'Really awesome.' },
    { id: '2', name: 'Cool Widget', price: 45.50 },
    { id: '3', name: 'Shiny Thing', price: 15.00, description: 'So shiny.' },
  ];

  async findAll(): Promise<Product[]> {
    console.log('Repository: Finding all products');
    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    console.log(`Repository: Finding product by ID ${id}`);
    await new Promise(resolve => setTimeout(resolve, 50));
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  // Add methods like create, update, delete as needed
}


@injectable()
export class UserRepository {
  private readonly apiBaseUrl = 'http://localhost:3000/api/getAllUsers';

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
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

      // Make the API request
      const response = await fetch(`${this.apiBaseUrl}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        users: data.data,
        pagination: data.pagination,
        success: data.success
      };
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
}
