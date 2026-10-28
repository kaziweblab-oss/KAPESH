import { AuditLogModel } from "./audit";
import {
  FaqModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  TestimonialModel,
} from "./content";
import { InquiryModel } from "./inquiry";
import { LoginAttemptModel } from "./login-attempt";
import { MediaModel } from "./media";
import { SiteSettingModel } from "./setting";
import { ContentBlockModel, NavigationModel } from "./site";
import { BrandModel, CategoryModel } from "./taxonomy";
import { UserModel } from "./user";

export * from "./audit";
export * from "./content";
export * from "./inquiry";
export * from "./login-attempt";
export * from "./media";
export * from "./setting";
export * from "./site";
export * from "./taxonomy";
export * from "./user";

export const allModels = [
  AuditLogModel,
  BrandModel,
  CategoryModel,
  ContentBlockModel,
  FaqModel,
  InquiryModel,
  LoginAttemptModel,
  MediaModel,
  NavigationModel,
  PostModel,
  ProductModel,
  ProjectModel,
  ServiceModel,
  SiteSettingModel,
  TestimonialModel,
  UserModel,
];

export async function syncDatabaseIndexes(): Promise<void> {
  await Promise.all(allModels.map((model) => model.syncIndexes()));
}
