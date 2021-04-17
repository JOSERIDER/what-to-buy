import {
  ProductsApiClientModel,
  ProductsApiClientModelInterface,
  ProductsApiClientUrlInterface,
} from "@/models/api-client/Products";

const urls: ProductsApiClientUrlInterface = {
  products: "productos",
};

const productsApiClient: ProductsApiClientModelInterface = new ProductsApiClientModel(
  urls
);

export default productsApiClient;
