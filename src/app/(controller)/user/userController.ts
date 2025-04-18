// src/controllers/productController.ts
import { injectable, inject } from 'tsyringe';
import { ProductRepository, UserRepository } from '@/app/(model)/users/userRepo'; 
import { PaginatedUsersResponse, Product, UserFilter } from '../../(model)/users/userModel';

@injectable()
export class ProductController {
  constructor(
    @inject(ProductRepository) private productRepository: ProductRepository
  ) {}

  async getProductsForListPage(): Promise<Pick<Product, 'id' | 'name' | 'price'>[]> {
    console.log('Controller: Preparing products for list page');
    const allProducts = await this.productRepository.findAll();
    // Potentially transform data for the view
    return allProducts.map(({ id, name, price }) => ({ id, name, price }));
  }

  async getProductDetails(id: string): Promise<Product | null> {
    console.log(`Controller: Getting details for product ID ${id}`);
    const product = await this.productRepository.findById(id);
    // Add business logic here if needed (e.g., check permissions, enrich data)
    return product;
  }

  // Example method for handling an action (e.g., from an API route)
  // async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  //   console.log('Controller: Creating product');
  //   // Add validation logic here
  //   const newProduct = await this.productRepository.create(data); // Assuming create exists in repo
  //   return newProduct;
  // }
}

@injectable()
export class UserController {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async getAllUsers(
    page?: number,
    pageSize?: number,
    filter?: UserFilter
  ): Promise<PaginatedUsersResponse> {
    return this.userRepository.getAllUsers(page, pageSize, filter);
  }
}