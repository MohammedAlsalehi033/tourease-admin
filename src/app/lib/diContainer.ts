// src/lib/diContainer.ts
import { container } from 'tsyringe';
import {  UserRepository } from '../(model)/users/userRepo'; 
import {  UserController } from '../(controller)/user/userController'; 
import { ContentController } from '../(controller)/content/contentController';
import { ProviderController } from '../(controller)/providers/providerController';
import { ProvdersRepository } from '../(model)/providers/providerRepo';
import { AnalyticsController } from '../(controller)/analytics/analyticsController';
import { AnalyticsRepository } from '../(model)/analytics/analyticsRepository';
import { SettingsController } from '../(controller)/settings/settingsController';
import { SettingsRepo } from '../(model)/settings/settingsRepo';
import { ApiService } from '../services/apiService';
import { ReportsController } from '../(controller)/reports/reportsController';
import { ReportsRepo } from '../(model)/reports/reportsRepo';


container.registerSingleton(ApiService);
container.registerSingleton(UserRepository);
container.registerSingleton(UserController);
container.registerSingleton(ContentController)
container.registerSingleton(ProviderController)
container.registerSingleton(ProvdersRepository)
container.registerSingleton(AnalyticsRepository)
container.registerSingleton(AnalyticsController)
container.registerSingleton(SettingsRepo)
container.registerSingleton(SettingsController)
// ApiService already registered above
container.registerSingleton(ReportsRepo)
container.registerSingleton(ReportsController)

export { container };