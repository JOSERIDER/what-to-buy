<template>
  <!--  Only render the menu when the router isn't Auth-->
  <ion-menu
    v-if="$router.currentRoute.value.name !== 'Auth'"
    side="start"
    menu-id="first"
    content-id="main"
  >
    <ion-header class="flex items-center justify-around p-4">
      <div>
        <h3>{{ user?.name }}</h3>
        <ion-label color="medium">{{ user?.email }}</ion-label>
      </div>
      <img
        class="w-14 h-14 rounded-full shadow"
        :src="user?.image ? user.image : require('@/assets/resources/user.png')"
      />
    </ion-header>
    <ion-content>
      <ion-list id="inbox-list">
        <ion-menu-toggle
          auto-hide="false"
          v-for="(page, index) in appPages"
          :key="index"
        >
          <ion-item
            @click="selectedIndex = index"
            router-direction="root"
            :router-link="page.url"
            lines="none"
            detail="false"
            class="hydrated"
            :class="{ selected: selectedIndex === index }"
          >
            <ion-icon slot="start" :icon="page.icon"></ion-icon>
            <ion-label>{{ page.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
  <!-- Should render <ion-router-outlet/> and must have contentId as id -->
  <slot name="content" contentId="main" />
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from "@ionic/vue";
import {
  settingsOutline,
  fastFoodOutline,
  listOutline,
  shareOutline,
} from "ionicons/icons";
import { computed, defineComponent, onUnmounted, ref } from "vue";
import router from "@/router";
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "VDrawerMenu",
  components: {
    IonContent,
    IonMenu,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonHeader,
    IonLabel,
  },
  setup() {
    const userStore = useUserStore();
    const selectedIndex = ref(0);
    const appPages = [
      {
        title: "Home",
        url: "/dashboard",
        icon: listOutline,
      },
      {
        title: "Products",
        url: "/products",
        icon: fastFoodOutline,
      },
      {
        title: "Share",
        url: "/share",
        icon: shareOutline,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: settingsOutline,
      },
    ];

    const user = computed(() => {
      return userStore.state.user;
    });

    const path: string = router.currentRoute.value.path;

    function findCurrentRoute() {
      selectedIndex.value = appPages.findIndex(page => page.url === path);
    }

    findCurrentRoute();
    onUnmounted(() => (selectedIndex.value = 0));

    return {
      appPages,
      user,
      selectedIndex,
    };
  },
});
</script>

<style scoped>
ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
