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
    name = name.charAt(0).toUpperCase() + name.slice(1);
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
