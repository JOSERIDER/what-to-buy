/**
 * @Name HttpRequestParamsInterface
 * @Description Request params to put/get/post operations.
 */
export interface HttpRequestParamsInterface {
  url: string;
  documentId?: string;
  query?: any;
  payload?: any;
}
