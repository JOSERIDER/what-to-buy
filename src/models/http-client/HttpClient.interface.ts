import { HttpRequestParamsInterface } from "@/models/http-client/HttpRequestParams.interface";

/**
 * @name HttpClientInterface
 * @description Wrapper for HttpClient
 */
export interface HttpClientInterface {
  get<T>(params: HttpRequestParamsInterface): Promise<T>;
  getCollection<T>(params: HttpRequestParamsInterface): Promise<T[]>;
  getWithQuery<T>(params: HttpRequestParamsInterface): Promise<T[]>;
  post<T>(params: HttpRequestParamsInterface): Promise<T>;
  put<T>(params: HttpRequestParamsInterface): Promise<T>;
  delete(params: HttpRequestParamsInterface): Promise<void>;
  update(params: HttpRequestParamsInterface): Promise<void>;
  auth();
}
