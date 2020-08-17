import { createApp } from "vue"
import createListView from "./views/createListView"
import ItemView from "./views/ItemView"
import UserView from "./views/UserView"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/top/:page(\\d+)?", component: createListView("top") },
    { path: "/new/:page(\\d+)?", component: createListView("new") },
    { path: "/show/:page(\\d+)?", component: createListView("show") },
    { path: "/ask/:page(\\d+)?", component: createListView("ask") },
    { path: "/job/:page(\\d+)?", component: createListView("job") },
    { path: "/item/:id(\\d+)", component: ItemView },
    { path: "/user/:id", component: UserView },
    { path: "/", redirect: "/top" }
  ]
})

const app = createApp(App).use(router)
router.isReady().then(() => app.mount("#app"))
