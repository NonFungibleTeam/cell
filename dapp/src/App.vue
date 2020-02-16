<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-btn(
        to="/"
        text)
        span.mr-2.title Microverse

      v-spacer

      v-btn(
        to="/mint"
        text)
        span.mr-2 Mint
      v-btn(
        to="/merge"
        text)
        span.mr-2 Merge
      v-btn(
        to="/divide"
        text)
        span.mr-2 Divide
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

    v-content
      router-view
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({})
});
</script>

<style lang="sass">
.body
  background-color: #121212
  font-family: "sans-serif"
.title
  font-family: "Pangolin"
  font-size: 2rem
</style>
