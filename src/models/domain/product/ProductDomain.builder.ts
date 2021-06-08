import { Product } from "@/models/domain/product/ProductDomain.interface";
import { IdBuilder } from "@/utils/IdBuilder";

export class ProductDomainBuilder {
  public static build(
    name: string,
    description: string,
    price: number,
    category: string,
    imageUrl?: string,
    barcode?: string
  ): Product {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const productId = IdBuilder.createIdentifier();
    price = Math.floor(price * 100) / 100;
    return {
      id: productId,
      name,
      image: imageUrl,
      description,
      price,
      category,
      barcode: barcode ? barcode : "",
    };
  }
}
