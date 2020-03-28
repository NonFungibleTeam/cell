<template lang="pug">
  .cell-page
    v-container
      v-row(v-if="loading")
        v-col(align="center").cell-loading
            v-progress-circular(indeterminate size="75" color="primary")
            h1 Fetching Cell {{ "#" + id }}
            h3 This may take a little while
      v-row(v-else)
        v-col(align="center")
          v-card
            .cell-stats
              span.id {{ "#" + id }}
              .mass
                span {{ data.mass }}
                v-icon(large) mdi-atom
              Level(:mass="data.mass")
            v-divider
            .cell-graphic
              Cell(:id="id" :data="data")
            v-divider
            .cell-info
              h3 Born: {{ new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString() }}
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
          v-icon mdi-paw
          v-icon mdi-mushroom
          v-icon mdi-robot
          v-icon mdi-battery

          h1 Features
          .features
            .feature(v-if="!data.nucleusHidden")
              v-chip(:color="intToColor(data.nucleusColor)") 
                span Nucleus
            .feature
              v-chip(:color="intToColor(data.wallColor)") 
                span Cell Wall {{ data.wallWave % 11 }} {{ data.wallRound ? "Rounded" : "" }}
            .feature(v-for="f,i in data.featureCategories" :key="i")
              v-chip(:color="intToColor(data.featureColors[i])") 
                v-avatar
                  .count(left) {{ data.featureCounts[i] }}
                span {{ getFeatureFamily(data.featureFamilies[i]) }} {{ getFeatureType(f, data.featureFamilies[i]).title }}
    
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Cell from "@/components/Cell.vue";
import Level from "@/components/Level.vue";
import { cellAddress, cellABI } from "../CellContract";

import cellUtils from "@/mixins/cellUtils";
import cellRender from "@/mixins/cellRender";

export default Vue.extend({
  name: "CellPage",
  mixins: [cellUtils, cellRender],
  components: { Cell, Level },
  computed: {
    id() {
      return this.$route.params.id;
    },
    ...mapGetters(['currentAccount']),
  },
  mounted: async function() {
    await this.$store.dispatch('initialize');
    await this.loadCell();
  },
  methods: {
    loadCell: function() {
      const cached = this.$store.state.cachedCells[this.id];
      if (cached) {
        this.data = cached;
      } else {
        this.$store.state.contracts.cell.methods.get(this.id).call()
          .then((result: any) => {
            this.$store.commit('setCell', {id: this.id, data: result});
            this.data = result;
            this.loading = false;
          })
          .catch( err => {
            console.error(err);
          });
      }
    },
  },
  data: () => ({
    founders: 100,
    loading: true,
    data: {},
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
.cell-loading
  padding-top: 40vh
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
