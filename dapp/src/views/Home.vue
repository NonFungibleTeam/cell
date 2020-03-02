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
          br
          p Coming Soon!
          p Stay posted on our social channels below
          .social
            v-btn(icon target="_blank" href="https://twitter.com/MicroverseLife")
              v-icon(large) mdi-twitter
            v-btn(icon target="_blank" href="https://discord.gg/upwdYAh")
              v-icon(large) mdi-discord
          .call-to-action
            v-btn.btn(color="tertiary" large to="/about") Learn More
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
  @media(max-width: 700px)
    .landing
      padding-top: 0
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
  .social
    margin-top: 5vh
    .v-btn
      margin: 15px
  .call-to-action
    margin-bottom: 5vh
    color: #121212
    .btn
      margin: 15px
</style>