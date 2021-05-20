import {
  ProductsApiClientModel,
  ProductsApiClientModelInterface,
  ProductsApiClientUrlInterface,
} from "@/models/api-client/Products";
import { useProductsSelectionStore } from "@/store/products-selection";

const urls: ProductsApiClientUrlInterface = {
  products: "products",
};

const productsSelectionApiClient: ProductsApiClientModelInterface = new ProductsApiClientModel(
  urls,
  useProductsSelectionStore()
);

export default productsSelectionApiClient;
