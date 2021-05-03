import { HttpClientInterface } from "@/models/http-client/HttpClient.interface";
import { HttpRequestParamsInterface } from "@/models/http-client/HttpRequestParams.interface";
import { firestore, auth } from "./client/firebase.config";

/**
 * @name HttpClientModel
 * @description Wrap the Http functionality to centralize all request with the same provider as axios or Firebase.
 */
export class HttpClientModel implements HttpClientInterface {
  get<T>(params: HttpRequestParamsInterface): Promise<T> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .doc(params.documentId)
        .get()
        .then(response => {
          if (!response.exists) {
            reject({ message: "This resource doesn't exists" });
            return;
          }
          resolve(response.data() as T);
        })
        .catch(error => reject(error));
    });
  }

  getCollections<T>(params: HttpRequestParamsInterface): Promise<T[]> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .orderBy(params.orderBy!!)
        .startAt(params.query.name)
        .endAt(`${params.query.name}\uf8ff`)
        .get()
        .then(response => {
          const docs = response.docs.map(doc => doc.data() as T);
          resolve(docs);
        })
        .catch(error => reject(error));
    });
  }

  getWithQuery<T>(params: HttpRequestParamsInterface): Promise<T[]> {
    try {
      if (Array.isArray(params.query.value)) {
        return this.queryPerformance(params);
      }

      return this.queryWithWhere(params);
    } catch (error) {
      console.error(error);

      return Promise.reject({
        message: "Something went wrong, with our server or network connection.",
      });
    }
  }

  async post<T>(params: HttpRequestParamsInterface): Promise<T> {
    return (
      await firestore
        .collection(params.url)
        .doc(params.documentId)
        .get()
    ).data() as T;
  }

  update<T>(params: HttpRequestParamsInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .doc(params.documentId)
        .update(params.payload)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  async delete<T>(params: HttpRequestParamsInterface): Promise<void> {
    return await firestore
      .collection(params.url)
      .doc(params.documentId)
      .delete();
  }

  async put<T>(params: HttpRequestParamsInterface): Promise<T> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .doc(params.documentId)
        .set(params.payload)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  auth() {
    return auth;
  }

  private async queryPerformance<T>(
    params: HttpRequestParamsInterface
  ): Promise<T[]> {
    let i, j, tempArray;
    const FIREBASE_MAX_VALUES = 10;
    const aux: any[] = [];

    for (
      i = 0, j = params.query.value.length;
      i < j;
      i += FIREBASE_MAX_VALUES
    ) {
      tempArray = params.query.value.slice(i, i + FIREBASE_MAX_VALUES);
      params.query.value = tempArray;
      await this.queryWithWhere(params)
        .then(response => {
          response.forEach(r => aux.push(r));
        })
        .catch(error => {
          throw error;
        });
    }

    return Promise.resolve(aux);
  }

  private queryWithWhere<T>(params: HttpRequestParamsInterface): Promise<T[]> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .where(params.query.path, params.query.filter, params.query.value)
        .get()
        .then(response => resolve(response.docs.map(doc => doc.data() as T)))
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
}
