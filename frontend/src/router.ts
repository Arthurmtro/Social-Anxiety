import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@views/HomePage.vue";
import ConnectionPage from "@views/ConnectionPage.vue";
import ChatPage from "@views/ChatPage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/Chat",
    component: ChatPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
