import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/page/index.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
