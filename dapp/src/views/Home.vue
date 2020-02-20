<template lang="pug">
  .home
    v-container(flex)
      v-row(align="center" cols=6)
        v-col(flex)
          Cell(:mass="cell.mass" :features="cell.features")
      v-row(align="center" justify="center" cols=6)
        v-col
          h1.title Microverse
          h2 NFT Cells
          h3 Mint, merge, and divide NFT biological cells. 
          h3 Compete to make massive unique cells and avoid getting rekt!
      v-row(align="center" justify="center" cols=12).call-to-actions
        v-col(justify="space-around")
          v-btn.ma-5(color="primary" large to="/mint") Play Now
          v-btn(color="tertiary" outline large to="/About") Learn More
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
  data: () => ({
    cell: {
      mass: 17,
      features: {
        body: {
          rounded: false,
          waves: [0, 1, 2, 3],
          color: "#efcc35"
        },
        nucleus: {
          color: "#f56",
          size: 60
        },
        endo: {
          color: "#00f"
        },
        mitocondria: {
          color: "#f33",
          count: 6
        },
        chloroplasts: {
          color: "#3f5",
          count: 4
        },
        lisosomes: {
          color: "#ff0",
          count: 1
        },
        ribosomes: {
          color: "#66f",
          count: 4
        }
      }
    }
  }),
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized"])
  }
};
</script>

<style lang="sass" scoped>
  .title
    font-size: 4rem
  .call-to-actions .btn
    color: #121212
</style>