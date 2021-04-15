import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Auth from "../views/Auth.vue";
import { useStore } from "@/store/store";
import { ActionTypes } from "@/store/action-types";
import Share from "@/views/Share.vue";

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
  {
    path: "/share",
    name: "Share",
    component: Share,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const user = await store.dispatch(ActionTypes.GET_USER);

  if (to.name === "Auth" && user === null) {
    next();
    return;
  } else if (to.name === "Auth" && user !== null) {
    next({ name: "Dashboard" });
    return;
  }

  if (user === null) {
    next({ name: "Auth" });
    return;
  }

  next();
});

export default router;
