<template>
<div id="app">
  <div>How To Play:</div>
  <v-app id="inspire">
    <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-text>
        <p class="display-1 text--primary">
          Minting
        </p>
        <div class="text--primary">
          Mint new cells directly from the contract at a cost of .008 per cell.<br>
          Cell appearance is a procedurally generated using the random values assigned to their genetic traits during minting.<br>
          The visual complexity of the cell depends in part, on the total mass of the cell.<br>
          Newly minted cells are created with a mass of 8.<br>
          Any cell with a mass of 8 or less is a level 1 cell.<br>
          The mass threshold for each level is twice the previous level.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
        >
          Mint Now
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-text>
        <p class="display-1 text--primary">
          Merging
        </p>
        <div class="text--primary">
          A player may merge any two cells they own into a new cell.<br>
          The genetics of the merged cell are sampled from the input cells based on their proportion of the total mass being combined.<br>
          E.G. A cell with a mass of 8 has a small chance of influencing the genetic outcome when merging with a cell with a mass of 100.<br>
          When merging cells, the resulting mass can vary greatly. The table below describes the probability of different mass altering outcomes.<br>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
        >
          Merge Now
        </v-btn>
      </v-card-actions>
    </v-card>

     <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-text>
        <p class="display-1 text--primary">
          Dividing
        </p>
        <div class="text--primary">
          A player may divide any cell they own into two cells of smaller mass with identical genetics.<br>
          The distribution of mass between these divided cells will range from 50-50 to 70-30 at most.<br>
          The total mass of the resulting cells is equal to the mass of the parent cell.<br>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
        >
          Divide Now
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-app>
</div>
</template>
