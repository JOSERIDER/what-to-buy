import { ProductRepositoryInterface } from "@/repository/Product/ProductRepositoryInterface";
import { Product } from "@/models/Product";
import Client from "@/repository/Client/firebaseClient.js";

export class ProductRepository implements ProductRepositoryInterface {
  private resource = "productos";

  async create(payload: Product) {
    await Client(this.resource)
      .doc(payload.id)
      .set(payload);
  }

  async delete(id: string) {
    await Client(this.resource)
      .doc(id)
      .delete();
  }

  async getProduct(id: string): Promise<Product> {
    return (
      await Client(this.resource)
        .doc(id)
        .get()
    ).data() as Product;
  }

  getProducts(): Promise<Product[]> {
    //TODO
    return Promise.resolve([]);
  }

  async update(id: string, payload: Product) {
    await Client(this.resource)
      .doc(id)
      .update(payload);
  }
}
