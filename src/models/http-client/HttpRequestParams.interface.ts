/**
 * @name HttpRequestParamsInterface
 * @description Request params to put/get/post operations.
 */
export interface HttpRequestParamsInterface {
  url: string;
  documentId?: string;
  // {path, filter, value}
  query?: any;
  payload?: any;
}
