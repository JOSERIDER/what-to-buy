import { ProductsSelectionStateInterface } from "@/models/store/products-selection";
import useCategory from "@/use/useCategory";

export const initialState: ProductsSelectionStateInterface = {
  products: [],
  productsSelected: [],
  loading: false,
  error: "",
  lastQuery: null,
  isDisableInfiniteScroll: false,
  name: "",
  filter: {
    minPrice: 0,
    maxPrice: 100,
    name: "",
    category: useCategory().categories[0],
  },
  isFilter: false,
};
