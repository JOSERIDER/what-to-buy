import { ProductsApiClientModelInterface } from "@/models/api-client/Products/ProductsApiClientModelInterface";
import { HttpClient, HttpRequestParamsInterface } from "@/models/http-client";
import { ProductsApiClientUrlInterface } from "@/models/api-client/Products/ProductsApiClientUrl.interface";
import { Product } from "@/models/domain/product";
import { ProductFilterInterface } from "@/models/store";
import _ from "lodash";

/**
 * @name ProductsApiClientModel
 * @description Api client for product domain that implements ProductsApiClientModelInterface.
 * @constructor
 *    @param urls - Urls that api client client accepts.
 */
export class ProductsApiClientModel implements ProductsApiClientModelInterface {
  private readonly urls!: ProductsApiClientUrlInterface;
  private readonly store!: any;

  constructor(urls: ProductsApiClientUrlInterface, store: any) {
    this.urls = urls;
    this.store = store;
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

    return new Promise((resolve, reject) => {
      HttpClient.getCollections(params, this.store)
        .then(products => {
          resolve(_.orderBy(products, ["name", "price"], ["asc", "desc"]));
        })
        .catch(error => reject(error));
    });
  }

  getProductsByName(name: string): Promise<Product[]> {
    name = ProductsApiClientModel.capitalizeWord(name);
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { name },
      orderBy: "name",
    };

    return new Promise((resolve, reject) => {
      HttpClient.getCollections(params, this.store)
        .then(products => {
          resolve(_.orderBy(products, ["name", "price"], ["asc", "desc"]));
        })
        .catch(error => reject(error));
    });
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

    return new Promise((resolve, reject) => {
      HttpClient.getWithQuery(params)
        .then(products => {
          resolve(_.orderBy(products, ["name", "price"], ["asc", "desc"]));
        })
        .catch(error => reject(error));
    });
  }

  getFilterProducts(filter: ProductFilterInterface): Promise<Product[]> {
    filter.name = ProductsApiClientModel.capitalizeWord(filter.name);
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { ...filter },
    };

    return new Promise((resolve, reject) => {
      HttpClient.getFilterCollections(params, this.store)
        .then(products => {
          resolve(_.orderBy(products, ["name", "price"], ["asc", "desc"]));
        })
        .catch(error => reject(error));
    });
  }

  getProductByBarcode(barcode: string): Promise<Product> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { path: "barcode", filter: "==", value: barcode },
    };

    return new Promise((resolve, reject) => {
      HttpClient.getWithQuery(params).then(response => {
        if (resolve.length === 0) {
          reject();
        }
        resolve(response[0] as Product);
      });
    });
  }

  checkProductBarcode(barcode: string): Promise<boolean> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { path: "barcode", filter: "==", value: barcode },
    };

    return this.checkProduct(params);
  }

  checkProductName(name: string): Promise<boolean> {
    const params: HttpRequestParamsInterface = {
      url: this.urls.products,
      query: { path: "name", filter: "==", value: name },
    };

    return this.checkProduct(params);
  }

  private checkProduct(params: HttpRequestParamsInterface): Promise<boolean> {
    return new Promise(resolve => {
      HttpClient.getWithQuery(params).then(response =>
        resolve(response.length > 0)
      );
    });
  }

  private static capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
