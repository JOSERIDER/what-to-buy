import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Auth from "../views/Auth.vue";
import Share from "@/views/Share.vue";
import { useUserStore } from "@/store/user";
import { MutationType } from "@/models/store";
import { User } from "@/models/domain/user";

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
  const userStore = useUserStore();
  await userStore.action(MutationType.user.getUser);
  const user: User = userStore.state.user;

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
