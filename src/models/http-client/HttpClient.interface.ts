import { HttpRequestParamsInterface } from "@/models/http-client/HttpRequestParams.interface";

/**
 * @Name HttpClientInterface
 * @Description Wrapper for HttpClient
 */
export interface HttpClientInterface {
  get<T>(params: HttpRequestParamsInterface): Promise<T>;
  getWithQuery<T>(params: HttpRequestParamsInterface): Promise<T[]>;
  post<T>(params: HttpRequestParamsInterface): Promise<T>;
  put<T>(params: HttpRequestParamsInterface): Promise<T>;
  delete(params: HttpRequestParamsInterface): Promise<void>;
  update(params: HttpRequestParamsInterface): Promise<void>;
  auth();
}
