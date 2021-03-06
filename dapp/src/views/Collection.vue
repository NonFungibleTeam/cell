<template lang="pug">
  .collection
    v-app-bar(v-if="cells.length" absolute collapse dense)
      v-btn Mint
    v-container
      v-row(no-gutters)
        v-col(v-for="cell,i in cells" :key="i" align="center" xl="3" lg="4" sm="6" xs="12")
          v-card.cell(:class="{ 'selected-cell': (merge[0] === i || merge[1] === i) }")
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              Level(:mass="cell.mass")
            v-card-text.cell-wrapper
              Cell(:id="'merge' + i" :mass="cell.mass" :features="cell.features")
            v-divider
            v-card-actions
              v-btn(:to="'/cell/' + i") View
              v-spacer
              v-btn(v-if="merge[0]" color="success" @click="setMerge(1, i); mergeCompare = true") Select
              v-btn(v-else color="primary" @click="setMerge(0, i)") Merge
              v-btn(color="primary") Divide
        v-col(v-if="!cells.length").get-started
          v-card(align="center").get-started-card
            p You dont have any cells yet!
            v-btn(outlined color="secondary") Mint
            span &nbsp;or&nbsp;
            v-btn(outlined color="secondary") Buy
            p one to get started
    v-bottom-sheet(v-model="mergeCompare" inset persistent)
      v-sheet(v-if="mergeCompare" align="center" height="430px")
        v-container
          v-row
            v-col
              .stats-bar
                span {{ "#" + merge[0] }}
                .mass
                  span {{ cells[merge[0]].mass }}
                  v-icon(large) mdi-atom
                Level(:mass="cells[merge[0]].mass")
              Cell(:id="merge[0]" :mass="cells[merge[0]].mass" :features="cells[merge[0]].features")
            v-divider(vertical)
            v-col
              .stats-bar
                span {{ "#" + merge[1] }}
                .mass
                  span {{ cells[merge[1]].mass }}
                  v-icon(large) mdi-atom
                Level(:mass="cells[merge[1]].mass")
              Cell(:id="merge[1]" :mass="cells[merge[1]].mass" :features="cells[merge[1]].features")
        .merge-btns
          v-btn(class="mt-6" text color="success" @click="mergeCompare = false; dialog = true") Merge
          v-btn(class="mt-6" text color="error" @click="clearMerge(); mergeCompare = false") Cancel
    v-dialog(v-model="dialog" persistent max-width="600px")
      v-card.tx-preview
        v-card-title Transaction Preview
        v-card-text.tx-preview-form
          .form-content
            h4 test 123
        v-card-actions
          v-btn(class="mt-6" text color="success" @click="clearMerge(); dialog = false") Submit
          v-spacer
          v-btn(class="mt-6" text color="error" @click="clearMerge(); dialog = false") Cancel
</template>

<script>
import Cell from "@/components/Cell.vue";
import Level from "@/components/Level.vue";

import cellUtils from "@/mixins/cellUtils";

export default {
  name: "Collection",
  mixins: [cellUtils],
  components: { Cell, Level },
  computed: {
    selecting() {
      return this.merge[0] !== null;
    }
  },
  methods: {
    clearMerge() {
      this.merge = [null, null];
    },
    setMerge(x, i) {
      this.merge[x] = i;
    }
  },
  data: () => ({
    dialog: false,
    mergeCompare: false,
    merge: [null, null],
    cells: [
      {
        mass: 15,
        features: {
          body: {
            rounded: false,
            waves: [0, 1, 2, 3],
            color: "#efcc35",
            gradient: ["#ccddcc", "#9999ff", "#449944"]
          },
          nucleus: {
            color: "#f56",
            count: 1
          },
          endo: {
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
            count: 4
          }
        }
      },
      {
        mass: 17,
        features: {
          body: {
            rounded: false,
            waves: [1, 0, 2, 3],
            color: "#efcc35",
            gradient: ["#ccddcc", "#cc8899", "#aa5544"]
          },
          nucleus: {
            color: "#f56",
            count: 0
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
      },
      {
        mass: 1046,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
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
      },
      {
        mass: 75,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
            color: "#efcc35",
            gradient: ["#332233", "#117733", "#99bb00"]
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
    ]
  })
};
</script>

<style lang="sass" scoped>
.cell
  margin: 1rem
.cell-wrapper
  padding: 0
.selected-cell
  border: solid #ffc107 2px
  box-shadow: 0 0 20px 0 rgba(255,255,255,0.2)
.get-started
  justify-content: center
  margin-top: 20vh
.get-started-card
  display: flex
  flex-direction: column
  padding: 2rem 
.container
  padding: 0
.stats-bar
  display: flex
  justify-content: space-between
  padding: 0 1rem
.merge-btns
  display: flex
  justify-content: space-around
.v-dialog > .v-card > .tx-preview-form
  padding: 0 !important
  .form-content
    padding: 1rem
</style>