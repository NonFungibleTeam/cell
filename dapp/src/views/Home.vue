<template lang="pug">
  .home
    Cell
    v-row(align="center" justify="center" cols=12)
      v-col
        h1.paralax-title Microverse
        h3 A game of single cellular crypto organisms
    v-row(align="center" justify="center" cols=12).call-to-actions
      v-col(justify="space-around")
        v-btn(color="secondary" to="/mint") Play Now
        v-btn(color="secondary" to="/About") Learn More
    v-container(flex)
      v-row(align="center" flex)
        v-col(cols=6)
          v-card.text.text-center
            v-card-text
</template>

<script>
// @ is an alias to /src
import Cell from "@/components/Cell.vue";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Cell
  },
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized"])
  }
};
</script>

<style lang="sass" scoped>
  .paralax-title
    font-size: 4rem
</style>