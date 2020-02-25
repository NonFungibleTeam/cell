<template lang="pug">
  .cell-page
    Nav
    .page
      v-container
        v-row
          v-col(align="center")
            v-card
              .cell-stats
                span.id {{ "#" + id }}
                .mass
                  span {{ cell.mass }}
                  v-icon(large) mdi-atom
                Level(:mass="cell.mass")
              v-divider
              .cell-graphic
                Cell(:id="id" :mass="cell.mass" :features="cell.features")
              v-divider
              .cell-info
                h3 Born: {{ cell.born.toLocaleDateString() + " at " + cell.born.toLocaleTimeString() }}
                .ribbons
                  v-chip(outlined color="primary" v-if="id < founders")
                    v-icon(left) mdi-compass-rose
                    span Founder {{ parseInt(id) + 1 }} of {{ founders }}
                  v-chip(outlined color="primary")
                    v-icon(left) mdi-crystal-ball
                    span Mythical
                  v-chip(outlined color="primary")
                    v-icon(left) mdi-egg-easter
                    span Exclusive
                  v-chip(outlined color="primary")
                    v-icon(left) mdi-radioactive
                    span Mutant
                  v-chip(outlined color="primary")
                    v-icon(left) mdi-dna
                    span Pure
                  v-chip(outlined color="primary")
                    v-icon(left) mdi-checkbox-marked-circle-outline
                    span Complete
          v-col
            h1 Family
            p Add a chart (maybe from google visualization API?) here showing the family type distribution of features
            v-icon mdi-bacteria
            v-icon mdi-leaf
            v-icon mdi-cat
            v-icon mdi-mushroom
            v-icon mdi-robot
            v-icon mdi-battery

            h1 Features
            .features
              .feature(v-for="f in featureSet" :key="f.key")
                v-chip(v-if="cell.features[f.key].count > 0" outlined :color="cell.features[f.key].color") 
                  v-avatar
                    v-icon(v-if="f.bool" small) mdi-check
                    .count(v-else left) {{ cell.features[f.key].count }}
                  span {{ f.title }}
    
</template>

<script lang="ts">
import Vue from "vue";
import Nav from "@/components/Nav.vue";
import Cell from "@/components/Cell.vue";
import Level from "@/components/Level.vue";

import cellUtils from "@/mixins/cellUtils.js";

export default Vue.extend({
  name: "CellPage",
  mixins: [cellUtils],
  components: { Nav, Cell, Level },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  data: () => ({
    founders: 100,
    featureSet: [
      { title: "Nucleus", key: "nucleus", bool: true },
      { title: "Endoplasmic Reticulum", key: "endo", bool: true },
      { title: "Golgi Aparatus", key: "golgi", bool: true },
      { title: "Mitochondria", key: "mitochondria" },
      { title: "Chloroplasts", key: "chloroplasts" },
      { title: "Lisosomes", key: "lisosomes" },
      { title: "Ribosomes", key: "ribosomes" }
    ],
    cell: {
      mass: 541,
      born: new Date(),
      features: {
        body: {
          rounded: false,
          waves: [2, 1, 1, 0],
          color: "#efcc35",
          gradient: ["#ccddcc", "#773311", "#337744"]
        },
        nucleus: {
          color: "#f56",
          size: 60,
          count: 1
        },
        endo: {
          color: "#00f",
          count: 1
        },
        golgi: {
          color: "#00f",
          count: 0
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
          count: 3
        }
      }
    }
  })
});
</script>

<style lang="sass" scoped>
.v-chip__content
  span
    color: #FFF !important
.content
  margin-top: 35vh
.id
  font-size: 2rem
.cell-stats
  padding: 1rem
  display: flex
  flex-direction: row
  justify-content: space-between
.cell-info
  padding: 0 1rem 1rem 1rem
.features
  margin: 2hv 1vw
.feature
  margin: 1vh 1vw
</style>
