<template lang="pug">
  .home
    vue-particles(color="#ffffff"
      width=1000
      :particleOpacity="0.1"
      :particlesNumber="70"
      shapeType="circle"
      :particleSize="7"
      :lineLinked="false"
      :moveSpeed="1"
      :hoverEffect="false"
      :clickEffect="false").particles
    v-container
      v-row(cols=6).landing
        v-col(align="center")
          Cell.cell(:mass="cell.mass" :features="cell.features")
          h1.title Microverse
          h3 Mint, merge, and divide NFT cells. 
          h3 Compete to make massive unique cells and avoid getting rekt!
          .call-to-action
            v-btn.btn(color="primary" large to="/mint") Play Now
            v-btn.btn(color="tertiary" large to="/about") Learn More
      v-row(d-flex).details
        v-col(align="center")
          v-card.details-card
            h1 Generative Open Source Art 
            h3 An open source rendering library allows you to completely own your cells art.
            h3 While also promoting a vibrant ecosystem of third party applications.
            v-btn(color="primary" large target="_new" href="") View Source
        v-col(align="center")
          v-card.details-card
            h1 ERC721 Standard NFTs
            h3 Trade your cells on OpenSea.
            h3 Manage them in any NFT compatible wallet.
            v-btn(color="primary" large target="_new" href="") Shop OpenSea
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
      mass: 541,
      features: {
        body: {
          rounded: false,
          waves: [2, 1, 1, 0],
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
  .particles
    position: fixed
    height: 100vh
    width: 100vw
  .landing
    padding-top: 10vh
    height: 100vh
  .details
    height: 50vh
    .details-card
      margin: 2rem
      padding: 2rem
  .cell 
    margin-top: 3vh
  .title
    font-size: 4rem
  .call-to-action
    margin-top: 5vh
    color: #121212
    .btn
      margin: 15px
</style>