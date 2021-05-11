import { ProductsApiClientModelInterface } from "@/models/api-client/Products/ProductsApiClientModelInterface";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";
import { ProductsApiClientUrlInterface } from "@/models/api-client/Products/ProductsApiClientUrl.interface";
import { Product } from "@/models/domain/product";
import { ProductFilterInterface } from "@/models/store";

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
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { name: "" },
      orderBy: "name",
    };

    return HttpClient.getCollections(params);
  }

  getProductsByName(name: string): Promise<Product[]> {
    name = ProductsApiClientModel.capitalizeWord(name);
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { name },
      orderBy: "name",
    };

    return HttpClient.getCollections(params);
  }

  update(id: string, payload: Product): Promise<void> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      payload,
      documentId: id,
    };

    return HttpClient.update(params);
  }

  getProductsById(productsId: string[]): Promise<Product[]> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { path: "id", filter: "in", value: productsId },
    };

    return HttpClient.getWithQuery(params);
  }

  private static capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  getFilterProducts(filter: ProductFilterInterface): Promise<Product[]> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { ...filter },
    };

    return HttpClient.getFilterCollections(params);
  }
}
