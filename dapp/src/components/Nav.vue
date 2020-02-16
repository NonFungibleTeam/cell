<template lang="pug">
  v-app-bar(app color="primary" dark).nav
      v-toolbar-title
        router-link(to="/" text color="accent").mr-2.title Microverse
      v-spacer
      .web3(v-if="isDrizzleInitialized")
        p :)
      v-btn(
        to="/mine"
        text)
        span.mr-2 My Cells
      v-btn(
        to="/mint"
        text)
        span.mr-2 Mint
      v-btn(
        to="/about"
        text)
        span.mr-2 About
      v-btn(
        href="https://discord.gg/upwdYAh"
        target="_new"
        text)
        v-icon.mr-2 mdi-discord
      v-btn(
        href="https://twitter.com/MicroverseLife"
        target="_new"
        text)
        v-icon.mr-2 mdi-twitter
</template>

<script>
import { mapGetters } from "vuex";

export default {
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
</style>