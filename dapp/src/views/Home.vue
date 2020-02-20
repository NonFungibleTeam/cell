<template lang="pug">
  .home
    Cell
    v-row(align="center" justify="center" cols=12)
      v-col
        h1.paralax-title Microverse
        h2 NFT Cells
        h3 Mint, merge, and divide NFT biological cells. Compete to make massive unique cells and avoid getting rekt!
    v-row(align="center" justify="center" cols=12).call-to-actions
      v-col(justify="space-around")
        v-btn(color="secondary" to="/mint") Play Now
        v-btn(color="secondary" to="/About") Learn More
    v-container(flex)
      v-row(align="center" flex)
        v-col(cols="5")
          Cell(v-for="c,i in cells" :key="i" 
          :mass="c.mass" 
          :features="c.features")
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
    cells: [
      {
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
      },
      {
        mass: 66,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
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
      },
      {
        mass: 75,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
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
    ]
  }),
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