import { SharedListsApiClientModelInterface } from "@/models/api-client/SharedLists/SharedListsApiClientModelInterface";
import { SharedListsApiClientUrlInterface } from "@/models/api-client/SharedLists/SharedListsApiClientUrl.interface";
import { SharedList } from "@/models/SharedList";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";

/**
 * @Name SharedListApiClientModel
 * @Description Api client for sharedList domain that implements SharedListApiClientModel.
 * @constructor
 * @param urls - Represent the urls that client accepts.
 */
export class SharedListApiClientModel
  implements SharedListsApiClientModelInterface {
  private readonly urls!: SharedListsApiClientUrlInterface;

  constructor(urls: SharedListsApiClientUrlInterface) {
    this.urls = urls;
  }

  async addUser(listId: string, userId: string): Promise<boolean> {
    const list = await this.get(listId);

    if (list.users.includes(userId)) {
      return Promise.resolve(false);
    }
    list.users.push(userId);
    await this.update(listId, list);

    return Promise.resolve(true);
  }

  checkList(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.get(id)
        .then(() => resolve(true))
        .catch(error => reject(error.message));
    });
  }

  create(payload: SharedList): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.sharedLists,
      documentId: payload.listCode,
      payload,
    };

    return HttpClient.put(params);
  }

  delete(id: string): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.sharedLists,
      documentId: id,
    };

    return HttpClient.delete(params);
  }

  get(id: string): Promise<SharedList> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.sharedLists,
      documentId: id,
    };

    return HttpClient.get(params);
  }

  getUserList(userId: string): Promise<SharedList[]> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.sharedLists,
      query: { path: "users", filter: "array-contains", value: userId },
    };

    return HttpClient.getWithQuery(params);
  }

  update(id: string, payload: SharedList): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.sharedLists,
      documentId: id,
      payload,
    };

    return HttpClient.update(params);
  }
}
