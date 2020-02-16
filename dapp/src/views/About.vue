<template>
<div>
      <v-card>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>How To Play:</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left>mdi-biohazard</v-icon>
          Minting
        </v-tab>
        <v-tab>
          <v-icon left>mdi-call-merge</v-icon>
          Merging
        </v-tab>
        <v-tab>
          <v-icon left>mdi-call-split</v-icon>
          Dividing
        </v-tab>
        <v-tab>
          <v-icon left>mdi-menu</v-icon>
          Levels
        </v-tab>
        <v-tab>
          <v-icon left>mdi-dice-6</v-icon>
          Get Rekt?
        </v-tab>
  
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div class="text--primary">
              Mint new cells directly from the contract at a cost of .008 per cell.<br>
              Cell art is procedurally generated using the random values assigned during minting.<br>
              The visual complexity of the cell depends in part on the total mass of the cell.<br>
              Cells are minted with a mass of 8.<br>
              Any cell with a mass of 8 or less is a level 1 cell.<br>
              The mass threshold for each level is twice the previous level.
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div class="text--primary">
              A player may merge any two cells they own into a new cell.<br>
              The genetics of the merged cell are sampled from the input cells based on their proportion of the total mass being combined.<br>
              E.G. A cell with a mass of 8 has a small chance of influencing the genetic outcome when merging with a cell with a mass of 100.<br>
              When merging cells, the resulting mass can vary greatly. The table below describes the probability of different mass altering outcomes.<br>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div class="text--primary">
              A player may divide any cell they own into two cells of smaller mass with identical genetics.<br>
              The distribution of mass between these divided cells will range from 50-50 to 70-30 at most.<br>
              The total mass of the resulting cells is equal to the mass of the parent cell.<br>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
                <v-simple-table>
                  <template v-slot:default>
                   <thead>
                    <tr>
                      <th class="text-left">Level</th>
                      <th class="text-left">Mass</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in masslevels" :key="item.level">
                      <td>{{ item.level }}</td>
                      <td>{{ item.mass }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
                <v-simple-table>
                  <template v-slot:default>
                   <thead>
                    <tr>
                      <th class="text-left">Merge Result</th>
                      <th class="text-left">Probability</th>
                      <th class="text-left">Loss(% of Cell Mass)</th>
                      <th class="text-left">Gain(% of Mass Pool)</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in rekt" :key="item.mergeresult">
                      <td>{{ item.mergeresult }}</td>
                      <td>{{ item.probability }}</td>
                      <td>{{ item.loss }}</td>
                      <td>{{ item.gain }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "About",
  data: () => ({
      masslevels: [
        {
          level: 1,
          mass: 8,
        },
        {
          level: 2,
          mass: 16,
        },
        {
          level: 3,
          mass: 32,
        },
        {
          level: 4,
          mass: 64,
        },
        {
          level: 5,
          mass: 128,
        },
        {
          level: 6,
          mass: 256,
        },
        {
          level: 7,
          mass: 512,
        },
        {
          level: 8,
          mass: 1024,
        },
        {
          level: 9,
          mass: 2048,
        },
        {
          level: 10,
          mass: 4096,
        },
      ],
      rekt: [
        {
          mergeresult: 'Boost',
          probability: '3%',
          loss: 0,
          gain: '1% * Level',
        },
        {
          mergeresult: 'Kinda Boost',
          probability: '7%',
          loss: 0,
          gain: '.3% * Level',
        },
        {
          mergeresult: 'Barely Boost',
          probability: '25%',
          loss: 0,
          gain: '.1% * Level',
        },
        {
          mergeresult: 'Neutral',
          probability: '30%',
          loss: 0,
          gain: 0,
        },
        {
          mergeresult: 'Barely Rekt',
          probability: '25%',
          loss: '5%',
          gain: 0,
        },
        {
          mergeresult: 'Kinda Rekt',
          probability: '7%',
          loss: '10%',
          gain: 0,
        },
        {
          mergeresult: 'Rekt',
          probability: '2%',
          loss: '30%',
          gain: 0,
        },
        {
          mergeresult: 'Fukt',
          probability: '1%',
          loss: '99%',
          gain: 0,
        }
      ],
  })
})
</script>