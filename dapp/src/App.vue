<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-btn(
        to="/"
        text)
        span.mr-2.title Microverse

      v-spacer

      v-btn(
        to="/about"
        text)
        span.mr-2 About
    v-content
      router-view
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({})
});
</script>

<style lang="sass" scoped>
.title
  font-family: "Arial"
  font-size: 2rem
</style>
