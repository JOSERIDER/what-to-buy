import { ProductsApiClientModelInterface } from "@/models/api-client/Products/ProductsApiClientModelInterface";
import { Product } from "@/models/Product";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";
import { ProductsApiClientUrlInterface } from "@/models/api-client/Products/ProductsApiClientUrl.interface";

/**
 * @name ProductsApiClientModel
 * @description Api client for product domain that implements ProductsApiClientModelInterface.
 * @constructor
 *    @param urls - Urls that api client client accepts.
 */
export class ProductsApiClientModel implements ProductsApiClientModelInterface {
  private readonly urls!: ProductsApiClientUrlInterface;

  constructor(urls: ProductsApiClientUrlInterface) {
    this.urls = urls;
  }

  create(payload: Product): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      payload,
      documentId: payload.id,
    };

    return HttpClient.put(params);
  }

  delete(id: string): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      documentId: id,
    };

    return HttpClient.delete(params);
  }

  get(id: string): Promise<Product> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      documentId: id,
    };

    return HttpClient.get(params);
  }

  getProducts(): Promise<Product[]> {
    //TODO
    return Promise.resolve([]);
  }

  update(id: string, payload: Product): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      payload,
      documentId: id,
    };

    return HttpClient.update(params);
  }
}
