import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import { useStore } from "@/store/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    beforeEnter: async (to, from, next) => {
      const store = useStore();
      const isLoggedIn = await store.getters.isLoggedIn;
      if (isLoggedIn) {
        next(from);
        return;
      }
      next();
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
