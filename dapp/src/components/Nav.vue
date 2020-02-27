<template lang="pug">
  .nav
    v-navigation-drawer(app right temporary v-model="drawer")
      v-list(nav dense)
        .link(v-for="l,i in links" :key="i")
          v-list-item(v-if="l.type === 'page'" :to="l.path" link)
            v-list-item-icon
              v-icon {{ l.icon }}
            v-list-item-content {{ l.text }}
          v-list-item(v-else-if="l.type === 'link'" :href="l.path" target="_blank" link)
            v-list-item-icon
              v-icon {{ l.icon }}
            v-list-item-content {{ l.text }}
        
    v-app-bar(app color="primary" dark)
      v-toolbar-title
        router-link(to="/" text color="accent").mr-2.title Microverse
      v-spacer
      .link(v-for="l in links")
        v-btn(v-if="l.type === 'page'" :to="l.path" text)
          span.mr-2 {{ l.text }}
        v-btn(v-else-if="l.type === 'link'" :href="l.path" target="_blank" icon)
          v-icon {{ l.icon }}
      Gravatar.gravatar(size="40" hash="268b87E4F6B7e7BEB58e3128138D4F6b768E1b17")
      v-btn(@click="drawer = !drawer" text).mobile-menu-btn
        v-icon mdi-menu
        
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Gravatar from "vue-gravatar";

Vue.component("v-gravatar", Gravatar);

export default {
  components: { Gravatar },
  data: () => ({
    drawer: false,
    links: [
      {
        type: "page",
        icon: "mdi-scatter-plot-outline",
        text: "Collection",
        path: "/collection"
      },
      {
        type: "page",
        icon: "mdi-book-open-page-variant",
        text: "About",
        path: "/about"
      },
      {
        type: "link",
        icon: "mdi-discord",
        text: "Discord",
        path: "https://discord.gg/upwdYAh"
      },
      {
        type: "link",
        icon: "mdi-twitter",
        text: "Twitter",
        path: "https://twitter.com/MicroverseLife"
      }
    ]
  }),
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized"])
  }
};
</script>

<style lang="sass">
.title
  font-family: "Pangolin"
  font-size: 2rem
  color: #ffffff
  text-decoration: none
.gravatar
  border-radius: 50%
.mobile-menu-btn
    display: none !important
@media(max-width: 700px)
  .mobile-menu-btn
    display: block
  .link
    display: none
</style>