import { Product } from "@/models/domain/product/ProductDomain.interface";

export class ProductDomainBuilder {
  public static build(
    name: string,
    description: string,
    price: number,
    category: string,
    productId?: string,
    imageUrl?: string
  ): Product {
    return {
      id: productId ? productId : name,
      name,
      image: imageUrl,
      description,
      price,
      category,
    };
  }
}
