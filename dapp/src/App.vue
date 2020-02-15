<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      .title Microverse
      v-spacer

      v-btn(
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text)
        span.mr-2 Latest Release
        v-icon mdi-open-in-new
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
