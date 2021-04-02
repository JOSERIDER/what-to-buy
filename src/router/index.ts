import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Auth from "../views/Auth.vue";
import { useStore } from "@/store/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { name: "Dashboard" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const isLoggedIn = await store.getters.isLoggedIn;

  if (to.name === "Auth" && !isLoggedIn) {
    next();
    return;
  } else if (to.name === "Auth" && isLoggedIn) {
    next({ name: "Dashboard" });
    return;
  }

  if (!isLoggedIn) {
    next({ name: "Auth" });
    return;
  }

  next();
});

export default router;
