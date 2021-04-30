<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Add products</ion-title>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/"></ion-back-button>
      </ion-buttons>
      <ion-button slot="end" color="success" (click)="save()" fill="clear">
        <ion-icon size="large" name="checkmark"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <form>
      <ion-searchbar
        placeholder="Search by name"
        inputmode="text"
        @ionChange="onSearchChange($event)"
      ></ion-searchbar>
    </form>
    <ion-list>
      <ion-item v-for="product in products" :key="product.id">
        <ion-icon
          *ngIf="!isSelected(product.idProducto)"
          size="large"
          name="ellipse-outline"
          (click)="agregate(product.idProducto)"
        ></ion-icon>
        <ion-icon
          *ngIf="isSelected(product.idProducto)"
          size="large"
          color="success"
          name="checkmark-circle"
          (click)="deleteProduct(product.idProducto)"
        ></ion-icon>

        <ion-label>{{ product.name }}</ion-label>

        <ion-row
          *ngIf="isSelected(product.idProducto)"
          class="ion-align-items-center ion-align-items-center row"
        >
          <ion-col>
            <ion-button
              (click)="changeQuantity(product.idProducto,false)"
              fill="clear"
              color="dark"
            >
              <ion-icon
                name="remove-circle-outline"
                size="small"
                class="icon"
              ></ion-icon>
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-chip>
              <ion-label class="ion-text-center chip">{{
                getQuantity(product.idProducto)
              }}</ion-label>
            </ion-chip>
          </ion-col>
          <ion-col>
            <ion-button
              (click)="changeQuantity(product.idProducto,true)"
              fill="clear"
              color="dark"
            >
              <ion-icon
                name="add-circle-outline"
                size="small"
                class="icon"
              ></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListDetailAddProduct",
  setup() {


    return {products: []}
  }
});
</script>

<style scoped></style>
