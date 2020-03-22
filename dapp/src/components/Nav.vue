<template lang="pug">
  .nav
    v-navigation-drawer(app right temporary v-model="drawer")
      v-list(nav dense)
        template(v-if="web3Status === 'active'")
          .mobile-link
            v-list-item(two-line)
              Gravatar.gravatar.gravatar-mobile(:size="50" :email="currentAccount !== '' ? currentAccount : defaultAccount")
              v-list-item-content 
                h4.account-label Active Account
                span.address {{ formatAccount(currentAccount !== '' ? currentAccount : defaultAccount) }}
          v-divider
        .mobile-link
          v-list-item(link to="/")
            v-list-item-icon
              v-icon mdi-home
            v-list-item-content Home
        .mobile-link(v-for="l,i in links" :key="i")
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
      v-tooltip(v-if="web3Status === 'active'" bottom)
        template(v-slot:activator="{ on }")
          Gravatar.gravatar.gravatar-desktop(v-on="on" :size="40" :email="currentAccount")
        h4.account-label Active Account
        span.address.address-tooltip {{ formatAccount(currentAccount !== '' ? currentAccount : defaultAccount) }}
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
  methods: {
    formatAccount(account) {
      return "0x" + account.slice(2, 6) + "...." + account.slice(-4);
    }
  },
  mounted: async function() {
    await this.$store.dispatch('initialize');
  },
  data: () => ({
    drawer: false,
    defaultAccount: "268b87E4F6B7e7BEB58e3128138D4F6b768E1b17",
    links: [
      {
        type: "page",
        icon: "mdi-information",
        text: "About",
        path: "/about"
      },
      {
        type: "page",
        icon: "mdi-scatter-plot-outline",
        text: "Collection",
        path: "/collection"
      },
      {
        type: "page",
        icon: "mdi-book-open-page-variant",
        text: "Guide",
        path: "/guide"
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
    ...mapGetters(['currentAccount', 'web3Status']),
  }
};
</script>

<style lang="sass">
.account-label, .address-tooltip
  margin: 0 0
.title
  font-family: "Pangolin"
  font-size: 2rem
  color: #ffffff
  text-decoration: none
.gravatar
  margin-top: -7px
  border-radius: 50%
.gravatar-mobile
  margin-right: 10px
.mobile-menu-btn
    display: none !important
@media(max-width: 700px)
  .mobile-menu-btn
    display: block !important
  .link, .gravatar-desktop
    display: none !important
</style>