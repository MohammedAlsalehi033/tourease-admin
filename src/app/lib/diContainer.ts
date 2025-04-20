// src/lib/diContainer.ts
import { container } from 'tsyringe';
import { ProductRepository, UserRepository } from '../(model)/users/userRepo'; 
import { ProductController, UserController } from '../(controller)/user/userController'; 
import { ContentController } from '../(controller)/content/contentController';
import { ProviderController } from '../(controller)/providers/providerController';
import { ProvdersRepository } from '../(model)/providers/providerRepo';


container.registerSingleton(ProductRepository);
container.registerSingleton(ProductController);
container.registerSingleton(UserRepository);
container.registerSingleton(UserController);
container.registerSingleton(ContentController)
container.registerSingleton(ProviderController)
container.registerSingleton(ProvdersRepository)

export { container };