<template>
<IonSplitPane>
  <ion-menu content-id="main-content" type="overlay">
    <ion-content>
      <ion-list id="inbox-list">
        <ion-list-header>Inbox</ion-list-header>
        <ion-note>hi@ionicframework.com</ion-note>

        <ion-menu-toggle auto-hide="false" v-for="(page, index) in appPages" :key="index">
          <ion-item
            @click="selectedIndex = index" router-direction="root" :router-link="page.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === index }">
            <ion-icon slot="start" :icon="page.icon"></ion-icon>
            <ion-label>{{ page.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>

  <!-- Should render <ion-router-outlet/> -->
  <slot name="content"/>
</IonSplitPane>
</template>

<script>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonSplitPane
} from "@ionic/vue";
import { list, fastFood, shareSocial } from "ionicons/icons";


export default {
  name: "VDrawerMenu",
  components: {
    IonSplitPane,
    IonContent,
    IonMenu,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel
  },
  setup(){
    const appPages = [
      {
        title: 'Lists',
        url: '/folder/Inbox',
        icon: list,
      },
      {
        title: 'Products',
        url: '/folder/Outbox',
        icon: fastFood,
      },
      {
        title: 'Share',
        url: '/folder/Favorites',
        icon: shareSocial,
      }
    ];

    return {
      appPages,
      selectedIndex
    }

  }
}
</script>

<style scoped>

</style>