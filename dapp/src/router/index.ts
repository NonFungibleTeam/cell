import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cell/:id",
    name: "Cell",
    component: () =>
      import(/* webpackChunkName: "cell" */ "../views/CellPage.vue")
  },
  {
    path: "/collection",
    name: "Collection",
    component: () =>
      import(/* webpackChunkName: "collection" */ "../views/Collection.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/mint",
    name: "Mint",
    component: () => import(/* webpackChunkName: "mint" */ "../views/Mint.vue")
  },
  {
    path: "/*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
