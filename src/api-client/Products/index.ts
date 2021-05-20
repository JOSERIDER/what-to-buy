import {
  ProductsApiClientModel,
  ProductsApiClientModelInterface,
  ProductsApiClientUrlInterface,
} from "@/models/api-client/Products";
import { useProductsStore } from "@/store/products";

const urls: ProductsApiClientUrlInterface = {
  products: "products",
};

const productsApiClient: ProductsApiClientModelInterface = new ProductsApiClientModel(
  urls,
  useProductsStore()
);

export default productsApiClient;
