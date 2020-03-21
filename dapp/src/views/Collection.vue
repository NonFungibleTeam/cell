<template lang="pug">
  .collection
    v-app-bar(v-if="cells !== {}" absolute collapse dense)
      v-btn(@click="mintCell()") Mint
    v-container
      v-row(v-if="cellsLoading")
        v-col(align="center").cells-loading
          v-progress-circular(indeterminate size="75" color="primary")
          h1 Fetching Your Cells
          h3 This may take a little while
      v-row(v-else no-gutters)
        v-col(v-for="cell,i in cells" :key="i" align="center" xl="3" lg="4" sm="6" xs="12")
          v-card.cell(:class="{ 'selected-cell': (merge[0] === i || merge[1] === i) }")
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              Level(:mass="cell.mass")
            v-card-text.cell-wrapper
              Cell(:id="i" :data="cell")
            v-divider
            v-card-actions
              v-btn(:to="'/cell/' + i") View
              v-spacer
              v-btn(v-if="merge[0]" color="success" @click="setMerge(1, i); mergeCompare = true") Select
              v-btn(v-else color="primary" @click="setMerge(0, i)") Merge
              v-btn(color="primary" @click="divideCell(i)") Divide
        v-col(v-if="cells === {}").get-started
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
              Cell(:id="merge[0]" :data="cells[merge[0]]")
            v-divider(vertical)
            v-col
              .stats-bar
                span {{ "#" + merge[1] }}
                .mass
                  span {{ cells[merge[1]].mass }}
                  v-icon(large) mdi-atom
                Level(:mass="cells[merge[1]].mass")
              Cell(:id="merge[1]" :data="cells[merge[1]]")
        .merge-btns
          v-btn(class="mt-6" text color="success" @click="mergeCells(merge[0],merge[1]); mergeCompare = false; dialog = true") Merge
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
import { cellAddress, cellABI } from "../CellContract";
import { mapGetters } from "vuex";

import cellUtils from "@/mixins/cellUtils";

export default {
  name: "Collection",
  mixins: [cellUtils],
  components: { Cell, Level },
  computed: {
    selecting() {
      return this.merge[0] !== null;
    },
    ...mapGetters(['currentAccount']),
  },
  mounted: async function() {
    await this.$store.dispatch('initialize');
    await this.loadCells();
  },
  methods: {
    clearMerge() {
      this.merge = [null, null];
    },
    setMerge(x, i) {
      this.merge[x] = i;
    },
    lookupCell: function(id) {
      return this.$store.state.contracts.cell.methods.get(id).call();
    },
    loadCells: async function() {
      const count = await this.$store.state.contracts.cell.methods.balanceOf(this.currentAccount).call();
      for (let i = 0; i < count; i++) {
        const cellID = await this.$store.state.contracts.cell.methods.tokenOfOwnerByIndex(this.currentAccount, i).call();
        const cell = await this.lookupCell(cellID);
        this.cells[cellID] = cell;
      }
      this.cellsLoading = false;
    },
    listenForCells: function() {
      const cellsSubscription = this.$store.state.web3.eth.subscribe('logs', {
          address: cellAddress,
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', 
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000' + this.currentAccount.slice(2)
          ],
      })
      .on("data", function(log){
        const index = parseInt(log.topics[3], 16)
        this.lookupCell(index).then((resp) => this.cells[index] = resp);
      }.bind(this))
      // .on("error", function(log){});
    },
    mintCell: function() {
      this.$store.state.web3.eth.sendTransaction(
        {
          from: this.currentAccount,
          to: cellAddress,
          value: this.$store.state.web3.utils.toWei("8", "finney"),
          data: this.$store.state.contracts.cell.methods
            .mint(699823429231)
            .encodeABI()
        }
      );
      this.listenForCells()
    },
    divideCell: function(id) {
      this.$store.state.web3.eth.sendTransaction(
        {
          from: this.currentAccount,
          to: cellAddress,
          value: this.$store.state.web3.utils.toWei("2", "finney"),
          data: this.$store.state.contracts.cell.methods
            .split(id)
            .encodeABI()
        }
      );
      this.listenForCells()
    },
    mergeCells: function(id1, id2) {
      this.$store.state.web3.eth.sendTransaction(
        {
          from: this.currentAccount,
          to: cellAddress,
          value: this.$store.state.web3.utils.toWei("2", "finney"),
          data: this.$store.state.contracts.cell.methods
            .merge(id1, id2)
            .encodeABI()
        }
      );
      this.listenForCells()
    },
  },
  data: () => ({
    dialog: false,
    mergeCompare: false,
    merge: [null, null],
    cells: {},
    cellsLoading: true
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
.cells-loading
  padding-top: 40vh
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