import { PrivateListsApiClientModelInterface } from "@/models/api-client/PrivateLists/PrivateListsApiClientModelInterface";
import { List } from "@/models/List";
import { PrivateListsApiClientUrlInterface } from "@/models/api-client/PrivateLists/PrivateListsApiClientUrl.interface";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";

export class PrivateListsApiClientModel
  implements PrivateListsApiClientModelInterface {
  private readonly urls!: PrivateListsApiClientUrlInterface;

  constructor(urls: PrivateListsApiClientUrlInterface) {
    this.urls = urls;
  }

  create(payload: List): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.privateLists,
      documentId: payload.listCode,
      payload,
    };

    return HttpClient.put(params);
  }

  delete(id: string): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.privateLists,
      documentId: id,
    };

    return HttpClient.delete(params);
  }

  getList(id: string): Promise<List> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.privateLists,
      documentId: id,
    };

    return HttpClient.get(params);
  }

  getUserList(userId: string): Promise<List[]> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.privateLists,
      query: { path: "admin", filter: "==", value: userId },
    };

    return HttpClient.getWithQuery(params);
  }

  update(id: string, payload: List): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.privateLists,
      documentId: id,
      payload,
    };

    return HttpClient.update(params);
  }
}
