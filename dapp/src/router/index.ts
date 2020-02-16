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
    path: "/collection",
    name: "Collection",
    component: () =>
      import(/* webpackChunkName: "mint" */ "../views/Collection.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/merge",
    name: "Merge",
    component: () =>
      import(/* webpackChunkName: "merge" */ "../views/Merge.vue")
  },
  {
    path: "/mint",
    name: "Mint",
    component: () => import(/* webpackChunkName: "mint" */ "../views/Mint.vue")
  },
  {
    path: "/divide",
    name: "Divide",
    component: () =>
      import(/* webpackChunkName: "divide" */ "../views/Divide.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
