import { UsersApiClientModelInterface } from "./UsersApiClient.interface";
import { UsersApiClientUrlInterface } from "@/models/api-client/users/UsersApiClientUrl.interface";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";
import { User } from "@/models/domain/user/UserDomain.interface";

/**
 * @name UsersApiClientModel
 * @description Api client for users domain that implements the UsersApiClientModelInterface.
 */
export class UsersApiClientModel implements UsersApiClientModelInterface {
  private readonly urls!: UsersApiClientUrlInterface;

  constructor(urls: UsersApiClientUrlInterface) {
    this.urls = urls;
  }

  create(payload: User): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.users,
      payload,
      documentId: payload.id,
    };

    return HttpClient.put(params);
  }

  delete(id: string): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.users,
      documentId: id,
    };

    return HttpClient.delete(params);
  }

  get(id: string): Promise<User> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.users,
      documentId: id,
    };

    return HttpClient.get(params);
  }

  update(id: string, payload: User): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.users,
      payload,
      documentId: id,
    };

    return HttpClient.update(params);
  }
}
