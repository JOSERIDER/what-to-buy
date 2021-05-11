import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Auth from "@/views/Auth.vue";
import { useUserStore } from "@/store/user";
import { MutationType } from "@/models/store";
import { User } from "@/models/domain/user";
import { useListDetailStore } from "@/store/list-detail";

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
    path: "/list-detail/:listId/:listType",
    name: "ListDetail",
    component: () => import("@/views/ListDetail.vue"),
    props: true,
  },
  {
    path: "/products-selection",
    name: "ProductsSelection",
    component: () => import("@/views/ProductsSelection.vue"),
    beforeEnter: (to, from, next) => {
      const listDetailStore = useListDetailStore();
      if (listDetailStore.state.list.admin === undefined) {
        next({ name: "Dashboard" });
        return;
      }
      next();
    },
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("@/views/Products.vue"),
  },
  {
    path: "/share",
    name: "Share",
    component: () => import("@/views/Share.vue"),
  },
  {
    path: "/add-product",
    name: "AddProduct",
    component: () => import("@/views/AddProduct.vue"),
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
