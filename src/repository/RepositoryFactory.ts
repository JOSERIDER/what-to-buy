import { UserRepository } from "@/repository/User/UserRepository";
import { PrivateListRepository } from "@/repository/PrivateList/PrivateListRepository";
import { SharedListRepository } from "@/repository/SharedList/SharedListRepository";
import { ProductRepository } from "@/repository/Product/ProductRepository";
import { UserRepositoryInterface } from "@/repository/User/UserRepositoryInterface";
import { PrivateListRepositoryInterface } from "@/repository/PrivateList/PrivateListRepositoryInterface";
import { SharedListRepositoryInterface } from "@/repository/SharedList/SharedListRepositoryInterface";
import { ProductRepositoryInterface } from "@/repository/Product/ProductRepositoryInterface";

export enum repositoryTypes {
  USER_REPOSITORY = "USER_REPOSITORY",
  PRIVATE_LIST_REPOSITORY = "PRIVATE_LIST_REPOSITORY",
  SHARED_LIST_REPOSITORY = "SHARED_LIST_REPOSITORY",
  PRODUCT_REPOSITORY = "PRODUCT_REPOSITORY",
}

interface Repositories {
  [repositoryTypes.USER_REPOSITORY]: UserRepositoryInterface;
  [repositoryTypes.PRIVATE_LIST_REPOSITORY]: PrivateListRepositoryInterface;
  [repositoryTypes.SHARED_LIST_REPOSITORY]: SharedListRepositoryInterface;
  [repositoryTypes.PRODUCT_REPOSITORY]: ProductRepositoryInterface;
}

export const repositories: Repositories = {
  [repositoryTypes.USER_REPOSITORY]: new UserRepository(),
  [repositoryTypes.PRIVATE_LIST_REPOSITORY]: new PrivateListRepository(),
  [repositoryTypes.SHARED_LIST_REPOSITORY]: new SharedListRepository(),
  [repositoryTypes.PRODUCT_REPOSITORY]: new ProductRepository(),
};
