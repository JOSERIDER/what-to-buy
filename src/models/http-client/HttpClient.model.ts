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
            reject({ message: "Data doesn't exists" });
            return;
          }
          resolve(response.data() as T);
        })
        .catch(error => reject(error));
    });
  }

  getWithQuery<T>(params: HttpRequestParamsInterface): Promise<T[]> {
    return new Promise((resolve, reject) => {
      firestore
        .collection(params.url)
        .where(params.query.path, params.query.filter, params.query.value)
        .get()
        .then(response => {
          const list = response.docs.map(doc => doc.data() as T);
          resolve(list);
        })
        .catch(error => reject(error));
    });
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
}
