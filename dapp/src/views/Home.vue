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
    v-container(fluid)
      v-row(cols=6).landing
        v-col(align="center")
          Cell.cell(id="1" :mass="cell.mass" :features="cell.features")
          h1.title Microverse
          h3 Mint, merge, and divide NFT cells
          h3 Compete to make massive unique cells and avoid getting rekt!
          .call-to-action
            v-btn.btn(color="primary" large to="/collection") Play Now
            v-btn.btn(color="tertiary" large to="/about") Learn More
      v-row(no-gutters).details
        v-col(align="center" xl="3" md="6" sm="12")
          v-card.details-card
            v-icon(large) mdi-draw
            h1 Generative Open Source Art 
            p An open source SVG renderer means you own your cells art
            p Simultaniously promoting a vibrant third party ecosystem
            v-btn(color="primary" large target="_new" href="https://github.com/NonFungibleTeam/cell") View Source
        v-col(align="center" xl="3" md="6" sm="12")
          v-card.details-card
            v-icon(large) mdi-check-decagram
            h1 ERC721 Standard NFTs
            p Trade your cells on OpenSea
            p Manage them in any NFT compatible wallet
            v-btn(color="primary" large target="_new" href="https://opensea.io/") Shop OpenSea
        v-col(align="center" xl="3" md="6" sm="12")
          v-card.details-card
            v-icon(large) mdi-dna
            h1 Evolve Your Genetics
            p Each cell has its own set of genes the determine its features
            p Learn about how genes combine on merging
            v-btn(color="primary" href="/guide/genes") Genetics
        v-col(align="center" xl="3" md="6" sm="12")
          v-card.details-card
            v-icon(large) mdi-atom
            h1 Expand Your Mass
            p Gain mass to level up you cells
            p Unlock special rewards for having the largest cells
            v-btn(color="primary" href="/guide/mass") Mass
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

import Cell from "@/components/Cell.vue";

import VueParticles from "vue-particles";
Vue.use(VueParticles);

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
          color: "#efcc35",
          gradient: ["#ccddcc", "#773311", "#337744"]
        },
        nucleus: {
          color: "#f56",
          count: 1
        },
        endo: {
          color: "#00f",
          count: 1
        },
        mitochondria: {
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
    min-height: 100vh
  .details
    height: 50vh
    .details-card
      margin: 2rem
      padding: 2rem
  .container
    padding: 0
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